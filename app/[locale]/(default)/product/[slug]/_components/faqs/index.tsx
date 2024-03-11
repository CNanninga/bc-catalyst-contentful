import { getProductFaqMetafields } from '~/client/queries/get-product-faq-metafields';
import ProductFaqs from '~/components/product-faqs';

const Faqs = async ({ productId, t }: { productId: number, t: { [key: string]: string } }) => {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await sleep(2000);

  const limit = 2;

  const faqData = await getProductFaqMetafields(productId, limit);

  return <ProductFaqs faqData={faqData} limit={limit} productId={productId} t={t} />;
};

export default Faqs;
