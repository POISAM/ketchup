# kup-switch

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                          | Type      | Default |
| -------------- | --------------- | ------------------------------------------------------------------------------------ | --------- | ------- |
| `checked`      | `checked`       | Defaults at false. When set to true, the component will be set to 'checked'.         | `boolean` | `false` |
| `customStyle`  | `custom-style`  | Custom style of the component.                                                       | `string`  | `''`    |
| `disabled`     | `disabled`      | Defaults at false. When set to true, the component is disabled.                      | `boolean` | `false` |
| `label`        | `label`         | Defaults at null. When specified, its content will be shown as a label.              | `string`  | `null`  |
| `leadingLabel` | `leading-label` | Defaults at false. When set to true, the label will be on the left of the component. | `boolean` | `false` |


## Events

| Event             | Description                                       | Type                                          |
| ----------------- | ------------------------------------------------- | --------------------------------------------- |
| `kupSwitchBlur`   | Triggered when the input element loses focus.     | `CustomEvent<{ value: string; }>`             |
| `kupSwitchChange` | Triggered when the input element's value changes. | `CustomEvent<{ id: string; value: string; }>` |
| `kupSwitchFocus`  | Triggered when the input element gets focused.    | `CustomEvent<{ value: string; }>`             |


## Methods

### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-card](../kup-card)
 - [kup-data-table](../kup-data-table)

### Graph
```mermaid
graph TD;
  kup-card --> kup-switch
  kup-data-table --> kup-switch
  style kup-switch fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
