import qs from 'qs';
import { fetchAPI } from '../fetch-api';
import { type Locale, STRAPI_BASE_URL } from '@/config';

const BLOG_PAGE_SIZE = 10;

const homePageBlocks = {
  blocks: {
    on: {
      'blocks.hero-section': {
        populate: {
          image: {
            fields: ['url', 'alternativeText'],
          },
          cta: true,
        },
      },
      'blocks.info-block': {
        populate: {
          image: {
            fields: ['url', 'alternativeText'],
          },
          cta: true,
        },
      },
      'blocks.content-block': {
        populate: true,
      },
    },
  },
};

export async function getHomePage(locale: Locale) {
  const path = `/api/home-page`;
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = qs.stringify({
    populate: homePageBlocks,
    filters: {
      locale: {
        $eq: locale,
      },
    },
  });
  return fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 300, // Revalidate every 5 minutes
    },
  });
}

const pageBySlugQuery = (locale: Locale, slug: string) =>
  qs.stringify({
    locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        on: {
          'blocks.hero-section': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
              cta: true,
            },
          },
          'blocks.info-block': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
              cta: true,
            },
          },
          'blocks.heading': {
            populate: true,
          },
          'blocks.paragraph-with-image': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
            },
          },
          'blocks.paragraph': {
            populate: true,
          },
          'blocks.full-image': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
            },
          },
        },
      },
    },
  });

export async function getPageBySlug(slug: string, locale: Locale) {
  const path = '/api/pages';
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = pageBySlugQuery(locale, slug);
  return await fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 300, // Revalidate every 5 minutes
    },
  });
}

const globalSettings = (locale: Locale) => {
  return qs.stringify({
    populate: {
      header: {
        populate: {
          logo: {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
            },
          },
          navigation: true,
        },
      },
      footer: {
        populate: {
          socials: true,
        },
      },
    },
    locale,
  });
};

export async function getGlobalSettings(locale: Locale) {
  const path = '/api/global';
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = await globalSettings(locale);
  return fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 3600, // Revalidate every hour
    },
  });
}

export async function getContent(
  locale: Locale,
  path: string,
  query?: string,
  page?: string,
  limit?: string
) {
  const url = new URL(path, STRAPI_BASE_URL);

  url.search = qs.stringify({
    locale,
    sort: ['createdAt:desc'],
    filters: {
      $or: [
        { title: { $containsi: query } },
        { description: { $containsi: query } },
      ],
    },
    pagination: {
      pageSize: parseInt(limit || '0') || BLOG_PAGE_SIZE,
      page: parseInt(page || '1'),
    },
    populate: {
      logo: {
        fields: ['url', 'alternativeText'],
      },
      tags: {
        fields: ['tag', 'slug'],
      },
    },
  });

  return fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 300, // Revalidate every 5 minutes
    },
  });
}

const blogPopulate = {
  image: {
    fields: ['url', 'alternativeText'],
  },
  tags: {
    fields: ['tag', 'slug'],
  },
  blocks: {
    on: {
      'blocks.hero-section': {
        populate: {
          image: {
            fields: ['url', 'alternativeText'],
          },
          cta: true,
        },
      },
      'blocks.info-block': {
        populate: {
          image: {
            fields: ['url', 'alternativeText'],
          },
          cta: true,
        },
      },
      'blocks.heading': {
        populate: true,
      },
      'blocks.paragraph-with-image': {
        populate: {
          image: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
      'blocks.paragraph': {
        populate: true,
      },
      'blocks.full-image': {
        populate: {
          image: {
            fields: ['url', 'alternativeText'],
          },
        },
      },
    },
  },
};

export async function getContentBySlug(
  slug: string,
  path: string,
  locale: Locale
) {
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = qs.stringify({
    locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      ...blogPopulate,
    },
  });
  return fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 300, // Revalidate every 5 minutes
    },
  });
}

// Helper functions for sitemap generation
export async function getAllArticlesForSitemap(locale: Locale) {
  const path = '/api/articles';
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = qs.stringify({
    locale,
    fields: ['slug', 'updatedAt', 'publishedAt'],
    pagination: {
      pageSize: 1000, // Adjust if you have more than 100 articles
      page: 1,
    },
  });
  return fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 3600, // Revalidate every hour
    },
  });
}

export async function getAllPagesForSitemap(locale: Locale) {
  const path = '/api/pages';
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = qs.stringify({
    locale,
    fields: ['slug', 'updatedAt', 'publishedAt'],
    pagination: {
      pageSize: 1000, // Adjust if you have more than 100 pages
      page: 1,
    },
  });
  return fetchAPI(url.href, {
    method: 'GET',
    locale,
    next: {
      revalidate: 3600, // Revalidate every hour
    },
  });
}
