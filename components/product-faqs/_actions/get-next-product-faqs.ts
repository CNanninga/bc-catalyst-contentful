'use server';

import { getProductFaqMetafields } from '~/client/queries/get-product-faq-metafields';

const getNextProductFaqs = async (
  productId: number,
  limit: number,
  endCursor?: string | null
) => {
  return getProductFaqMetafields(productId, limit, endCursor);
};

export default getNextProductFaqs;
