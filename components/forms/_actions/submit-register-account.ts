'use server';

import { z } from 'zod';
import { createCustomer } from '~/client/management/create-customer';

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

    await createCustomer(customerData);

    return {status: 'ok'};
}