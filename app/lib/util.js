var uniqId = (function() {
	var count = 0;
	var prefix = 'cID-';
	return function() {
		return (count++, prefix + count);
	}
})();

var rgbToHex = (function(){
	
	var toString = Number.prototype.toString;

	var toHex = function toHex (num){	
		var hexed = toString.call(parseInt(num,10), 16);
		hexed = hexed.length === 1 ? '0' + hexed : hexed; // zero pad length one numbers
		return hexed;
	};

	return function rgbToHex (){
		var args = [].slice.call(arguments);
		return "#" + args.map(toHex).join('');
	}

})();


// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps, staticProps) {
	var parent = this;
	var child;

	// The constructor function for the new subclass is either defined by you
	// (the "constructor" property in your `extend` definition), or defaulted
	// by us to simply call the parent's constructor.
	if (protoProps && _.has(protoProps, 'constructor')) {
		child = protoProps.constructor;
	} else {
		child = function() {
			return parent.apply(this, arguments);
		};
	}

	// Add static properties to the constructor function, if supplied.
	_.extend(child, parent, staticProps);

	// Set the prototype chain to inherit from `parent`, without calling
	// `parent`'s constructor function.
	var Surrogate = function() {
		this.constructor = child;
	};
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;

	// Add prototype properties (instance properties) to the subclass,
	// if supplied.
	if (protoProps) _.extend(child.prototype, protoProps);

	// Set a convenience property in case the parent's prototype is needed
	// later.
	child.__super__ = parent.prototype;

	return child;
};

var toDom = function toDom(str) {

	if (typeof str !== 'string') {
		throw new Error('toDom called on a non-string');
	};

	var elem,
	frag = document.createDocumentFragment(),
		holder = document.createElement('div');

	// convert our hopefully htmlish string into dom elements
	holder.innerHTML = str;

	// insert holder elems to frag
	while (elem = holder.firstChild) {
		frag.appendChild(elem);
	}

	return frag;
};


module.exports = {
	extend: extend,
	toDom: toDom,
	uniqId: uniqId,
	rgbToHex: rgbToHex
};