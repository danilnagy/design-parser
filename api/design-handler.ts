import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { parseStringPromise } from 'xml2js'
import YAML from 'yaml'

/**
 * Recursively traverses any JS object/array to count "elements".
 * Adjust as needed to match your definition of an element.
 */
function countElements(obj: unknown): number {
  let total = 0

  function traverse(node: any) {
    // For arrays
    if (Array.isArray(node)) {
      node.forEach((item) => traverse(item))
    }
    // For objects
    else if (node && typeof node === 'object') {
      total += 1 // Count this object
      for (const key in node) {
        traverse(node[key])
      }
    }
  }

  traverse(obj)
  return total
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow PUT for this example
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Use PUT.' }),
    }
  }

  try {
    // Parse the incoming JSON body
    const bodyJson = JSON.parse(event.body || '{}')

    // Extract the raw XML from the "xml" property
    const xmlString = bodyJson.xml || ''

    // Parse the XML
    const parsedXml = await parseStringPromise(xmlString)

    console.log(parsedXml)

    // Extract the YAML string from the `yaml` property
    const yamlString = bodyJson.yaml || ''

    // Parse YAML into a JavaScript object
    const parsedYaml = YAML.parse(yamlString)

    console.log(parsedYaml)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Design files parsed successfully',
        xmlElements: countElements(parsedXml),
        yamlElements: countElements(parsedYaml),
      }),
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Failed to parse request',
        details: error instanceof Error ? error.message : String(error),
      }),
    }
  }
}
