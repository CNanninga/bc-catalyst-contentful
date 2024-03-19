import { Document } from '@contentful/rich-text-types';

const QUERY_CONTENT = `
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

const extractCategoryContent = (responseData: CategoryContentBlocksResp): ContentfulBlock[] => {
  return responseData.data.categoryContentCollection.items[0]?.contentCollection.items ?? [];
};

async function fetchGraphQL<VarsType, RespType>(query: string, variables: VarsType, cache = 'force-cache'): Promise<RespType | never> {
  const fetchOpts:RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN ?? ''}`
    },
    body: JSON.stringify({
      ...(query && { query }),
      variables
    }),
  };

  if (cache !== 'no-store') {
    fetchOpts.next = {
      revalidate: process.env.FETCH_REVALIDATE_TIME ? parseInt(process.env.FETCH_REVALIDATE_TIME, 10) : 10,
    };
  } else {
    fetchOpts.cache = cache;
  }

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID ?? ''}`,
    fetchOpts
  );
  
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return response.json() as Promise<RespType | never>;
}

export async function getContentBlocks(type: string, slug: string): Promise<ContentfulBlock[]> {
  const blocks = await fetchGraphQL<{type: string, slug: string}, CategoryContentBlocksResp>(QUERY_CONTENT, { type, slug });
  
  return extractCategoryContent(blocks);
}

export interface CategoryContentBlocksResp {
  data: {
    categoryContentCollection: {
      items: Array<{
        contentCollection: {
          items: ContentfulBlock[]
        }
      }>
    }
  }
}

export interface ContentfulBlock {
  "__typename": string,
  heading?: string,
  imagePosition?: string,
  backgroundColor?: string,
  style?: string,
  content?: {
    json: Document,
    links?: ContentfulLinks,
  },
  image?: {
    title: string,
    description: string,
    url: string,
  },
  size?: string,
  sys?: {
    id?: string
  },
  url?: string,
  description?: string,
}

export interface ContentfulLinks {
  assets?: {
    block?: ContentfulBlock[]
  }
}
