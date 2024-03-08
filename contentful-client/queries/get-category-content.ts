import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';

import { contentfulFetch } from '../client';
import { graphql } from '../generated';

export const GET_CATEGORY_CONTENT_QUERY = /* GraphQL */ `
  query ContentCollection(
    $type: String
    $slug: String
  ) {
      categoryContentCollection(
        where: {slug: $slug, type: $type}, 
        limit: 1
      ) {
          items {
              contentCollection(limit: 10) {
                  items {
                      __typename
                      ... on BlockBanner {
                          sys {
                              id
                          }
                          heading
                          imagePosition
                          backgroundColor
                          style
                          content {
                              json
                          }
                          image {
                              title
                              description
                              url
                          }
                      }
                      ... on BlockRichText {
                          sys {
                              id
                          }
                          content {
                              json
                              links {
                                  assets {
                                      block {
                                          title
                                          description
                                          url
                                          sys {
                                              id
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      ... on BlockSimpleText {
                          sys {
                              id
                          }
                          size
                          content {
                              json
                          }
                      }
                      ... on BlockImage {
                          sys {
                              id
                          }
                          size
                          image {
                              title
                              description
                              url
                          }
                      }
                  }
              }
          }
      }
  }
`;

export const getCategoryContent = cache(
  async (type: string, slug: string) => {
    const query = graphql(GET_CATEGORY_CONTENT_QUERY);

    const response = await contentfulFetch({
      document: query,
      variables: { type, slug }
    });

    return response.data.categoryContentCollection?.items[0]?.contentCollection?.items ?? [];
  },
);

export const getFirstCategoryContentBlock = (blocks: Awaited<ReturnType<typeof getCategoryContent>>) => {
  return blocks.find(block => block?.__typename);
};
