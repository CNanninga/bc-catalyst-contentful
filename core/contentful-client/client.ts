import { DocumentNode, print } from 'graphql';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DocumentDecoration<
  Result = {
    [key: string]: any;
  },
  Variables = {
    [key: string]: any;
  },
> {
  /** Type to support `@graphql-typed-document-node/core`
   * @internal
   */
  __apiType?: (variables: Variables) => Result;
  /** Type to support `TypedQueryDocumentNode` from `graphql`
   * @internal
   */
  __ensureTypesOfVariablesAndResultMatching?: (variables: Variables) => Result;
}

export function normalizeQuery(query: string | DocumentNode | DocumentDecoration<any, any>) {
  if (typeof query === 'string') {
    return query;
  }

  if (query instanceof String) {
    return query.toString();
  }

  if ('kind' in query) {
    return print(query);
  }

  throw new Error('Invalid query type');
};

// Overload for documents that require variables
export async function contentfulFetch<TResult, TVariables extends Record<string, unknown>>(config: {
  document: DocumentDecoration<TResult, TVariables>;
  variables: TVariables;
  fetchOptions?: RequestInit;
}): Promise<{data: TResult}>;

// Overload for documents that do not require variables
export async function contentfulFetch<TResult>(config: {
  document: DocumentDecoration<TResult, Record<string, never>>;
  variables?: undefined;
  fetchOptions?: RequestInit;
}): Promise<{data: TResult}>;

export async function contentfulFetch<TResult, TVariables>({
  document,
  variables,
  fetchOptions = {} as RequestInit,
}: {
  document: DocumentDecoration<TResult, TVariables>;
  variables?: TVariables;
  fetchOptions?: RequestInit;
}): Promise<{data: TResult}> {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

  const { cache, headers = {}, ...rest } = fetchOptions;

  const query = normalizeQuery(document);

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID ?? ''}`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN ?? ''}`,
        ...headers,
      },
      body: JSON.stringify({
        query,
        ...(variables && { variables }),
      }),
      ...(cache && { cache }),
      ...rest,
    }
  );

  if (!response.ok) {
    throw new Error('Unexpected error');
  }

  return response.json() as Promise<{data: TResult}>;
}