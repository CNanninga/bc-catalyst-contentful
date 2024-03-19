import RichText from '~/components/cms/rich-text';
import { ContentfulBlock } from '~/lib/contentful/api';

export default function SimpleText({ className, block }: {className?: string, block: ContentfulBlock}) {
  let sizeClass;

  switch (block.size) {
    case 'full':
      sizeClass = 'col-span-6';
      break;

    case 'two-thirds':
      sizeClass = 'col-span-4';
      break;

    case 'half':
      sizeClass = 'col-span-3';
      break;

    case 'third':
      sizeClass = 'col-span-2';
      break;

    default:
      sizeClass = 'col-span-6';
  }

  if (block.content === undefined) {
    return '';
  }

  return <RichText className={`${className ?? ''} ${sizeClass}`} content={block.content} />;
}
