import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.db.lifecycles.subscribe({
    // only for the article collection type
    models: ['api::article.article'],
    // after an article post is created
    async afterCreate(event) {
      // create new data
      const newData = {
        article: event.result.documentId,
        devToLink: null,
      };

      // create new post
      await strapi.documents('plugin::content-publisher.post').create({
        data: newData,
      });
    },
  });
};

export default register;
