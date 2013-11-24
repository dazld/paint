var toDom = function toDom (str){
	
	if (typeof str !== 'string') {
		throw new Error('toDom called on a non-string');
	};

	var elem,
		frag = document.createDocumentFragment(),
		holder = document.createElement('div');

	// convert our hopefully htmlish string into dom elements
	holder.innerHTML = str;

	// insert holder elems to frag
	while(elem = holder.firstChild) {
		frag.appendChild(elem);
	}

	return frag;
};


module.exports = {
	toDom: toDom
};