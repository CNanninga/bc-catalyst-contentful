'use server';

import { generateLoginToken } from "~/actions/generateLoginToken";
import { redirect } from 'next/navigation';
import { getCheckoutUrl } from "~/client/management/get-checkout-url";

export async function redirectToCheckout(cartId: string) {
    const checkoutUrl = await getCheckoutUrl(cartId);
    const relativeCheckoutUrl = checkoutUrl.replace(/^https?:\/\/[^/]*/, '');
    const token = await generateLoginToken(relativeCheckoutUrl);

    const BIGCOMMERCE_CHECKOUT_DOMAIN = process.env.BIGCOMMERCE_CHECKOUT_DOMAIN ?? '';

    if (token !== null) {
        redirect(`https://${BIGCOMMERCE_CHECKOUT_DOMAIN}/login/token/${token}`);
    } else {
        redirect(checkoutUrl);
    }
}