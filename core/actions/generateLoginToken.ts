import { SignJWT } from 'jose';
import {v4 as uuidv4} from 'uuid';
import { getSessionCustomerId } from '~/auth';

export async function generateLoginToken(redirectTo?: string) {
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
    const checkoutChannelId = process.env.BIGCOMMERCE_CHECKOUT_CHANNEL_ID
        ? parseInt(process.env.BIGCOMMERCE_CHECKOUT_CHANNEL_ID) : null;
    const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
    const clientSecret = process.env.BIGCOMMERCE_CLIENT_SECRET;

    if (!storeHash || !checkoutChannelId || !clientId || !clientSecret) {
        return null;
    }

    const customerId = await getSessionCustomerId();
    if (!customerId) {
        return null;
    }

    const dateCreated = Math.round((new Date()).getTime() / 1000);

    const token = await new SignJWT({
        "iss": clientId,
        "iat": dateCreated,
        "jti": uuidv4(),
        "operation": "customer_login",
        "store_hash": storeHash,
        "channel_id": checkoutChannelId,
        "customer_id": customerId,
        ...(redirectTo !== null && {"redirect_to": redirectTo})
    }).setProtectedHeader({ 
        "alg": "HS256",
        "typ": "JWT",
    }).sign(
        new TextEncoder().encode(clientSecret)
    );

    return token;
}