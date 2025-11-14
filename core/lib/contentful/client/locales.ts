const defaultLocale = 'en-US';

const contentfulLocales: { [key: string]: string } = {
  'en': 'en-US',
  'en-US': 'en-US',
  'fr': 'fr',
};

export const normalizeLocale = (locale: string) => {
  return contentfulLocales[locale] ?? defaultLocale;
};
