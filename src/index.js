'use strict';

const getService = (name) => strapi.plugin('users-permissions').service(name);

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register( /*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async afterCreate(event) {
        const student_email = event.result.email;
        const new_password = randomString(8);

        await getService('user').edit(event.result.id, {
          password: new_password,
        });

        await strapi
          .plugin('email')
          .service('email')
          .send({
            to: student_email,
            from: 'nao-responda@essenfeldereducacional.com.br',
            subject: 'Senha de Acesso - Curso Essenfelder',
            text: 'Olé '+event.result.username+', sua senha é '+new_password,
            html: email_body.replace("[PRIMEIRO_NOME]", event.result.username).replace("[SENHA]", new_password),
          });
      },
    });
  },
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

const email_body = `<body>
    <div style="width: 100%; background-color: #c39b50; text-align: center; padding: 10px; position: relative; float: left;">
        <h2 style="color: #ffffff; margin-bottom: 0;">Aplicativo Aluno Essenfelder</h2>
    </div>

    <div style="width: 100%; text-align: center; position: relative; float: left; margin-top: 20px;">
        <h1 style="color: #c39b50;">Olá, [PRIMEIRO_NOME]!</h1>
        <p style="color: #1a1a1a; font-size: 18px;">Agora você tem acesso ao conteúdo exclusivo da metodologia Essenfelder no seu celular!</p>
        <p style="color: #1a1a1a; font-size: 18px;">Baixe o aplicativo <strong>Aluno Essenfelder</strong> na App Store ou Google Play.</p>
        <p style="color: #1a1a1a; font-size: 18px; margin-top: 40px;"><strong>Utilize o e-mail cadastrado e a senha abaixo no seu primeiro acesso</strong></p>
        <div style="width: 150px; height: 50px; background-color: #e8e8e8; border: 2px solid black; margin: 0 auto; display: flex; align-items: center; flex-direction: row; flex-wrap: wrap; justify-content: center;">
            <p style="font-size: 14pt; margin: 0;"><strong>[SENHA]</strong></p>
        </div>
        <p style="color: #1a1a1a; font-size: 18px;">Após o primeiro acesso, você deverá cadastrar uma nova senha!</p>
    </div>
</body>`;
