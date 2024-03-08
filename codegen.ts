import { CodegenConfig } from '@graphql-codegen/cli';

export const graphqlApiDomain: string =
  process.env.BIGCOMMERCE_GRAPHQL_API_DOMAIN ?? 'mybigcommerce.com';

const getToken = () => {
  const token = process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

  if (!token) {
    throw new Error('Missing customer impersonation token');
  }

  return token;
};

const getStoreHash = () => {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;

  if (!storeHash) {
    throw new Error('Missing store hash');
  }

  return storeHash;
};

const getChannelId = () => {
  const channelId = process.env.BIGCOMMERCE_CHANNEL_ID;

  return channelId;
};

const getEndpoint = () => {
  const storeHash = getStoreHash();
  const channelId = getChannelId();

  // Not all sites have the channel-specific canonical URL backfilled.
  // Wait till MSF-2643 is resolved before removing and simplifying the endpoint logic.
  if (!channelId || channelId === '1') {
    return `https://store-${storeHash}.${graphqlApiDomain}/graphql`;
  }

  return `https://store-${storeHash}-${channelId}.${graphqlApiDomain}/graphql`;
};

const getContentfulEndpoint = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  return `https://graphql.contentful.com/content/v1/spaces/${spaceId ?? ''}`;
};

const getContentfulToken = () => {
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;
  return token ?? '';
};

const config: CodegenConfig = {
  generates: {
    './client/generated/': {
      schema: [
        {
          [getEndpoint()]: {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        },
      ],
      documents: ['client/queries/**/*.ts', 'client/mutations/**/*.ts', 'client/fragments/**/*.ts'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        documentMode: 'string',
        avoidOptionals: {
          field: true,
        },
        scalars: {
          DateTime: 'string',
          Long: 'number',
          BigDecimal: 'number',
        },
      },
    },
    './contentful-client/generated/': {
      schema: [
        {
          [getContentfulEndpoint()]: {
            headers: {
              Authorization: `Bearer ${getContentfulToken()}`,
            },
          },
        },
      ],
      documents: ['contentful-client/queries/**/*.ts', 'contentful-client/mutations/**/*.ts', 'contentful-client/fragments/**/*.ts'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        documentMode: 'string',
        avoidOptionals: {
          field: true,
        },
        scalars: {
          DateTime: 'string',
          Long: 'number',
          BigDecimal: 'number',
        },
      },
    },
    './schema.graphql': {
      schema: [
        {
          [getEndpoint()]: {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        },
        {
          [getContentfulEndpoint()]: {
            headers: {
              Authorization: `Bearer ${getContentfulToken()}`,
            },
          },
        },
      ],
      plugins: ['schema-ast'],
      watchPattern: '',
    },
  },
};

export default config;
