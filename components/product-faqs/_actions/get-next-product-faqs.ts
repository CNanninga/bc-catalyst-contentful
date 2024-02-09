'use server';

import { getProductFaqMetafields } from '~/client/queries/get-product-faq-metafields';

const getNextProductFaqs = async (
  productId: number,
  limit: number,
  endCursor?: string | null
) => {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await sleep(2000);

  return getProductFaqMetafields(productId, limit, endCursor);
};

export default getNextProductFaqs;
