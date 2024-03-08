import RichText from '~/components/cms/rich-text';
import { BlockRichTextContent, BlockSimpleText } from '~/contentful-client/generated/graphql';

export default function SimpleText({ className, block }: {className?: string, block: Partial<BlockSimpleText>}) {
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

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return <RichText className={`${className ?? ''} ${sizeClass}`} content={block.content as BlockRichTextContent} />;
}
