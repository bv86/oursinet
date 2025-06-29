const schema = {
  kind: 'collectionType',
  collectionName: 'posts',
  info: {
    singularName: 'post',
    pluralName: 'posts',
    displayName: 'Post',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
    'content-type-builder': {
      visible: true,
    },
  },
  attributes: {
    devToLink: {
      type: 'text',
    },
    article: {
      type: 'relation',
      relation: 'oneToOne',
      target: 'api::article.article',
    },
  },
};

export default {
  schema,
};
