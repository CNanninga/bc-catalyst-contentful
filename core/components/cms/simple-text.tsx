import RichText from '~/components/cms/rich-text';
import { BLOCK_RICH_TEXT_FRAGMENT, BLOCK_SIMPLE_TEXT_FRAGMENT } from '~/contentful-client/queries/get-category-content';
import { FragmentOf } from '~/contentful-client/graphql';

type BlockSimpleText = FragmentOf<typeof BLOCK_SIMPLE_TEXT_FRAGMENT>;
type BlockRichText = FragmentOf<typeof BLOCK_RICH_TEXT_FRAGMENT>;

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
  return <RichText className={`${className ?? ''} ${sizeClass}`} content={block.content as BlockRichText['content']} />;
}
