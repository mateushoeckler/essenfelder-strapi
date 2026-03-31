module.exports = plugin => {
  const sanitizeOutput = (user) => {
    const {
      password, resetPasswordToken, confirmationToken, ...sanitizedUser
    } = user; // be careful, you need to omit other private attributes yourself
    return sanitizedUser;
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      { populate: ['school'] }
    );

    ctx.body = sanitizeOutput(user);
  };

  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      { ...ctx.params, populate: ['role'] }
    );

    ctx.body = users.map(user => sanitizeOutput(user));
  };

  plugin.controllers.user.changePassword = async (ctx) => {
    let decoded = await strapi.plugin('users-permissions').service('jwt').verify(ctx.request.header.authorization.split(" ")[1]);
    const userId = decoded.id;
    if (!ctx.request.body.hasOwnProperty('password') || !ctx.request.body.hasOwnProperty('passwordConfirmation')) {
      ctx.body = {error: "Invalid request"};
    } else if (ctx.request.body.password == ctx.request.body.passwordConfirmation) {
      await strapi.plugin('users-permissions').service('user').edit(userId,
        {
          password: ctx.request.body.password,
          first_access: false
        });
      ctx.body = {id: userId, response: "ok"};
    } else ctx.body = {error: "Invalid request"};
  }

  plugin.controllers.user.forgotMyPassword = async (ctx) => {
    if (!ctx.request.body.hasOwnProperty('email')) {
      ctx.body = {error: "Invalid request"};
    } else {
      let user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: ctx.request.body['email'] },
      });
      if (!user) {
        ctx.body = {error: "Invalid request"};
      } else {
        let new_password = randomString(8);
        let userId = user['id'];
        await strapi.plugin('users-permissions').service('user').edit(userId,
          {
            password: new_password,
            first_access: true
          });
        await strapi
          .plugin('email')
          .service('email')
          .send({
            to: ctx.request.body['email'],
            from: 'nao-responda@essenfeldereducacional.com.br',
            subject: 'Esqueci minha Senha - Curso Essenfelder',
            text: 'Ol   '+user['username']+', sua senha    '+new_password,
            html: email_body.replace("[PRIMEIRO_NOME]", user['username']).replace("[SENHA]", new_password),
        });
        ctx.body = {id: userId, response: "ok"};
      }
    }
  }

  plugin.middlewares.onceADay = (ctx, next) => {
    const ratelimit = require('koa2-ratelimit').RateLimit;

    const message = [
      {
        messages: [
          {
            id: 'Auth.form.error.ratelimit',
            message: 'Too many attempts, please try again in a minute.',
          },
        ],
      },
    ];

    return ratelimit.middleware({
      interval: 12 * 60 * 60 * 1000,
      max: 1,
      prefixKey: `${ctx.request.path}:${ctx.request.ip}`,
      message,
      ...strapi.config.get('plugin.users-permissions.ratelimit'),
    })(ctx, next);
  };

  console.log(plugin.middlewares.onceADay)
  console.log(plugin.middlewares.rateLimit)

    plugin.routes['content-api'].routes.push({
      method: 'POST',
      path: '/changePassword',
      handler: 'plugin::users-permissions.user.changePassword',
      config: {
        prefix: "",
        auth: false,
        policies: [],
        middlewares: [],
      }
    });

    plugin.routes['content-api'].routes.push({
      method: 'POST',
      path: '/forgotMyPassword',
      handler: 'plugin::users-permissions.user.forgotMyPassword',
      config: {
        prefix: "",
        auth: false,
        policies: [],
        middlewares: [plugin.middlewares.onceADay],
      }
    });

  return plugin;
};

var randomString = function (len, bits)
{
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
     	newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
};

let email_body = `<body>
    <div style="width: 100%; background-color: #c39b50; text-align: center; padding: 10px; position: relative; float: left;">
        <h2 style="color: #ffffff; margin-bottom: 0;">Alteração de senha</h2>
    </div>

    <div style="width: 100%; text-align: center; position: relative; float: left; margin-top: 20px;">
        <h1 style="color: #c39b50;">Olá, [PRIMEIRO_NOME]!</h1>
        <p style="color: #1a1a1a; font-size: 18px;">Recebemos um pedido de recuperação de senha.</p>
        <p style="color: #1a1a1a; font-size: 18px;"><strong>Utilize a senha abaixo no seu próximo acesso:</strong></p>
        <div style="width: 150px; height: 50px; background-color: #e8e8e8; border: 2px solid black; margin: 0 auto; display: flex; align-items: center; flex-direction: row; flex-wrap: wrap; justify-content: center;">
            <p style="font-size: 14pt; margin: 0;"><strong>[SENHA]</strong></p>
        </div>
        <p style="color: #1a1a1a; font-size: 18px;">No próximo acesso, você deverá cadastrar uma nova senha!</p>
        <p style="color: #1a1a1a; font-size: 18px;">Caso não tenha solicitado, desconsidere este e-mail.</p>
    </div>
</body>`;
