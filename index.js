// painting things in windows

var main_tpl = require('./app/templates/main.hbs');
var util = require('./app/lib/util');
var bus = require('./app/lib/bus');
var pantone = require('./app/data/pantone-colors.js');

var TWOPI = Math.PI*2;

var Painter = function Painter (options){

	// <3 events
	this.startTime = Date.now();
	this.bus = bus;
	this.colors = pantone;



	var main = util.toDom(main_tpl());
	this.sidebar = main.querySelector('aside');
	this.canvas = main.querySelector('canvas');
	main.querySelector('#reset').addEventListener('click',this.reset.bind(this));
	main.querySelector('#setbg').addEventListener('click',this.setBackgroundColor.bind(this));
	main.querySelector('#play').addEventListener('click',this.undo.bind(this,true));

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

	this.ctx = this.canvas.getContext('2d');
	document.body.appendChild(main);

	this.startListening();
	this.reset();
	
};

Painter.prototype.startListening = function() {

	document.body.addEventListener('keydown', function(evt){
		if ((evt.metaKey || evt.ctrlKey) && evt.keyCode === 90) {
			evt.stopPropagation();
			this.undo();
		};
	}.bind(this),false)

	this.canvas.addEventListener('mousedown', function(evt){
		this.drawing = true;
		this.lastX = evt.offsetX;
		this.lastY = evt.offsetY;
	}.bind(this),false);

	this.canvas.addEventListener('mouseup', function(evt){
		if (evt.offsetX == this.lastX && evt.offsetY == this.lastY) {
			this.draw.call(this, evt, 1)
		};
		this.drawing = false;

	}.bind(this),false);

	this.canvas.addEventListener('mouseout', function(evt){
		this.drawing = false;
	}.bind(this),false);

	this.canvas.addEventListener('mousemove', this.draw.bind(this),false);
	this.canvas.addEventListener('mousemove', this.bus.emit.bind(bus,'mm'),false);

	// set up event listeners on our bus
	this.bus.on('color',this.dispatchColor.bind(this));

};

Painter.prototype.undo = function undo (replay){
	
	var playback = [];

	if (replay !== true) {
		this.strokes.pop();
	} 
	
	this.ctx.clearRect(0,0,this.width, this.height);
	this.drawing = true;
	this.replaying = true;
	this.strokes.forEach(function(stroke){

		var drawStroke = (function(stroke){
			

			return function(){
				
				this.lastX = stroke.fromX;
				this.lastY = stroke.fromY;
				this.color = stroke.color;

				var fakeEvt = {
					offsetX: stroke.toX,
					offsetY: stroke.toY
				}

				this.draw(fakeEvt, stroke.size, stroke.spot);
			}.bind(this);
			
			// this.draw.call(this, fakeEvt, stroke.size, stroke.spot);

		}.bind(this))(stroke);
		


			
		
		if (replay) {
			playback.push(drawStroke)
		} else {
			drawStroke();
		}
		

	},this);

	if (replay) {
		
		playback.unshift(function(){
			this.drawing = true;
			this.replaying = true;
		}.bind(this));
		playback.push(function(){
			this.drawing = false;
			this.replaying = false;
		}.bind(this))

		console.log('trying to playback')

		util.sequential(playback, 8);
	};

	this.drawing = false;
	this.replaying = false;
};

Painter.prototype.dispatchColor = function(color) {
	if (!this.setBG) {
		this.color = color;	
	};
};

Painter.prototype.setBackgroundColor = function(evt) {
	this.setBG = true;
	this.bus.once('color', function(color){
		this.setBG = false;
		this.backgroundColor = color;
		this.canvas.style.backgroundColor = color;
	}.bind(this))
};

Painter.prototype.reset = function() {
	
	var ctx = this.ctx;
	var cvs = this.canvas;

	
	this.backgroundColor = '#000000';
	this.color = '#ffffff';
	
	this.strokes = [];
	this.userColors = [];

	var dims = this.canvas.getBoundingClientRect();
	this.width = dims.width;
	this.height = dims.height;
	
	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);


};

Painter.prototype.createStroke = function(evt) {
	
};

Painter.prototype.chooseColor = function(evt) {
	var target = evt.target;

	// normalize clicks that drop through to the holders @TODO figure out if this is an inline problem..dimensions wrong?
	if (evt.target.className.indexOf('holder') > -1) {
		target = evt.target.querySelector('.color');
		if (!target.length) {return false};
	};

	var rgb = target.style.backgroundColor.match(/[0-9]+/gi);
	var hex = util.rgbToHex.apply(null, rgb);

	
	this.bus.emit('color', hex);


};

Painter.prototype.save = function(options) {
	this.strokes.push(options);
};

Painter.prototype.draw = function(evt, size, spot) {

	if (!this.drawing) {
		// this.debug('nuhuh')
		return;
	} else {
		// this.debug('ok')
	}



	var ctx = this.ctx;

	var currentSpeed_x = this.lastX - evt.offsetX;
	var currentSpeed_y = this.lastY - evt.offsetY;

	if (currentSpeed_x < 0) { currentSpeed_x = currentSpeed_x * -1};
	if (currentSpeed_y < 0) { currentSpeed_y = currentSpeed_y * -1};

	var a2 = Math.pow(currentSpeed_x,2);
	var b2 = Math.pow(currentSpeed_y,2);

	var speed = Math.sqrt(a2+b2);

	
	ctx.strokeStyle = this.color;
	ctx.fillStyle = this.color;
	ctx.lineWidth = size || (Math.log(speed) + 1);
	if (!this.replaying) {

		this.save({
			color: this.color,
			fromX: this.lastX,
			fromY: this.lastY,
			toX: evt.offsetX,
			toY: evt.offsetY,
			width: ctx.lineWidth,
			size: size,
			spot: spot
		});
	
	};
	
	if (this.drawing) {
		
		if (size) {
			ctx.beginPath();
	        ctx.arc(evt.offsetX, evt.offsetY,size,0,TWOPI);
	        ctx.fill();
		} else {
			ctx.beginPath();
			ctx.moveTo(this.lastX,this.lastY);
			ctx.lineTo(evt.offsetX,evt.offsetY);
			ctx.stroke();
			this.lastX = evt.offsetX;
			this.lastY = evt.offsetY;
				
		}
		
		
	} 
};

Painter.prototype.debug = function( /* ... */ ) {
	var evtTimeMs = Date.now() - this.startTime;
	var args = [].slice.call(arguments);
	args.unshift("[" + (evtTimeMs/1000).toFixed(3) + "s] - ");
	return console.log.apply(console, args);
};


var painter = new Painter();
window.p = painter;
window.u = util;
