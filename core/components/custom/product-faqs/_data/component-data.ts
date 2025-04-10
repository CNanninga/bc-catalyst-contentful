import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';
import { z } from 'zod';

import { client } from '~/client';
import { FragmentOf, graphql, VariablesOf } from '~/client/graphql';

const FaqMetafieldsFragment = graphql(`
  fragment FaqMetafieldsFragment on Product {
    name
    metafields(namespace: "FAQ", first: $limit, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          key
          value
        }
      }
    }
  }
`);

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

const FaqMetafield = z.object({
  key: z.string(),
  question: z.string(),
  answer: z.string(),
});

const formatFaqs = (
  product: FragmentOf<typeof FaqMetafieldsFragment>
) => {
  const fields = removeEdgesAndNodes(product.metafields);

  return fields
    .map((field) => {
      try {
        return FaqMetafield.parse({
          ...JSON.parse(field.value),
          key: field.key,
        });
      } catch {
        return { key: '', question: '', answer: '' };
      }
    })
    .filter((field) => field.key.trim().length > 0);
}

const formatFaqsCollection = (
  product: FragmentOf<typeof FaqMetafieldsFragment>
) => {
  return {
    productName: product.name,
    endCursor: product.metafields.pageInfo.hasNextPage 
      ? product.metafields.pageInfo.endCursor 
      : null,
    faqs: formatFaqs(product),
  };
};

type Variables = VariablesOf<typeof MetafieldsQuery>;

const getProductFaqMetafields = cache(
  async (variables: Variables) => {
    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    await sleep(5000);

    const response = await client.fetch({
      document: MetafieldsQuery,
      variables,
    });

    const product = response.data.site.product;

    if (!product?.metafields) {
      return { productName: '', endCursor: null, faqs: [] };
    }

    return formatFaqsCollection(product);
  }
);

export { formatFaqs, type Variables, getProductFaqMetafields };
