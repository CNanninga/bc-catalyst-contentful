'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';

import { generateLoginToken } from '~/actions/generateLoginToken';

const CheckoutRedirectMutation = graphql(`
  mutation CheckoutRedirectMutation($cartId: String!) {
    cart {
      createCartRedirectUrls(input: { cartEntityId: $cartId }) {
        redirectUrls {
          redirectedCheckoutUrl
        }
      }
    }
  }
`);

export const redirectToCheckout = async (formData: FormData) => {
  const cartId = z.string().parse(formData.get('cartId'));
  const customerId = await getSessionCustomerId();

  const { data } = await client.fetch({
    document: CheckoutRedirectMutation,
    variables: { cartId },
    fetchOptions: { cache: 'no-store' },
    customerId,
  });

  const url = data.cart.createCartRedirectUrls.redirectUrls?.redirectedCheckoutUrl;

  if (!url) {
    throw new Error('Invalid checkout url.');
  }

  const relativeCheckoutUrl = url.replace(/^https?:\/\/[^/]*/, '');
  const token = await generateLoginToken(relativeCheckoutUrl);

  const BIGCOMMERCE_CHECKOUT_DOMAIN = process.env.BIGCOMMERCE_CHECKOUT_DOMAIN ?? '';

  if (token !== null) {
      redirect(`https://${BIGCOMMERCE_CHECKOUT_DOMAIN}/login/token/${token}`);
  } else {
      redirect(url);
  }
};
