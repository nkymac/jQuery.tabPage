/**
 * tabPage, tabbed navigation plugin for jQuery
 *
 * (c) 2011 nkym http://nkymemo.blogspot.com/
 *
 * released under the MIT license
 *
 * @version 0.1
 * @author  nkym
 */

(function($) {
    var _itemPool = {};
    var _topPriorityItemId = window.location.hash;

    var TabPage = function(container, options) {
        this.$container = $(container);
        this.options = options;
        this.init();
    };

    TabPage.prototype = {
        $container: null,
        $nav: null,
        $tabs: null,
        $pages: null,

        init: function() {
           try {
               var tabPage = this;
               this.$pages = this.$container.children(this.options.selectorPage);
               this.$pages.hide();

               this.$nav  = this.$container.children(this.options.selectorNav);
               this.$tabs = this.$nav.children(this.options.selectorTab);
               this.$tabs.each(function() {
                   var pageId = '#' + $(this).children('a:first').attr('href').split('#')[1];
                   var $page = $(pageId);
                   var $tab = $(this);

                   $tab.click(function(e) {
                       $.tabPage.select(pageId);
                       $(window).focus(); // remove focus outline
                       return false;
                   });

                   _itemPool[pageId] = {
                       $tab: $tab,
                       $page: $page,
                       tabPage: tabPage
                   };
               });
               this.refresh();

           } catch (e) {
               this.alert(e);
           }
        },

        refresh: function() {
            var $tab = this.$tabs.filter('.selected:first');

            if (!($tab.length && !$tab.hasClass('disabled'))) {
            	this.$tabs.each(function() {
            		if (!$(this).hasClass('disabled')) {
            			$tab = $(this);
            			return false;
            		}
            	});
            }
            this.reset();
            $tab.click();
        },

        reset: function() {
            this.$tabs.removeClass('selected');
            this.$pages.hide();
        },

        alert: function(e) {
        	this.$container.append('<p class="tabAleart">[' + e.name + '] ' + e.message + '</p>');
        }
    };

    // plugin method
    $.fn.tabPage = function(options) {
    	var options = $.extend({}, $.fn.tabPage.defaults, options);

    	this.each(function() {
    		var tabPage = $(this).data('tabPage');

    		if (!tabPage) {
    			$(this).data('tabPage', new TabPage(this, options));
    		}
    	});

    	if (options.locationHash && _topPriorityItemId) {
    		$.tabPage.select(_topPriorityItemId);
    	}
    	return this;
    };

    // default settings
    $.fn.tabPage.defaults = {
    	locationHash : true,
    	selectorNav  : 'ul:first',
    	selectorTab  : 'li',
    	selectorPage : 'div',
    	animate      : 'show', // TODO
    	duration     : ''      // TODO
    };

    // public functions
    $.tabPage = {

    };

    $.tabPage.select = function(id) {
        var item = _itemPool[id];

        if (item) {
        	if (!item.$tab.hasClass('disabled')) {
        		item.tabPage.reset();
        		item.$tab.addClass('selected');
        		item.$page.show();
        	}
        }
    };

    $.tabPage.unselect = function(id) {
        var item = _itemPool[id];

        if (item) {
        	if (!item.$tab.hasClass('disabled')) {
        		item.$tab.removeClass('selected');
        		item.$page.hide();
        		item.tabPage.refresh();
        	}
        }
    };

    $.tabPage.enable = function(id) {
        var item = _itemPool[id];

        if (item) {
        	item.$tab.removeClass('disabled');
        }
    };

    $.tabPage.disable = function(id) {
        var item = _itemPool[id];

        if (item) {
    		this.unselect(id);
    		item.$tab.addClass('disabled');
        }
    };

})(jQuery);
