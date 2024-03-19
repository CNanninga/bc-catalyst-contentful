import { z } from 'zod';

const CreateCustomerResponse = z.object({
    data: z.array(z.object({
        id: z.number(),
    })),
});

export const createCustomer = async (
    customerData: { email: string, first_name: string, last_name: string }
) => {
    const channelId = process.env.BIGCOMMERCE_CHANNEL_ID ?? '';
    const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN ?? '';
    const storeHash = process.env.BIGCOMMERCE_STORE_HASH ?? '';

    const createCustomerBody = [
        {
            ...customerData,
            ...(channelId && { 
                origin_channel_id: parseInt(channelId, 10),
                channel_ids: [parseInt(channelId, 10)],
            }),
        }
    ];

    let customer;
    
    try {
        const customersData = CreateCustomerResponse.parse(await fetch(
            `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Auth-Token': accessToken,
                },
                cache: 'no-store',
                body: JSON.stringify(createCustomerBody),
            },
        ).then(res => res.json())
        );
        
        customer = customersData.data[0] ?? null;
    } catch {
        customer = null;
    }

    if (!customer) {
        throw new Error('Customer creation failed');
    }

    return customer;
};
