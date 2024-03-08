import { DocumentTypeDecoration } from "@graphql-typed-document-node/core";

// Overload for documents that require variables
export async function contentfulFetch<TResult, TVariables extends Record<string, unknown>>(config: {
  document: DocumentTypeDecoration<TResult, TVariables>;
  variables: TVariables;
  fetchOptions?: RequestInit;
}): Promise<{data: TResult}>;

// Overload for documents that do not require variables
export async function contentfulFetch<TResult>(config: {
  document: DocumentTypeDecoration<TResult, Record<string, never>>;
  variables?: undefined;
  fetchOptions?: RequestInit;
}): Promise<{data: TResult}>;

export async function contentfulFetch<TResult, TVariables>({
  document,
  variables,
  fetchOptions = {} as RequestInit,
}: {
  document: DocumentTypeDecoration<TResult, TVariables>;
  variables?: TVariables;
  fetchOptions?: RequestInit;
}): Promise<{data: TResult}> {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

  const { cache, headers = {}, ...rest } = fetchOptions;

  const query = (typeof document === 'string') ? document : document.toString();

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