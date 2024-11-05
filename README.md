# Catalyst Customizations

See main README-Catalyst.md.

## Custom Features

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

* `CONTENTFUL_SPACE_ID`
* `CONTENTFUL_ACCESS_TOKEN`