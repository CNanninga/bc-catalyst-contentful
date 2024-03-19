'use server';

import { z } from 'zod';
import { customOldClient } from '~/client';
import storeCustomerSession from '~/actions/storeCustomerSession';

const CustomerAccountSchema = z.object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    authentication: z.object({
        new_password: z.string(),
    })
});

export default async function submitRegisterAccount(
    formData: FormData
) {
    const customerData = CustomerAccountSchema.parse({
        email: formData.get('email'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        authentication: {
            new_password: formData.get('password'),
        }
    });

    const createdCustomer: {id: number} | undefined = await customOldClient.createCustomer(customerData);
    
    if (createdCustomer) {
        await storeCustomerSession(createdCustomer.id);
    }

    return {status: 'ok'};
}