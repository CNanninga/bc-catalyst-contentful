import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { CardSkeleton } from '@/vibes/soul/primitives/card';
import ContentBlock from './content-block';
import { ContentItem, ContentItems, getCategoryContent } from '~/lib/contentful/client/queries/get-category-content';

export default function CmsContent({ 
  blocks, 
  className = '' 
}: {
  blocks: Streamable<ContentItems>, 
  className?: string
}) {
  return (
    <Stream
      fallback={<CmsContentSkeleton />}
      value={blocks}
    >
      {(blocks) => (

      <>
        {blocks.length > 0 && (
        <div className={`${className} grid grid-cols-6 gap-6`}>
          {blocks.map((block) => {
            return (!block) ? null : (
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              <ContentBlock block={block as ContentItem} key={block.sys.id} />
            )
          })}
        </div>
        )}
      </>

      )}
    </Stream>
  );
}

function CmsContentSkeleton() {
  return <>
    <div className="col-span-6 mx-auto my-6 max-w-screen-sm">
      <CardSkeleton />
    </div>
  </>;
}
