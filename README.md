# Cascade.js

Simple minimalistic plugin for masonry-like layout. Lightweight (3kb minified) jQuery-free library, a successor of [kudago/waterfall.js](https://github.com/kudago/waterfall).

## Usage

Browserify:

```
$ npm install cascade-layout
```

```js
var cascade = require('cascade-layout);
```

You can also use it with native JS:

```js
var cascade = new Cascade(element, options);
```

Or with jQuery:

```js
$(elem).cascade(options);
```

## Options

```js
{
	childrenSelector: null, //children selector (simply children if null)
	minWidth: 300, //minimal width of the children
	autoResize: true //resize automatically on resize
}
```

## Methods

When using VanillaJS or CommonJS forms you can call the instance's reflow method to make Cascade redraw the elements

```js
var cascadeItem = new Cascade(...);
cascadeItem.reflow() //reposition cascade elements

```



