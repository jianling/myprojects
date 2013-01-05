define(function(require, exports){

	var pop_tpl = '<div class="pop-layer">'+
			'<div class="mask"></div>'+
			'<div class="pop-layer-inner">'+
				'<h1 class="pop-title">#{title}</h1>'+
				'<div class="pop-content">#{content}</div>'+
				'<p class="status-bar"></p>'+
				'<p class="button-area"></p>'+
			'</div>'+
		'</div>';

	function popup(config){
		this.config = config;
		this.init();
	}

	popup.prototype = {

		init: function(){
			var me = this;

			me.popup_el = $(pop_tpl);

			$(document.body).append(me.popup_el);

			me.title_el = me.popup_el.find('.pop-title');
			me.content_el = me.popup_el.find('.pop-content');
			me.status_bar = me.popup_el.find('.status-bar');
			me.button_container = me.popup_el.find('.button-area');

			me.setTitle();
			me.setContent();
			me.createButton();

			// $(me).trigger('init', me);
		},

		setTitle: function(){
			var me = this;

			me.title_el.html(me.config.title);
		},

		setContent: function(){
			var me = this;

			me.content_el.html(me.config.content);
		},

		createButton: function(){
			var me = this,
				buttons = me.config.buttons;

			buttons.forEach(function(item){
				var button = $('<button class="m-btn ' + item.classname + '">' + item.name + '</button>');
				me.button_container.append(button);
				button.click(function(){
					item.handler.call(me);
				});
			});
		},

		show: function(){
			this.popup_el.show();
		},

		hide: function(){
			this.popup_el.hide();
		},

		log: function(status, msg){
			this.status_bar.html('<span class="' + status + '">' + msg+ '</span>');
		}
	};

	exports.popup = popup;
});