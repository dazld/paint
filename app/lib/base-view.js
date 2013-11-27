// jquery-less, _-less backbone view


var util = require('./util');

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;
var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];


var BaseView = function(options) {
	// guard against illegal invocation
	if (!(this instanceof BaseView)) {
		throw new Error('BaseView not called as a constructor');
	};

	this.cid = util.uniqId();
	options || (options = {});
	viewOptions.forEach(function(viewOption) {
		if (options[viewOption]) {
			this[viewOption] = options[viewOption];
		};
	}, this);
	this._ensureElement();
	this.initialize.apply(this, options);
	this.delegateEvents();
};

BaseView.prototype = {
	tagName: 'div',
	initialize: function() {},
	render: function() {
		return this;
	},
	remove: function() {
		this.el.remove();
		this.stopListening();
		return this;
	},
	setElement: function(element, delegate) {
		if (this.el) this.undelegateEvents();
		this.el = element;
		if (delegate !== false) this.delegateEvents();
		return this;
	},
	stopListening: function() {},
	delegateEvents: function(events) {
		if (!(events || this.events)) return this;
		this.undelegateEvents();
		for (var key in events) {
			var method = events[key];
			if (!_.isFunction(method)) method = this[events[key]];
			if (!method) continue;

			var match = key.match(delegateEventSplitter);
			var eventName = match[1],
				selector = match[2];
			method = method.bind(this);
			eventName += '.delegateEvents' + this.cid;
			if (selector === '') {
				this.$el.on(eventName, method);
			} else {
				this.$el.on(eventName, selector, method);
			}
		}
		return this;
	},
	undelegateEvents: function() {},
	_ensureElement: function() {
		if (!this.el) {

		};
	},
	_delegatedEventHandler: function(selector, method){
		
	}
};

BaseView.extend = util.extend;

module.exports = BaseView;