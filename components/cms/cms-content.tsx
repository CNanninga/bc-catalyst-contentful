import ContentBlock from '~/components/cms/content-block';
import { getCategoryContent } from '~/contentful-client/queries/get-category-content';
import { CategoryContentContentItem } from '~/contentful-client/generated/graphql';

export default function CmsContent({ blocks, className = '' }: {blocks: Awaited<ReturnType<typeof getCategoryContent>>, className?: string}) {
  return (
    <div className={`${className} grid grid-cols-6 gap-6`}>
      {blocks.map((block) => {
        return (!block) ? null : (
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          <ContentBlock block={block as CategoryContentContentItem} key={block.sys.id} />
        )
      })}
    </div>
  );
}
