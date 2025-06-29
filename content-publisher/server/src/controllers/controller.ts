import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }): Core.CoreAPI.Controller.Generic => ({
  // get article entries
  async getArticles(ctx) {},

  // get posts
  async getPosts(ctx) {
    ctx.body = await strapi.plugin('content-publisher').service('service').getPosts(ctx.query);
  },

  // publish a blog post to dev.to
  async publishPostToDevTo(ctx) {
    ctx.body = await strapi
      .plugin('content-publisher')
      .service('service')
      .publishPostToDevTo(ctx.request.body);
  },

  // get a single post
  async getSinglePost(ctx) {
    ctx.body = await strapi
      .plugin('content-publisher')
      .service('service')
      .getSinglePost(ctx.request.query);
  },

  // search for a post
  async getSearchQuery(ctx) {
    ctx.body = await strapi
      .plugin('content-publisher')
      .service('service')
      .getSearchQuery(ctx.request.query);
  },

  // delete a post
  async deletePost(ctx) {
    ctx.body = await strapi
      .plugin('content-publisher')
      .service('service')
      .deletePost(ctx.request.query);
  },
});

export default controller;
