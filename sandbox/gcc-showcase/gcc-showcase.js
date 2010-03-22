if(typeof Gcc == 'undefined' || !Gcc) {
	Gcc = {};
}

/**
 * @class Gcc.Showcase
 * @author Niko Ni
 * @create 2010-03-21
 * @update 2010-03-22
 */
Gcc.Showcase = Class.create({
	/**
	 * @constructor
	 */
	initialize : function(config) {
		this.opt = config || {};
		this.items = this.opt['items'] || [];
		this.bound = false;

        // init markup
        this.initMarkup();
        // init events
        this.initEvents();
	},

	initMarkup : function() {
		var ctHtml = '';

		this.initTemplates();

		this.items.each(function(item, index) {
			item.id = 'sample-' + index;
			ctHtml += this.ctTpl.evaluate({
				id: item.id,
				title: item.title
			});
		}.bind(this));

		this.menu = $(this.opt['menuEl']) || $('sample-menu-inner');
		this.ct = $(this.opt['contentEl']) || $('sample-box-inner');
		this.cb = $(this.opt['controlBarEl']) || $('samples-cb');
		
		this.ct.update(ctHtml);
	},

	initEvents : function() {
		this.ct.observe('mouseover', function() {
			//@TODO
		});
		this.ct.observe('mouseout', function() {
			//@TODO
		});
		this.ct.observe('click', function() {
			//@TODO
		});

		this.menu.observe('click', function(ev) {
			ev.stop();
			//@TODO
		});

		this.cb.observe('click', function() {
			//@TODO
		});

		this.bindScroll(true);

		this.activate(this.items[0].id);
	},

	initTemplates : function() {		
		this.ctTpl = new Template(
			'<div id="sample-ct"><div>' +
			  '<a name="#{id}" id="#{id}"><h2><div unselectable="on">#{title}</div></h2>' +
			  '<dl id="sample-ct-#{id}"></dl>' +
			'</div></div>'
		);

		this.ctItemTpl = new Template(
			'<dd ext:url="#{url}">' +
			  '<img title="#{text}" src="assets/#{icon}" />' +
			  '<div><h4>#{text}</h4><p>#{desc}</p></div>' +
			'</dd>'
		);

		//@TODO
	},

	calcScrollPosition : function() {
		var last, found = false;
		this.ct.select('a[name]').each(function(item) {
			last = item;

			if(item.getOffsetsTo(this.ct)[1] >= -10) {
				this.activate(item.id);
				found = true;
				return false;
			}
		}.bind(this));

		if(!found) {
			this.activate(last.id);
		}
	},

	bindScroll : function(flag) {
		var fn = this.calcScrollPosition;
		if(flag) {
			this.ct.observe('scroll', fn);
			this.bound = true;
		} else {
			this.ct.stopObserving('scroll', fn);
			this.bound = false;
		}
	},

	activate : function(id) {
		var el = $('a4' + id);
		this.radioClass(el, 'active');
	},

    radioClass : function(el, cls) {
        if(el) {
            var arr = el.up().childElements();
            arr.each(function(item) {
                item.removeClassName(cls);
            });
            el.addClassName(cls);
        }
    }
});