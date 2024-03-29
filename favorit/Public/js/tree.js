define(function(require, exports) {
	require('jquery');
	var tools = require('tools');
	var itemrowTpl = '<div class="tree-item"><div class="tree-row">' +
						'<span class="hitarea"></span><p class="tree-label">#{name}</p>' +
					 '</div></div>';

	/**
	 * 节点类
	 */
	var node = function(data, container){
		this.data = data;
		this.container = container;
	};

	node.prototype = {

		render: function(){
			this.el = $(tools.sformat(itemrowTpl, {'name': this.data.name}));
			if(this.data.children.length === 0){
				this.el.addClass('nochildren');
			}
			this.container[0].appendChild(this.el[0]);
			this.bind();
		},

		renderChildren: function(){
			var me = this;

			//不管有没有子节点，只要调用了该方法，就应该标志位true
			me.childrenRended = true;
			if(me.data.children.length === 0){
				return;
			}
			me.children = [];
			me.data.children.forEach(function(item){
				me.addChild(item);
			});
		},

		addChild: function(item){
			var me = this;
			var nodeItem;

			if(!me.childrenContainer){
				me.childrenContainer = $('<div class="tree-children"></div>');
				me.el[0].appendChild(me.childrenContainer[0]);
			}
			//将上一个子节点的last标识去掉
			me.childrenContainer.children().last().removeClass('last');
			nodeItem = new node(item, me.childrenContainer);

			nodeItem.parent = me;
			me.children.push(nodeItem);
			nodeItem.treeInstance = me.treeInstance;
			nodeItem.render();
			//为当前子节点标识last
			me.childrenContainer.children().last().addClass('last');

			return nodeItem;
		},

		/**
		 * 编辑节点
		 */
		edit: function(){
			//TODO 修改节点HTML、修改data、修改父节点data
		},

		/**
		 * 获取焦点
		 */
		focus: function(){
			$(this.treeInstance).trigger('nodefocus', this);
		},

		/**
		 * 展开子节点
		 */
		expend: function(){
			var me= this;

			if(me.data.children.length === 0)
				return;

			!me.childrenRended && me.renderChildren();
			me.expended = true;
			me.el.addClass("expended");
		},

		/**
		 * 收缩子节点
		 */
		collapse: function(){
			var me = this;

			me.expended = false;
			me.el.removeClass("expended");
		},

		bind: function(){
			var me = this;

			//鼠标在label上单击
			me.el.on('click', '.tree-label', function(e){
				me.focus();
				$(me.treeInstance).trigger('nodeclick', me);
				e.stopPropagation();
			});

			//鼠标在展开/收缩箭头上单击
			me.el.on('click', '.hitarea', function(e){
				me.focus();
				$(me.treeInstance).trigger('hitareaclick', me);
				if(me.expended){
					me.collapse();
				}else{
					me.expend();
				}
				e.stopPropagation();
			});

			//鼠标在label上双击
			// me.el.on('dblclick', '.tree-label', function(e){
			// 	$(me.treeInstance).trigger('nodedblclick', me);
			// 	if(me.expended){
			// 		me.collapse();
			// 	}else if(!me.expended && me.childrenRended){
			// 		me.expend();
			// 	}else{
			// 		me.renderChildren();
			// 		me.expend();
			// 	}

			// 	e.stopPropagation();
			// });

			//鼠标右键
			me.el.on('contextmenu', '.tree-label', function(e){
				e.preventDefault();
				e.stopPropagation();
				me.focus();
				$(me.treeInstance).trigger('contextmenu', {
					'instance': me,
					'event': e
				});
			});
		}
	};

	/**
	 * 树类
	 */
	var tree = function(data, container){
		this.data = data;
		this.container = container;
	};

	tree.prototype = {

		/**
		 * 渲染树，只渲染第一级，子节点在父节点被点击时才渲染
		 */
		render: function(){
			var me = this;

			me.children = [];

			me.data.children.forEach(function(item){
				var nodeItem = new node(item, me.container);

				nodeItem.parent = me;
				me.children.push(nodeItem);
				nodeItem.treeInstance = me;//保存一个tree的实例，在叶子节点派发自定义事件时需要使用
				nodeItem.render();
			});

			this.container.children().last().addClass('last');

			$(me).trigger('treerender', me);
		}
	};

	exports.tree = tree;
});