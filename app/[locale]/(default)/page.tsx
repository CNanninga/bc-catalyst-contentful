import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import {
  ProductCardCarousel,
  ProductCardCarouselFragment,
} from '~/components/product-card-carousel';
import { LocaleType } from '~/i18n';

import { getCategoryContent } from '~/contentful-client/queries/get-category-content';
import CmsContent from '~/components/cms/cms-content';

interface Props {
  params: {
    locale: LocaleType;
  };
}

const HomePageQuery = graphql(
  `
    query HomePageQuery {
      site {
        newestProducts(first: 12) {
          edges {
            node {
              ...ProductCardCarouselFragment
            }
          }
        }
        featuredProducts(first: 12) {
          edges {
            node {
              ...ProductCardCarouselFragment
            }
          }
        }
      }
    }
  `,
  [ProductCardCarouselFragment],
);

export default async function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const customerId = await getSessionCustomerId();

  const t = await getTranslations({ locale, namespace: 'Home' });
  const messages = await getMessages({ locale });

  const [ homePageData, cmsContent ] = await Promise.all([
    client.fetch({
      document: HomePageQuery,
      customerId,
      fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
    }),
    getCategoryContent('home', 'home'),
  ]);

  const { data } = homePageData;

  const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);
  const newestProducts = removeEdgesAndNodes(data.site.newestProducts);

  return (
    <>
      {cmsContent.length > 0 && <CmsContent blocks={cmsContent} className="mx-8" />}

      <div className="my-10">
        <NextIntlClientProvider locale={locale} messages={{ Product: messages.Product ?? {} }}>
          <ProductCardCarousel
            products={featuredProducts}
            showCart={false}
            showCompare={false}
            title={t('Carousel.featuredProducts')}
          />
          <ProductCardCarousel
            products={newestProducts}
            showCart={false}
            showCompare={false}
            title={t('Carousel.newestProducts')}
          />
        </NextIntlClientProvider>
      </div>
    </>
  );
}

export const runtime = 'edge';
