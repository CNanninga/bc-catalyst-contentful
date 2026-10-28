import { CSSProperties } from 'react';

import { Card } from '@/vibes/soul/primitives/card';

import { getSubcategories } from './component-data';

export const SubcategoryList = (
  {
    title,
    subcategories
  }: {
    title: string | null,
    subcategories: Awaited<ReturnType<typeof getSubcategories>>,
  }
) => {
  return (
    <div className="@container 
      mx-auto max-w-screen-2xl px-4 py-10 
      @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-12"
    >
      <h1 className="font-heading 
        text-3xl font-medium leading-none 
        @lg:text-4xl @2xl:text-5xl
        text-subcategoryListHeading"
      >
          {title}
      </h1>
      <div className="w-full @container my-4">
        <div className="mx-auto 
          grid grid-cols-1 gap-4 
          @lg:grid-cols-2 @2xl:grid-cols-3"

          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          style={{
            '--card-light-text': 'var(--subcategory-list-light-text)',
            '--card-border-radius': 'var(--subcategory-list-border-radius)',
          } as CSSProperties}
        >
          {subcategories.map((subcategory) => (
            <Card
              className=''
              href={subcategory.path}
              image={(!subcategory.image) ? undefined : {
                src: subcategory.image.url,
                alt: subcategory.image.altText,
              }}
              key={subcategory.entityId}
              title={`${subcategory.name} (${subcategory.productCount})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};