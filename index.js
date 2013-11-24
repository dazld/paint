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
	this.colors = pantone;
	document.body.appendChild(this.main);
	
	this.debug('starting to insert cols');
	this.colors.forEach(function(color){
		var col = document.createElement('div');
		col.classList.add('color');
		col.style.backgroundColor = color.color;
		col.addEventListener('mouseover', console.log.bind(console, color));
		this.sidebar.appendChild(col);

	},this);
	this.debug('end to insert cols');
	this.main.appendChild(document.createElement('h1'));

};

Painter.prototype.debug = function( /* ... */ ) {
	var evtTimeMs = Date.now() - this.startTime;
	var boundConsole = console.log.bind(console, "[" + evtTimeMs/1000 + "s] - ");

	return boundConsole.apply(null, arguments);

};


var painter = new Painter();
window.p = painter;
