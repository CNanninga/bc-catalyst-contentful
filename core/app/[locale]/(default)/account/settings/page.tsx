import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AccountSettingsSection } from '@/vibes/soul/sections/account-settings';

import { changePassword } from './_actions/change-password';
import { updateCustomer } from './_actions/update-customer';
import { getCustomerSettingsQuery } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Account.Settings' });

  return {
    title: t('title'),
  };
}

export default async function Settings({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Account.Settings');

  const customerSettings = await getCustomerSettingsQuery();

  if (!customerSettings) {
    notFound();
  }

  return (
    <AccountSettingsSection
      account={customerSettings.customerInfo}
      changePasswordAction={changePassword}
      changePasswordSubmitLabel={t('cta')}
      changePasswordTitle={t('changePassword')}
      confirmPasswordLabel={t('confirmPassword')}
      currentPasswordLabel={t('currentPassword')}
      newPasswordLabel={t('newPassword')}
      title={t('title')}
      updateAccountAction={updateCustomer}
      updateAccountSubmitLabel={t('cta')}
    />
  );
}
