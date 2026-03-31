module.exports = {
  async changePassowrd(ctx, next) {
    let decoded = await strapi.plugin('users-permissions').service('jwt').verify(ctx.request.header.authorization.split(" ")[1]);
    const userId = decoded.id;
    ctx.body = 'Ok'
  },
};
