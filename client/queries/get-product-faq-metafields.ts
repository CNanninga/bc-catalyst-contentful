import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';
import { z } from 'zod';

import { client } from '..';
import { graphql } from '../generated';

const GET_PRODUCT_FAQ_METAFIELDS_QUERY = /* GraphQL */ `
  query getProductFaqMetafields($productId: Int!, $limit: Int) {
    site {
      product(entityId: $productId) {
        metafields(namespace: "FAQ", first: $limit) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  }
`;

const FaqMetafield = z.object({
  key: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const getProductFaqMetafields = cache(
  async (
    productId: number,
    limit: number
  ) => {
    const query = graphql(GET_PRODUCT_FAQ_METAFIELDS_QUERY);

    const response = await client.fetch({
      document: query,
      variables: {
        productId,
        limit,
      },
    });

    const metafields = response.data.site.product?.metafields;

    if (!metafields) {
      return { faqs: [] };
    }

    const fields = removeEdgesAndNodes(metafields);

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
      faqs,
    };
  },
);
