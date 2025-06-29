export default [
  {
    method: 'GET',
    path: '/articles',
    // name of the controller file & the method.
    handler: 'controller.getArticles',
    config: {
      policies: [],
    },
  },
];
