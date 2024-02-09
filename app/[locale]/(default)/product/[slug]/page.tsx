import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { getProduct } from '~/client/queries/get-product';
import { LocaleType } from '~/i18n';

import { BreadCrumbs } from './_components/breadcrumbs';
import { Description } from './_components/description';
import { Details } from './_components/details';
import Faqs from './_components/faqs';
import FaqsLoading from './_components/faqs/loading';
import { Gallery } from './_components/gallery';
import { RelatedProducts } from './_components/related-products';
import { Reviews } from './_components/reviews';
import { Warranty } from './_components/warranty';

import { getContentBlocks } from '~/lib/contentful/api';
import CmsContent from '~/components/cms/cms-content';

interface ProductPageProps {
  params: { slug: string; locale: LocaleType };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const productId = Number(params.slug);
  const product = await getProduct(productId);

  if (!product) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product({ params, searchParams }: ProductPageProps) {
  const { locale } = params;

  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Product' });
  const messages = await getMessages({ locale });

  const productId = Number(params.slug);
  const { slug, ...options } = searchParams;

  const optionValueIds = Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(searchParams[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );

  const product = await getProduct(productId, optionValueIds);

  if (!product) {
    return notFound();
  }

  const cmsContent = await getContentBlocks('product', product.sku);

  return (
    <>
      <BreadCrumbs productId={product.entityId} />
      <div className="mb-12 mt-4 lg:grid lg:grid-cols-2 lg:gap-8">
        <NextIntlClientProvider locale={locale} messages={{ Product: messages.Product ?? {} }}>
          <Gallery noImageText={t('noGalleryText')} product={product} />
          <Details product={product} />
          {cmsContent.length > 0 && <CmsContent blocks={cmsContent} className="lg:col-span-2 mx-8" />}
          <div className="lg:col-span-2">
            <Description product={product} />
            <Warranty product={product} />

            <h2 className="text-h5 my-4">Frequently Asked Questions</h2>
            <div className="mx-auto md:w-2/3">
              <Suspense fallback={<FaqsLoading />}>
                <Faqs productId={product.entityId} />
              </Suspense>
            </div>

            <Suspense fallback={t('loading')}>
              <Reviews productId={product.entityId} />
            </Suspense>
          </div>
        </NextIntlClientProvider>
      </div>

      <Suspense fallback={t('loading')}>
        <RelatedProducts productId={product.entityId} />
      </Suspense>
    </>
  );
}

export const runtime = 'edge';
