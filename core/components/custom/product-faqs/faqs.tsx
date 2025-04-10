'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';

import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';

import { getNextProductFaqs } from './_actions/get-next-product-faqs';
import { formatFaqs } from './_data/component-data';

export function ProductFaqs({
  productId,
  limit,
  faqs,
  initialEndCursor,
  showLoadMore = true
}: {
  productId?: number;
  limit: number;
  faqs: Array<{
    key: string,
    question: string,
    answer: string | ReactNode
  }>;
  initialEndCursor?: string | null;
  showLoadMore?: boolean;
}) {
  const t = useTranslations('Product.FAQ');

  const [moreFaqs, setMoreFaqs] = useState<ReturnType<typeof formatFaqs>>([]);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [pending, setPending] = useState(false);

  const allFaqs = faqs.concat(moreFaqs);

  const getNextFaqs = async () => {
    if (!productId) {
      return;
    }

    setPending(true);

    try {
      const nextFaqData = await getNextProductFaqs({ productId, limit, after: endCursor });

      setEndCursor(nextFaqData.endCursor);
      setMoreFaqs(moreFaqs.concat(nextFaqData.faqs));
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      
      toast.error(error);
    }

    setPending(false);
  };

  return allFaqs.length <= 0 ? '' : (
    <section className="overflow-hidden @container">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        <h2 className="font-heading text-2xl leading-none @xl:text-3xl @4xl:text-4xl">
          {t('heading')}
        </h2>

        <div className="mx-auto md:w-2/3 p-4">

          <Accordion 
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            style={{
              '--accordion-light-title-text-hover': 'hsl(var(--info))'
            } as React.CSSProperties}
            type="multiple"
          >
            {allFaqs.map(faq => (
              <AccordionItem key={faq.key} title={faq.question} value={faq.key}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>


          {showLoadMore && (endCursor !== null) && (
            <div className="mx-auto md:w-2/3 lg:w-1/3 text-center">
              <Button
                loading={pending}
                onClick={getNextFaqs}
                variant="secondary"
              >
                {t('loadMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ProductFaqsSkeleton() {
  return (
    <div className="animate-pulse mx-auto md:w-2/3 p-4 items-center">
      <div className="my-3 h-12 w-full rounded-md bg-contrast-100 @md:my-4" />
      <div className="my-3 h-12 w-full rounded-md bg-contrast-100 @md:my-4" />
      <div className="my-3 h-12 w-full rounded-md bg-contrast-100 @md:my-4" />
    </div>
  );
}
