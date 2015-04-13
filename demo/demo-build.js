(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cascade = require('../index');

var cascadeElement = document.querySelector('.cascade');

new Cascade(cascadeElement);
},{"../index":2}],2:[function(require,module,exports){
var extend = require('xtend/mutable'),
	css = require('mucss/css'),
	getMargins = require('mucss/margins');

function Cascade(element, options) {

	if (!(this instanceof Cascade)) return new Cascade(element, options);

	var defaults = {
		childrenSelector: null,
		minWidth: 300,
		autoResize: true
	};

	//apply options
	extend(this, defaults, options);

	//get DOM elements
	this.element = element;
	if (this.childrenSelector) {
		this.children = this.element.querySelectorAll(childrenSelector);
	} else {
		this.children = this.element.children;
	}

	//init DOM elements
	if (getComputedStyle(this.element).position == 'static') {
		css(this.element, 'position', 'relative');
	}

	Array.prototype.forEach.call(this.children, function(child) {
		css(child, {
			position: 'absolute',
			'box-sizing': 'border-box'
		});
	});

	this.flow();

	if (this.autoResize) {
		//TODO: add throttle
		window.addEventListener('resize', this.flow.bind(this));
	}

}

extend(Cascade.prototype, {

	flow: function() {
		var self = this,
			elementWidth = self.element.offsetWidth,
			columnsNumber = Math.floor(elementWidth/self.minWidth),
			columnWidth = elementWidth / columnsNumber,
			//create array with zeros to monitor columns current height
			columnsHeights = [];

		for (var i=0; i<columnsNumber; i++) {
			columnsHeights[i] = 0;
		}

		Array.prototype.forEach.call(self.children, function(child) {

			//get the index of the array with minimum height
			var columnIndex = columnsHeights.indexOf(Math.min.apply(Math, columnsHeights)),
				margins = getMargins(child),
				// horizontal and vertical sums of box model properties for the child
				horizontalSpace = 
					margins.left + margins.right,
				verticalSpace = 
					margins.top + margins.bottom;
			
			css(child, {
				//width is the column width excluding paddings, margins and borders
				width: columnWidth - horizontalSpace,
				//top is under the bottom element
				top: columnsHeights[columnIndex],
				//left is width of column and index production
				left: columnWidth*columnIndex
			});

			//add current element's height to the column height
			columnsHeights[columnIndex] += child.clientHeight + verticalSpace;

		});

		//set the highest column height to the container
		css(self.element, 'height', Math.max.apply(Math, columnsHeights));
	}

});

//jQuery support
if (window.jQuery) {
	(function($) {
		$.fn.cascade = function(options) {
			$(this).each(function() {
				new Cascade(this, options);
			});
		};
	}(window.jQuery));
}

if (module && module.exports) { //CommonJS support
	module.exports = Cascade;
} else { //VanillaJS support
	window.Cascade = Cascade;
}
},{"mucss/css":4,"mucss/margins":6,"xtend/mutable":9}],3:[function(require,module,exports){
/** simple rect stub  */
module.exports = function(l,t,r,b,w,h){
	this.top=t||0;
	this.bottom=b||0;
	this.left=l||0;
	this.right=r||0;
	if (w!==undefined) this.width=w||this.right-this.left;
	if (h!==undefined) this.height=h||this.bottom-this.top;
};
},{}],4:[function(require,module,exports){
var fakeStyle = require('./fake-element').style;
var prefix = require('./prefix').dom;

/**
 * Apply styles to an element.
 *
 * @param    {Element}   el   An element to apply styles.
 * @param    {Object|string}   obj   Set of style rules or string to get style rule.
 */
module.exports = function(el, obj){
	if (!el || !obj) return;

	var name, value;

	//return value, if string passed
	if (typeof obj === 'string') {
		name = obj;

		//return value, if no value passed
		if (arguments.length < 3) {
			return el.style[prefixize(name)];
		}

		//set style, if value passed
		value = arguments[2] || '';
		obj = {};
		obj[name] = value;
	}

	for (name in obj){
		//convert numbers to px
		if (typeof obj[name] === 'number' && /left|right|bottom|top|width|height/i.test(name)) obj[name] += 'px';

		value = obj[name] || '';

		el.style[prefixize(name)] = value;
	}
};


/**
 * Return prefixized prop name, if needed.
 *
 * @param    {string}   name   A property name.
 * @return   {string}   Prefixed property name.
 */
function prefixize(name){
	var uName = name[0].toUpperCase() + name.slice(1);
	if (fakeStyle[name] !== undefined) return name;
	if (fakeStyle[prefix + uName] !== undefined) return prefix + uName;
	return '';
}

},{"./fake-element":5,"./prefix":8}],5:[function(require,module,exports){
module.exports = document.createElement('div');
},{}],6:[function(require,module,exports){
var parse = require('./parse-value');
var Rect = require('./Rect');

/**
 * Return margins of an element.
 *
 * @param    {Element}   $el   An element which to calc margins.
 * @return   {Object}   Paddings object `{top:n, bottom:n, left:n, right:n}`.
 */
module.exports = function($el){
	if ($el === window) return new Rect();

	if (!($el instanceof Element)) throw Error('Argument is not an element');

	var style = window.getComputedStyle($el);

	return new Rect(
		parse(style.marginLeft),
		parse(style.marginTop),
		parse(style.marginRight),
		parse(style.marginBottom)
	);
};

},{"./Rect":3,"./parse-value":7}],7:[function(require,module,exports){
/** Returns parsed css value. */
module.exports = function (str){
	str += '';
	return parseFloat(str.slice(0,-2)) || 0;
};
},{}],8:[function(require,module,exports){
//vendor-prefix method, http://davidwalsh.name/vendor-prefix
var styles = getComputedStyle(document.documentElement, '');

var pre = (Array.prototype.slice.call(styles)
	.join('')
	.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
)[1];

dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

module.exports = {
	dom: dom,
	lowercase: pre,
	css: '-' + pre + '-',
	js: pre[0].toUpperCase() + pre.substr(1)
};
},{}],9:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1]);
