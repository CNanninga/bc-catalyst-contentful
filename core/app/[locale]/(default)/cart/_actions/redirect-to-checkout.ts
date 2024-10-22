'use server';

import { getLocale } from 'next-intl/server';
import { z } from 'zod';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { redirect } from '~/i18n/routing';

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
  const locale = await getLocale();
  const cartId = z.string().parse(formData.get('cartId'));
  const customerAccessToken = await getSessionCustomerAccessToken();

  const { data } = await client.fetch({
    document: CheckoutRedirectMutation,
    variables: { cartId },
    fetchOptions: { cache: 'no-store' },
    customerAccessToken,
  });

  const url = data.cart.createCartRedirectUrls.redirectUrls?.redirectedCheckoutUrl;

  if (!url) {
    throw new Error('Invalid checkout url.');
  }

  const relativeCheckoutUrl = url.replace(/^https?:\/\/[^/]*/, '');
  const token = await generateLoginToken(relativeCheckoutUrl);

  const BIGCOMMERCE_CHECKOUT_DOMAIN = process.env.BIGCOMMERCE_CHECKOUT_DOMAIN ?? '';

  if (token !== null) {
    redirect({ href: `https://${BIGCOMMERCE_CHECKOUT_DOMAIN}/login/token/${token}`, locale });
  } else {
    redirect({ href: url, locale });
  }
};
