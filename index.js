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

	
	document.body.appendChild(main);
		
	
	this.debug('starting to insert cols');
	
	this.colors.forEach(function(color){
		var col = document.createElement('div');
		col.classList.add('color');
		col.style.backgroundColor = color.color;
		this.sidebar.appendChild(col);
	},this);

	this.debug('end to insert cols');

};

Painter.prototype.debug = function( /* ... */ ) {
	var evtTimeMs = Date.now() - this.startTime;
	var args = [].slice.call(arguments);
	args.unshift("[" + (evtTimeMs/1000).toFixed(3) + "s] - ");
	

	return console.log.apply(console, args);

};


var painter = new Painter();
window.p = painter;
