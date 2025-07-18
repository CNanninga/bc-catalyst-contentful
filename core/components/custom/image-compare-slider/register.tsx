'use client';

import { Image, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { ImageCompareSlider } from './image-compare-slider';

runtime.registerComponent(
  ImageCompareSlider,
  {
    type: 'img-compare-slider',
    label: 'Image Compare Slider',
    props: {
      className: Style({ 
        properties: [Style.Width, Style.Margin, Style.Padding, Style.Border, Style.BorderRadius],
      }),
      image1: Image({
        label: "Image 1",
        format: Image.Format.URL,
      }),
      image2: Image({
        label: "Image 2",
        format: Image.Format.URL,
      }),
    },
  }
);
