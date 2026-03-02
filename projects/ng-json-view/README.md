# angular-json-view

A read-only Angular 21 JSON tree viewer component. Supports objects, arrays, and primitive types with expandable/collapsible nodes, theming via CSS variables, and copy-to-clipboard.

## Installation

```bash
npm install ng-json-view
```

## Usage

Import `NgJsonViewComponent` into your standalone component:

```ts
import { NgJsonViewComponent } from 'ng-json-view';

@Component({
  standalone: true,
  imports: [NgJsonViewComponent],
  template: `<ng-json-view [src]="data" />`,
})
export class AppComponent {
  data = {
    name: 'Angular JSON View',
    version: 21,
    features: ['expandable', 'collapsible', 'themeable'],
    active: true,
    meta: null,
  };
}
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `src` | `JsonValue` | *(required)* | The JSON value to display |
| `name` | `string \| false` | `'root'` | Root node label. Set to `false` to hide. |
| `collapsed` | `boolean \| number` | `false` | `true` collapses all nodes. A number collapses nodes at or beyond that depth (e.g. `1` collapses children of the root). |
| `sortKeys` | `boolean` | `false` | Sort object keys alphabetically |
| `indentWidth` | `number` | `4` | Indentation width in character units |
| `enableClipboard` | `boolean` | `true` | Show copy-to-clipboard buttons on hover |
| `theme` | `JsonTheme \| null` | `null` | Override CSS variable-based theme |

## Theming

The component uses CSS custom properties (variables) for theming. You can override them via the `theme` input or with global CSS:

```ts
// Via input
<ng-json-view [src]="data" [theme]="{
  background: '#ffffff',
  keyColor: '#0451a5',
  stringColor: '#a31515',
  numberColor: '#098658',
  booleanColor: '#0000ff',
  nullColor: '#808080',
}" />
```

```css
/* Via global CSS */
ng-json-view {
  --njv-background: #ffffff;
  --njv-key-color: #0451a5;
  --njv-string-color: #a31515;
  --njv-number-color: #098658;
  --njv-boolean-color: #0000ff;
  --njv-null-color: #808080;
  --njv-font-family: 'Consolas', monospace;
  --njv-font-size: 13px;
  --njv-punctuation-color: #333333;
  --njv-meta-color: #999999;
  --njv-indent-color: #dddddd;
  --njv-toggle-color: #555555;
}
```

## Examples

### Collapsed by default

```html
<ng-json-view [src]="data" [collapsed]="true" />
```

### Expand top level only (collapse children at depth ≥ 1)

```html
<ng-json-view [src]="data" [collapsed]="1" />
```

### No root label

```html
<ng-json-view [src]="data" [name]="false" />
```

### Custom root name, sorted keys, no clipboard

```html
<ng-json-view
  [src]="data"
  name="response"
  [sortKeys]="true"
  [enableClipboard]="false"
/>
```

## Types

```ts
import type { JsonValue, JsonObject, JsonArray, JsonTheme, JsonNodeType, JsonPath } from 'ng-json-view';
```

## Development

```bash
# Build the library
ng build ng-json-view

# Run tests
ng test ng-json-view
```
