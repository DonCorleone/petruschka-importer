import * as postmark from 'postmark';
import { jsPDF } from 'jspdf';
import { HandlerEvent } from '@netlify/functions';

type Context = {
  content: string;
  destination: string;
};

export async function handler(event, context) {
  if (!event.queryStringParameters) {
    return;
  }

  const ctx: Context = {
    content: event.queryStringParameters['content'] ?? '',
    destination: event.queryStringParameters['destination'] ?? ''
  };

  console.log(`Sending PDF report to ${ctx.destination}`);

  const report = Buffer.from(
    new jsPDF().text(decodeURI(ctx.content), 10, 10).output('arraybuffer')
  );

  const serverToken = process.env.POSTMARK_API;

  if (!serverToken) {
    return;
  }

  const client = new postmark.ServerClient(serverToken);

  client
    .sendEmail({
      From: process.env.POSTMARK_DOMAIN ?? '',
      To: decodeURI(ctx.destination),
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
}
