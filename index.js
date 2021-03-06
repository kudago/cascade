var extend = require('xtend/mutable'),
	css = require('mucss/css'),
	getMargins = require('mucss/margins');

/**
 * Cascade instance constructor
 * @param {DOMObject} element - cascade container
 * @param {Object} options - initialization options
 * @constructor
 */
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

	//set this instance reflow to its prototype reflow bind to 'this' value
	this.reflow = this.reflow.bind(this);

	this.reflow();

	if (this.autoResize) {
		window.addEventListener('resize', this.reflow.bind(this));
	}

}

extend(Cascade.prototype, {

	/**
	 * Reposition elements according to they sizes and positions
	 * Can be called e.g. after adding a new elemenet
	 * @return {Void}
	 */
	reflow: function() {
		var self = this,
			elementWidth = self.element.offsetWidth,
			columnsNumber = Math.floor(elementWidth/self.minWidth),
			columnWidth = Math.floor(elementWidth / columnsNumber),
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
				position: 'absolute',
				'box-sizing': 'border-box',
				//width is the column width excluding paddings, margins and borders
				width: columnWidth - horizontalSpace,
				//if min-width is set on the element it can break cascade items layout
				'min-width': 0,
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
			return this;
		};
	}(window.jQuery));
}

module.exports = Cascade;
