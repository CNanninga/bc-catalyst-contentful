import { Button } from '@bigcommerce/components/button';
import {
    Field,
    FieldControl,
    FieldLabel,
    Form,
    FormSubmit,
} from '@bigcommerce/components/Form';
import { Input } from '@bigcommerce/components/Input';

import submitRegisterAccount from './_actions/submit-register-account';

export const RegisterAccount = () => {
    const onSubmit = async (formData: FormData) => {
        await submitRegisterAccount(formData);
    };

    return (
        <Form
            action={onSubmit}
        >
            <Field className="mt-8" key="email" name="email">
                <FieldLabel htmlFor="email" isRequired>
                    Email
                </FieldLabel>
                <FieldControl asChild>
                    <Input
                        id="email"
                        required
                        type="email"
                    />
                </FieldControl>
            </Field>
            <Field className="mt-8" key="first_name" name="first_name">
                <FieldLabel htmlFor="first_name" isRequired>
                    First Name
                </FieldLabel>
                <FieldControl asChild>
                    <Input
                        id="first_name"
                        required
                    />
                </FieldControl>
            </Field>
            <Field className="mt-8" key="last_name" name="last_name">
                <FieldLabel htmlFor="last_name" isRequired>
                    Last Name
                </FieldLabel>
                <FieldControl asChild>
                    <Input
                        id="last_name"
                        required
                    />
                </FieldControl>
            </Field>
            <Field className="mt-8" key="password" name="password">
                <FieldLabel htmlFor="password" isRequired>
                    Password
                </FieldLabel>
                <FieldControl asChild>
                    <Input
                        id="password"
                        required
                        type="password"
                    />
                </FieldControl>
            </Field>
            <FormSubmit asChild>
                <Button className="mt-8">
                    <span>Register</span>
                </Button>
            </FormSubmit>
        </Form>
    );
};
