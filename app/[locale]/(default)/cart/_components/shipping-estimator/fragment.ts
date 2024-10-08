import { graphql } from '~/client/graphql';

import { ShippingInfoFragment } from '../shipping-info/fragment';
import { ShippingOptionsFragment } from '../shipping-options/fragment';

export const ShippingEstimatorFragment = graphql(
  `
    fragment ShippingEstimatorFragment on Checkout {
      ...ShippingInfoFragment
      entityId
      shippingConsignments {
        ...ShippingOptionsFragment
        selectedShippingOption {
          entityId
          description
        }
      }
      handlingCostTotal {
        value
      }
      shippingCostTotal {
        currencyCode
        value
      }
      cart {
        currencyCode
      }
    }
  `,
  [ShippingOptionsFragment, ShippingInfoFragment],
);

export const GeographyFragment = graphql(
  `
    fragment GeographyFragment on Geography {
      countries {
        entityId
        name
        code
        statesOrProvinces {
          entityId
          name
          abbreviation
        }
      }
    }
  `,
  [],
);
