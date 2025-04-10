import { MakeswiftComponent } from '@makeswift/runtime/next';

import { getComponentSnapshot } from '~/lib/makeswift/client';

import { getProductFaqMetafields } from './_data/component-data';
import { ProductFaqsContextProvider } from './client';
import { COMPONENT_TYPE } from './register';

const limit = 2;

export async function ProductFaqs({ productId }: { productId: number }) {
  const snapshot = await getComponentSnapshot(`product-faqs-${productId}`);
  const faqCollection = await getProductFaqMetafields({ productId, limit });

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
