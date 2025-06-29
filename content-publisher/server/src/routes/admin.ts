export default [
  {
    method: 'GET',
    path: '/posts',
    handler: 'controller.getPosts',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/single-post',
    handler: 'controller.getSinglePost',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/publish-to-devto',
    handler: 'controller.publishPostToDevTo',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/search',
    handler: 'controller.getSearchQuery',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/delete-post',
    handler: 'controller.deletePost',
    config: {
      policies: [],
      auth: false,
    },
  },
];
