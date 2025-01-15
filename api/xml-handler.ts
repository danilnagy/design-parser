import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { parseStringPromise } from 'xml2js'

function countElements(obj: any): number {
  let total = 0

  function traverse(node: any) {
    if (Array.isArray(node)) {
      node.forEach((item) => traverse(item))
    } else if (node && typeof node === 'object') {
      // Count this node
      total += 1
      // Recursively traverse child properties
      for (const key in node) {
        traverse(node[key])
      }
    }
  }

  traverse(obj)
  return total
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // 1. Only allow PUT
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Use PUT.' }),
    }
  }

  try {
    // 2. Parse the JSON body
    const bodyJson = JSON.parse(event.body || '{}')

    // 3. Extract the raw XML from the "xml" property
    const xmlString = bodyJson.xml || ''

    // 4. Parse the XML
    const parsedXml = await parseStringPromise(xmlString)

    console.log(parsedXml)

    // 5. Count the elements
    const elementCount = countElements(parsedXml)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'XML processed successfully',
        elementCount,
      }),
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Failed to parse request or XML',
        details: error instanceof Error ? error.message : String(error),
      }),
    }
  }
}
