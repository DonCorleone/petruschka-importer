import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';

export async function handler(event: HandlerEvent, context: HandlerContext) {
  try {
    // const data = await getEvents();
    // const result = await insertEventIntoDb(data);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify('hello-background')
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application.json'
      },
      body: JSON.stringify({
        message: err.message
      })
    };
  }
}
