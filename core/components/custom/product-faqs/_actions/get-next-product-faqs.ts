'use server';

import { getProductFaqMetafields, Variables as ProductFaqVariables } from '../_data/component-data';

export const getNextProductFaqs = async(variables: ProductFaqVariables) => {
  return await getProductFaqMetafields(variables);
}
