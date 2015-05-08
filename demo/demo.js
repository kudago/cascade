var cascadeElement = document.querySelector('.cascade');
var cascade = new Cascade(cascadeElement);

var addButton = document.querySelector('.add-10');
addButton.onclick = function() {
	for (var i=0; i<5; i++) {
		var child = cascadeElement.children[i];
		var clone = child.cloneNode(true);
		cascadeElement.appendChild(clone);
	}
	cascade.reflow();
}

