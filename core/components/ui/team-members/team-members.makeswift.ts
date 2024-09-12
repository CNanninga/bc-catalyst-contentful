'use client';

import { lazy } from 'react';
import { 
  Color, 
  Image, 
  List, 
  Number, 
  Select, 
  Shape, 
  Slot, 
  Style, 
  TextInput 
} from '@makeswift/runtime/controls';
import { runtime } from '~/lib/makeswift/runtime';

runtime.registerComponent(
  lazy(() => import('./team-members')),
  {
    type: 'team-members',
    label: 'Team Members',
    props: {
      className: Style({ properties: Style.All }),
      members: List({
        label: 'Members',
        type: Shape({
          type: {
            name: TextInput({
              label: 'Name',
            }),
            position: TextInput({
              label: 'Position',
            }),
            image: Image({
              label: 'Image',
              format: Image.Format.URL,
            }),
            content: Slot(),
          },
        }),
        getItemLabel(member) {
          return member?.name || 'Team Member'
        },
      }),
      highlightColor: Color({
        label: "Highlight Color",
      }),
      thumbnailTextColor: Color({
        label: "Thumbnail Text Color",
      }),
      thumbnailOrientation: Select({
        label: "Thumbnail Orientation",
        labelOrientation: "horizontal",
        options: [
          { value: "vertical", label: "Vertical" },
          { value: "horizontal", label: "Horizontal" },
        ],
        defaultValue: "vertical",
      }),
      itemsPerRow: Number({
        label: "Horizontal Items Per Row",
        defaultValue: 3,
        min: 1,
        max: 12,
      }),
    },
  }
);
