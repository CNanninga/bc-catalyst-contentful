import { FragmentOf, graphql } from '~/client/graphql';

export const HeaderFragment = graphql(`
  fragment HeaderFragment on Site {
    settings {
      storeName
      logoV2 {
        __typename
        ... on StoreTextLogo {
          text
        }
        ... on StoreImageLogo {
          image {
            url: urlTemplate(lossy: true)
            altText
          }
        }
      }
    }
    content {
      headerPages: pages(filters: { isVisibleInNavigation: true }) {
        edges {
          node {
            __typename
            name
            ... on RawHtmlPage {
              path
            }
            ... on ContactPage {
              path
            }
            ... on NormalPage {
              path
            }
            ... on BlogIndexPage {
              path
            }
            ... on ExternalLinkPage {
              link
            }
          }
        }
      }
    }
    categoryTree {
      name
      path
      children {
        name
        path
        children {
          name
          path
        }
      }
    }
    currencies(first: 25) {
      edges {
        node {
          code
          isTransactional
          isDefault
        }
      }
    }
  }
`);

export const HeaderLinksFragment = graphql(`
  fragment HeaderLinksFragment on Site {
    categoryTree {
      name
      path
      children {
        name
        path
        children {
          name
          path
        }
      }
    }
  }
`);

export type Currency = NonNullable<
  NonNullable<FragmentOf<typeof HeaderFragment>>['currencies']['edges']
>[number]['node'];
export type CurrencyCode = Currency['code'];
