module.exports = {
  routes: [
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/auth/changePassword', 
      handler: 'changePassword',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      }
    },
  ]
}

