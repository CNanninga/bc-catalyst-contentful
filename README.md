# Catalyst Customizations

See main README-Catalyst.md.

## Custom Features

### Missing BigCommerce Features

* **Maintain Customer Session on Checkout** - Customer Login API used to log into BC storefront with current customer's ID before redirecting for checkout.

### Contentful Integration

Banner content loaded from Contentful for:

* **Home page** - Loaded with type "home" and slug "home"
* **Category pages** - Loaded with type "category" and slug matching category path
* **Product pages** - Loaded with type "product" and slug matching SKU

### Product FAQs

Custom query/component to load "FAQs" on product detail page. With locale support for static strings.

Requires metafields on a product matching the following details:

* `namespace`: "FAQ"
* `permission`: "read_and_sf_access"
* `value`: JSON string matching the following schema:

```
{
  "question": "Question string",
  "answer": "Answer string"
}
```

### Custom Makeswift Components

Two new Makeswift-enabled components are added:

* Image Compare Slider
* Team Members

### Web Pages in Main Nav

Changes to main nav:

* Fewer top-level categories loaded
* Limited number of Web Pages loaded and displayed alongside top-level categories
* Three hierarchical levels supported for Web Pages, similar to categories

## Configuration

Additional environment vars:

* `BIGCOMMERCE_CHECKOUT_CHANNEL_ID` - For redirected checkout
* `BIGCOMMERCE_CHECKOUT_DOMAIN` - For redirected checkout
* `BIGCOMMERCE_CLIENT_ID` - from v2/v3 API account with customer login permission
* `BIGCOMMERCE_CLIENT_SECRET` - from v2/v3 API account with customer login permission
* `CONTENTFUL_SPACE_ID`
* `CONTENTFUL_ACCESS_TOKEN`