define(function(require, exports) {
	var tools = require('tools');
	var app = require('app');
	var popup = require('popup').popup;
	require('jquery');

	//保存几个弹出层的实例
	var popupInstances = {
		getInstance: function(name){
			if(popupInstances[name]){
				return popupInstances[name];
			}else{
				return null;
			}
		},

		addInstance: function(name, instance){
			popupInstances[name] = instance;
		}
	}

	//重命名文件夹
	exports.showRenameFolderPopup = function(folder_node){
		if(popupInstances.getInstance('rename-folder')){
			popupInstances.getInstance('rename-folder').show();
			return;
		}

	  	var pop = new popup({
	  		'title': '重命名文件夹',
	  		'content': '<input type="text" class="folder-input m-input-text" maxlength="20" value="' + folder_node.data.name + '" />',
	  		'buttons': [{
				  			'name': '确定',
				  			'classname': 'm-btn-vermilion',
				  			'handler': function(){
				  				var folder_name_input = pop.popup_el.find('.folder-input'),
				  					new_folder_name = folder_name_input.val();

				  				if(!tools.trim(new_folder_name)){
									pop.log('attention', '文件夹名称不能为空');
									folder_name_input.focus();
									return;
								}
								if(tools.trim(new_folder_name).length > 20){
									pop.log('attention', '文件夹名称不能超过20个字符');
									folder_name_input.focus();
									return;
								}
								$.getJSON(
									"?m=folder&a=renamefolder",
									{ 'folder_name': new_folder_name, 'folder_id': folder_node.data.folder_id},
									function(msg){
										if(msg.code === 1){
											// pop.log('success', '修改成功');
											folder_node.el.find('.tree-label').html(new_folder_name);
											folder_node.data.name = new_folder_name;
											folder_node.data.folder_name = new_folder_name;
											pop.hide();
										}else{
											pop.log('failure', msg.msg || '修改失败');
										}
									}
								);
				  			}
				  		},{
				  			'name': '取消',
				  			'classname': 'm-btn-gray',
				  			'handler': function(){
				  				pop.hide();
				  			}
				  		}]
	  	});
	  	pop.show();
	};

	//添加文件夹
	exports.showNewFolderPopup = function(folder_node){
		if(popupInstances.getInstance('new-folder')){
			popupInstances.getInstance('new-folder').show();
			return;
		}

	  	var pop = new popup({
	  		'title': '添加文件夹',
	  		'content': '<input type="text" class="folder-input m-input-text" maxlength="20" value="" />',
	  		'buttons': [{
				  			'name': '确定',
				  			'classname': 'm-btn-vermilion',
				  			'handler': function(){
				  				var folder_name_input = pop.popup_el.find('.folder-input'),
				  					folder_name = folder_name_input.val();

				  				if(!tools.trim(folder_name)){
									pop.log('attention', '文件夹名称不能为空');
									folder_name_input.focus();
									return;
								}
								if(tools.trim(folder_name).length > 20){
									pop.log('attention', '文件夹名称不能超过20个字符');
									folder_name_input.focus();
									return;
								}

								$.getJSON(
									"?m=folder&a=addfolder",
									{ 'folder_name': folder_name, 'parent_folder_id': folder_node.data.folder_id},
									function(msg){
										if(msg.code === 1){
											// pop.log('success', '修改成功');
											var folder_id = msg.folder_id;

											//往父文件夹添加该子文件夹数据
											folder_node.data.children.push({
												'folder_id': folder_id,
												'folder_name': folder_name,
												'name': folder_name,
												'parent_folder_id': folder_node.data.folder_id,
												'urls': [],
												'children': []
											});

											if(folder_node.expended){	//如果已经展开，直接添加子节点DOM
												folder_node = folder_node.addChild({
													'folder_id': folder_id,
													'folder_name': folder_name,
													'name': folder_name,
													'parent_folder_id': folder_node.data.folder_id,
													'urls': [],
													'children': []
												});
											}else{	//如果没有展开
												if(folder_node.childrenRended){
													folder_node.addChild({
														'folder_id': folder_id,
														'folder_name': folder_name,
														'name': folder_name,
														'parent_folder_id': folder_node.data.folder_id,
														'urls': [],
														'children': []
													});
												}
												folder_node.expend();
												folder_node.el.removeClass('nochildren');
											}
											pop.hide();
										}else{
											pop.log('failure', msg.msg || '添加失败');
										}
									}
								);
				  			}
				  		},{
				  			'name': '取消',
				  			'classname': 'm-btn-gray',
				  			'handler': function(){
				  				pop.hide();
				  			}
				  		}]
	  	});
	  	pop.show();
	};

	//添加网页
	exports.showAddURLPopup = function(folder_node){
		if(popupInstances.getInstance('addurl')){
			popupInstances.getInstance('addurl').show();
			return;
		}

	  	var pop = new popup({
	  		'title': '添加网页',
	  		'content': '<p><input type="text" class="m-input-text url-name-input" maxlength="20" placeholder="标题" value="" /></p>'+
					   '<p><input type="text" class="m-input-text url-input" maxlength="200" placeholder="URL" value="" style="width: 400px;"/></p>',
	  		'buttons': [{
				  			'name': '确定',
				  			'classname': 'm-btn-vermilion',
				  			'handler': function(){
				  				var url_name = pop.popup_el.find('.url-name-input');
				  				var url_url = pop.popup_el.find('.url-input');
				  				//检查值的有效性
								var name = tools.trim(url_name.val());
								var url = tools.trim(url_url.val());

								//TODO 将下面的判断解耦出来
								if(!name || !url){
									pop.log('attention', '请将表单填写完整');
									return;
								}

								if(name.length > 20){
									pop.log('attention', '标题不能超过20个字符');
									url_name.focus();
									return;
								}

								if(url.length > 200){
									pop.log('attention', 'url不能超过200个字符');
									url_url.focus();
									return;
								}

								//TODO 不检查url的合法性，因为可能用作其他用途
								$.getJSON(
									"?m=url&a=addurl",
									{ 'folder_id': folder_node.data.folder_id, 'name': name, 'url': url},
									function(msg){
										if(msg.code === 1){
											folder_node.data.urls.push([name, url]);
											app.showUrls(folder_node.data.urls);
											pop.hide();
										}else{
											pop.log('failure', '添加失败');
										}
									}
								);
				  			}
				  		},{
				  			'name': '取消',
				  			'classname': 'm-btn-gray',
				  			'handler': function(){
				  				pop.hide();
				  			}
				  		}]
	  	});
	  	pop.show();
	};
});