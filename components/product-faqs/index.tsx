'use client';

import { useState } from 'react';

import { getProductFaqMetafields } from '~/client/queries/get-product-faq-metafields';

const ProductFaqs = ({
  productId,
  limit,
  faqData,
}: {
  productId: number;
  limit: number;
  faqData: Awaited<ReturnType<typeof getProductFaqMetafields>>;
}) => {
  const [faqs, setFaqs] = useState(faqData.faqs);

  return (
    <>
      {faqs.map((faq) => (
        <div className="my-4" key={faq.key}>
          <div>
            <label className="font-bold">Question:</label>
            <span> {faq.question}</span>
          </div>
          <div>
            <label className="font-bold">Answer:</label>
            <span> {faq.answer}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductFaqs;
