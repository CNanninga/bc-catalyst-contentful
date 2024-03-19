import Banner from '~/components/cms/banner';
import ImageBlock from '~/components/cms/image-block';
import RichText from '~/components/cms/rich-text';
import SimpleText from '~/components/cms/simple-text';
import { ContentfulBlock } from '~/lib/contentful/api';

const BLOCK_TYPE_BANNER = 'BlockBanner';
const BLOCK_TYPE_RICHTEXT = 'BlockRichText';
const BLOCK_TYPE_SIMPLETEXT = 'BlockSimpleText';
const BLOCK_TYPE_IMG = 'BlockImage';

export default function ContentBlock({ block }: {block: ContentfulBlock}) {
  switch (block.__typename) {
    case BLOCK_TYPE_BANNER:
      return <Banner block={block} className="col-span-6 mx-auto my-6 max-w-screen-lg" />;

    case BLOCK_TYPE_RICHTEXT:
      if (block.content === undefined) {
        return '';
      }

      return (
        <RichText className="col-span-6 mx-auto my-6 max-w-screen-md" content={block.content} />
      );

    case BLOCK_TYPE_SIMPLETEXT:
      return <SimpleText block={block} className="my-6 max-w-screen-md" />;

    case BLOCK_TYPE_IMG:
      return <ImageBlock block={block} className="my-6" />;

    default:
      return null;
  }
}
