import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/BlockRenderer";
import { HeroSection } from "@/components/blocks/HeroSection";
import { getContentBySlug } from "@/lib/data/loaders";
import { ArticleProps } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/articles");
  const article = data[0];
  if (!article) throw notFound();
  return { article: article as ArticleProps, blocks: article?.blocks };
}

export default async function SingleBlogRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, image } = article;

  return (
    <div className="flex flex-col gap-8">
      <HeroSection id={article.id} title={title} image={image} />

      <div className="flex flex-col gap-4">
        <BlockRenderer blocks={blocks} />
      </div>
    </div>
  );
}
