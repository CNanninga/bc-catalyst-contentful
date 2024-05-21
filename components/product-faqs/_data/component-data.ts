import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { z } from 'zod';
import { FragmentOf, graphql } from '~/client/graphql';

export const FaqMetafieldsFragment = graphql(`
  fragment FaqMetafieldsFragment on Product {
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

const FaqMetafield = z.object({
  key: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const formatFaqsCollection = (
  product: FragmentOf<typeof FaqMetafieldsFragment>
) => {
  const fields = removeEdgesAndNodes(product.metafields);

  const faqs = fields
    .map((field) => {
      try {
        return FaqMetafield.parse({
          ...JSON.parse(field.value),
          key: field.key,
        });
      } catch (err) {
        return { key: '', question: '', answer: '' };
      }
    })
    .filter((field) => field.key.trim().length > 0);

  return {
    endCursor: product.metafields.pageInfo.hasNextPage 
      ? product.metafields.pageInfo.endCursor 
      : null,
    faqs,
  };
};