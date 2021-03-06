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
 * @class Ext.ux.MessageSlider
 * @extends-ext Ext.util.Observable
 * @author Niko Ni (bluepspower@163.com)
 * @demo http://cz9908.com/showcase/?item=message-slider&p=1
 * @demo-extra http://cz9908.com/showcase/?item=Ext-Web-PPT&p=1
 * @thumbnail http://cz9908.com/thumb/?item=message-slider
 * @version v0.5
 * @create 2009-06-20
 * @update 2010-08-24
 * 
 * // Example object item:
 * {
 *     content: 'some content/text',
 *     url: 'some url (optional)',
 *     tip: 'some tip (optional)',
 *     target: 'target element (optional)'
 * }
 *
 */
Ext.ux.MessageSlider = Ext.extend(Ext.util.Observable, {
    //------------------------------------------------------------
    // config options
    //------------------------------------------------------------
    /**
     * @cfg {Array} items Array of message slider config object items.
     */
    items : [],

    /**
     * @cfg {Mixed} renderTo The container element.
     */
    renderTo : document.body,

    /**
     * @cfg {Number} displayIndex The display message index.
     */
    displayIndex : 0,

    /**
     * @cfg {Number} intervalTime The interval time seconds (recommend number greater than 1).
     */
    intervalTime : 4,

    /**
     * @cfg {String} msgContainerCls The css class of message slider container element.
     */
    msgContainerCls : 'ux-msg-slider-container',

    /**
     * @cfg {String} msgInnerCls The css class of message slider inner element.
     */
    msgInnerCls : 'ux-msg-slider-inner',

    /**
     * @cfg {String} msgOverCls The css class when hover message slider
     */
    msgOverCls : 'ux-msg-slider-over',

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
        Ext.ux.MessageSlider.superclass.constructor.call(this);

        // add custom event
        this.addEvents(
            /**
             * @event change
             * Fires when message slide item is clicked
             * @param {Ext.ux.MessageSlider} this
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
        this.activeItem = this.items[this.displayIndex];

        // init markup
        this.initMarkup();

        // init events
        this.initEvents();
    },

    /**
     * @private
     */
    initMarkup : function() {
        // message container
        this.containerEl = this.el.createChild({
            tag : 'div',
            cls : this.msgContainerCls
        });
        // inner message element
        this.innerEl = this.containerEl.createChild({
            tag : 'div',
            cls : this.msgInnerCls
        });

        // message link element
        var currItem = this.activeItem,
            currContent = currItem.content || currItem.text;
        
        this.innerEl.createChild({
            tag : 'a',
            href : currItem.url || '#',
            html : currContent,
            title : currItem.tip || currContent,
            target : currItem.target || '_blank'
        });
    },
    
    /**
     * @private
     */
    initEvents : function() {
        var hoverCls = this.msgOverCls;
        
        // set hover action, equal to addClassOnOver
        this.innerEl.hover(function() {
            Ext.fly(this).addClass(hoverCls);
        }, function() {
            Ext.fly(this).removeClass(hoverCls);
        });

        this.containerEl.on('click', function(ev, t) {
            if(t.href.slice(-1) == '#') {
                ev.preventDefault();
            }
            this.fireEvent('change', this.activeItem, this.displayIndex);
        }, this, {
            delegate : 'a'
        });

        // show the default message
        this.showMsg(this.displayIndex);

        // set interval action
        window.setInterval(function() {
            // if hover, do nothing
            if(!this.innerEl.hasClass(hoverCls)) {
                this.displayIndex = this.items[this.displayIndex + 1] ? this.displayIndex + 1 : 0;
                this.showMsg(this.displayIndex);
            }
        }.createDelegate(this), this.intervalTime * 1000);
    },
    
    /**
     * Show specific message
     * @param {Number} index Display message index
     */
    showMsg : function(index) {
        // if hover, do nothing
        if(!this.innerEl.hasClass(this.msgOverCls)) {
            this.displayIndex = index;
            this.activeItem = this.items[index];
            if(this.containerEl.isVisible()) {
                this.containerEl.slideOut('b', {
                    callback : this.updateMsg,
                    scope : this
                });
            } else {
                this.updateMsg();
            }
        }
    },

    /**
     * @private
     */
    updateMsg : function() {
        // update message
        var currItem = this.activeItem,
			linkEl = this.innerEl.child('a'),
            currContent = currItem.content || currItem.text;

        linkEl.update(currContent);
        linkEl.dom.href = currItem.url || '#';
        linkEl.dom.title = currItem.tip || currContent;
        linkEl.dom.target = currItem.target || '_blank';
        
        this.containerEl.slideIn('b', {
            duration : 0.2
        });
    }

});  // end of Ext.ux.MessageSlider