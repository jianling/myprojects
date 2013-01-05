/**
 *	 @module SimpleEditor
 * 	 @base YUI
 * 	 @author 1988zcy@gmail.com
 *	 @todo 获取内容样式,IE兼容性,组件功能完善
 */

var Y = YAHOO,D = Y.util.Dom,E = Y.util.Event;

SimpleEditor = function(container){
	this.container = "";
	this._toolpops = [];		//记录弹出层
	this.init(container);
}

SimpleEditor.prototype = {
	/**
	*	@param {HTMLElement/String} container 编辑器容器对象
	*/
	init : function(container){
		this.container = container;
		if(typeof container == "string")
			this.container = D.get(container);
		this.initView();
		E.on([document.body,editor_body_area],"click",function(e){
			for(var i = 0;i<this._toolpops.length;i++){
				if(D.getStyle(this._toolpops[i],"display") == "block")
					var currentpop = this._toolpops[i];
			}
			if(!D.isAncestor(currentpop,E.getTarget(e)) && !(E.getTarget(e) == currentpop)){
				D.setStyle(currentpop,"display","none");
			}
		},this,true);
	},
	
	initView:function(container){
		var editContainer = this.container;
		var tools = [
			{name:"fontname",title:"字体"},
			{name:"fontsize",title:"字号"},
			{name:"redo",title:"重做"},
			{name:"undo",title:"撤销"},
			{name:"bold",title:"粗体"},
			{name:"italic",title:"斜体"},
			{name:"underline",title:"下划线"},
			{name:"forecolor",title:"字体颜色"},
			{name:"backgroundcolor",title:"背景色"},
			{name:"link",title:"链接"},
			{name:"pic",title:"图片"},
			{name:"face",title:"表情"},
			{name:"insertorderedlist",title:"有序列表"},
			{name:"insertunorderedlist",title:"无序列表"},
			{name:"indent",title:"增加缩进"},
			{name:"outdent",title:"减少缩进"},
			{name:"justifyleft",title:"左对齐"},
			{name:"justifycenter",title:"居中对齐"},
			{name:"justifyright",title:"右对齐"}
		];
		var bar = '<div class="bar">';
		for(var i = 0;i<tools.length;i++){
			if(tools[i].name == "fontname" || tools[i].name == "fontsize"){
				bar = bar + '<div class="edit-bar-outerbox bar-select"><div class="edit-bar-innerbox"><span class="edit-bar-item-' + tools[i].name + ' bar-button" title="' + tools[i].title + '">' + tools[i].title +'</span></div></div>';
			}else{
				bar = bar + '<div class="edit-bar-outerbox"><div class="edit-bar-innerbox"><span class="edit-bar-item-' + tools[i].name + ' bar-button" title="' + tools[i].title + '"></span></div></div>';
			}
		}

		bar += '<i></i></div>';
		editContainer.innerHTML = bar + '<textarea></textarea><iframe id="editor_body_area" name="editor_body_area" frameborder="0"></iframe>' + 
			'<div class="editor_foot"><span class="editor_source"><input type="checkbox" class="editor_source_check"/><span>查看源代码</span></span><span><span class="editor_preview">内容预览</span><span class="editor_clear">清空内容</span></span><i title="改变大小"></i></div>';
		
		var _iframeHTML = '<html><head></head><body></body></html>',
			_iframe = D.get("editor_body_area"),
			_ifrdoc = _iframe.contentWindow.document;
		_ifrdoc.open();
		_ifrdoc.write(_iframeHTML);
		_ifrdoc.close();
		_ifrdoc.designMode="on"; 
		
		this.addaction(tools);
		bar = D.getElementsByClassName("bar","div",this.container)[0];
		this._setItemUnselectable(bar);
		this.changeStyle();
	},
	
	addaction : function(tools){
		for(var i = 0;i<tools.length;i++){
			if(tools[i].name == "fontname"){
				this.fontnameAction();
			}else if(tools[i].name == "fontsize"){
				this.fontsizeAction();
			}else if(tools[i].name == "forecolor"){
				this.forecolorAction();
			}else if(tools[i].name == "backgroundcolor"){
				this.backgroundcolorAction();
			}else if(tools[i].name == "link"){
				this.linkAction();
			}else if(tools[i].name == "pic"){
				this.picAction();
			}else if(tools[i].name == "face"){
				this.faceAction();
			}else{
				var _ref = D.getElementsByClassName('edit-bar-item-' + tools[i].name,"span",this.container)[0];
				E.on(_ref,"click",function(){
					this.edit.runCMD(this.actiontype);
				},{edit:this,actiontype:tools[i].name},true);
			}
		}
		//查看源代码
		var source_but = D.getElementsByClassName("editor_source_check","input",this.container)[0],
			textarea = this.container.getElementsByTagName("textarea")[0],
			bar = D.getElementsByClassName("bar","div",this.container)[0],
			mask = bar.getElementsByTagName("i")[0],
			editor_preview = D.getElementsByClassName("editor_preview","span",this.container)[0],
			editor_clear = D.getElementsByClassName("editor_clear","span",this.container)[0],
			resize_but = D.getElementsByClassName("editor_foot","div",this.container)[0].getElementsByTagName("i")[0],
			iframe = D.get("editor_body_area");
		E.on(source_but,"click",function(){
			D.setStyle(mask,"opacity","0.6");
			if(source_but.checked == true){
				D.setStyle(mask,"display","block");
				textarea.value = iframe.contentDocument.body.innerHTML;
				D.setStyle(textarea,"height",D.getStyle("editor_body_area","height"));
				D.setStyle(iframe,"display","none");
				D.setStyle(textarea,"display","block");
			}else{
				iframe.contentDocument.body.innerHTML = textarea.value;
				D.setStyle(mask,"display","none");
				D.setStyle(iframe,"display","block");
				D.setStyle(textarea,"display","none");
			}
		},this,true);
		//文章预览
		E.on(editor_preview,"click",function(){
			var previewWin = window.open('','newwindow','height=600,width=700,menubar=no,scrollbars=yes, resizable=yes,location=no, status=no');
			previewWin.document.write(iframe.contentDocument.body.innerHTML);
		},this,true);
		
		//清空内容
		E.on(editor_clear,"click",function(){
			iframe.contentDocument.body.innerHTML = "";
		},this,true);
		
		var movefunc = function(e){//拖动改变编辑器高度	TODO还是有问题
			var docmousemoveEvent = document.onmousemove;//移动前的鼠标事件
			var docmouseupEvent = document.onmouseup;
			var mouseX = newmouseX = 0;
			var edit_height = D.getStyle("editor_body_area","height");
			
			var e = window.event || e;
			mouseY = document.body.scrollTop+e.clientY;
			
			document.onmousemove = function(e){
				var e = window.event || e;
				newmouseY = document.body.scrollTop+e.clientY;
				
				var new_height = parseInt(edit_height) + (newmouseY - mouseY) + "px";
				if(newmouseY>0 && newmouseY<D.getViewportHeight()){
					var currentHeight = parseInt(D.getStyle("editor_body_area","height"));
					if(currentHeight >= 300 && currentHeight <= 1000)
						D.setStyle("editor_body_area","height",new_height);
				}
			}
			document.onmouseup = function(){
				var currentHeight = parseInt(D.getStyle("editor_body_area","height"));
				if(currentHeight < 300)
					D.setStyle("editor_body_area","height","300px");
				document.onmousemove = docmousemoveEvent;
				document.onmouseup = docmouseupEvent;
			}
		};
		E.on(resize_but,"mousedown",function(e){
			movefunc(e);
		},this,true);
	},
	
	/**
	*	设置字体
	*/
	fontnameAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-fontname',"span",this.container),
			_fontNames = ["宋体","黑体","楷体"];
		
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("fontnamePop",e);
			if(!showpop){
				var fontnamePop = document.createElement("div");
				fontnamePop.className = "fontnamePop editpop";
				for(var i = 0;i<_fontNames.length;i++){
					fontnamePop.innerHTML = fontnamePop.innerHTML + '<li data-value = "' + _fontNames[i] + '"><span style="font-family:\'' + _fontNames[i] + '\'">' + _fontNames[i] + '</span></li>';
				}
				fontnamePop.innerHTML = "<ul>" + fontnamePop.innerHTML + "</ul>";
				document.body.appendChild(fontnamePop);
				this._setItemUnselectable(fontnamePop);
				
				this._toolpops.push(fontnamePop);	//添加到弹出层数组
				
				this._setpopXY(fontnamePop,_ref,e);
				
				var _names = D.getElementsByClassName("fontnamePop","div")[0].getElementsByTagName("li");
				
				E.on(_names,"click",function(e){
					var currentFontName = "";
					if(E.getTarget(e).tagName.toUpperCase() == "SPAN")
						currentFontName = E.getTarget(e).innerHTML;
					else if(E.getTarget(e).tagName.toUpperCase() == "LI")
						currentFontName = E.getTarget(e).getAttribute("data-value");
					this.runCMD("fontname","",currentFontName);
					_ref[0].innerHTML = currentFontName;
					D.setStyle(fontnamePop,"display","none");
				},this,true);
				
				E.on(_names,"mouseover",function(e){
					this.className += " hover";
				});
				
				E.on(_names,"mouseout",function(e){
					this.className  = this.className.replace(/( hover)/g,"");
				});
			}//if...else
		},this,true);
	},
	
	/**
	*	设置字号
	*/
	fontsizeAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-fontsize',"span",this.container);
		var _fontSizes = ["8-1","10-2","12-3","14-4","18-5","24-6","36-7"];
		
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("fontsizePop",e);
			if(!showpop){
				var fontsizePop = document.createElement("div");
				fontsizePop.className = "fontsizePop editpop";
				for(var i = 0;i<_fontSizes.length;i++){
					fontsizePop.innerHTML = fontsizePop.innerHTML + '<li data-value = "' + _fontSizes[i] + '"><span style="font-size:' + _fontSizes[i].split("-")[0] + 'px;">' + _fontSizes[i].split("-")[0] + '</span></li>';
				}
				fontsizePop.innerHTML = "<ul>" + fontsizePop.innerHTML + "</ul>";
				document.body.appendChild(fontsizePop);
				this._setItemUnselectable(fontsizePop);
				
				this._toolpops.push(fontsizePop);	//添加到弹出层数组
				
				this._setpopXY(fontsizePop,_ref,e);
				
				var _names = D.getElementsByClassName("fontsizePop","div")[0].getElementsByTagName("li");
				
				E.on(_names,"click",function(e){
					var currentFontSize = "";
					if(E.getTarget(e).tagName.toUpperCase() == "SPAN")
						currentFontSize = E.getTarget(e).parentNode.getAttribute("data-value");
					else if(E.getTarget(e).tagName.toUpperCase() == "LI")
						currentFontSize = E.getTarget(e).getAttribute("data-value");
					this.runCMD("fontsize","",currentFontSize.split("-")[1]);
					_ref[0].innerHTML = currentFontSize.split("-")[0];
					D.setStyle(fontsizePop,"display","none");
				},this,true);
				
				E.on(_names,"mouseover",function(e){
					this.className += " hover";
				});
				
				E.on(_names,"mouseout",function(e){
					this.className  = this.className.replace(/( hover)/g,"");
				});
			}//if...else
		},this,true);
	},
	
	/**
	*	设置文字颜色
	*/
	forecolorAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-forecolor',"span",this.container);
		var _color = ["#FF0000","#FF9900","#FFFF00","#00FF00","#00FFFF","#0000FF","#9900FF","#FF00FF"];
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("forecolorPop",e);
			if(!showpop){
				var forecolorPop = document.createElement("div");
				forecolorPop.className = "forecolorPop editpop";
				for(var i = 0;i<_color.length;i++)
					forecolorPop.innerHTML += '<div class="edit-colorswatch" style="background-color:' + _color[i] + ';"></div>';
				document.body.appendChild(forecolorPop);
				this._setItemUnselectable(forecolorPop);
				
				E.on(forecolorPop,"click",function(e){
					var target = E.getTarget(e);
					if(target.className == "edit-colorswatch"){
						this.runCMD("forecolor","",target.style.backgroundColor);
						D.setStyle(forecolorPop,"display","none");
					}
				},this,true);
				
				this._toolpops.push(forecolorPop);	//添加到弹出层数组
				
				this._setpopXY(forecolorPop,_ref,e);
			}//if...else
		},this,true);
	},
	
	/**
	*	设置文字背景色
	*	@option	Mozilla和Safari设置颜色时需要#
	*	@option	Mozilla和Opera在使用bgcolor设置颜色时其实是给选区的块级父元素设置背景色，IE和Safari是给选区本身设置背景色，
	*	@option	Mozilla和Opera中使用hilitecolor可达到与IE相同的效果
	*/
	backgroundcolorAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-backgroundcolor',"span",this.container);
		var _color = ["#FF0000","#FF9900","#FFFF00","#00FF00","#00FFFF","#0000FF","#9900FF","#FF00FF"];
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("bgcolorPop",e);
			if(!showpop){
				var bgcolorPop = document.createElement("div");
				bgcolorPop.className = "bgcolorPop editpop";
				for(var i = 0;i<_color.length;i++)
					bgcolorPop.innerHTML += '<div class="edit-colorswatch" style="background-color:' + _color[i] + ';"></div>';
				document.body.appendChild(bgcolorPop);
				this._setItemUnselectable(bgcolorPop);
				
				E.on(bgcolorPop,"click",function(e){
					var target = E.getTarget(e);
					if(target.className == "edit-colorswatch"){
						var bgcolor = target.style.backgroundColor;
						var ifr = D.get("editor_body_area");
						var ifrdoc = ifr.contentWindow.document || ifr.contentDocument;
						//区别浏览器
						if(YAHOO.env.ua.gecko || YAHOO.env.ua.opera){
							this.runCMD("hilitecolor","",target.style.backgroundColor);
						}else{
							this.runCMD("backcolor","",target.style.backgroundColor);
						}
						
						D.setStyle(bgcolorPop,"display","none");
					}
				},this,true);
				
				this._toolpops.push(bgcolorPop);	//添加到弹出层数组
				
				this._setpopXY(bgcolorPop,_ref,e);
			}//if...else
		},this,true);
	},
	
	/**
	*	设置链接
	*/
	linkAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-link',"span",this.container);
		
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("linkPop",e);
			if(!showpop){
				var linkPop = document.createElement("div");
				linkPop.className = "linkPop editpop";
				linkPop.innerHTML = '<p><label>链接地址</label><input type="text" value="http://"  class="addlink_input" /></p><p><button class="addlink_but">确定</button></p>';
				document.body.appendChild(linkPop);
				this._setItemUnselectable(linkPop);
				
				this._toolpops.push(linkPop);	//添加到弹出层数组
				
				this._setpopXY(linkPop,_ref,e);
				
				var _linkinput = D.getElementsByClassName("addlink_input","input",linkPop)[0];
				var _linkbut = D.getElementsByClassName("addlink_but","button",linkPop)[0];
				
				E.on(_linkbut,"click",function(){
					var ifr = D.get("editor_body_area");
						ifrdoc = ifr.contentWindow.document || ifr.contentDocument;
					if(document.selection && ifrdoc.selection.createRange().execCommand){//TODO ie问题 待解决
//						var oRange = ifrdoc.selection.createRange();
//						var text = oRange.text;
//						var newLink = '<a href="' + _linkinput.value + '">' + (text == "") ? _linkinput.value : text + '</a>';
//						oRange.pasteHTML(newLink);
						this.runCMD("createlink","",_linkinput.value);
					}else if(document.getSelection){		//other browsers
						var oRange = ifr.contentWindow.getSelection();
						var text = oRange.getRangeAt(0);
						var linkEle = ifrdoc.createElement("a");
						linkEle.href = _linkinput.value;
						text.surroundContents(linkEle);
						if(text == "")
							linkEle.innerHTML = _linkinput.value;
					}

					_linkinput.value = "http://";
					D.setStyle(linkPop,"display","none");
				},this,true);
			}//if...else

		},this,true);
	},
	
	/**
	*	设置图片
	*	TODO 解决选区的问题
	*/
	picAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-pic',"span",this.container);
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("picPop",e);
			if(!showpop){
				var picPop = document.createElement("div");
				picPop.className = "picPop editpop";
				picPop.innerHTML = '<p><label>图片地址</label><input type="text" value="http://"  class="addpic_input" /></p><p><button class="addpic_but">确定</button></p>';
				document.body.appendChild(picPop);
				this._setItemUnselectable(picPop);
				
				this._toolpops.push(picPop);	//添加到弹出层数组
				
				this._setpopXY(picPop,_ref,e);
				
				var _picinput = D.getElementsByClassName("addpic_input","input",picPop)[0];
				var _picbut = D.getElementsByClassName("addpic_but","button",picPop)[0];
				
				E.on(_picbut,"click",function(){
					this.runCMD("insertimage","",_picinput.value);
					_picinput.value = "";
					D.setStyle(picPop,"display","none");
				},this,true);
			}//if...else
		},this,true);
	},
	
	/**
	*	设置表情
	*/
	faceAction : function(){
		var _ref = D.getElementsByClassName('edit-bar-item-face',"span",this.container);
		var _facePath = "./sysface/";	//表情图片存放路径,实际项目中使用PHP构建完整路径
		E.on(_ref,"click",function(e){
			var showpop = this._popexist("facePop",e);
			if(!showpop){
				var facePop = document.createElement("div");
				facePop.className = "facePop editpop";
				for(var i = 1;i<63;i++){
					if(i<10){
						facename = 'b0' + i;
					}else{
						facename = 'b' + i;
					}
					facePop.innerHTML += '<a href=""><img src="' + _facePath + facename + '_s.gif" /></a>';
				}
				document.body.appendChild(facePop);
				this._setItemUnselectable(facePop);
				
				var showfacepop = document.createElement("div");
				showfacepop.className = "showfacepop editpop";
				document.body.appendChild(showfacepop);
				E.on(facePop,"mouseover",function(e){	//鼠标悬停时显示大图	@TODO：可视区域的判断
					var target = E.getTarget(e);
					if(target.nodeName.toUpperCase() == "IMG"){
						showfacepop.innerHTML = '<img src="' + target.src.replace(/(_s.gif)/g,".gif") + '" />';
						D.setStyle(showfacepop,"display","block");
						this._setpopXY(showfacepop,target,e);
					}
				},this,true);
				E.on(facePop,"mouseout",function(e){
					D.setStyle(showfacepop,"display","none");
				},this,true);
				
				E.on(facePop,"click",function(e){
					var target = E.getTarget(e);
					E.preventDefault(e);
					if(target.nodeName.toUpperCase() == "IMG"){
						var face = target.src.replace(/(_s.gif)/g,".gif");
						this.runCMD("insertimage","",face);
						D.setStyle(facePop,"display","none");
					}
				},this,true);
				
				this._toolpops.push(facePop);	//添加到弹出层数组
				
				this._setpopXY(facePop,_ref,e);
			}//if...else
		},this,true);
	},
	
	/**
	*	@action 执行设置命令
	*	@param {String} type 要执行的命令
	*	@param {Boolean} ui 是否显示用户界面，默认不显示
	*	@param {String} value 要执行的命令参数
	*/
	runCMD : function (type,ui,value){
		var _type = type;
		if(type == "" || type == null)
			return;
		_value = value || null;
		var _ifrdoc = D.get("editor_body_area").contentWindow.document;
		_ifrdoc.execCommand(_type,false,_value);
	},
	
	/**
	*	改变工具栏图表的鼠标状态
	*/
	changeStyle : function(){
		var toolbox = D.getElementsByClassName('edit-bar-outerbox',"div",this.container);
		E.on(toolbox,"mouseover",function(){
				this.className += " hover";
		});
		E.on(toolbox,"mouseout",function(){
				this.className = this.className.replace(/( hover)|( select)/g,"");
		});
		E.on(toolbox,"mousedown",function(){
			if(this.className.indexOf("select")<0)
				this.className += " select";
		});
	},
	
	/**
	*	@action 遍历弹出层数组，判断弹出层是否已存在
	*	@param {String} popnane 弹出层的唯一classname
	*	@param {Object} e 事件对象
	*/
	_popexist : function(popname,e){
		D.setStyle(this._toolpops,"display","none");	//关闭所有弹出层
		for(var i = 0;i<this._toolpops.length;i++){
			if(this._toolpops[i].className.indexOf(popname) >= 0){
				D.setStyle(this._toolpops[i],"display","block");
				E.stopPropagation(e);	//停止事件的传播，防止被设置在document.body上的事件监听捕获到
				return this._toolpops[i];
			}
		}
		return false;
	},
	
	/**
	*	@action 设置弹出层坐标
	*	@param {HTMLElement} popnane 弹出层对象
	*	@param {(Array of HTMLElement)/HTMLElement} tar 当前点击的按钮，作为弹出层的停靠目标
	*	@param {Object} e 事件对象
	*/
	_setpopXY : function(popname,tar,e){
		if(Object.prototype.toString.apply(tar).indexOf("Array") >= 0){
			var _parent = tar[0];
		}else{
			var _parent = tar;
		}
		var _xy = D.getXY(_parent);
		_xy[1] += 20;
		D.setXY(popname,_xy);
		E.stopPropagation(e);	//停止事件的传播，防止被设置在document.body上的事件监听捕获到
	},

	 /**
      * @action 设置按钮不可选，修复ie下选区丢失的问题
      */
	_setItemUnselectable : function(parent) {
		if(!YAHOO.env.ua.ie)
			return;
		var childs = parent.getElementsByTagName("*");
		for(var i = 0;i<childs.length;i++){
			if(childs[i].nodeName.toUpperCase() != "INPUT")
				D.setAttribute(childs[i],"unselectable","on");
		}
	}
}