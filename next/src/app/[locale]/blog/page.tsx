import { BlockRenderer } from "@/components/BlockRenderer";
import { BlogCard } from "@/components/BlogCard";
import { ContentList } from "@/components/ContentList";
import { type Locale } from "@/config";
import { getPageBySlug } from "@/lib/data/loaders";
import { LocalizedPage } from "@/lib/types";
import { notFound } from "next/navigation";

async function loader(locale: Locale) {
  const { data } = await getPageBySlug("blog", locale);
  if (data.length === 0) notFound();
  return { blocks: data[0]?.blocks };
}

const Blog: LocalizedPage<{ page?: string; query?: string }> = async function ({
  params,
  searchParams,
}) {
  const { locale } = await params;
  const { page, query } = await searchParams;
  const { blocks } = await loader(locale);
  return (
    <div className="flex flex-col gap-8 pb-8">
      <BlockRenderer blocks={blocks} />
      <ContentList
        path="/api/articles"
        component={BlogCard}
        showSearch
        query={query}
        showPagination
        page={page}
      />
    </div>
  );
};

export default Blog;
