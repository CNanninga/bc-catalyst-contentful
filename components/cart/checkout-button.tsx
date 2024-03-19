'use client';

import { Button } from '@bigcommerce/components/button';
import { redirectToCheckout } from '~/app/[locale]/(default)/cart/_actions/redirect-to-checkout';

const CheckoutButton = ({ cartId }: { cartId: string }) => {
    const onClick = async () => {
        await redirectToCheckout(cartId);
    }

    return (
        <Button className="mt-6" onClick={onClick}>
            Proceed to checkout
        </Button>
    );
};

export default CheckoutButton;