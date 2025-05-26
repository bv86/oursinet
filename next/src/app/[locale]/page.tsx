import { BlockRenderer } from '@/components/BlockRenderer';
import { Locale } from '@/config';
import { getHomePage } from '@/lib/data/loaders';
import { LocalizedPage } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslation } from '@/i18n.utils';

async function loader(locale: Locale) {
  const data = await getHomePage(locale);
  if (!data) notFound();
  return { ...data.data };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = await loader(locale);

  return {
    title: `${title || (await getTranslation(locale, 'meta.home.title'))} | Oursi.net - Benoit Vannesson`,
    description:
      description || (await getTranslation(locale, 'meta.home.description')),
    keywords: [
      'Benoit Vannesson',
      'Web Development',
      'Technology Blog',
      'Portfolio',
      'Oursi.net',
    ],
    alternates: {
      languages: {
        'en-US': '/en',
        'fr-FR': '/fr',
      },
    },
    openGraph: {
      title: `${title || (await getTranslation(locale, 'meta.home.title'))} | Oursi.net - Benoit Vannesson`,
      description:
        description || (await getTranslation(locale, 'meta.home.description')),
      type: 'website',
      url: 'https://oursi.net/',
      siteName: 'Oursi.net',
    },
  };
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
