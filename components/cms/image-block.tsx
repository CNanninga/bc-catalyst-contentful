import { ContentfulBlock } from "~/lib/contentful/api";

export default function ImageBlock({ className, block }: { className?: string, block: ContentfulBlock }) {
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
      }<img alt={block.image.description} src={`${block.image.url}?w=${imgSize}`} />
    </div>
  );
}
