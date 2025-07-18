import { MakeswiftComponent } from '@makeswift/runtime/next';
import { getLocale } from 'next-intl/server';

import { getComponentSnapshot } from '~/lib/makeswift/client';

import { getProductFaqMetafields } from './_data/component-data';
import { ProductFaqsContextProvider } from './client';
import { COMPONENT_TYPE } from './register';

const limit = 2;

export async function ProductFaqs({ productId }: { productId: number }) {
  const locale = await getLocale();

  const snapshot = await getComponentSnapshot(`product-faqs-${productId}`);
  const faqCollection = await getProductFaqMetafields({ productId, locale, limit });

  return (
    <ProductFaqsContextProvider value={{
      productId,
      limit,
      faqs: faqCollection.faqs,
      initialEndCursor: faqCollection.endCursor
    }}>
      <MakeswiftComponent
        label={`FAQs for ${faqCollection.productName}`}
        snapshot={snapshot}
        type={COMPONENT_TYPE}
      />
    </ProductFaqsContextProvider>
  );
}
