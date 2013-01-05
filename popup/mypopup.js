/**
 * 弹出层
 *
 * @author zhaochengyang
 * @date   2009-12-12
 */


	var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, Lang = YAHOO.lang;
	//window.onload = function(){
		//if(window.attachEvent)
			//Dom.get("showBut").attachEvent("onclick",function(){new pop()});
		//else
			//Dom.get("showBut").addEventListener("click",function(){new pop()},false);
	//}
	
	var popConfig = {
		quadrant : 1,//最小化后显示的象限
		hideMask : false,//是否有遮罩
		movable : true,//是否可移动
		border : true,//是否有边框
		head : true, //是否显示头部
		width : "200",
		type :　"normal",
		title : "",
		tools : "",
		content : "",
		buttons : []//默认无按钮
	};

	var popTemplate = '<div class="maskDiv"></div>' + 
						'<div class="contentDiv">' +
							'<div class="hd">' +
								'<span class="title"></span><span class="tools"></span>' +
							'</div>' +
							'<div class="tips"></div>' +
							'<div class="bd"></div>' +
							'<div class="ft"></div>' +
						'</div>';

	var popHeight;//定义弹出层原始高度 for restore
	var movable = true;//是否可移动：最小化状态下不可移动
	var animing = false;
	
	//定义弹出层状态 1：最大化 	0：最小化
	var popstatus = 1;

	var pop = function(config){
		if(Dom.get("popContainer")){
			alert("已存在实例");
			return;
		}
		this.config  = Lang.merge(popConfig, config || {});
		this.init();
	};

	pop.prototype = {
	
		/*
		*初始化
		*/
		init : function (){
			popstatus = 1;//防止多次打开时关闭后的状态不正确
			//容器层
			var popContainer = document.createElement("div");
			popContainer.id = "popContainer";
			document.body.appendChild(popContainer);
			popContainer.innerHTML = popTemplate;
			Dom.setStyle(popContainer,"opacity","0");
			var anim = new YAHOO.util.Anim(popContainer, {opacity: {to: 1}}, .3);
			anim.animate();
			
			this.applyConfig();
			
			//遮罩层
			if(!this.config.hideMask){
				var maskDiv = Dom.getElementsByClassName("maskDiv","div","popContainer");
				Dom.setStyle(maskDiv ,"opacity","0.3");
			}else{
				Dom.getElementsByClassName("maskDiv","div","popContainer")[0].style.display = "none";
			}
			
			//内容层
			var contentDiv= Dom.getElementsByClassName("contentDiv","div","popContainer");
			Dom.setStyle(contentDiv,"opacity","1");
			Dom.setStyle(contentDiv,"overflow","hidden");
			Dom.setStyle(contentDiv,"visibility","visible");
			Dom.setStyle(contentDiv,"top","30%");
			anim = new YAHOO.util.Anim(contentDiv[0], {height:{from:0,to:contentDiv[0].clientHeight}}, .3);
			anim.animate();
			Dom.setStyle(contentDiv,"display","block");
			
			// 绑定 ESC 键，@TODO Fix Webkit
			var existEvent = false;
			for(var i = 0;i<Event.getListeners(document).length;i++)
				if(Event.getListeners(document)[i].type == "keypress")
					existEvent = true;
			if(existEvent == false)
				Event.on(document, 'keypress', function(e) {
					if(!movable)
						return;
					if(!!animing)
						return;
					if (27 == Event.getCharCode(e))
						if(popstatus == 1)
							this.minimize();
						else
							this.remove();
				}, this, true);
			
			//todo:修复IE6 Bug
			if(YAHOO.env.ua.ie == 6){
				var de = document.documentElement;
				var popContainer = Dom.get("popContainer");
                Dom.setStyle(popContainer, 'position', 'absolute');
                Dom.setStyle(popContainer, 'z-index', '999999');
                Dom.setStyle(popContainer, 'top', '0px');
                var iframe = document.createElement('iframe');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('scrolling', 'no');
                    iframe.src = "about:blank";
                    iframe.style.cssText = 'filter:alpha(opacity=0); position:absolute; top: 0px; left: 0px; z-index: -1;';
                Dom.setStyle(iframe, 'width',  (de.clientWidth  || document.body.clientWidth) - 20 + 'px');
                Dom.setStyle(iframe, 'height', (de.clientHeight || document.body.clientHeight) + 'px');
                Dom.setStyle(popContainer, 'height', (de.clientHeight || document.body.clientHeight) + 'px');
                popContainer.appendChild(iframe);

                var innerMask = Dom.getElementsByClassName('maskDiv', 'div', popContainer)[0], resizeTimer;
                var resizePopup = function(e) {
                    var resize = function () {
                        if (innerMask) {
                            Dom.setStyle(innerMask, 'width', Dom.getViewportWidth() + 'px');
                            Dom.setStyle(innerMask, 'height', Dom.getViewportHeight() + 'px');
                        }

                        var offset = de.scrollTop || document.body.scrollTop;
                        var totalHeight = de.scrollHeight || document.body.scrollHeight;
                        if (offset + (de.clientHeight || document.body.clientHeight) > totalHeight) {
                            return;
                        }

                        Dom.setStyle(popContainer, 'top', offset + 'px');
                        Dom.setStyle(popContainer, 'zoom', '1.2');
                        Dom.setStyle(popContainer, 'zoom', '');
                    };

                    if (resizeTimer) {
                        resizeTimer.cancel();
                    }
                    resizeTimer = YAHOO.lang.later(10, null, resize, null, false);
                };

                Event.on(window, 'scroll', resizePopup, this, true);
                Event.on(window, 'resize', resizePopup, this, true);

                // 重修修订 IE6 下滚动条的问题
                resizePopup();
			}
			this.move();
			//this.addEvent();
		},

		/*
		*应用配置
		*/
		applyConfig : function(){
			Dom.get("popContainer").innerHTML = popTemplate;
			var config = this.config;
			movable = config.movable;
			if(!movable){
				Dom.setStyle(Dom.getElementsByClassName("hd","div","popContainer")[0],"cursor","auto");//修改鼠标样式
			}
			if(!config.border){
				Dom.setStyle(Dom.getElementsByClassName("contentDiv","div","popContainer")[0],"-moz-border-radius","0");
				Dom.setStyle(Dom.getElementsByClassName("contentDiv","div","popContainer")[0],"border","none");//修改边框样式
			}
			if(!config.head)
				Dom.setStyle(Dom.getElementsByClassName("hd","div","popContainer")[0],"display","none");//修改标题样式
			Dom.getElementsByClassName("contentDiv","div","popContainer")[0].style.width = config.width + "px";
			if(config.type == "special")
				Dom.addClass(Dom.getElementsByClassName("hd","div","popContainer"),"special");
			var title=document.createTextNode(config.title);
			Dom.getElementsByClassName("title","span","popContainer")[0].appendChild(title);
			
			var toolsContent = Dom.getElementsByClassName("tools","span","popContainer")[0];
			
			var tools = config.tools;
			//右上角的最小化、还原、关闭按钮
			for(var i = 0;i<tools.length;i++){
				if(tools[i] == "minimize"){
					var tool = document.createElement('span');
                    tool.innerHTML = '<button class="minimize sns-icon icon-stick-blog" title="最小化" href="#"></button>';
                    toolsContent.appendChild(tool);
				}else if(tools[i] == "restore"){
					tool = document.createElement('span');
                    tool.innerHTML = '<button class="restore sns-icon icon-unstick-blog" title="还原" href="#" style="display:none;"></button>';
                    toolsContent.appendChild(tool);
				}else if(tools[i] == "close"){
					tool = document.createElement('span');
                    tool.innerHTML = '<button class="close sns-icon icon-del" title="关闭" href="#"></button>';
                    toolsContent.appendChild(tool);
				}
			}
			
			//添加右上角按钮事件
			Event.on(Dom.getElementsByClassName("minimize","button","popContainer"), 'click', function(e) {
	                    Event.stopEvent(e);
	                    this.minimize();
	                }, this, true);
	        Event.on(Dom.getElementsByClassName("restore","button","popContainer"), 'click', function(e) {
	                     Event.stopEvent(e);
	                     this.restore();
	                }, this, true);
			Event.on(Dom.getElementsByClassName("close","button","popContainer"), 'click', function(e) {
	                     Event.stopEvent(e);
	                     this.remove();
	                }, this, true);
	                
			// 添加按钮
            var buttonContent = Dom.getElementsByClassName('ft', 'div', "popContainer")[0],
                i = 0, buttons = config.buttons, len = buttons.length;
            if (len) {
                for (; i < len; i++) {
                    var btn = document.createElement('span');
                    if(i == (len - 1))
						Dom.setAttribute(btn,"class","btn n-btn last-child");
					else
						Dom.setAttribute(btn,"class","btn n-btn");
                    btn.innerHTML = "<button>" + buttons[i].text + "</button>";
                    Event.on(btn, 'click', buttons[i].func, this, true); // 绑定对应的回调
                    buttonContent.appendChild(btn);
                }
            } else {
                Dom.setStyle(buttonContent, 'display', 'none');
            }
			
			Dom.getElementsByClassName("bd","div","popContainer")[0].innerHTML = config.content;
		},
		
		move: function(){
			var movefunc = function(e){
				if(!movable)
					return;
				
				var docmousemoveEvent = document.onmousemove;//移动前的鼠标事件
				var docmouseupEvent = document.onmouseup;
				var mouseX = mouseY = newmouseX = newmouseY = 0;
				var pop = Dom.getElementsByClassName("contentDiv","div","popContainer")[0];
				var popX = Dom.getX(pop);
				var popY = Dom.getY(pop);
				
				var e = window.event || e;
				mouseX = document.body.scrollLeft+e.clientX;
				mouseY = document.body.scrollTop+e.clientY;
				
				document.onmousemove = function(e){
					var e = window.event || e;
					newmouseX = document.body.scrollLeft+e.clientX;
					newmouseY = document.body.scrollTop+e.clientY;
					var xy = [popX + (newmouseX - mouseX),popY + (newmouseY - mouseY)];					
					if(newmouseX>0 && newmouseX<Dom.getViewportWidth() && newmouseY>0 && newmouseY<Dom.getViewportHeight())
						Dom.setXY(pop,xy);
				}
				document.onmouseup = function(){
					document.onmousemove = docmousemoveEvent;
					document.onmouseup = docmouseupEvent;
					//mouseX = mouseY = newmouseX = newmouseY = 0;//参数还原
					//popX = Dom.getX(pop);
					//popY = Dom.getY(pop);
				}
			}
			Event.addListener(Dom.getElementsByClassName("hd","div","popContainer")[0], "mousedown", movefunc);
		},
		/*
		*最小化
		*todo:定位象限
		*/
		minimize : function(){
			animing = true;
			setTimeout(function(){animing = false;},300);
			
			popHeight = Dom.getElementsByClassName("contentDiv","div","popContainer")[0].offsetHeight - 14;//获取弹出层原始高度 for restore
			
			movable = false;//锁定移动
			Dom.setStyle(Dom.getElementsByClassName("hd","div","popContainer")[0],"cursor","auto");//修改鼠标样式
			
			popstatus = 0;//设置状态
			
			//标题截取
			if(this.config.title.length>8)
				Dom.getElementsByClassName("title","span","popContainer")[0].innerHTML = this.config.title.substring(0,8) + "...";
			
			var popContainer = Dom.get("popContainer");
			//if(window.attachEvent)
				//minimizeHeight = 34;
			//Dom.setStyle(popContainer,"height","30px");
			//Dom.setStyle(popContainer,"width","220px");
			anim = new YAHOO.util.Anim(popContainer, {width: {to: 220},height:{to:30}}, .3);
			anim.animate();
			Dom.getElementsByClassName("contentDiv","div","popContainer")[0].style.left = 0;
			var maskDiv = Dom.getElementsByClassName("maskDiv","div","popContainer");
			Dom.setStyle(maskDiv,"opacity","0");
			var contentDiv = Dom.getElementsByClassName("contentDiv","div","popContainer");
			Dom.setStyle(contentDiv,"opacity","0");
			Dom.setStyle(contentDiv,"position","absolute");
			var minimizeHeight = 20;
			
			if(this.config.quadrant == 1){
				anim = new YAHOO.util.Anim(contentDiv[0], {height: {to: 20},width:{to:200},right:{to:0},top:{from:Dom.getY(contentDiv[0]),to:0},opacity:{to:1}}, .3);
				Dom.setStyle(contentDiv,"left","auto");
			}else if(this.config.quadrant == 2){
				anim = new YAHOO.util.Anim(contentDiv[0], {height: {to: 20},width:{to:200},left:{to:0},top:{from:Dom.getY(contentDiv[0]),to:0},opacity:{to:1}}, .3);
				Dom.setStyle(popContainer,"right","auto");
			}else if(this.config.quadrant == 3){
				anim = new YAHOO.util.Anim(contentDiv[0], {height: {to: 20},width:{to:200},left:{to:0},bottom:{from:Dom.getY(contentDiv[0]),to:0},opacity:{to:1}}, .3);
				Dom.setStyle(contentDiv,"top","auto");
				Dom.setStyle(popContainer,"right","auto");
				Dom.setStyle(popContainer,"bottom","0");
				Dom.setStyle(popContainer,"top","auto");
			}else if(this.config.quadrant == 4){
				Dom.setStyle(contentDiv,"left","auto");
				Dom.setStyle(contentDiv,"right",Dom.getDocumentWidth() - (Dom.getX(contentDiv[0]) + parseInt(Dom.getStyle(contentDiv[0],"width"))) + "px");
				anim = new YAHOO.util.Anim(contentDiv[0], {height: {to: 20},width:{to:200},right:{to:0},bottom:{from:Dom.getY(contentDiv[0]),to:0},opacity:{to:1}}, .3);
				Dom.setStyle(contentDiv,"top","auto");
				Dom.setStyle(popContainer,"bottom","0");
				Dom.setStyle(popContainer,"top","auto");
			}
			anim.animate();
			
			//隐藏最小化按钮
			Dom.getElementsByClassName("minimize","button","popContainer")[0].style.display = "none";
			
			//显示还原按钮
			Dom.getElementsByClassName("restore","button","popContainer")[0].style.display = "inline";
		},
		
		/*
		*还原
		*/
		restore : function(){
			animing = true;
			setTimeout(function(){animing = false;},300);
			
			movable = true;//释放移动锁定
			Dom.setStyle(Dom.getElementsByClassName("hd","div","popContainer")[0],"cursor","move");//修改鼠标样式
			popstatus = 1;//设置状态
			//标题还原
			Dom.getElementsByClassName("title","span","popContainer")[0].innerHTML = this.config.title;
			
			var contentDiv = Dom.getElementsByClassName("contentDiv","div","popContainer");
			Dom.setStyle(contentDiv,"opacity","0");
			
			var popContainer = Dom.get("popContainer");
			Dom.setStyle(popContainer,"height","100%");
			Dom.setStyle(popContainer,"top","0");
			var anim = new YAHOO.util.Anim(popContainer, {width:{to:Dom.getDocumentWidth()}}, .3);
			anim.animate();
			var maskDiv = Dom.getElementsByClassName("maskDiv","div","popContainer");
			anim = new YAHOO.util.Anim(maskDiv[0], {opacity: {to:0.3}}, .3);
			anim.animate();
			
			anim = new YAHOO.util.Anim(contentDiv[0], {height:{to:popHeight},width:{to:this.config.width},top:{to:Dom.getViewportHeight()*0.3},opacity:{from:0,to:1}}, .3);
			anim.animate();
			
			var contentDiv = Dom.getElementsByClassName("contentDiv","div","popContainer");
			Dom.setStyle(contentDiv,"position","relative");
			
			//显示最小化按钮
			Dom.getElementsByClassName("minimize","button","popContainer")[0].style.display = "inline";
			
			//隐藏还原按钮
			Dom.getElementsByClassName("restore","button","popContainer")[0].style.display = "none";
		},

		/*
		*关闭(节点移除)
		*/
		remove : function(){
			document.body.removeChild(Dom.get("popContainer"));
			Event.removeListener(document,"click");
			animing = false;
		},
		/*
		*添加点击关闭事件
		*/
		addEvent : function(){
			var parent = Dom.getElementsByClassName("contentDiv","div","popContainer")[0];
			//可以给document添加事件，利用target来实现隐藏判断
			Event.on(document,"click",function(e){
				var target = Event.getTarget(e);
				if(parent && !Dom.isAncestor(parent,target) && target != Dom.get("showBut")){
					document.body.removeChild(Dom.get("popContainer"));
					Event.removeListener(document,"click");
				}
			});
		}
	}