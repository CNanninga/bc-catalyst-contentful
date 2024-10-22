import { BLOCK_IMAGE_FRAGMENT } from "~/contentful-client/queries/get-category-content";
import { FragmentOf } from '~/contentful-client/graphql';

type BlockImage = FragmentOf<typeof BLOCK_IMAGE_FRAGMENT>;

export default function ImageBlock({ className, block }: { className?: string, block: Partial<BlockImage> }) {
  let sizeClass;
  let imgSize;

  switch (block.size) {
    case 'full':
      sizeClass = 'col-span-6';
      imgSize = 1000;
      break;

    case 'two-thirds':
      sizeClass = 'col-span-4';
      imgSize = 700;
      break;

    case 'half':
      sizeClass = 'col-span-3';
      imgSize = 500;
      break;

    case 'third':
      sizeClass = 'col-span-2';
      imgSize = 400;
      break;

    default:
      sizeClass = 'col-span-6';
      imgSize = 1000;
  }

  if (block.image?.url === undefined) {
    return '';
  }

  return (
    <div className={`${className ?? ''} ${sizeClass} mx-auto block`}>
      {
        // eslint-disable-next-line @next/next/no-img-element
      }<img alt={block.image.description ?? ''} src={`${block.image.url ?? ''}?w=${imgSize}`} />
    </div>
  );
}
