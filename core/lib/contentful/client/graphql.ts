import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '~/contentful-graphql';

export const contentfulGraphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    Long: number;
    BigDecimal: number;
  };
  disableMasking: true;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
