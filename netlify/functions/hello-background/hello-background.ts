import * as postmark from 'postmark';
import { jsPDF } from 'jspdf';
import { HandlerEvent } from '@netlify/functions';

type Context = {
  content: string;
  destination: string;
};

const handler = async (event: HandlerEvent) => {
  if (!event.queryStringParameters) {
    return;
  }

  const context: Context = {
    content: event.queryStringParameters['content'] ?? '',
    destination: event.queryStringParameters['destination'] ?? ''
  };

  console.log(`Sending PDF report to ${context.destination}`);

  const report = Buffer.from(
    new jsPDF().text(decodeURI(context.content), 10, 10).output('arraybuffer')
  );

  const serverToken = process.env.POSTMARK_API;

  if (!serverToken) {
    return;
  }

  const client = new postmark.ServerClient(serverToken);

  client
    .sendEmail({
      From: process.env.POSTMARK_DOMAIN ?? '',
      To: decodeURI(context.destination),
      Subject: 'Test',
      TextBody: 'Hello from Postmark!'
      // Attachments: [
      //   {
      //     Name: `report-${new Date().toDateString()}.pdf`,
      //     Content: report.toString('base64'),
      //     ContentType: 'application/pdf',
      //     ContentID: 'cid:report.pdf'
      //   }
      // ]
    })
    .then((info) => console.log(`PDF report sent: %s`, info.MessageID))
    .catch((ex) => console.log(ex));
};

export { handler };
