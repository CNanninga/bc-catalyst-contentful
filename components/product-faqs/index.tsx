import ProductFaqsList from '~/components/product-faqs/faqs-list';
import { FaqMetafieldsFragment, formatFaqsCollection } from './_data/component-data';
import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';

const limit = 2;

const MetafieldsQuery = graphql(
  `
    query getProductFaqMetafields($productId: Int!, $limit: Int, $after: String) {
      site {
        product(entityId: $productId) {
          ...FaqMetafieldsFragment
        }
      }
    }
  `,
  [FaqMetafieldsFragment]
);

export const getProductFaqMetafields = cache(
  async (
    productId: number
  ) => {
    const response = await client.fetch({
      document: MetafieldsQuery,
      variables: {
        productId,
        limit,
      },
    });

    const product = response.data.site.product;

    if (!product?.metafields) {
      return { endCursor: null, faqs: [] };
    }

    return formatFaqsCollection(product);
  },
);

const Faqs = async ({ productId }: { productId: number }) => {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await sleep(2000);

  const faqCollection = await getProductFaqMetafields(productId);

  return <ProductFaqsList faqCollection={faqCollection} limit={limit} productId={productId} />;
};

export default Faqs;
