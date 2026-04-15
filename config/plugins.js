module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: 465,
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        secure:true,
        debug: true,
        logger: true,
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: env('SMTP_USERNAME'),
        defaultReplyTo: env('SMTP_USERNAME'),
      },
    },
  },
  // ...
});
