import { Metadata } from 'next';

import { Streamable } from '@/vibes/soul/lib/streamable';

import { locales } from '~/i18n/locales';
import { getMakeswiftPageMetadata, Page as MakeswiftPage } from '~/lib/makeswift';
import { getMetadataAlternates } from '~/lib/seo/canonical';

import { getCategoryContent } from '~/lib/contentful/client/queries/get-category-content';
import CmsContent from '~/components/custom/contenful/cms-content';

interface Params {
  locale: string;
}

interface Props {
  params: Promise<Params>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await getMakeswiftPageMetadata({ path: '/', locale });

  return {
    ...(metadata?.title != null && { title: metadata.title }),
    ...(metadata?.description != null && { description: metadata.description }),
    alternates: await getMetadataAlternates({ path: '/', locale }),
  };
}

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  const streamableCmsContent = Streamable.from(async () => {
    await new Promise((resolve) => setTimeout(resolve, 6000));
    return await getCategoryContent('home', 'home', locale);
  });

  return (
    <>
      <CmsContent blocks={streamableCmsContent} className="mx-8" />
      <MakeswiftPage locale={locale} path="/" />
    </>
  );
}
