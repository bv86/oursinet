import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { type Locale } from "@/config";
import type { LocalizedStrapiPage } from "@/lib/types";
import { getPageBySlug } from "@/lib/data/loaders";

async function loader({ slug, locale }: { slug: string; locale: Locale }) {
  const { data } = await getPageBySlug(slug, locale);
  if (!data) notFound();
  return { blocks: data[0]?.blocks };
}

const DynamicPage: LocalizedStrapiPage = async ({ params }) => {
  const settings = await params;
  const { blocks } = await loader(settings);
  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-8 pb-8">
      <BlockRenderer blocks={blocks} />
    </div>
  );
};

export default DynamicPage;
