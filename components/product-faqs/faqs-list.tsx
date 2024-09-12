'use client';

import { Accordions } from '~/components/ui/accordions';
import { Button } from '~/components/ui/button';
import { Loader2 as Spinner } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { formatFaqsCollection } from './_data/component-data';

import getNextProductFaqs from './_actions/get-next-product-faqs';

const ProductFaqsList = ({
  productId,
  limit,
  faqCollection
}: {
  productId: number;
  limit: number;
  faqCollection: Awaited<ReturnType<typeof formatFaqsCollection>>;
}) => {
  const [faqs, setFaqs] = useState(faqCollection.faqs);
  const [endCursor, setEndCursor] = useState(faqCollection.endCursor);
  const [pending, setPending] = useState(false);

  const t = useTranslations('Product.FAQ');

  const getNextFaqs = async () => {
    setPending(true);

    try {
      const nextFaqData = await getNextProductFaqs(productId, limit, endCursor);

      setEndCursor(nextFaqData.endCursor);
      setFaqs(faqs.concat(nextFaqData.faqs));
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      
      toast.error(error);
    }

    setPending(false);
  };

  return (
    <>
      <Accordions
        accordions={faqs.map(faq => {
          return {
            content: faq.answer,
            title: faq.question,
          }
        })}
        type="multiple"
      />

      {endCursor !== null && (
        <Button
          className="mx-auto block text-center md:w-2/3 lg:w-1/3"
          onClick={getNextFaqs}
          variant="secondary"
        >
          {pending ? (
            <Spinner aria-hidden="true" className="mx-auto animate-spin" />
          ) : (
            <span>{t('loadMore')}</span>
          )}
        </Button>
      )}
    </>
  );
};

export default ProductFaqsList;
