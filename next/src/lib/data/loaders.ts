import qs from "qs";
import { fetchAPI } from "../fetch-api";
import { type Locale, STRAPI_BASE_URL } from "@/config";

const BLOG_PAGE_SIZE = 10;

const homePageBlocks = {
  blocks: {
    on: {
      "blocks.hero-section": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
      },
      "blocks.info-block": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
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
  return fetchAPI(url.href, { method: "GET", locale });
}

const pageBySlugQuery = (slug: string) =>
  qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        on: {
          "blocks.hero-section": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              cta: true,
            },
          },
          "blocks.info-block": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              cta: true,
            },
          },
        },
      },
    },
  });

export async function getPageBySlug(slug: string, locale: Locale) {
  const path = "/api/pages";
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = pageBySlugQuery(slug);
  return await fetchAPI(url.href, { method: "GET", locale });
}

const globalSettings = () => {
  return qs.stringify({
    populate: {
      header: {
        populate: {
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
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
  });
};

export async function getGlobalSettings(locale: Locale) {
  const path = "/api/global";
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = await globalSettings();
  return fetchAPI(url.href, {
    method: "GET",
    locale,
  });
}

export async function getContent(path: string, query?: string, page?: string) {
  const url = new URL(path, STRAPI_BASE_URL);

  url.search = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: query } },
        { description: { $containsi: query } },
      ],
    },
    pagination: {
      pageSize: BLOG_PAGE_SIZE,
      page: parseInt(page || "1"),
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}

const blogPopulate = {
  blocks: {
    on: {
      "blocks.hero-section": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
      },
      "blocks.info-block": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
      },
      "blocks.heading": {
        populate: true,
      },
      "blocks.paragraph-with-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "blocks.paragraph": {
        populate: true,
      },
      "blocks.full-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
  },
};

export async function getContentBySlug(slug: string, path: string) {
  const url = new URL(path, STRAPI_BASE_URL);
  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      ...blogPopulate,
    },
  });
  console.log("url should be", url.href);
  return fetchAPI(url.href, { method: "GET" });
}
