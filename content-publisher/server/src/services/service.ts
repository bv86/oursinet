import { type Core } from '@strapi/strapi';

const postPerPage = 5;
const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * GET Posts with Pagination
   */
  async getPosts(query: any) {
    try {
      // get start from query params
      const { start } = query;
      // get total posts count
      const totalPosts = await strapi.documents('plugin::content-publisher.post').count({});

      // get posts
      const posts = await strapi.documents('plugin::content-publisher.post').findMany({
        populate: {
          article: {
            populate: '*',
          },
        },
        // return only 5 posts from the start index
        start,
        limit: postPerPage,
        locale: 'en',
      });

      // return the posts and total posts
      return { posts, totalPosts };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Publish Post to Dev.to
   */
  async publishPostToDevTo(post: any) {
    try {
      // destructuring the post object
      const { title, blocks, description, slug, tags, image } = post.article;
      // get the blog tags
      const blogTags = tags.map((tag) => tag.tag);
      // content is made by concatenating all paragraphs
      let content = blocks
        .filter((block) => block.__component === 'blocks.paragraph')
        .map((block) => block.content)
        .join('\n\n');

      content += `\n\n*NB: [this article](https://oursi.net/en/blog/${slug}) was originally published on [oursi.net](https://oursi.net/en/blog), my personal blog where I write about Kubernetes, self-hosting, and Linux.*`;
      // payload to be sent to dev.to
      const devToPayload = {
        article: {
          title,
          body_markdown: content,
          published: true,
          series: null,
          main_image: image.url,
          canonical_url: `https://oursi.net/en/blog/${slug}`,
          description,
          tags: blogTags,
          organization_id: null,
        },
      };

      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.DEVTO_API_KEY,
        },
        body: JSON.stringify(devToPayload),
      });
      if (!response.ok) {
        try {
          const details = await response.text();
          console.log('Error details:', details);
          throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
          console.error('Error parsing response:', error);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      // parse the response
      const data = await response.json();

      // get the dev.to url
      const devToUrl = data?.url;

      // update the post with the dev.to link
      await strapi.documents('plugin::content-publisher.post').update({
        documentId: post.documentId,
        data: {
          devToLink: devToUrl,
        } as any,
      });

      // return the response
      return data;
    } catch (error) {
      console.log('Error publishing to Dev.to:', error);
      return error.message;
    }
  },
  /**
   * FETCH SINGLE Post
   */
  async getSinglePost(query: any) {
    // get articleId from query
    const { articleId } = query;
    try {
      // find the post
      const post = await strapi.documents('plugin::content-publisher.post').findFirst({
        populate: {
          article: {
            populate: ['tags'],
          },
        },
        // filter the post by blogId
        filters: {
          article: {
            documentId: {
              $eq: articleId,
            },
          },
        },
      });

      // return the post
      return post;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search Query
   */
  async getSearchQuery(query: { search: string; start: number }) {
    try {
      // get search and start from query
      const { search, start } = query;

      console.log('start ooo,', start);
      // find total posts
      const totalPosts = await strapi.documents('plugin::content-publisher.post').findMany({
        filters: {
          article: { title: { $contains: search } },
        },
      });

      // find posts
      const posts = await strapi.documents('plugin::content-publisher.post').findMany({
        populate: {
          article: {
            populate: ['tags'],
          },
        },
        // filter only blog titles that contains the search query
        filters: {
          article: { title: { $contains: search } },
        },
        // return only 5 posts from the start index
        start: start,
        limit: postPerPage,
      });

      // return the posts and total posts
      return { posts, totalPosts: totalPosts.length };
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE Post
   */
  async deletePost(query: { postId: string }) {
    try {
      // get postId from query
      const { postId } = query;

      // delete the post
      await strapi.documents('plugin::content-publisher.post').delete({ documentId: postId });

      return 'Post deleted';
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
});

export default service;
