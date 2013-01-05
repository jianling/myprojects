define(function(require, exports) {
	require('jquery');
	var tools = require('tools');
	var tree = require('tree').tree;
	var popups = require('app-popups');
	var menu = require('menu').menu;
	var urlDatas;
	var searchResults = [];
	var focusNode;	//表示当前选中的树节点对象
	var apppath = 'http://' + location.hostname + location.pathname;

	var urlTpl = '<p class="url-item"><a href="#{url}" target="_blank"><span>#{name}</span><span class="url">#{url}</span></a><span class="action-del" url_id="#{id}">删除</span></p>';
	var searchUrlTpl = '<p class="url-item"><a href="#{url}" target="_blank"><span>#{name}</span><span class="url">#{url}</span></a></p>';
	// 显示当前文件下下的子目录和url
	function showUrls(urls){
		var html = '';

		urls.forEach(function(item){
			html += tools.sformat(urlTpl, {'name':item[0], 'url':item[1], 'id':item[2]});	
		});

		$("#J_urlwrap").html(html);
	}

	// 显示搜索结果
	function showSearchUrls(searchResults){
		var html = '';

		searchResults.forEach(function(item){
			html += tools.sformat(searchUrlTpl, {'name':item[0], 'url':item[1], 'id':item[2]});	
		});

		$("#J_urlwrap").html(html);
	}

	// 删除url
	function delUrl(id, node){
		$.getJSON(
					"?m=url&a=delurlbyid",
					{'id': id},
					function(msg){
						if(msg.code == 1){
							node.parent().remove();
							focusNode.data.urls.forEach(function(item, key){
												if(item[2] == id){
													focusNode.data.urls.splice(key, 1);
												}
											});
						}else{
							alert('删除失败');
						}
					});
	}

	//搜索url
	function searchUrl(key, data){
		data.children.forEach(function(item){
			item.urls.forEach(function(url){
				if((new RegExp(key)).test(url[0])){
					searchResults.push(url);
				}
			});
			searchUrl(key, item);
		});
	}

	//显示搜索结果
	function showSearchResult(){
		if($('#J_search_item').length === 0){
			$('#J_tree').append('<p id="J_search_item">搜索</p>');
			$('#J_search_item').click(function(){
				showSearchUrls(searchResults);
				$('#J_tree').find('.focus').removeClass('focus');
				$('#J_search_item').addClass("focus");
			});
		}
		showSearchUrls(searchResults);
		$('#J_tree').find('.focus').removeClass('focus');
		$('#J_search_item').addClass("focus");
	}

	function bindApp(){
		$('#J_sbutton').click(function(){
			var key = tools.trim($('#J_sinput').val());

			if(key === ''){
				alert('请输入搜索关键字');
				return;
			}

			//将搜索结果清空
			searchResults = [];
			searchUrl(key, urlDatas);
			showSearchResult();
			$('#J_sinput').val('');
		});

		$('#J_urlwrap').click(function(e){
			var target = $(e.target);
			if(target.hasClass('action-del')){
				delUrl(target.attr('url_id'), target);
			}
		});
	}

	function initApp(){
		//创建一个根节点：收藏夹
		var treedata = {
			children: [{
				children: urlDatas.children || [],
				folder_id: "0",
				folder_name: "收藏夹",
				name: "收藏夹",
				urls: []
			}]
		};
		urlDatas = treedata;//将添加了根节点的树作为urlDatas


		var instance = new tree(treedata, $('#J_tree'));

  		$(instance).bind('treerender', function(e, node){
  			// node.expend();
  			node.children[0].expend();
  			if(node.children[0].children.length > 0){
  				node.children[0].children[0].focus();
  			}
  		});

  		$(instance).bind('nodefocus', function(e, node){
  			showUrls(node.data.urls);

  			focusNode = node;
  		});

  		$(instance).bind('contextmenu', function(e, arg){
  			var node = arg.instance,
  				menuitem_enalbe =   (function(){
					  					if(node.data.folder_id === '0'){
					  						return false;
					  					}
					  					return true;
					  				})();

  			var contextmenu = new menu([
	  			{
	  				'text': '重命名文件夹',
	  				'clickhandler': function(){
	  					popups.showRenameFolderPopup(node);
	  				},
	  				'enable': menuitem_enalbe
	  			},
	  			{
	  				'text': '删除文件夹',
	  				'clickhandler': function(){
	  					if(node.data.urls.length > 0 || node.data.children.length > 0){
	  						alert('不能删除非空文件夹');
	  					}else{
	  						$.getJSON(
									"?m=folder&a=delfolder",
									{'folder_id': node.data.folder_id},
									function(msg){
										if(msg.code === 1){
											//从父节点数据中删除该节点
											node.parent.data.children.forEach(function(item, key){
												if(item.folder_id == node.data.folder_id){
													node.parent.data.children.splice(key, 1);
												}
											});

											//删除DOM节点
											node.el.remove();
											node.parent.focus();

											//改变节点状态nochildren、last
											var children = node.parent.el.children('.tree-children').children();
											$(children[children.length - 1]).addClass('last');

											if(node.parent.data.children.length == 0){
												node.parent.el.addClass('nochildren');
												node.parent.el.removeClass('expended');
												node.parent.expended = false;
											}
										}else{
											alert(msg.msg || '删除失败');
										}
									}
								);
	  					}
	  				},
	  				'enable': menuitem_enalbe
	  			},
	  			{
	  				'text': '添加文件夹',
	  				'clickhandler': function(){
	  					popups.showNewFolderPopup(node);
	  				},
	  				'enable': true
	  			},
	  			{
	  				'text': '添加网页',
	  				'clickhandler': function(){
	  					popups.showAddURLPopup(node);
	  				},
	  				'enable': menuitem_enalbe
	  			}
  			]);

  			contextmenu.setPosition({x: arg.event.clientX, y: arg.event.clientY});
  			
  			$(instance).bind('nodefocus', function(e, node){
	  			contextmenu.dispose();
	  		});
  		});

  		$(instance).bind('nodefocus', function(e, node){
  			$('#J_tree').find('.focus').removeClass('focus');
  			node.el.addClass("focus");
  		});

  		// $(instance).bind('nodefocus', function(e, node){
  		// 	node.el.css('outline', '1px solid red');
  		// });
		instance.render();

		bindApp();
	}

	exports.run = function(){
		$.getJSON('?m=url&a=geturls', 
				function(data){
				  	console.log(data);
				  	urlDatas = data;

				  	initApp();
			    });
	};

	exports.showUrls = showUrls;

});