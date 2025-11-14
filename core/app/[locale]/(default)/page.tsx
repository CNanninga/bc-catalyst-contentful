import { Streamable } from '@/vibes/soul/lib/streamable';

import { locales } from '~/i18n/locales';
import { Page as MakeswiftPage } from '~/lib/makeswift';

import { getCategoryContent } from '~/lib/contentful/client/queries/get-category-content';
import CmsContent from '~/components/custom/contenful/cms-content';

interface Params {
  locale: string;
}

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

interface Props {
  params: Promise<Params>;
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
