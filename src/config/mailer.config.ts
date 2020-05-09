import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
export const MailerConfig: MailerOptions = {
  transport: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ID, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    },
  },
  defaults: {
    from: '"nest-modules" <davoodebi789@gmail.com>', // outgoing email ID
  },
  template: {
    dir: process.cwd() + '/template/',
    adapter: new HandlebarsAdapter(), // or new PugAdapter()
    options: {
      strict: true,
    },
  },
}
