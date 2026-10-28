import { Checkbox, Group, List, Slot, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MakeswiftProductFaqs } from './client';

export const COMPONENT_TYPE = 'catalyst-makeswift-product-faqs';

runtime.registerComponent(MakeswiftProductFaqs, {
  type: COMPONENT_TYPE,
  label: 'MakeswiftProductFaqs (private)',
  hidden: true,
  props: {
    faqs: List({
      label: 'FAQs',
      type: Group({
        label: 'FAQ Details',
        props: {
          question: TextInput({ label: 'Question', defaultValue: 'Question' }),
          answer: TextInput({ label: 'Answer', defaultValue: 'Answer' }),
          richContent: Checkbox({ label: 'Use rich content slot', defaultValue: false }),
          content: Slot(),
        },
      }),
      getItemLabel: (section) => section?.question || 'Question',
    }),
    showOriginal: Checkbox({ label: 'Show metafields-based FAQs', defaultValue: true }),
  },
});
