// painting things in windows

var main_tpl = require('./app/templates/main.hbs');
var util = require('./app/lib/util');
var bus = require('./app/lib/bus');
var pantone = require('./app/data/pantone-colors.js');

var Painter = function Painter (options){

	// <3 events
	this.startTime = Date.now();
	this.bus = bus;
	
	this.main = util.toDom(main_tpl());
	this.sidebar = this.main.querySelector('aside');
	this.canvas = this.main.querySelector('canvas');
	this.ctx = this.canvas.getContext('2d');

	this.colors = pantone;
	document.body.appendChild(this.main);
	
	this.debug('starting to insert cols');
	
	this.colors.forEach(function(color){
		var col = document.createElement('div');
		col.classList.add('color');
		col.style.backgroundColor = color.color;
		this.sidebar.appendChild(col);
	},this);

	this.debug('end to insert cols');
	this.main.appendChild(document.createElement('h1'));

};

Painter.prototype.debug = function( /* ... */ ) {
	var evtTimeMs = Date.now() - this.startTime;
	var args = [].slice.call(arguments);
	args.unshift("[" + (evtTimeMs/1000).toFixed(3) + "s] - ");
	

	return console.log.apply(console, args);

};


var painter = new Painter();
window.p = painter;