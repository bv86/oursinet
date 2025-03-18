import { ArticleProps } from "@/lib/types";
import { Search } from "@/components/Search";
import { getContent } from "@/lib/data/loaders";
import { PaginationComponent } from "./PaginationComponent";

interface ContentListProps {
  query?: string;
  path: string;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  showSearch?: boolean;
  page?: string;
  showPagination?: boolean;
}

async function loader(path: string, query?: string, page?: string) {
  const { data, meta } = await getContent(path, query, page);
  return {
    articles: (data as ArticleProps[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  path,
  component,
  showSearch,
  query,
  page,
  showPagination,
}: Readonly<ContentListProps>) {
  const { articles, pageCount } = await loader(path, query, page);
  const Component = component;

  return (
    <section className="flex flex-col gap-8 items-center px-4">
      {showSearch && <Search />}
      <div className="w-full flex flex-col gap-4">
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
      {showPagination && <PaginationComponent pageCount={pageCount} />}
    </section>
  );
}
