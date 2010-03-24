/**
 * @class Gcc.ShowcaseList
 * @author Niko Ni
 * @create 2010-03-21
 * @update 2010-03-24
 */
Gcc.ShowcaseList = Class.create({
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
		var menuHtml = '',
			ctHtml = '',
			ctItemHtml = '';

		this.initTemplates();

		this.items.each(function(item, index) {
			item.id = 'sample-' + index;
			ctHtml += this.ctTpl.evaluate({
				id: item.id,
				title: item.title
			});
			
			menuHtml += this.menuTpl.evaluate({
				id: item.id,
				title: item.title				
			});
		}.bind(this));

		this.menu = $(this.opt['menuEl']) || $('sample-menu-inner');
		this.ct = $(this.opt['contentEl']) || $('sample-box-inner');
		this.cb = $(this.opt['controlBarEl']) || $('samples-cb');
		
		this.ct.update('<div id="sample-ct">' + ctHtml + '</div>');

		this.items.each(function(item) {
			var container = $('sample-ct-' + item.id);
			if(container) {
				item.samples.each(function(sample) {
					ctItemHtml = this.ctItemTpl.evaluate({
						text: sample.text,
						url: sample.url,
						icon: sample.icon,
						desc: sample.desc
					});
					container.update(container.innerHTML + ctItemHtml);
				}.bind(this));
				container.insert('<div class="x-clear"></div>');
			}
		}.bind(this));

		this.menu.update(menuHtml);
	},

	initEvents : function() {
		this.ct.observe('mouseover', function(ev) {
			var t = ev.findElement('dd');
			if(t) {
				t.addClassName('over');
			}
		});

		this.ct.observe('mouseout', function(ev) {
			var t = ev.findElement('dd');
			if(t) {
				t.removeClassName('over');
			}
		});

		this.ct.observe('click', function(ev) {
			var item = ev.findElement('dd'),
				title = ev.findElement('h2');
			if(item) {
				var url = item.readAttribute('ext:url');
				if(url) {
					window.open(url.indexOf('http') == -1 ? '../../examples/' + url : url);
				}
			}

			if(title) {
				title.up('div').toggleClassName('collapsed');
			}
		}.bind(this));

		this.menu.observe('click', function(ev) {
			ev.stop();
			//@TODO - fix for IE
			if(!Prototype.Browser.IE) {
				var item = ev.findElement('a');
				if(item && this.bound) {
					this.radioClass(item, 'active');
					this.bindScroll(false);

					var ctItem = $('sample-' + item.id.split('-').pop());
					if(ctItem) {
						this.ct.setStyle({
							'position': 'relative'
						});
						new Effect.Move(this.ct.firstDescendant(), {
							duration: 0.3,
							y: -ctItem.offsetTop,
							afterFinish: this.bindScroll.bind(this, true),
							mode: 'absolute'
						});
					}
				}
			}
		}.bind(this));

		this.cb.observe('click', function(ev) {
			var img = ev.findElement('img');
			if(img) {
				$('samples').className = img.className;
				this.calcScrollPosition();
			}
		}.bind(this));

		this.bindScroll(true);

		this.activate(this.items[0].id);
	},

	initTemplates : function() {		
		this.ctTpl = new Template(
			'<div>' +
			  '<a name="#{id}" id="#{id}"></a><h2><div unselectable="on">#{title}</div></h2>' +
			  '<dl id="sample-ct-#{id}"></dl>' +
			'</div>'
		);

		this.ctItemTpl = new Template(
			'<dd ext:url="#{url}">' +
			  '<img title="#{text}" src="assets/#{icon}" />' +
			  '<div><h4>#{text}</h4><p>#{desc}</p></div>' +
			'</dd>'
		);

		this.menuTpl= new Template(
			'<a href="#" hidefocus="on" id="menu-#{id}">#{title}</a>'
		);
	},

	calcScrollPosition : function() {
		var last, found = false;

		this.ct.select('a').each(function(item) {
			last = item;			
			if(item.cumulativeOffset()[1] - item.cumulativeScrollOffset()[1] >= -10) {
				this.activate(item.id);
				found = true;
				throw $break;
			}			
		}.bind(this));

		if(!found) {
			this.activate(last.id);
		}
	},

	bindScroll : function(flag) {
		var fn = this.calcScrollPosition.bind(this);
		if(flag) {
			this.ct.observe('scroll', fn);
			this.bound = true;
		} else {
			this.ct.stopObserving('scroll', fn);
			this.bound = false;
		}
	},

	activate : function(id) {
		var el = $('menu-' + id);
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