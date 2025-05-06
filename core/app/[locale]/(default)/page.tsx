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

  const cmsContent = await getCategoryContent('home', 'home', locale);

  return (
    <>
      {cmsContent.length > 0 && <CmsContent blocks={cmsContent} className="mx-8" />}
      <MakeswiftPage locale={locale} path="/" />
    </>
  );
}
