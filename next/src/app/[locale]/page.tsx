import { BlockRenderer } from "@/components/BlockRenderer";
import { Locale } from "@/config";
import { getHomePage } from "@/lib/data/loaders";
import { LocalizedPage } from "@/lib/types";
import { notFound } from "next/navigation";

async function loader(locale: Locale) {
  const data = await getHomePage(locale);
  if (!data) notFound();
  return { ...data.data };
}

const Home: LocalizedPage = async ({ params }) => {
  const { locale } = await params;
  const data = await loader(locale);
  const blocks = data?.blocks || [];
  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-8 pb-8">
      <BlockRenderer blocks={blocks} />
    </div>
  );
};

export default Home;
