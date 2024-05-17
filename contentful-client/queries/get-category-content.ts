import { cache } from 'react';

import { contentfulFetch } from '../client';
import { graphql, FragmentOf } from '../graphql';

export const BLOCK_BANNER_FRAGMENT = graphql(
  `
    fragment BlockBannerFields on BlockBanner {
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
  `
);

export const BLOCK_RICH_TEXT_FRAGMENT = graphql(
  `
    fragment BlockRichTextFields on BlockRichText {
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
  `
);

export const BLOCK_SIMPLE_TEXT_FRAGMENT = graphql(
  `
    fragment BlockSimpleTextFields on BlockSimpleText {
      sys {
        id
      }
      size
      content {
        json
      }
    }
  `
);

export const BLOCK_IMAGE_FRAGMENT = graphql(
  `
    fragment BlockImageFields on BlockImage {
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
  `
);

const GET_CATEGORY_CONTENT_QUERY = graphql(
  `
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
                ... BlockBannerFields
              }
              ... on BlockRichText {
                ... BlockRichTextFields
              }
              ... on BlockSimpleText {
                ... BlockSimpleTextFields
              }
              ... on BlockImage {
                ... BlockImageFields
              }
            }
          }
        }
      }
    }
    `,
    [
      BLOCK_BANNER_FRAGMENT,
      BLOCK_RICH_TEXT_FRAGMENT,
      BLOCK_SIMPLE_TEXT_FRAGMENT,
      BLOCK_IMAGE_FRAGMENT,
    ]
);

type BlockBanner = FragmentOf<typeof BLOCK_BANNER_FRAGMENT>;
type BlockImage = FragmentOf<typeof BLOCK_IMAGE_FRAGMENT>;
type BlockRichText = FragmentOf<typeof BLOCK_RICH_TEXT_FRAGMENT>;
type BlockSimpleText = FragmentOf<typeof BLOCK_SIMPLE_TEXT_FRAGMENT>;

export type ContentItem = { "__typename": string } & BlockBanner & BlockImage & BlockRichText & BlockSimpleText;

export const getCategoryContent = cache(
  async (type: string, slug: string) => {
    const response = await contentfulFetch({
      document: GET_CATEGORY_CONTENT_QUERY,
      variables: { type, slug }
    });

    return response.data.categoryContentCollection?.items[0]?.contentCollection?.items ?? [];
  },
);
