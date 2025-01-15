import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

// Netlify automatically detects and uses ESBuild for TypeScript
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // You can use TypeScript features here
    const message: string = 'Hello from Netlify Functions (TypeScript)!'
    return {
      statusCode: 200,
      body: JSON.stringify({ message }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : error,
      }),
    }
  }
}
