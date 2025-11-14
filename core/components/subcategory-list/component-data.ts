import { cache } from 'react';

import { client } from '~/client';
import { graphql, VariablesOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const SubcategoriesQuery = graphql(
  `
    query SubcategoriesQuery($categoryId: Int!) {
      site {
        categoryTree(rootEntityId: $categoryId) {
          entityId
          children {
            entityId
            name
            path
            image {
              altText
              url: urlTemplate(lossy: true)
            }
            productCount
          }
        }
      }
    }
  `
);

export const getSubcategories = cache(
  async (
    variables: VariablesOf<typeof SubcategoriesQuery>,
    customerAccessToken?: string
  ) => {
    const response = await client.fetch({
      document: SubcategoriesQuery,
      variables,
      customerAccessToken,
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
    });

    return response.data.site.categoryTree[0]?.children ?? [];
  }
);