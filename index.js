var extend = require('xtend/mutable'),
	throttle = require('emmy/throttle'),
	css = require('mucss/css');

function Cascade(element, options) {

	if (!(this instanceof Cascade)) return new Cascade(element, options);

	var defaults = {
		childrenSelector: null,
		minWidth: 300,
		autoResize: true,
		autoResizeThrottle: 45
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
		css(child, 'position', 'absolute');
	});

	this.flow();

	if (this.autoResize) {
		throttle(window, 'resize', this.flow.bind(this), this.autoResizeThrottle);
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
			var columnIndex = columnsHeights.indexOf(Math.min.apply(Math, columnsHeights));

			css(child, {
				//width is the column width
				width: columnWidth,
				//top is under the bottom element
				top: columnsHeights[columnIndex],
				//left is width of column and index production
				left: columnWidth*columnIndex
			});

			//add current element's height to the column height
			columnsHeights[columnIndex]+=child.offsetHeight;

		});

		//set the highest column height to the container
		css(self.element, 'height', Math.max.apply(Math, columnsHeights));
	}

});

module.exports = Cascade;