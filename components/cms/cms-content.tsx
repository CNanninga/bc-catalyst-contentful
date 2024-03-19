import ContentBlock from '~/components/cms/content-block';
import { ContentfulBlock } from '~/lib/contentful/api';

export default function CmsContent({ blocks, className = '' }: {blocks: ContentfulBlock[], className?: string}) {
  return (
    <div className={`${className} grid grid-cols-6 gap-6`}>
      {blocks.map((block) => (
        <ContentBlock block={block} key={block.sys?.id} />
      ))}
    </div>
  );
}
