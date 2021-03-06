/*
The MIT License

Copyright (c) 2009-2010 Niko Ni (bluepspower@163.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// namespace
Ext.ns('Ext.ux');

/**
 * @class Ext.ux.ShowcaseList
 * @extends-ext Ext.util.Observable
 * @author Niko Ni (bluepspower@163.com)
 * @demo http://cz9908.com/showcase/?item=showcase-list&p=1
 * @version v0.3
 * @create 2010-03-26
 * @update 2010-03-26
 */
Ext.ux.ShowcaseList = Ext.extend(Ext.util.Observable, {
    //------------------------------------------------------------
    // config options
    //------------------------------------------------------------
    /**
     * @cfg {Array} items Array of showcase list config object items.
     */
    items : [],

    /**
     * @cfg {Mixed} renderTo The container element.
     */
    renderTo : document.body,

    /**
     * @cfg {String} title The title of showcase.
     */
	title : 'Showcase List',

    /**
     * @cfg {String} menuEl The menu container element id.
     */
	menuEl : 'showcase-list-menu-inner',

    /**
     * @cfg {String} contentEl The content container element id.
     */
	contentEl : 'showcase-list-box-inner',

    /**
     * @cfg {String} controlBarEl The controlBar container element id.
     */
	controlBarEl : 'showcase-list-controlbar',
	
    //------------------------------------------------------------
    // class constructor
    //------------------------------------------------------------
    /**
     * @constructor
     * @param config
     * @private
     */
	constructor : function(config) {
		Ext.apply(this, config);
		Ext.ux.ShowcaseList.superclass.constructor.call(this);

        // add custom event
        this.addEvents(
            /**
             * @event change
             * Fires when showcase list item is clicked
             * @param {Ext.ux.ShowcaseList} this
             * @param {Object} activeItem
             * @param {Number} index
             */
            'change'
        );

        // initialize
        this.init();
	},

    //------------------------------------------------------------
    // public/private methods
    //------------------------------------------------------------
    /**
     * @private
     */
    init : function() {
        // properties
        this.el = Ext.get(this.renderTo);
        this.bound = false;

        // init markup
        this.initMarkup();

        // init events
        this.initEvents();
    },

    /**
     * @private
     */
	initMarkup : function() {
		this.initTemplates();

		this.containerEl = this.el.createChild({
			tag: 'div',
			cls: 'ux-showcase-list-container',
			children: [{
				tag: 'h3',
				cls: 'ux-showcase-list-title',
				html: this.title
			}, {
				tag: 'div',
				id: 'showcase-list-main',
				children: [{
					tag: 'div',
					id: this.controlBarEl,
					children: [{
						tag: 'img',
						cls: 'ux-showcase-list-normal-view',
						src: 'images/s.gif',
						title: 'Full view with descriptions'
					}, {
						tag: 'img',
						cls: 'ux-showcase-list-condensed-view',
						src: 'images/s.gif',
						title: 'Condensed view'
					}, {
						tag: 'img',
						cls: 'ux-showcase-list-mini-view',
						src: 'images/s.gif',
						title: 'Mini view'
					}]
				}, {
					tag: 'div',
					id: 'showcase-list-menu'
				}, {
					tag: 'div',
					id: 'showcase-list-box'
				}]
			}]
		});

		Ext.fly('showcase-list-menu').createChild({
			tag: 'div',
			id: this.menuEl
		});

		Ext.fly('showcase-list-box').createChild({
			tag: 'div',
			id: this.contentEl,
			children: [{
				tag: 'div',
				id: 'showcase-list-content'
			}]
		});
		
		this.menu = Ext.get(this.menuEl);
		this.ct = Ext.get(this.contentEl);
		this.cb = Ext.get(this.controlBarEl);

		Ext.each(this.items, function(item, idx) {
			var cfg = {
				index: idx,
				title: item.title			
			};
			this.ctTemplate.append('showcase-list-content', cfg);
			this.menuTemplate.append(this.menu, cfg);

			var itemContainer = Ext.get('showcase-list-content-' + idx);
			if(itemContainer) {
				Ext.each(item.samples, function(sample, i) {
					this.ctItemTemplate.append(itemContainer, {
						text: sample.text,
						url: sample.url,
						icon: sample.icon,
						desc: sample.desc,
						groupIndex: idx + '-' + i
					});
				}, this);

				itemContainer.insertHtml('beforeEnd', '<div class="x-clear"></div>');
			}
		}, this);
	},

    /**
     * @private
     */
	initEvents : function() {
		this.ct.on('mouseover', function(ev, t) {
			var target = Ext.fly(ev.getTarget('dd'));
			if(target) {
				target.addClass('over');
			}
		});

		this.ct.on('mouseout', function(ev, t) {
			var target = Ext.fly(ev.getTarget('dd'));
			if(target) {
				target.removeClass('over');
			}
		});

		this.ct.on('click', function(ev, t) {
			var item = Ext.fly(ev.getTarget('dd', 5)),
				title = ev.getTarget('h2', 3);
			if(item && !item.is('dd')) {
				item = item.up('dd');
			}

			if(item && !ev.getTarget('a', 3)) {
				var url = item.getAttributeNS('ext', 'url'),
					itemId = item.getAttributeNS('ext', 'id'),
					arr = itemId.split('-');

				if(url && url.slice(-1) != '#') {
					window.open(url.indexOf('http') == -1 ? '../' + url : url);
				} else {						
					this.fireEvent('change', t, arr[arr.length - 2] + '-' + arr[arr.length - 1]);
				}
			}

			if(title) {
				Ext.fly(title).up('div').toggleClass('ux-showcase-list-collapsed');
			}
		}, this);

		this.menu.on('click', function(ev, t) {
			ev.preventDefault();
			
			var item = ev.getTarget('a');
			if(item && this.bound) {
				this.setActivate(item.id.split('-').pop());
			}
			
		}, this);

		this.cb.on('click', function(ev, t) {
			var img = ev.getTarget('img');
			if(img) {
				Ext.getDom('showcase-list-main').className = img.className;
				this.setScrollPosition.defer(10, this);
			}
		}, this);

		this.setActivate(0);
	},

    /**
     * @private
     */
	initTemplates : function() {		
		this.ctTemplate = new Ext.Template([
			'<div>',
			  '<a name="showcase-list-sample-{index}" id="showcase-list-sample-{index}"></a><h2><div unselectable="on">{title}</div></h2>',
			  '<dl id="showcase-list-content-{index}"></dl>',
			'</div>'
		]);

		this.ctItemTemplate = new Ext.Template([
			'<dd ext:id="showcase-list-content-{groupIndex}" ext:url="{url}">',
			  '<img title="{text}" src="images/{icon}" />',
			  '<div><h4>{text}</h4><p>{desc}</p></div>',
			'</dd>'
		]);

		this.menuTemplate = new Ext.Template([
			'<a href="#" hidefocus="on" id="showcase-list-menu-{index}">{title}</a>'
		]);
	},

    /**
     * @private
     */
	setScrollPosition : function() {
		var last, idx, found = false;

		this.ct.select('a[name]', true).each(function(item, all, index) {
			last = item;

			if(item.getOffsetsTo(this.ct)[1] >= -10) {
				idx = item.dom.id.split('-').pop();
				Ext.get('showcase-list-menu-' + idx).radioClass('ux-showcase-list-active');
				found = true;
				return false;
			}
		}, this);

		if(!found) {
			idx = last.dom.id.split('-').pop();
			Ext.get('showcase-list-menu-' + idx).radioClass('ux-showcase-list-active');
		}
	},

    /**
     * @private
     */
	setScrollEventBind : function(flag) {
		if(flag) {
			this.ct.on('scroll', this.setScrollPosition, this, { buffer: 250 });
			this.bound = true;
		} else {
			this.ct.un('scroll', this.setScrollPosition, this);
			this.bound = false;
		}
	},

    /**
	 * Set activate for specific menu item
	 * @param {Number} index Display menu item index
     */
	setActivate : function(index) {
		Ext.get('showcase-list-menu-' + index).radioClass('ux-showcase-list-active');
		this.setScrollEventBind(false);

		var ctItem = Ext.getDom('showcase-list-sample-' + index);
		if(ctItem) {
			this.ct.animate(
				{
					scroll: {
						to : [0, ctItem.offsetTop]
					}
				},
				0.3,
				this.setScrollEventBind.createDelegate(this, [true]),
				'easeOut',
				'scroll'
			)
		}
	}

});  // end of Ext.ux.ShowcaseList