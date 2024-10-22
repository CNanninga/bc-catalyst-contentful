'use server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';

import { FaqMetafieldsFragment, formatFaqsCollection } from '../_data/component-data';

const getNextProductFaqs = async (
  productId: number,
  limit: number,
  endCursor?: string | null
) => {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await sleep(2000);

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

  const response = await client.fetch({
    document: MetafieldsQuery,
    variables: {
      productId,
      limit,
      after: endCursor,
    },
  });

  const product = response.data.site.product;

  if (!product?.metafields) {
    return { endCursor: null, faqs: [] };
  }

  return formatFaqsCollection(product);
};

export default getNextProductFaqs;
