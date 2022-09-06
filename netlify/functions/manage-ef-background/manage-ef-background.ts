import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';

export async function handler(event: HandlerEvent, context: HandlerContext) {
  try {
    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    (async () => {
      for (let i = 0; i <= 60; i++) {
        const date = new Date();
        await sleep(1000);
        console.log(date.toLocaleString(), i);
      }
      console.log('Done');
    })();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify('hello-background')
    };
  } catch (err: any) {
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
