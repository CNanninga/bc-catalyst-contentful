'use client';

import React, {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  useContext,
} from 'react';

import { ProductFaqs } from './faqs';

type ContextProps = ComponentPropsWithoutRef<typeof ProductFaqs>;

const ProductFaqsContext = createContext<ContextProps>({
  limit: 10,
  faqs: [],
});

export const ProductFaqsContextProvider = (
  { value, children }: PropsWithChildren<{ value: ContextProps }>
) => (
  <ProductFaqsContext.Provider value={value}>{children}</ProductFaqsContext.Provider>
);

interface ProductFaq {
  question: string;
  answer: string;
  richContent: boolean;
  content: ReactNode;
}

interface ProductFaqsProps {
  faqs: ProductFaq[];
  showOriginal: boolean;
}

export const MakeswiftProductFaqs = forwardRef(
  (
    {
      faqs,
      showOriginal
    }: ProductFaqsProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { productId, limit, faqs: passedFaqs, initialEndCursor } = useContext(ProductFaqsContext);

    const formattedFaqs = faqs.map(
      (faq, index): { key: string, question: string, answer: string | ReactNode } => {
        return {
          key: index.toString(),
          question: faq.question,
          answer: (faq.richContent) ? faq.content : faq.answer,
        };
      }
    );

    const allFaqs = formattedFaqs.concat(
      showOriginal ? passedFaqs : []
    );

    return (
      <div ref={ref}>
        <ProductFaqs 
          faqs={allFaqs} 
          initialEndCursor={showOriginal ? initialEndCursor : null}
          limit={limit} 
          productId={productId} 
          showLoadMore={showOriginal} 
          />
      </div>
    );
  },
);