'use client';

import { clsx } from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

import { Image } from '~/components/image';

export interface ProductGalleryProps {
  images: Array<{ alt: string; src: string }>;
  className?: string;
  thumbnailLabel?: string;
  aspectRatio?:
    | '1:1'
    | '4:5'
    | '5:4'
    | '3:4'
    | '4:3'
    | '2:3'
    | '3:2'
    | '16:9'
    | '9:16'
    | '5:6'
    | '6:5';
  fit?: 'contain' | 'cover';
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-gallery-focus: hsl(var(--primary));
 *   --product-gallery-image-background: hsl(var(--contrast-100));
 *   --product-gallery-image-border: hsl(var(--contrast-100));
 *   --product-gallery-image-border-active: hsl(var(--foreground));
 * }
 * ```
 */
export function ProductGallery({
  images,
  className,
  thumbnailLabel = 'View image number',
  aspectRatio = '4:5',
  fit = 'contain',
}: ProductGalleryProps) {
  const [previewImage, setPreviewImage] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setPreviewImage(emblaApi.selectedScrollSnap());

    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const selectImage = (index: number) => {
    setPreviewImage(index);
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div className={clsx('sticky top-4 flex flex-col gap-2 @2xl:flex-row', className)}>
      <div
        className="w-full overflow-hidden rounded-xl @xl:rounded-2xl @2xl:order-2"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((image, idx) => (
            <div
              className={clsx(
                'relative w-full shrink-0 grow-0 basis-full',
                {
                  '5:6': 'aspect-[5/6]',
                  '3:4': 'aspect-[3/4]',
                  '4:5': 'aspect-[4/5]',
                  '3:2': 'aspect-[3/2]',
                  '2:3': 'aspect-[2/3]',
                  '16:9': 'aspect-[16/9]',
                  '9:16': 'aspect-[9/16]',
                  '6:5': 'aspect-[6/5]',
                  '5:4': 'aspect-[5/4]',
                  '4:3': 'aspect-[4/3]',
                  '1:1': 'aspect-square',
                }[aspectRatio],
              )}
              key={idx}
            >
              <Image
                alt={image.alt}
                className={clsx(
                  'bg-[var(--product-gallery-image-background,hsl(var(--contrast-100)))]',
                  {
                    contain: 'object-contain',
                    cover: 'object-cover',
                  }[fit],
                )}
                fill
                priority={idx === 0}
                sizes="(min-width: 42rem) 50vw, 100vw"
                src={image.src}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex max-w-full shrink-0 flex-row gap-2 overflow-x-auto p-1 @2xl:order-1 @2xl:flex-col">
        {images.map((image, index) => (
          <button
            aria-label={`${thumbnailLabel} ${index + 1}`}
            className={clsx(
              'relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--product-gallery-focus,hsl(var(--primary)))] focus-visible:ring-offset-2 @md:h-16 @md:w-16',
              index === previewImage
                ? 'border-[var(--product-gallery-image-border-active,hsl(var(--foreground)))]'
                : 'border-transparent',
            )}
            key={index}
            onClick={() => selectImage(index)}
          >
            <div
              className={clsx(
                index === previewImage ? 'opacity-100' : 'opacity-50',
                'transition-all duration-300 hover:opacity-100',
              )}
            >
              <Image
                alt={image.alt}
                className="bg-[var(--product-gallery-image-background,hsl(var(--contrast-100)))] object-cover"
                fill
                sizes="(min-width: 28rem) 4rem, 3rem"
                src={image.src}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
