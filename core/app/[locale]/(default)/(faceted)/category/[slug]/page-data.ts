import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { BreadcrumbsCategoryFragment } from '~/components/breadcrumbs/fragment';

const CategoryPageQuery = graphql(
  `
    query CategoryPageQuery($entityId: Int!) {
      site {
        category(entityId: $entityId) {
          entityId
          name
          ...BreadcrumbsFragment
          seo {
            pageTitle
            metaDescription
            metaKeywords
          }
        }
        categoryTree(rootEntityId: $entityId) {
          entityId
          name
          path
          children {
            entityId
            name
            path
            children {
              entityId
              name
              path
            }
          }
        }
        settings {
          storefront {
            catalog {
              productComparisonsEnabled
            }
          }
        }
      }
    }
  `,
  [BreadcrumbsCategoryFragment],
);

export const getCategoryPageData = cache(async (entityId: number, customerAccessToken?: string) => {
  const response = await client.fetch({
    document: CategoryPageQuery,
    variables: { entityId },
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return response.data.site;
});
