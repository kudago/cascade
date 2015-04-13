#Cascade.js

Simple minimalistic plugin for masonry-like layout. Lightweight (3kb minified) jQuery-free library, a successor of [kudago/waterfall.js](https://github.com/kudago/waterfall).

##Usage

Npm installation is not ready but in future it will work like this:

`$ npm install emmy cascade-layout`

Then call

```js
var cascade = require('cascade-layout);
```

You can also use it with native JS:

```js
new Cascade(element, options);
```

Or with jQuery:

```js
$(elem).cascade(options);
```

##Options

```js
{
	childrenSelector: null, //children selector (simply children if null)
	minWidth: 300, //minimal width of the children
	autoResize: true //resize automatically on resize
}
```