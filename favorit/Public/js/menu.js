define(function(require, exports) {

	var contentmenuSingleton = {
		getInstance: function(){
			if(contentmenuSingleton.instance){
				return contentmenuSingleton.instance;
			}
			return null;
		}
	}

	var menu = function(items){
		this.items = items;

		if(contentmenuSingleton.getInstance()){
			contentmenuSingleton.getInstance().dispose();
		}
		this.init();
		this.bind();
		contentmenuSingleton.instance = this;
	};

	menu.prototype = {
		init: function(){
			var me = this;
			var el = document.createElement('div');
			el.className = 'app-menu';
			var itemContainer = document.createElement('ul');
			el.appendChild(itemContainer);

			this.items.forEach(function(item){
				var item = new menuItem(item);
				item.parent = me;
				itemContainer.appendChild(item.el);
			});

			document.body.appendChild(el);
			me.el = el;
		},

		setPosition: function(pos){
			var me = this,
				x = pos.x,
				y = pos.y,
				window_width = $(window).width(),
				window_height = $(window).height(),
				el_width = $(me.el).width(),
				el_height = $(me.el).height();

			//重新计算位置，不考虑浏览器窗口大小很小的情况
			if((el_width + x) > window_width){
				x = window_width - el_width;
			}

			if((el_height + y) > window_height){
				y = window_height - el_height;
			}

			$(me.el).css('top', y);
			$(me.el).css('left', x);
			me.show();
		},

		show: function(){
			this.el.style.display = "block";
		},

		//对浏览器resize、blur、content、click的响应
		bind: function(){
			var me = this;

			//TODO dispose时移除掉这些事件监听
			$(window).blur(function(){
				me.dispose();
			});
			$(window).resize(function(){
				me.dispose();
			});
			$(window).contextmenu(function(){
				me.dispose();
			});
			$(document).click(function(e){
				var target = e.target;
				if(target === me.el || $(me.el).find(target).length > 0){
					return;
				}else{
					me.dispose();
				}
			});
		},

		dispose: function(){
			if(this.el){
				document.body.removeChild(this.el);
				this.el = null;
			}
		}

	};

	var menuItem = function(item){
		var me = this;
		var el = document.createElement('li');

		el.innerHTML = item.text;
		(item.enable === true) && (el.onclick = function(){
			me.parent.dispose();
			item.clickhandler();
		});

		if(!item.enable){
			el.className = 'disable';
		}

		me.el = el;
	};

	exports.menu = menu;
});