import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Block, BLOCKS, Document, Inline } from '@contentful/rich-text-types';
import { BLOCK_RICH_TEXT_FRAGMENT } from '~/contentful-client/queries/get-category-content';
import { FragmentOf } from '~/contentful-client/graphql';

type BlockRichTextContent = FragmentOf<typeof BLOCK_RICH_TEXT_FRAGMENT>;

function RichTextAsset({ id, content }: { id: string, content: Partial<BlockRichTextContent['content']> }) {
  if (!content) {
    return '';
  }

  const assetLinks = content.links?.assets.block ?? [];

  const asset = assetLinks.find((ast) => ast?.sys.id === id);

  return asset?.url ? (
    <>
      {
        // eslint-disable-next-line @next/next/no-img-element
      }<img alt={asset.description ?? ''} className="mx-auto block" src={asset.url} />
    </>
  ) : null;
}

export default function RichText({ content, className }: { content: Partial<BlockRichTextContent['content']>, className?: string }) {
  if (!content) {
    return '';
  }
  
  return (
    <div className={`${className ?? ''} prose dark:prose-invert`}>
      {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      documentToReactComponents(content.json as Document, {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
            const { data } = node;

            return (
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-member-access
              <RichTextAsset content={content} id={data.target.sys.id as string} />
            )
          }
        }
      })
      }
    </div>
  );
}
