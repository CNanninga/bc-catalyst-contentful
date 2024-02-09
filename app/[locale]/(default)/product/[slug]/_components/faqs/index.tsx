import { getProductFaqMetafields } from '~/client/queries/get-product-faq-metafields';
import ProductFaqs from '~/components/product-faqs';

const Faqs = async ({ productId }: { productId: number }) => {
  const limit = 2;

  const faqData = await getProductFaqMetafields(productId, limit);

  return <ProductFaqs faqData={faqData} limit={limit} productId={productId} />;
};

export default Faqs;
