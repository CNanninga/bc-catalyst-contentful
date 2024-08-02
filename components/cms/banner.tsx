import RichText from '~/components/cms/rich-text';
import { BLOCK_BANNER_FRAGMENT } from '~/contentful-client/queries/get-category-content';
import { FragmentOf } from '~/contentful-client/graphql';

type BlockBanner = FragmentOf<typeof BLOCK_BANNER_FRAGMENT>;

export default function Banner({ className, block }: {className?: string, block: Partial<BlockBanner>}) {
    const { heading, imagePosition, backgroundColor, style, content, image } = block;

    const bgClass = style === 'light' ? `bg-${backgroundColor ?? ''}-200` : `bg-${backgroundColor ?? ''}-800`;
    const textColorClass = style === 'light' ? 'text-slate-800' : 'text-slate-200';

    const bannerImg = (
        <div>
            {
                // eslint-disable-next-line @next/next/no-img-element
            }<img alt={image?.description ?? ''} src={`${image?.url ?? ''}?w=750`} />
        </div>
    );

    return (
        <div className={`${className ?? ''} rounded-2xl p-12 md:grid md:grid-cols-2 md:gap-8 ${bgClass}`}>
            {imagePosition === 'left' && bannerImg}
            <div className={textColorClass}>
                <h3 className="mb-8 text-3xl font-bold">{heading}</h3>
                {content !== undefined && <RichText className={`text-xl ${textColorClass}`} content={content} />}
            </div>
            {imagePosition === 'right' && bannerImg}
        </div>
    );
}
