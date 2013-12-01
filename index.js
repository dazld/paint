// painting things in windows

var main_tpl = require('./app/templates/main.hbs');
var util = require('./app/lib/util');
var bus = require('./app/lib/bus');
var pantone = require('./app/data/pantone-colors.js');

var Painter = function Painter (options){

	// <3 events
	this.startTime = Date.now();
	this.bus = bus;
	this.colors = pantone;

	var main = util.toDom(main_tpl());
	this.sidebar = main.querySelector('aside');
	this.canvas = main.querySelector('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	this.debug('starting to insert cols');
	var holder = document.createElement('span');
	holder.classList.add('holder');
	
	
	this.colors.forEach(function(color){
		var col = document.createElement('div');
		var container = holder.cloneNode();
		col.classList.add('color');
		col.style.backgroundColor = color.color;
		container.appendChild(col);
		this.sidebar.appendChild(container);
	},this);

	this.sidebar.addEventListener('click',this.chooseColor.bind(this),false);
	

	this.debug('end insert');

	document.body.appendChild(main);

};

Painter.prototype.chooseColor = function(evt) {
	console.log(evt);
	// normalize clicks that drop through to the holders @TODO figure out if this is an inline problem..dimensions wrong?
	var target = evt.target;
	if (evt.target.className.indexOf('holder') > -1) {
		target = evt.target.querySelector('.color');
	};

	var rgb = target.style.backgroundColor.match(/[0-9]+/gi);
	var hex = util.rgbToHex.apply(null, rgb);

	console.log(rgb,hex);




};

Painter.prototype.draw = function(props) {
	
};

Painter.prototype.debug = function( /* ... */ ) {
	var evtTimeMs = Date.now() - this.startTime;
	var args = [].slice.call(arguments);
	args.unshift("[" + (evtTimeMs/1000).toFixed(3) + "s] - ");
	return console.log.apply(console, args);
};


var painter = new Painter();
window.p = painter;
