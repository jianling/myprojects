/*
 Qzone Project By Qzone Web Group. 
 Copyright 1998 - 2008
*/

QZFL.editor=
{
  plugins:[],items:
  {
  }
  ,count:0,_cssLoaded:false,_dialog:null,create:function(container,options)
  {
    var _qe=new QZFL.editor.Core(container,options);
    if(!_qe.init())
    {
      _qe=null;
      return null;
    }
    this.items[_qe.uniqueID]=_qe;
    try
    {
      document.execCommand('BackgroundImageCache',false,true);
    }
    catch(e)
    {
    };
    return _qe;
  }
  ,get:function(uniqueID)
  {
    return this.items[uniqueID];
  }
  ,getDialog:function()
  {
    return this._dialog;
  }
  ,closeDialog:function()
  {
    if(!QZONE.FP)
    {
      this._dialog.unload();
    }
    else
    {
      QZONE.FP.closePopup();
    }
  }
  ,getEditorByDialog:function()
  {
    return this._dialogOpenedId?this.get(this._dialogOpenedId):null;
  }
  ,openDialog:function(uniqueID,title,url,width,height)
  {
    if(!uniqueID)
    {
      throw new Error("no Editor Call dialog.");
      return;
    }
    var _fp=QZONE.FP,_url=/^http:\/\//.test(url)?url:QZFL.editor.config.editorPath+url,_html='<iframe frameborder="no" id="popup_dialog_frame" src="'+_url+'" width="100%" height="'+height+'" style="background:no-repeat url('+QZFL.editor.config.editorPath+'/assets/images/loading.gif) center center">';var _f=QZFL.event.bind(this,function(){if(!_fp){QZFL.maskLayout.remove(this._maskId);}else{_fp._t._dialogFrame=null;}
    this._dialog=null;
    var _e=this.get(uniqueID).getCurrentEditor();
    _e.focus();
    this._dialogOpenedId=null;
  }
  );
  if(!_fp)
  {
    this._dialog=QZFL.dialog.create(title,_html,width,height);
    var _z=this._dialog.getZIndex();
    this._maskId=QZFL.maskLayout.create(_z-1);
    this._dialog.onUnload=_f;
  }
  else
  {
    _fp.popupDialog(title,
    {
      src:_url
    }
    ,width,height,false);
    this._dialog=_fp.popupDialog._cpp;
    _fp._t._dialogFrame=window;
    QZONE.FP.appendPopupFn(_f);
  }
  this._dialogOpenedId=uniqueID;
  return this._dialog;
}
}
QZFL.editor.Core=function(container,options)
{
this._container=QZFL.dom.get(container);
this._element=null;
this._dom_container=null;
this._dom_tips=null;
this._dom_area=null;
this._dom_status=null;
this._dom_resize=null;
this._dom_toolbar=null;
this._dom_tips=null;
this._panelId=0;
this._toolbars=
{
};
this._toolbarFragment=null;
this._currentToolbar="";
this.uniqueID="";
this.isFullScreen=false;
this._pt=options||
{
};
this._pt.width=this._pt.width||QZFL.editor.config.editorOptions.width;
this._pt.height=this._pt.height||QZFL.editor.config.editorOptions.height;
this._pt.editorList=this._pt.editorList||QZFL.editor.config.editorOptions.editorList;
this._pt.toolbarList=this._pt.toolbarList||QZFL.editor.config.editorOptions.toolbarList;
this._pt.resizable=this._pt.resizable||QZFL.editor.config.editorOptions.resizable;
this.onload=QZFL.emptyFn;
this.onEditorSwitch=QZFL.emptyFn;
this.onToolbarSwitch=QZFL.emptyFn;
this.onKeyPress=QZFL.emptyFn;
this.onContentsReplace=QZFL.emptyFn;
this.onEditorReady=QZFL.emptyFn;
}
QZFL.editor.Core.prototype.callEvent=function(type,args)
{
setTimeout((function(o)
{
return function()
{
  if(o[type])
  {
    o._responseEvent.apply(o,[type,args]);
    o[type].apply(o,args||[]);
  }
}
}
)(this),0)
}
QZFL.editor.Core.prototype._responseEvent=function(type,args)
{
if(type=="onEditorReady")
{
var o=this;
if(o.getPanel()&&o.getPanel().currentEditorId==args[0])
{
  o.initToolbar();
}
var _e=QZFL.editor.editPanel.getEditorConstructor(args);
if(_e)
{
  _e.initPlugins.apply(_e,[o.uniqueID,args]);
}
o=null;
}
}
QZFL.editor.Core.prototype._initTheme=function()
{
if(!QZFL.editor._cssLoaded)
{
QZFL.css.insertCSSLink(QZFL.editor.config.editorCSS);
}
QZFL.editor._cssLoaded=true;
}
QZFL.editor.Core.prototype.initToolbar=function()
{
if(this._toolbar_inited)
{
return;
}
QZFL.console.print("initialize toolbars.");
this._dom_toolbar.innerHTML="";
this._toolbar_inited=true;
for(var k in this._pt.toolbarList)
{
var _n=this._pt.toolbarList[k];
this._toolbars[_n]=QZFL.editor.toolbar.create(_n,this.uniqueID);
this._dom_toolbar.appendChild(this._toolbars[_n].getRoot());
}
this.switchToolbar(this._pt.toolbarList[0]);
}
QZFL.editor.Core.prototype.switchToolbar=function(layoutName)
{
if(this._currentToolbar==layoutName)
{
return;
}
if(this._currentToolbar)
{
this._toolbars[this._currentToolbar].getRoot().style.display="none";
}
this._currentToolbar=layoutName;
this._toolbars[this._currentToolbar].getRoot().style.display="";
this.onToolbarSwitch.call(this);
}
QZFL.editor.Core.prototype.getCurrentToolbar=function()
{
return this._toolbars[this._currentToolbar];
}
QZFL.editor.Core.prototype.resizeArea=function()
{
this.getCurrentEditor().getInstance().style.height=this._dom_area.style.height;
if(this.isFullScreen)
{
var _clientHeight=QZFL.dom.getClientHeight();
this._dom_area.style.height=(_clientHeight-QZFL.dom.getSize(this._dom_toolbar)[1]-QZFL.dom.getSize(this._dom_resize)[1])+"px";
}
this.getCurrentEditor().getInstance().style.height=this._dom_area.style.height;
}
QZFL.editor.Core.prototype.switchEditor=function(id)
{
QZFL.console.print("switch editor Panel.");
var _ce=this.getCurrentEditor();
var _content="",_type="";
var _isInited=false;
if(_ce)
{
_content=_ce.getContents();
_type=this.getPanel().currentEditorId;
_isInited=true;
};
QZFL.editor.editPanel.switchEditor(this._panelId,id);
_ce=this.getCurrentEditor();
if(_content&&_ce)
{
setTimeout(function()
{
  _ce.contents.conver(_content,_type);
}
,0)
}
QZFL.editor.parser.enable();
this.resizeArea();
if(_isInited)
{
this.onEditorSwitch.call(this,id);
}
}
QZFL.editor.Core.prototype.getToolbarList=function()
{
return this._toolbars;
}
QZFL.editor.Core.prototype.getPanel=function()
{
return QZFL.editor.editPanel.get(this._panelId);
}
QZFL.editor.Core.prototype.getEditor=function(id)
{
return QZFL.editor.editPanel.get(this._panelId)[id];
}
QZFL.editor.Core.prototype.getCurrentEditor=function()
{
var _panel=this.getPanel(this._panelId);
return _panel[_panel.currentEditorId];
}
QZFL.editor.Core.prototype.execCommand=function(cName,cParam,noHistory)
{
var _editor=this.getCurrentEditor();
if(_editor.execCommand)
{
_editor.execCommand(cName,cParam,noHistory);
}
}
QZFL.editor.Core.prototype.init=function()
{
QZFL.console.print("initialize qzEditor 2.1.0");
try
{
document.execCommand("BackgroundImageCache",false,true);
}
catch(e)
{
}
if(!this._container)
{
QZFL.console.print("qzEditor initialize error.",1);
return false;
}
QZFL.editor.count++;
this.uniqueID="qzEditor_"+QZFL.editor.count;
return true;
}
QZFL.editor.Core.prototype.build=function()
{
this._element=QZFL.dom.createElementIn("div",this._container,false,
{
id:this.uniqueID
}
);
this._initTheme();
this._element.innerHTML=['<div id="'+this.uniqueID+'_container" class="editor_box" style="width:'+this._pt.width+';position:relative;">','<div id="'+this.uniqueID+'_toolbar"><div class="editor_tools" style="height:16px">正在初始化工具条...</div></div>','<div id="'+this.uniqueID+'_tips" class="editor_hint" style="display:none"></div>','<div id="'+this.uniqueID+'_area" class="editor_areas" style="height:'+this._pt.height+';"></div>',(this._pt.resizable?'<div id="'+this.uniqueID+'_status" class="ex_editor"><button id="'+this.uniqueID+'_resizebar" type="button" class="btn_resize hover"><span>拉伸QZFL.</span></button></div>':''),'</div>'].join("");
this._dom_container=QZFL.dom.get(this.uniqueID+"_container");
this._dom_toolbar=QZFL.dom.get(this.uniqueID+"_toolbar");
this._dom_tips=QZFL.dom.get(this.uniqueID+"_tips");
this._dom_area=QZFL.dom.get(this.uniqueID+"_area");
this._dom_status=QZFL.dom.get(this.uniqueID+"_status");
this._dom_resize=QZFL.dom.get(this.uniqueID+"_resizebar");
QZFL.console.print("initialize editor Panel.");
this._panelId=QZFL.editor.editPanel.create(this._pt.editorList,this.uniqueID);
this.switchEditor(this._pt.editorList[0]);
this._initResizeBar();
this.onload.call(this);
}
QZFL.editor.Core.prototype._initResizeBar=function()
{
if(!this._pt.resizable)
{
return;
}
var _dd=QZFL.dragdrop.registerDragdropHandler(this._dom_resize,null,
{
ghost:true,rangeElement:[this._dom_area,[false,true,false,true],true],ghostStyle:"cursor:row-resize;position:absolute;background:#ccc;z-index:1000;overflow:hidden"
}
)
var o=this;
_dd.onStartDrag=function()
{
o._maskDiv=document.createElement("div");
o._maskDiv.style.cssText="background-color: #fff; position: absolute; width: 100%; left: 0; top: 0px; height:"+o._dom_area.style.height;
QZFL.dom.setStyle(o._maskDiv,"opacity",0.1);
o._dom_area.appendChild(o._maskDiv);
}
_dd.onEndDrag=function(e,handlerId,dragCache,options)
{
var _re=dragCache.mXY[1]-dragCache.xy[1];
var _size=QZFL.dom.getSize(o._dom_area);
var _h=Math.max(60,_size[1]+_re);
o._dom_area.style.height=_h+"px";
o.resizeArea();
QZFL.dom.removeElement(o._maskDiv);
o._maskDiv=null;
}
this._dom_resize.style.cursor="row-resize"
}
QZFL.editor.Core.prototype.showTips=function(html,options)
{
options=options||
{
};
this._dom_tips.style.display="";
this._dom_tips.innerHTML='<div id="'+this.uniqueID+'_tips_close" class="bt_hint_close" title="关闭">X</div><div class="editor_hint_cont">'+html+'</div>';
this._dom_tips.style.height="auto";
if(!this._tipsOpened)
{
var _size=QZFL.dom.getSize(this._dom_tips);
var _t=new QZFL.Tween(this._dom_tips,"height",QZFL.transitions.regularEaseInOut,"0px",(Math.max(28,_size[1])+"px"),0.3);
_t.start();
}
this._tipsOpened=true;
QZFL.event.addEvent($(this.uniqueID+'_tips_close'),"click",QZFL.event.bind(this,this.hideTips));
if(options.timeout)
{
var o=this;
setTimeout(function()
{
  o.hideTips();
  o=null;
}
,options.timeout);
}
}
QZFL.editor.Core.prototype.hideTips=function()
{
var _t=new QZFL.Tween(this._dom_tips,"height",QZFL.transitions.regularEaseInOut,"28px","0px",0.3);
var o=this;
_t.onMotionStop=function()
{
o._dom_tips.style.display="none";
o._tipsOpened=false;
o=null;
}
_t.start();
}
QZFL.editor.Core.prototype.switchFullScreen=function()
{
if(this.isFullScreen)
{
this._dom_container.style.cssText='width:'+this._pt.width+';position:relative;';
this._dom_area.style.height=this._last_Height;
document.documentElement.style.overflow=this._last_overflow;
QZFL.dom.removeElement(this._dom_ghost);
this._dom_ghost=null;
if(QZFL.userAgent.ie<7)
{
  this._container.appendChild(this._element);
}
}
else
{
this._dom_ghost=document.createElement("div");
this._dom_ghost.style.height=QZFL.dom.getSize(this._dom_container)[1]+"px";
this._element.appendChild(this._dom_ghost);
var _t=(QZFL.userAgent.ie<7?QZFL.dom.getScrollTop():"0")+"px";
var _p=QZFL.userAgent.ie<7?"absolute":"fixed";
this._dom_container.style.cssText='margin:0;z-index:1000;left:0;width:100%;top:'+_t+';position:'+_p+';';
this._last_Height=this._dom_area.style.height;
this._last_overflow=document.documentElement.style.overflow;
document.documentElement.style.overflow="hidden";
if(QZFL.userAgent.ie<7)
{
  document.body.appendChild(this._element);
}
}
this.isFullScreen=!this.isFullScreen;
this.resizeArea();
return this.isFullScreen;
}
QZFL.editor.editPanel=
{
_editor:
{
}
,_panels:
{
}
,_length:0,addEditor:function(id,editor)
{
QZFL.console.print("new ["+id+"] editor plugins added.",1)
this._editor[id]=new Function();
this._editor[id].prototype=new editor;
this._editor[id].plugins=[];
this._editor[id].addPluginCallback=function(callName)
{
  this.plugins.push(callName);
}
this._editor[id].initPlugins=function(uniqueID,editorID)
{
  var _e=QZFL.editor.get(uniqueID);
  var _editor=_e.getEditor(editorID);
  if(!_editor)
  {
    return
  }
  for(var i=0;i<this.plugins.length;i++)
  {
    try
    {
      _editor[this.plugins[i]].call(_editor);
      QZFL.console.print("editor ["+editorID+"]"+" initialize ["+this.plugins[i]+"] plugin success.");
    }
    catch(e)
    {
      QZFL.console.print("editor ["+editorID+"]"+" initialize ["+this.plugins[i]+"] plugin failed.");
    }
  }
}
}
,getEditorConstructor:function(id)
{
return this._editor[id]||null;
}
,create:function(editorList,uniqueID)
{
var _editors=
{
  currentEditorId:""
};
this._length++;
var df=document.createDocumentFragment();
for(var k in editorList)
{
  var _id=editorList[k];
  try
  {
    var t=document.createElement("div");
    _editors[_id]=new this._editor[_id];
    _editors[_id].editorUniqueID=uniqueID;
    _editors[_id].initialize(this._length);
    _editors[_id].contents=
    {
      get:QZFL.event.bind(_editors[_id],function()
      {
        var content=this.getContents();
        content=QZFL.editor.parser.doOutputAllRules(this.type,content);
        return content;
      }
      ),set:QZFL.event.bind(_editors[_id],function(content)
      {
        content=QZFL.editor.parser.doInputAllRules(this.type,content);
        this.setContents(content);
      }
      ),conver:QZFL.event.bind(_editors[_id],function(content,sourceEditorName)
      {
        content=QZFL.editor.parser.doTranslateRules(sourceEditorName,this.type,content);
        this.setContents(content);
      }
      )
    }
    t.className="editor_area";
    t.style.cssText="border:1px solid #CCCCCC;margin:0;height:100%;_height:auto";
    t.style.display="none";
    t.appendChild(_editors[_id].getInstance());
    _editors[_id+"_panel"]=t;
    df.appendChild(t);
  }
  catch(e)
  {
    QZFL.console.print("Editor Plugins Error: "+e.message,1);
  }
}
var _c=QZFL.dom.get(uniqueID+"_area");
_c.appendChild(df);
this._panels[this._length]=_editors;
df=null;
return this._length;
}
,switchEditor:function(panelID,editorID)
{
var _p=this._panels[panelID];
if(_p.currentEditorId&&_p.currentEditorId!=editorID)
{
  _p[_p.currentEditorId+"_panel"].style.display="none";
}
_p[editorID+"_panel"].style.display="block";
_p.currentEditorId=editorID;
}
,get:function(id)
{
return this._panels[id];
}
,kill:function()
{
}
}
QZFL.editor.Fragment=function()
{
this.fragment=document.createDocumentFragment();
this.root=document.createElement("div");
this.fragment.appendChild(this.root)
};
QZFL.editor.Fragment.prototype=
{
setHtml:function(html)
{
this.root.innerHTML=html;
}
,getRoot:function()
{
return this.root;
}
,appendChild:function(element)
{
this.root.appendChild(element);
}
};
QZFL.editor.parser=
{
_input:
{
}
,_output:
{
}
,_translateRules:
{
}
,_enabled:true,addInputRule:function(type,name,fn,isFirst)
{
this._input[type]=this._input[type]||
{
  first:[],normal:[],cache:[]
};
var _rules=
{
  "name":name,"fn":fn
};
this._input[type][isFirst?"first":"normal"].push(_rules);
this.buildInputRuleCache(type);
return _rules;
}
,addOutputRule:function(type,name,fn,isFirst)
{
this._output[type]=this._output[type]||
{
  first:[],normal:[],cache:[]
};
var _rules=
{
  "name":name,"fn":fn
};
this._output[type][isFirst?"first":"normal"].push(_rules);
this.buildOutputRuleCache(type);
return _rules;
}
,addTranslateRules:function(source,target,fn,isFirst)
{
var _k=source+"-"+target;
this._translateRules[_k]=this._translateRules[_k]||
{
  first:[],normal:[],cache:[]
};;
this._translateRules[_k][isFirst?"first":"normal"].push(fn);
this.buildTranslateRulesCache(source,target);
return this._translateRules[_k];
}
,buildInputRuleCache:function(type)
{
if(!type)
{
  return
}
this._input[type].cache=[].concat(this._input[type].first,this._input[type].normal);
}
,buildOutputRuleCache:function(type)
{
if(!type)
{
  return
}
this._output[type].cache=[].concat(this._output[type].first,this._output[type].normal);
}
,buildTranslateRulesCache:function(source,target)
{
if(!source||!target)
{
  return
}
var _k=source+"-"+target;
this._translateRules[_k].cache=[].concat(this._translateRules[_k].first,this._translateRules[_k].normal);
}
,getInputRules:function(type)
{
return this._input[type];
}
,getOutputRules:function(type)
{
return this._output[type];
}
,doTranslateRules:function(source,target,content)
{
var _sr=this._translateRules[source+"-"+target];
if(!_sr)
{
  return content;
}
var _rules=_sr.cache;
if(_rules)
{
  for(var i=0;i<_rules.length;i++)
  {
    var _c=_rules[i](content);
    content=typeof(_c)=="string"?_c:content;
  }
}
return content;
}
,doInputRules:function(type,rule,content)
{
var _sr=this._input[type];
if(!_sr)
{
  return content;
}
var _rules=_sr.cache;
for(var i=0;i<_rules.length;i++)
{
  if(_rules[i].name==rule)
  {
    return this._doInputRules(type,i,content);
  }
}
}
,_doInputRules:function(type,id,content)
{
var _sr=this._input[type];
if(!_sr)
{
  return content;
}
var _rules=_sr.cache;
if(!this._enabled)
{
  return content
}
else
{
  var _re=_rules[id]["fn"](content);
  return typeof(_re)=="string"?_re:content;
}
}
,doOutputRules:function(type,rule,content)
{
var _sr=this._output[type];
if(!_sr)
{
  return content;
}
var _rules=_sr.cache;
for(var i=0;i<_rules.length;i++)
{
  if(_rules[i].name==rule)
  {
    return this._doInputRules(type,i,content);
  }
}
}
,_doOutputRules:function(type,id,content)
{
var _sr=this._output[type];
if(!_sr)
{
  return content;
}
var _rules=_sr.cache;
if(!this._enabled)
{
  return content
}
else
{
  var _re=_rules[id]["fn"](content);
  return typeof(_re)=="string"?_re:content;
}
}
,doInputAllRules:function(type,content)
{
var _sr=this._input[type];
if(!this._enabled||!_sr)
{
  return content;
}
var _rules=_sr.cache;
for(var i=0;i<_rules.length;i++)
{
  content=this._doInputRules(type,i,content);
}
return content;
}
,doOutputAllRules:function(type,content)
{
var _sr=this._output[type];
if(!this._enabled||!_sr)
{
  return content;
}
var _rules=_sr.cache;
for(var i=0;i<_rules.length;i++)
{
  content=this._doOutputRules(type,i,content);
}
return content;
}
,enable:function()
{
this._enabled=true;
}
,disable:function()
{
this._enabled=false;
}
}
QZFL.editor.Range=function(source)
{
this._source=source||(document.defaultView?window.getSelection():document.selection);
this.range=null;
this._controlList=new RegExp("(img|object|embed|iframe|table|td|tr|input|textarea)","ig")
if(this._source.createRange)
{
this.range=this._source.createRange();
}
else
{
this.range=this._source.rangeCount?this._source.getRangeAt(0):null;
};
};
QZFL.editor.Range.prototype=
{
selectNode:function(element)
{
if(!element)
{
  return;
}
if(QZFL.userAgent.ie)
{
  if(this._controlList.test(element.tagName))
  {
    var _cr=this.getCommonAncestorContainer().ownerDocument.body.createControlRange();
    _cr.add(element);
    _cr.select();
  }
  else
  {
    this.range.moveToElementText(element);
    this.range.select();
  }
}
else
{
  this.range.selectNode(element);
}
}
,getRange:function()
{
return this.range;
}
,getContent:function()
{
if(QZFL.userAgent.ie)
{
  return(this._source.type=="Control"?this.range.item(0):
  {
    nodeName:"#text",nodeType:3,nodeValue:this.range.text,textContent:this.range.text
  }
  );
}
else
{
  return this.range.cloneContents().firstChild;
}
}
,getHtmlContents:function()
{
if(QZFL.userAgent.ie)
{
  return(this._source.type=="Control"?this.range.item(0).outerHTML:this.range.htmlText);
}
else
{
  var _df=new QZFL.editor.Fragment();
  _df.appendChild(this.range.cloneContents());
  return _df.getRoot().innerHTML;
}
}
,isCollapsed:function()
{
if(QZFL.userAgent.ie)
{
  return!this.getContent().textContent;
}
else
{
  return this.range.collapsed;
}
}
,getCommonAncestorContainer:function()
{
if(QZFL.userAgent.ie)
{
  return this._source.type=="Control"?this.range.item(0).parentNode:this.range.parentElement();
}
else
{
  return this.range.commonAncestorContainer;
}
}
};
QZFL.editor.selection=
{
get:function(source)
{
if(!!source||source.nodeType==9||source.tagName=="TEXTAREA")
{
  return source.defaultView?source.defaultView.getSelection():source.selection;
}
else
{
  return null;
}
}
,getText:function(source)
{
var text;
if(QZFL.userAgent.ie)
{
  text=source.selection.createRange().text;
}
else
{
  text=source.getSelection();
}
return text;
}
,createRange:function(source)
{
return new QZFL.editor.Range(this.get(source));
}
};
QZFL.editor.toolbar=
{
_layouts:
{
}
,create:function(layoutName,editorUniqueID)
{
QZFL.console.print("create toolbar layout.");
return new QZFL.editor.toolbar.Container(layoutName,editorUniqueID);
}
,setLayout:function(layoutName,toolbarData)
{
this._layouts[layoutName]=toolbarData;
}
,getCloneLayout:function(layoutName)
{
return QZFL.lang.objectClone(this._layouts[layoutName]);
}
}
QZFL.editor.toolbar.Container=function(layoutName,editorUniqueID)
{
this.root=null;
this.buttons=[];
this._queryTime=16;
this.editorUniqueID=editorUniqueID;
this.layoutName=layoutName;
this.data=QZFL.editor.toolbar.getCloneLayout(layoutName);
this.initialize();
}
QZFL.editor.toolbar.Container.prototype=
{
initialize:function()
{
this.root=document.createElement("div");
for(var i=0;i<this.data.layouts.length;i++)
{
  var _ls=this.data.layouts[i];
  this.root.appendChild(this._drawLayout(_ls));
}
this.root.className=this.data.extendClass||"";
this.root.style.display="none";
}
,_drawLayout:function(layoutData)
{
var _div=document.createElement("div");
var _ul=document.createElement("ul");
var _bc=layoutData.buttons;
for(var j=0;j<_bc.length;j++)
{
  var _li=document.createElement("li");
  var _b=QZFL.editor.buttons.create(_bc[j],this.editorUniqueID);
  if(_b)
  {
    _li.appendChild(_b.getElement());
    _ul.appendChild(_li);
    this.buttons.push(_b);
    _b._buttonName=_bc[j];
    if(!_b.options.noHighlight)
    {
(function(l,b)
{
  QZFL.event.addEvent(l,"mouseover",function()
  {
    if(l.getAttribute("_highlightLock")==1)
    {
      return
    }
    l.className=b.options.highlight||"hover";
  }
  );
  QZFL.event.addEvent(l,"mouseout",function()
  {
    if(l.getAttribute("_highlightLock")==1)
    {
      return
    }
    l.className="";
  }
  );
}
)(_li,_b);
}
}
}
_div.className=layoutData.className||"";
_div.style.cssText=layoutData.style||"";
_div.appendChild(_ul);
return _div;
}
,getRoot:function()
{
return this.root;
}
,queryState:function()
{
clearTimeout(this._queryTimer);
this._queryTimer=setTimeout(QZONE.event.bind(this,this._queryState),this._queryTime);
}
,_queryState:function()
{
for(var k in this.buttons)
{
if(this.buttons[k].query)
{
this.buttons[k].query();
}
}
}
,getButton:function(buttonName)
{
for(var k in this.buttons)
{
if(this.buttons[k]._buttonName==buttonName)
{
return this.buttons[k];
}
}
return null
}
}
QZFL.editor.buttons=
{
_items:
{
}
,length:0,insert:function(buttonElement)
{
if(this._items[buttonElement.name])
{
QZFL.console.print("重复的按钮对象");
return false;
}
this._items[buttonElement.name]=buttonElement;
this.length++;
return true;
}
,remove:function(buttonName)
{
if(!this._items[buttonName])
{
QZFL.console.print("不存在的按钮对象");
delete this._items[buttonName];
return false;
}
this.length--;
return true;
}
,create:function(buttonName,editorUniqueID)
{
if(!this._items[buttonName])
{
QZFL.console.print("no ["+buttonName+"] button plugin loaded.",1);
return null;
}
var _bc=new this._items[buttonName].ButtonClass(editorUniqueID);
var _isCustom=_bc.options.isCustomButton||false;
if(!_isCustom)
{
var _dom=document.createElement("button");
_dom.className=_bc.options.className;
_dom.title=_bc.options.title;
_bc.initialize(_dom);
QZFL.event.addEvent(_dom,"click",function(e)
{
QZFL.event.preventDefault(e)
}
)
_dom=null;
}
else
{
_bc.initialize();
}
return _bc;
}
}
QZFL.editor.button=
{
enabled:function(buttonElement)
{
if(!buttonElement)
{
return false;
}
if(buttonElement.tagName=="BUTTON")
{
QZFL.dom.setStyle(buttonElement,"opacity","1");
buttonElement.disabled=false;
buttonElement.style.cursor="pointer";
}
}
,disabled:function(buttonElement)
{
if(!buttonElement)
{
return false;
}
if(buttonElement.tagName=="BUTTON")
{
QZFL.dom.setStyle(buttonElement,"opacity","0.3");
buttonElement.disabled=true;
buttonElement.style.cursor="default";
}
}
,highlight:function(buttonElement,className)
{
if(!buttonElement)
{
return false;
}
var _c=className||"hover"
if(buttonElement.tagName=="BUTTON")
{
var _p=buttonElement.parentNode;
_p.setAttribute("_highlightLock",1);
_p.className=_c;
}
}
,unHighlight:function(buttonElement,className)
{
if(!buttonElement)
{
return false;
}
var _c=className||"hover"
if(buttonElement.tagName=="BUTTON")
{
var _p=buttonElement.parentNode;
_p.setAttribute("_highlightLock",0);
_p.className="";
}
}
}
QZFL.editor.lang=
{
_lang:
{
}
,getLang:function(text)
{
return this._lang[text]||text;
}
,setLang:function(langPackage)
{
this._lang=langPackage;
}
};
QZFL.editor.History=function()
{
this.items=[];
this.current=-1;
this._element=null;
this._type=1;
this._useNativeHistory=false;
this._recordDelay=200;
};
QZFL.editor.History.prototype=
{
forward:function()
{
if(this._useNativeHistory)
{
this._element.execCommand("redo",false,true);
return
}
if(this.current==this.items.length-1)
{
return
}
this.current++;
this._setContents(this.items[this.current]);
}
,back:function()
{
if(this._useNativeHistory)
{
this._element.execCommand("undo",false,true);
return
}
if(this.current<=0)
{
return
}
this.current--;
this._setContents(this.items[this.current]);
}
,bind:function(element)
{
this._element=element;
if(!QZFL.userAgent.ie&&this._element.nodeType==9)
{
QZFL.console.print("use native history recording.");
this._useNativeHistory=true;
return
}
QZFL.console.print("history recording.");
if(this._element.tagName=="TEXTAREA")
{
this._type=0;
}
var o=this;
this._callRecord=function(e)
{
o.record.call(o);
}
QZFL.event.addEvent(this._element,"keyup",this._callRecord);
}
,record:function()
{
if(this._useNativeHistory)
{
return
}
clearTimeout(this._recordTimer);
this._recordTimer=setTimeout((function(o)
{
return function()
{
  o._record.call(o)
}
}
)(this),this._recordDelay)
}
,_getContents:function()
{
if(this._element.nodeType==9)
{
return this._element.body.innerHTML;
}
return this._element[this._type?"innerHTML":"value"];
}
,_setContents:function(contents)
{
if(this._element.nodeType==9)
{
this._element.body.innerHTML=contents;
}
this._element[this._type?"innerHTML":"value"]=contents;
}
,_record:function()
{
if(this.current!=this.items.length-1)
{
this.items=this.items.slice(0,this.current);
}
this.items.push(this._getContents());
this.current=this.items.length-1;
}
};
QZFL.editor.lang.setLang(
{
"button_bold":"加粗","button_italic":"倾斜","button_underline":"下划线","button_color":"字体颜色","button_size":"字号","button_family":"字体","button_justifycenter":"居中","button_justifyright":"居右","button_justifyleft":"居左","button_emotions":"插入表情","button_picture":"插入图片","button_cleanstyle":"清除样式","button_historyforward":"恢复","button_historyback":"撤销","button_link":"插入超链接","button_glowfont":"设置发光字","button_unorderedList":"插入/删除编号列表","button_orderedList":"插入/删除项目序号","button_fullscreen":"切换全屏/普通模式","font_size_1":"六号","font_size_2":"五号","font_size_3":"四号","font_size_4":"三号","font_size_5":"二号","font_size_6":"一号","font_size_7":"大号","font_size_10px":"六号","font_size_13px":"五号","font_size_16px":"四号","font_size_18px":"三号","font_size_24px":"二号","font_size_32px":"一号","font_size_48px":"大号","font_list":"宋体,黑体,楷体_GB2312,新宋体,仿宋_GB2312,Arial,Verdana,Simsun,Mingliu,Helvetica","tips_glowfont1":"要使用发光字，请先选定文字，再进行操作。","tips_glowfont2":"暂时不支持多行文字同时设置成发光字。","tips_glowfont3":"您使用了发光字，使用非IE浏览器(如Firefox、Opera、Safari等)浏览内容时，发光字可能无法正常显示，特此提醒。","tips_fullscreen":'您正在使用全屏编辑模式。返回普通模式，可以点击 [ <img alt="返回" class="btn_norscreen" src="/ac/b.gif"/> ] 按钮.',"tips_switch_UBB":"切换到UBB模式","tips_switch_HTML":"切换到HTML模式","tips_switch_fullscreen":"切换全屏/普通模式","tips_switch_help":"使用帮助"
}
);
(function()
{
  var _type="html";
  var _html=function()
  {
    this._instance=null;
    this.panelID=null;
    this.editorDoc=null;
    this.editorWindow=null;
    this.type=_type;
    this.editorUniqueID=null;
    this.history　=　null;
  }
  _html.prototype=
  {
    type:_type,initialize:function(panelID)
    {
      QZFL.console.print("html editor plugins initialized.");
      this.panelID=panelID;
      this._doEdited=QZFL.event.bind(this,function()
      {
        this._enableEditMode();
      }
      );
      this._instance=document.createElement("iframe");
      this._instance.frameBorder="0";
      if(QZFL.userAgent.ie)
      {
        this._instance.attachEvent("onload",this._doEdited);
      }
      else
      {
        this._instance.onload=this._doEdited;
      }
      this._instance.src=QZFL.editor.config.editorPath+"assets/blank.htm#"+QZFL.editor.config.domain;
      this._instance.panelID=this.panelID;
      this._instance.style.cssText="width:100%;height:100%";
      this._ready=false;
    }
    ,getInstance:function()
    {
      return this._instance;
    }
    ,execCommand:function(cName,cParam,noHistory)
    {
      this.focus();
      this.editorDoc.execCommand(cName,false,cParam);
      this.history.record();
    }
    ,getDocument:function()
    {
      return this.editorDoc;
    }
    ,focus:function()
    {
      if(this.editorDoc.defaultView)
      {
      }
      else
      {
      }
      this.editorWindow.focus();
    }
    ,setContents:function(html)
    {
      if(!this._ready)
      {
        this._tempHtml=html;
        return;
      }
      if(QZFL.userAgent.firefox)
      {
        this.editorDoc.body.innerHTML="";
        this.fillHtml(html||'<p><br/></p>');
      }
      else
      {
        this.editorDoc.body.innerHTML=html;
        this.focus();
      }
      this.history.record();
      QZFL.editor.get(this.editorUniqueID).callEvent("onContentsReplace");
    }
    ,getContents:function()
    {
      return this.editorDoc.body.innerHTML;
    }
    ,fillHtml:function(html)
    {
      this.focus();
      if(QZFL.userAgent.ie)
      {
        var type=this.editorDoc.selection.type;
        var range=this.editorDoc.selection.createRange();
        if(type=="Control")
        {
          range(0).outerHTML=html;
        }
        else
        {
          range.pasteHTML(html);
          range.collapse(true);
          range.select();
        }
      }
      else
      {
        this.editorDoc.execCommand("insertHtml",false,html);
      }
    }
    ,_enableEditMode:function()
    {
      this.editorWindow=this._instance.contentWindow;
      this.editorDoc=this._instance.contentWindow.document;
      if(QZFL.userAgent.ie)
      {
        this.editorDoc.body.innerHTML=this._tempHtml||"<p></p>";
        this.editorDoc.body.contentEditable=true;
        this.editorDoc.execCommand('MultipleSelection',true)
      }
      else
      {
        this.editorDoc.designMode="on";
        this.editorDoc.body.innerHTML=this._tempHtml||'<p><br/></p>';
        this.editorDoc.execCommand('styleWithCSS',false,false);
      }
      var o=this;
      this.editorDoc.body.onbeforedeactivate=function()
      {
        return
      }
      this.history=new QZFL.editor.History();
      this.history.bind(this.editorDoc);
      this.history.record();
      this.initializeEvent();
      this._ready=true;
      this._tempHtml="";
      QZFL.editor.get(this.editorUniqueID).callEvent("onEditorReady",["html"]);
    }
    ,initializeEvent:function()
    {
      QZFL.event.addEvent(this.editorDoc,"mouseup",QZFL.event.bind(this,this._mouseup));
      QZFL.event.addEvent(this.editorDoc,"keyup",QZFL.event.bind(this,this._keyup));
      QZFL.event.addEvent(this.editorDoc,"keydown",QZFL.event.bind(this,this._keydown));
    }
    ,_mouseup:function()
    {
      var editor=QZFL.editor.get(this.editorUniqueID);
      var _tb=editor.getCurrentToolbar();
      if(_tb)
      {
        editor.getCurrentToolbar().queryState();
      }
      editor=null;
    }
    ,_keydown:function(e)
    {
      var _code=e.keyCode;
      if(_code==13)
      {
        this._fixParagraphBug();
      }
      if(!QZFL.editor.selection.createRange(this.editorDoc).isCollapsed())
      {
        QZFL.editor.get(this.editorUniqueID).getCurrentToolbar().queryState();
      }
      if(e.keyCode=="9")
      {
        this.fillHtml("　　");
        QZFL.event.preventDefault();
        return false
      }
    }
    ,_keyup:function(e)
    {
      var _code=e.keyCode;
      if(_code>=37&&_code<=40)
      {
        QZFL.editor.get(this.editorUniqueID).getCurrentToolbar().queryState();
        return;
      }
      if(_code==13)
      {
        if(QZFL.editor.button.checkStyle)
        {
          QZFL.editor.button.checkStyle(this.editorUniqueID);
        }
      }
      QZFL.editor.get(this.editorUniqueID).callEvent("onKeyPress");
    }
    ,_fixParagraphBug:function()
    {
      if(QZFL.userAgent.firefox)
      {
        var _tn=this.editorDoc.body.firstChild.tagName;
        if(_tn!="P")
        {
          var _br=document.createElement("br");
          this.getSelectionRange().getRange().insertNode(_br);
          _br.id="_check_br_ID";
          this.editorDoc.body.innerHTML="<p>"+this.editorDoc.body.innerHTML.replace(/<div/g,"<p").replace(/div>/g,"p>")+"</p>";
          _br=this.editorDoc.getElementById("_check_br_ID");
          this.getSelection().collapse(_br.nextSibling||_br,0);
          _br.id="";
        }
      }
    }
    ,getSelectionRange:function()
    {
      this.focus();
      return QZFL.editor.selection.createRange(this.editorDoc);
    }
    ,getSelection:function()
    {
      this.focus();
      return QZFL.editor.selection.get(this.editorDoc);
    }
    ,getSelectHtml:function()
    {
      var _html="";
      if(QZFL.userAgent.ie)
      {
        var type=this.editorDoc.selection.type;
        if(type=="Control")
        {
          _html=this.getSelectionRange().range(0).outerHTML;
        }
        else
        {
          _html=this.getSelectionRange().range.htmlText;
        }
      }
      else
      {
        var _df=new QZFL.editor.Fragment();
        _df.appendChild(this.getSelectionRange().range.cloneContents());
        _html=_df.getRoot().innerHTML;
      }
      return _html;
    }
  }
  QZFL.editor.editPanel.addEditor(_type,_html);
  _html=null;
}
)();
(function()
{
  var _type="text";
  var _text=function()
  {
    this._instance=null;
    this.panelID=null;
    this.editorDoc=null;
    this.editorWindow=null;
    this.type=_type;
    this.editorUniqueID=null;
    this.history　=　null;
  }
  _text.prototype=
  {
    initialize:function(panelID)
    {
      QZFL.console.print("html editor plugins initialized.");
      this.panelID=panelID;
      this._instance=document.createElement("textarea");
      try
      {
        this._instance.rows="";
        this._instance.cols="";
      }
      catch(e)
      {
      }
      this._instance.panelID=this.panelID;
      this._instance.style.cssText="border:0px;width:100%;";
      this.history=new QZFL.editor.History();
      this.history.bind(this._instance);
      this.history.record();
      QZFL.editor.get(this.editorUniqueID).callEvent("onEditorReady",[_type]);
    }
    ,getInstance:function()
    {
      return this._instance;
    }
    ,execCommand:function(cName,cParam,noHistory)
    {
      this.focus();
      this.editorDoc.execCommand(cName,false,cParam);
    }
    ,focus:function()
    {
      this._instance.focus();
    }
    ,setContents:function(text)
    {
      this._instance.value=text;
      QZFL.editor.get(this.editorUniqueID).callEvent("onContentsReplace");
    }
    ,fillText:function(html)
    {
      this.focus();
      var t=this._instance,doc=t.ownerDocument;
      if(QZFL.userAgent.ie)
      {
        var range=doc.selection.createRange();
        range.text=html;
      }
      else if(typeof(t.selectionStart)!="undefined")
      {
        var s=t.selectionStart,e=t.selectionEnd;
        t.value=t.value.substring(0,s)+html+t.value.substring(e,t.value.length);
      }
      else
      {
        t.value+=html;
      }
    }
    ,getContents:function()
    {
      return this._instance.value;
    }
    ,initializeEvent:function()
    {
    }
    ,getSelectionRange:function()
    {
      this.focus();
      return QZFL.editor.selection.createRange(this._instance);
    }
  }
  QZFL.editor.editPanel.addEditor(_type,_text);
  _text=null;
}
)();
(function()
{
  var qzReg=new Object();
function createRegEX(key,pattern,flags)
{
  qzReg[key]=new RegExp('');
  qzReg[key].compile(pattern,flags);
}
createRegEX('quote','<blockquote [^>]+?>引自：<cite>(.+?)<\\/cite>[^<]+?<ins>(.+?)<\\/ins>.+?<q>(.+)<\\/q><\\/blockquote>','ig');
var HTMLToUBB=function(str)
{
  str=str.replace(/\n/g,"");
  str=str.replace(qzReg["quote"],"[quote=引自：$1 于 $2 发表的评论]$3[/quote]");
  if((/blockquote/i).test(str))
  {
    str=str.replace(qzReg["quote"],"[quote=引自：$1 于 $2 发表的评论]$3[/quote]");
  }
  return str;
};
QZFL.editor.parser.addOutputRule("html","replaceQuoteHTML",HTMLToUBB,true);
}
)();
(function()
{
  var qzReg=new Object();
function createRegEX(key,pattern,flags)
{
  qzReg[key]=new RegExp('');
  qzReg[key].compile(pattern,flags);
}
function QQshow_HTMLToUBB(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      var args=arguments;
      var orgSrc=/orgSrc="([^"]+)"/i.exec(args[1]);var src=(orgSrc&&orgSrc[1])?orgSrc[1]:(/src="([^"]+)"/i.exec(args[1])[1]);
      var w=/WIDTH(: |=)(\d
      {
        1,3
      }
      )/i.exec(args[1]);
      var h=/HEIGHT(: |=)(\d
      {
        1,3
      }
      )/i.exec(args[1]);
      var t=/TRANSIMG=(\"*)(\d{1})/i.exec(args[1]);var ow=/ORIGINWIDTH=(\"*)(\d{1,3})/i.exec(args[1]);var oh=/ORIGINHEIGHT=(\"*)(\d{1,3})/i.exec(args[1]);var oContent=/CONTENT="([^"]+)"/i.exec(args[1]);
      var osrc=/ORIGINSRC="([^"]+)"/i.exec(args[1]);if(!!t&&!!ow&&!!oh){if(!w)
      w=ow;
      if(!h)
      h=oh;
      return"[qqshow,"+ow[2]+","+oh[2]+","+w[2]+","+h[2]+(oContent?(","+oContent[1]):"")+"]"+(!!osrc?osrc[1]:src)+"[/qqshow]";
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Music_HTMLToUBB(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_music/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);
      if(cID&&data)
      {
        return"[music]"+data+"[/music]";
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Audio_HTMLToUBB(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_audio/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);
      if(cID&&data)
      {
        return"[audio,"+data[1]+","+data[2]+","+data[3]+"]"+data[0]+"[/audio]";
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Flash_HTMLToUBB(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);
      if(cID&&data)
      {
        var w=/WIDTH(: |=)(\d
        {
          1,3
        }
        )/i.exec(arguments[1]);
        var h=/HEIGHT(: |=)(\d
        {
          1,3
        }
        )/i.exec(arguments[1]);
        return"[flash,"+w[2]+","+h[2]+"]"+data+"[/flash]";
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Video_HTMLToUBB(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_video/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);
      if(cID&&data)
      {
        var w=/WIDTH(: |=)(\d
        {
          1,3
        }
        )/i.exec(arguments[1]);
        var h=/HEIGHT(: |=)(\d
        {
          1,3
        }
        )/i.exec(arguments[1]);
        return"[video,"+w[2]+","+h[2]+","+data[1]+","+data[2]+"]"+data[0]+"[/video]";
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Album_HTMLToUBB(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_album/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);
      if(cID&&data)
      {
        return"[vphoto,"+data[0]+","+data[2]+"]"+data[1]+"[/vphoto]";
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
var HTMLToUBB=function(str)
{
str=str.replace(/\n/g,"");
str=QQshow_HTMLToUBB(str);
str=Music_HTMLToUBB(str);
str=Audio_HTMLToUBB(str);
str=Flash_HTMLToUBB(str);
str=Video_HTMLToUBB(str);
str=Album_HTMLToUBB(str);
return str;
};
createRegEX('ubbQQShow','\\[qqshow,(\\d{1,3}),(\\d{1,3}),(\\d{1,3}),(\\d{1,3})(,(.*?)|)\\]http(.[^\\]\\\'\\"]*)\\[\\/qqshow\\]','ig');
createRegEX('ubbMusic','\\[music\\](.*?)\\[\\/music\\]','ig');
createRegEX('ubbAudio','\\[audio,(true|false),(true|false),(true|false)](.*?)\\[\\/audio\\]','ig');
createRegEX('ubbFlash','\\[flash(|,(\\d+),(\\d+))\\](.*?)\\[\\/flash\\]','ig');
createRegEX('isQQVideo','http:\\/\\/((\\w+\\.|)(video|v|tv)).qq.com','i');
createRegEX('ubbVideo','\\[video,(\\d+|true|false),(\\d+|true|false)(|,(true|false),(true|false))\\](.*?)\\[\\/video\\]','ig');
createRegEX('ubbAlbum','\\[vphoto,(\\d+),(\\d{5,12})](.*?)\\[\\/vphoto\\]','ig');
createRegEX('ubbEmotion','\\[em\\]e(\\d{1,3})\\[\\/em\\]','g');
function QQshow_UBBToHTML(str,bAddFlag)
{
  if(QZFL.userAgent.ie&&QZFL.userAgent.ie<7)
  {
    str=str.replace(qzReg["ubbQQShow"],'<img'+(bAddFlag?' fromubb="1"':'')+' originSrc="http$7" content="$6" style="width:$3;height:$4;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'http$7\', sizingMethod=\'scale\');" border="0" originWidth="$1" originHeight="$2" transImg="1" width="$3" height="$4" src="http://'+IMGCACHE_DOMAIN+'/ac/b.gif" />');
  }
  else
  {
    str=str.replace(qzReg["ubbQQShow"],'<img'+(bAddFlag?' fromubb="1"':'')+' originSrc="http$7" content="$6" style="width:$3;height:$4;" border="0" originWidth="$1" originHeight="$2" transImg="1" width="$3" height="$4" src="http$7" />');
  }
  return str;
}
function Music_UBBToHTML(str,bAddFlag)
{
  str=str.replace(qzReg["ubbMusic"],function()
  {
    var arr=arguments[1].split("|");
    var isMultiple=(arr.length>7?true:false);
    var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(arguments[1]);
    return'<img'+(bAddFlag?' fromubb="1"':'')+' src="/ac/b.gif" class="blog_music'+(isMultiple?"_multiple":"")+'" _cacheID="'+cacheID+'" onresizestart="return false;" />';
  }
  );
  return str;
}
function Audio_UBBToHTML(str,bAddFlag)
{
  str=str.replace(qzReg["ubbAudio"],function()
  {
    var data=[arguments[4],arguments[1],arguments[2],arguments[3]];
    var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
    return'<img'+(bAddFlag?' fromubb="1"':'')+' src="/ac/b.gif" class="blog_audio" _cacheID="'+cacheID+'" />'
  }
  );
  return str;
}
function Flash_UBBToHTML(str,bAddFlag)
{
  str=str.replace(qzReg["ubbFlash"],function()
  {
    var w=(arguments[1]?arguments[2]:"520");
    var h=(arguments[1]?arguments[3]:"425");
    var data=arguments[4];
    var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
    return'<img'+(bAddFlag?' fromubb="1"':'')+' src="/ac/b.gif" width="'+w+'" height="'+h+'" class="blog_'+(qzReg["isQQVideo"].test(arguments[4])?"qqVideo":"flash")+'" style="width:'+w+'px;height:'+h+'px;" _cacheID="'+cacheID+'" />';
  }
  );
  return str;
}
function Video_UBBToHTML(str,bAddFlag)
{
  str=str.replace(qzReg["ubbVideo"],function()
  {
    var w=arguments[3]?arguments[1]:"520";
    var h=arguments[3]?arguments[2]:"425";
    var r=arguments[3]?arguments[4]:arguments[1];
    var a=arguments[3]?arguments[5]:arguments[2];
    var data=[arguments[6],r,a];
    var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
    return'<img'+(bAddFlag?' fromubb="1"':'')+' src="/ac/b.gif" width="'+w+'" height="'+h+'" class="blog_video" style="width:'+w+'px;height:'+h+'px;" _cacheID="'+cacheID+'" />';
  }
  );
  return str;
}
function Album_UBBToHTML(str,bAddFlag)
{
  str=str.replace(qzReg["ubbAlbum"],function()
  {
    var data=[arguments[1],arguments[3],arguments[2]];
    var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
    return'<img'+(bAddFlag?' fromubb="1"':'')+' style="height:390px;width:520px;" onresizestart="return false;" src="'+arguments[3]+'" class="blog_album" _cacheID="'+cacheID+'" />';
  }
  );
  return str;
}
function Emotion_UBBToHTML(str,bAddFlag)
{
  str=str.replace(qzReg["ubbEmotion"],'<img'+(bAddFlag?' fromubb="1"':'')+' src="/qzone/em/e$1.gif" onresizestart="return false;">');
  return str;
}
var UBBToHTML=function(str,bAddFlag)
{
  str=QQshow_UBBToHTML(str,bAddFlag);
  str=Music_UBBToHTML(str,bAddFlag);
  str=Audio_UBBToHTML(str,bAddFlag);
  str=Flash_UBBToHTML(str,bAddFlag);
  str=Video_UBBToHTML(str,bAddFlag);
  str=Album_UBBToHTML(str,bAddFlag);
  str=Emotion_UBBToHTML(str,bAddFlag);
  return str;
};
QZFL.editor.parser.addInputRule("html","replaceBlogUBB",UBBToHTML);
QZFL.editor.parser.addOutputRule("html","replaceBlogHTML",HTMLToUBB,true);
QZFL.editor.parser.addTranslateRules("html","text",HTMLToUBB,true);
QZFL.editor.parser.addTranslateRules("text","html",UBBToHTML);
QZFL.editor.parser.replaceBlogUBB=UBBToHTML;
QZFL.editor.parser.replaceBlogHTML=HTMLToUBB;
}
)();
(function()
{
  var encodeUBBToHTML=function(str)
  {
    str=str.replace(/&/ig,"&amp;");
    str=str.replace(/ /ig,"&nbsp;&nbsp;");
    str=str.replace(/</ig,"&lt;");
    str=str.replace(/>/ig,"&gt;");
    return str;
  }
  var encodeHTMLToUBB=function(str)
  {
    str=str.replace(/<[^>]*?>/g,"");
    str=str.replace(/&shy;
    /ig,"");
    str=str.replace(/&nbsp;
    /ig," ");
    str=str.replace(/&lt;
    /ig,"<");
    str=str.replace(/&gt;
    /ig,">");
    str=str.replace(/&amp;
    /ig,"&");
    str=str.replace(/\n$/i,"");
    str=str.replace(/\[(url|ft|b|i|u|email|ffg)[^\[]*?\](\x20*?)\[\/(url|ft|b|i|u|email)\]/,"");
    return str;
  }
  QZFL.editor.parser.addInputRule("html","encodeUBBToHTML",encodeUBBToHTML,true);
  QZFL.editor.parser.addOutputRule("html","encodeHTMLToUBB",encodeHTMLToUBB);
}
)();
(function()
{
  qzReg=new Object();
function createRegEX(key,pattern,flags)
{
  qzReg[key]=new RegExp('');
  qzReg[key].compile(pattern,flags);
}
createRegEX('toStrong','<([\\/]?)(strong|b)[^>]*>','ig');
createRegEX('toItalic','<([\\/]?)(em|i)[^>]*>','ig');
createRegEX('toUnderline','<([\\/]?)(ins|u)[^>]*>','ig');
createRegEX('toAlignCenter','<(div|p)[^>]+align.{0,2}center[^>]*>([^\\<]+)<\\/(div|p)[^>]*>','ig');
createRegEX('toAlignRight','<(div|p)[^>]+align.{0,2}right[^>]*>([^\\<]+)<\\/(div|p)[^>]*>','ig');
createRegEX('glowFont','<font[^>]+\\_glowcolor.{0,2}#(\\w{6})[^>]*>','ig');
createRegEX('removeDumpDiv','^<(div|p)></(div|p)>','i');
createRegEX('toNameCard','<a[^>]+link="nameCard_(\\d+)"[^>]*>(.*?)<\\/a[^>]*>','ig');
createRegEX('toMail','<a[^>]+href="mailto:(.*?)"[^>]*>(.*?)<\\/a[^>]*>','ig');
createRegEX('toUrl','<a[^>]+href="(.*?)"[^>]*>(.*?)<\\/a[^>]*>','ig');
createRegEX('toEmotion','<img[^>]+em\\/e(\\d{1,3}).gif[^>]*>','ig');
createRegEX('fullFont','<font[^>]+style="[^"].+color=#(\\w+).+color:\s#(\\w+).+"[^>]*>([^\\<]+)<\\/font[^>]*>','ig');
createRegEX('delScript','<script[^>]*>(.*?)<\\/script[^>]*>','ig');
createRegEX('blockLine','<(div|p)[^>]*>(.*?)(<b(r|r\\/)>|)<\\/(div|p)[^>]*>','ig');
createRegEX('block','<b(r|r\\/)>','ig');
createRegEX('invalidProperties','( [a-z]+="[^<>"]+[<>][^"]+")*','g');
createRegEX('orderedListStart','<ol(\\s*style="LIST-STYLE-TYPE:\\s*[a-z]+(;)?")?[^>]*>','ig');
createRegEX('orderedListEnd','<\\/ol>','ig');
createRegEX('unorderedListStart','<ul(\\s*style="LIST-STYLE-TYPE:\\s*[a-z]+(;)?")?[^>]*>','ig');
createRegEX('unorderedListEnd','<\\/ul>','ig');
createRegEX('listItemStart','<li(\\s*style="MARGIN:\\s*\\d+px(;)?")?[^>]*>','ig');
createRegEX('listItemEnd','<\\/li>','ig');
var HTMLToUBB=function(content)
{
  var str=content;
  str=str.replace(/(\n|\r)/g,"");
  str=str.replace(qzReg.removeDumpDiv,"");
  str=str.replace(qzReg.toEmotion,"[em]e$1[/em]");
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      var args=arguments;
      var orgSrc=/orgSrc="([^"]+)"/i.exec(args[1]);var src=(orgSrc&&orgSrc[1])?orgSrc[1]:(/src="([^"]+)"/i.exec(args[1])[1]);
      var w=/WIDTH([\D]
      {
        0,2
      }
      )(\d
      {
        1,4
      }
      )/i.exec(args[1]);
      var h=/HEIGHT([\D]
      {
        0,2
      }
      )(\d
      {
        1,4
      }
      )/i.exec(args[1]);
      var t=/TRANSIMG=(\"*)(\d{1})/i.exec(args[1]);var ow=/ORIGINWIDTH=(\"*)(\d{1,4})/i.exec(args[1]);var oh=/ORIGINHEIGHT=(\"*)(\d{1,4})/i.exec(args[1]);var oContent=/CONTENT="([^"]+)"/i.exec(args[1]);
      var osrc=/ORIGINSRC="([^"]+)"/i.exec(args[1]);var c=(QZFL.userAgent.ie?/class=(flash|video|audio|qqVideo|vphoto|music)/i.exec(args[1]):/class="(flash|video|audio|qqVideo|vphoto)/i.exec(args[1]));
      var em=/em\/e(\d
      {
        1,3
      }
      ).gif/i.exec(args[1]);
      if(em)
      {
        return"[em]e"+em[1]+"[/em]";
      }
      if(w&&h)
      {
        return"[img,"+w[2]+","+h[2]+"]"+src+"[/img]";
      }
      return"[img]"+src+"[/img]";
    }
    catch(e)
    {
      return""
    }
  }
  );
  str=str.replace(qzReg.toAlignCenter,"[M]$2[/M]");
  str=str.replace(qzReg.toAlignRight,"[R]$2[/R]");
  str=str.replace(qzReg.glowFont,"[ffg,#$1,#FFFFFF]");
  str=str.replace(/<font([^>]+)>/ig,function()
  {
    var args=arguments;
    var color=/color([^#\w]
    {
      0,2
    }
    )([#\w]
    {
      1,7
    }
    )/.exec(args[1]);
    var size=/size=["]?(\d{1})/.exec(args[1]);var face=/face=("|)([^"\s]+)("|)/.exec(args[1]);
    return"[ft="+(color?color[2]:"")+","+(size?size[1]:"")+","+(face?face[2]:"")+"]";
  }
  );
  str=str.replace(/<\/font[^>]*>/ig,"[/ft]");
  if(!QZFL.userAgent.ie)
  {
    str=str.replace(/<(div|span)([^>]+)>(.*?)<\/(div|span)[^>]*>/ig,function(all,a,b,c,d)
    {
      var color=/color:\x20*?([^;
      ]+)/.exec(b),face=/font-family:\x20*?([^;
      ]+)/.exec(b),tmp;
      if(color&&color[1])
      {
        color=color[1].toLowerCase();
        if(color.indexOf("rgb")>-1)
        {
          tmp=color.replace(/[rgb\(\)]/g,"").split(",");
          if(tmp&&tmp.length>2)
          {
            color="#"+
            (tmp[0]-0).toString(16)+
            (tmp[1]-0).toString(16)+
            (tmp[2]-0).toString(16);
          }
        }
      }
      else
      {
        color="";
      }
      return"[ft="+color+",,"+(face?face[1]:"")+"]"+c+"[/ft]";
    }
    );
  }
  str=str.replace(qzReg.blockLine,"$2\n");
  str=str.replace(qzReg.block,"\n");
  str=str.replace(qzReg.toStrong,"[$1B]");
  str=str.replace(qzReg.toItalic,"[$1I]");
  str=str.replace(qzReg.toUnderline,"[$1U]");
  str=str.replace(qzReg.delScript,"");
  str=str.replace(qzReg.invalidProperties,"");
  str=str.replace(qzReg.toNameCard,"[card=$1]$2[/card]");
  str=str.replace(qzReg.toMail,"[email=$2]$1[/email]");
  str=str.replace(qzReg.toUrl,"[url=$1]$2[/url]");
  str=str.replace(qzReg.orderedListStart,"[ol]");
  str=str.replace(qzReg.orderedListEnd,"[/ol]");
  str=str.replace(qzReg.unorderedListStart,"[ul]");
  str=str.replace(qzReg.unorderedListEnd,"[/ul]");
  str=str.replace(qzReg.listItemStart,"[li]");
  str=str.replace(qzReg.listItemEnd,"[/li]");
  return str;
}
createRegEX('ubbNameCard','\\[card=(\\d+)\\](.+?)\\[\\/card\\]','ig');
createRegEX('ubbURL','\\[url=(http[^\\]\\"\\\']+)]([^\\[]+)\\[\\/url\\]','ig');
createRegEX('ubbEmotion','\\[em\\]e(\\d{1,3})\\[\\/em\\]','ig');
createRegEX('ubbQQShow','\\[qqshow,(\\d{1,3}),(\\d{1,3}),(\\d{1,3}),(\\d{1,3})(,(.*?)|)\\]http(.[^\\]\\\'\\"]*)\\[\\/qqshow\\]','ig');
createRegEX('ubbResizeImg','\\[img,(\\d{1,4}),(\\d{1,4})\\]http(.[^\\]\\\'\\"]*)\\[\\/img\\]','ig');
createRegEX('ubbImage','\\[img\\]http(.[^\\]\\\'\\"]*)\\[\\/img\\]','ig');
createRegEX('ubbGlow','\\[ffg,([#\\w]{1,10}),([#\\w]{1,10})\\]','ig');
createRegEX('ubbFont','\\[ft=([^\\]]+)\\]','ig');
createRegEX('ubbFontColor','\\[ftc=([#\\w]{1,10})\\]','ig');
createRegEX('ubbFontSize','\\[fts=([1-6]{1,1})\\]','ig');
createRegEX('ubbFontFace','\\[ftf=(.[^\\]]+)\\]','ig');
createRegEX('ubbFlash','\\[flash(|,(\\d+),(\\d+))\\](.*?)\\[\\/flash\\]','ig');
createRegEX('ubbVideo','\\[video,(\\d+|true|false),(\\d+|true|false)(|,(true|false),(true|false))\\](.*?)\\[\\/video\\]','ig');
createRegEX('ubbAudio','\\[audio,(true|false),(true|false),(true|false)](.*?)\\[\\/audio\\]','ig');
createRegEX('ubbVphoto','\\[vphoto,(\\d+),(\\d{5,11})](.*?)\\[\\/vphoto\\]','ig');
createRegEX('isQQVideo','http:\\/\\/((\\w+\\.|)video|v).qq.com','i');
createRegEX('ubbMusic','\\[music\\](.*?)\\[\\/music\\]','ig');
var procLineChar=function(str)
{
  if(QZFL.userAgent.ie)
  {
    str=str.replace(/(.+)(\n|)/ig,"<p>$1&#173;</p>");
    str=str.replace(/\n/ig,"<p>&#173;</p>");
    str=str.replace(/<div>\s+?<\/div>/ig,"<p>&#173;</p>");
  }
  else
  {
    str=str.replace(/(.+)(\n|)/ig,"<p>$1<br/></p>");
    str=str.replace(/\n/ig,"<p><br/></p>");
    str=str.replace(/<div>\s+?<\/div>/ig,"<p><br/></p>");
  }
  return str;
};
var UBBToHTML=function(content,bAddFlag)
{
  var str=content;
  var _imgcacheDomain="imgcache.qq.com";
  str=str.replace(qzReg.ubbEmotion,'<img'+(bAddFlag?' fromubb="1"':'')+' src="http://'+_imgcacheDomain+'/qzone/em/e$1.gif" onresizestart="return false">');
  str=str.replace(qzReg.ubbNameCard,'<a'+(bAddFlag?' fromubb="1"':'')+' href="http://user.qzone.qq.com/$1" link="nameCard_$1" target="_blank" class="q_namecard">$2</a>');
  str=str.replace(/\[url(|=([^\]]+))\]\[\/url\]/g,function()
  {
    var args=arguments;
    var href="";
    var REG_HTTP=/^http:\/\/anchor/i;
    if(REG_HTTP.test(args[2]))
    {
      href=args[2];
    }
    else if(REG_HTTP.test(args[3]))
    {
      href=args[3];
    }
    if(!href)
    return args[0];
    return'<a'+(bAddFlag?' fromubb="1"':'')+' href="'+href+'">#</a><wbr>';
  }
  );
  str=str.replace(/\[url(|=([^\]]+))\](.+?)\[\/url\]/g,function()
  {
    var args=arguments;
    var REG_HTTP=/^http:\/\//i;var INVALID_HREF_STRING=/[\"\']/i;var INVALID_EXPLAIN_STRING=/\[(em|video|flash|audio|vphoto|quote|ffg|url|marque|email)/i;var explain="";var href="";if(!args[1]){if(REG_HTTP.test(args[3])){explain=href=args[3];}}else{if(REG_HTTP.test(args[2])){explain=args[3];href=args[2];}else if(REG_HTTP.test(args[3])){explain=args[2];href=args[3];}}
    if(!href||!explain||INVALID_HREF_STRING.test(href)||INVALID_EXPLAIN_STRING.test(explain))
    return args[0];
    else
    return'<a'+(bAddFlag?' fromubb="1"':'')+' href="'+href+'" target="_blank">'+explain+'</a><wbr>';
  }
  );
  str=str.replace(qzReg.ubbResizeImg,function()
  {
    var strUrl=arguments[3];
    var height=arguments[2];
    var width=arguments[1];
    return'<img'+(bAddFlag?' fromubb="1"':'')+' appendurl="1" src="http'+strUrl+'" border="0" width="'+width+'" height="'+height+'" alt="图片" />';
  }
  );
  str=str.replace(qzReg.ubbImage,function()
  {
    var strUrl=arguments[1];
    return'<img'+(bAddFlag?' fromubb="1"':'')+' appendurl="1" src="http'+strUrl+'" border="0" alt="图片" />';
  }
  );
  var fontCount=0;
  var a;
  if(a=str.match(qzReg.ubbGlow))
  {
    fontCount+=a.length;
    str=str.replace(qzReg.ubbGlow,'<font style="line-height:1.8em"'+(bAddFlag?' fromubb="1"':'')+' class="lightFont" title="发光字" _glowColor="$1" color="$1">');
  }
  if(a=str.match(qzReg.ubbFont))
  {
    fontCount+=a.length;
    str=str.replace(qzReg.ubbFont,function()
    {
      var s=arguments[1].split(",");
      var color=s[0]?' color='+s[0]:'';
      var size=s[1]?' size='+(s[1]>6?6:s[1]):'';
      var face=s[2]?' face='+s[2]:'';
      return'<font style="line-height:1.8em"'+(bAddFlag?' fromubb="1"':'')+color+size+face+'>';
    }
    );
  }
  if(a=str.match(qzReg.ubbFontColor))
  {
    fontCount+=a.length;
    str=str.replace(qzReg.ubbFontColor,'<font'+(bAddFlag?' fromubb="1"':'')+' color="$1" style="line-height:1.8em">');
  }
  if(a=str.match(qzReg.ubbFontSize))
  {
    fontCount+=a.length;
    str=str.replace(qzReg.ubbFontSize,'<font'+(bAddFlag?' fromubb="1"':'')+' size="$1" style="line-height:1.8em">');
  }
  if(a=str.match(qzReg.ubbFontFace))
  {
    fontCount+=a.length;
    str=str.replace(qzReg.ubbFontFace,'<font'+(bAddFlag?' fromubb="1"':'')+' face="$1" style="line-height:1.8em">');
  }
  var regstr=/\[\/ft\]/g;
  if(a=str.match(regstr))
  {
    fontCount-=a.length;
    str=str.replace(regstr,"</font>");
  }
  if(fontCount>0)
  {
    str+=(new Array(fontCount+1)).join("</font>");
  }
  str=str.replace(/\[ol\]/ig,'<ol'+(bAddFlag?' fromubb="1"':'')+' style="list-style-type:decimal">').replace(/\[\/ol\]/ig,"</ol>").replace(/\[ul\]/ig,'<ul'+(bAddFlag?' fromubb="1"':'')+' style="list-style-type:disc">').replace(/\[\/ul\]/ig,"</ul>").replace(/\[li\]/ig,'<li'+(bAddFlag?' fromubb="1"':'')+'>').replace(/\[\/li\]/ig,"</li>");
  var regstr=new RegExp("\\[email\\](.*?)\\[\\/email\\]","ig");
  str=str.replace(regstr,'<a'+(bAddFlag?' fromubb="1"':'')+' href="mailto:$1" target="_blank">$1</a>');
  var regstr=new RegExp("\\[email=(.*?)\\](.*?)\\[\\/email\\]","ig");
  str=str.replace(regstr,'<a'+(bAddFlag?' fromubb="1"':'')+' href="mailto:$2" target="_blank">$1</a>');
  str=str.replace(/\[B\](.*?)\[\/B\]/ig,'<B fromubb="1">$1</B>');
  str=str.replace(/\[U\](.*?)\[\/U\]/ig,'<U fromubb="1">$1</U>');
  str=str.replace(/\[I\](.*?)\[\/I\]/ig,'<I fromubb="1">$1</I>');
  str=str.replace(/\[M\]/ig,'<p align=center'+(bAddFlag?' fromubb="1"':'')+'>&shy;');
  str=str.replace(/\[\/M\]/ig,"</p>");
  str=str.replace(/\[R\]/ig,'<p align=right'+(bAddFlag?' fromubb="1"':'')+'>&shy;');
  str=str.replace(/\[\/R\]/ig,"</p>");
  return str;
}
QZFL.editor.parser.addInputRule("html","procLineChar",procLineChar);
QZFL.editor.parser.addInputRule("html","simpleUBBToHTML",UBBToHTML);
QZFL.editor.parser.addOutputRule("html","simpleHTMLToUBB",HTMLToUBB,true);
QZFL.editor.parser.simpleUBBToHTML=UBBToHTML;
QZFL.editor.parser.simpleHTMLToUBB=HTMLToUBB;
}
)();
QZFL.editor.button.checkStyle=function(uniqueID)
{
var _editor=QZFL.editor.get(uniqueID);
var _sr=_editor.getCurrentEditor().getSelectionRange();
var _c=_sr.getHtmlContents();
if(_c&&/lightFont/g.test(_c))
{
  if(QZFL.userAgent.ie)
  {
    _p=_sr.range.parentElement().parentNode;
    if(_p.tagName!="HTML")
    {
      _p.innerHTML="&#173;"+_p.innerHTML;
      _sr.range.moveStart("character",0);
      _sr.range.collapse(true);
      _sr.range.select();
    }
  }
  _editor.execCommand("removeformat",false,true);
}
else
{
  var _ac=_sr.getCommonAncestorContainer();
  _ac=_ac.nodeType==3?_ac.parentNode:_ac;
  if(_ac.className=="lightFont")
  {
    _editor.execCommand("removeformat",false,true);
  }
}
}
QZFL.editor.buttons.insert(
{
name:"bold",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_bold",title:QZFL.editor.lang.getLang("button_bold"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._buttonElement.innerHTML="";
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    if(QZFL.editor.button.checkStyle)
    {
      QZFL.editor.button.checkStyle(this._editorUniqueID);
    }
    _editor.execCommand("bold",false);
    this.query();
  }
  this.query=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    var _state=_editor.getEditor("html").editorDoc.queryCommandState("bold");
    if(_state)
    {
      QZFL.editor.button.highlight(this._buttonElement);
    }
    else
    {
      QZFL.editor.button.unHighlight(this._buttonElement);
    }
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"fontcolor",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_color",title:QZFL.editor.lang.getLang("button_color"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._colorPanel=QZFL.widget.colorPicker.bind(this._buttonElement);
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    this._colorPanel.onSelect=QZFL.event.bind(this,this.execute);
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function(color)
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    if(QZFL.editor.button.checkStyle)
    {
      QZFL.editor.button.checkStyle(this._editorUniqueID);
    }
    _editor.execCommand("forecolor",color);
  }
  this.query=function()
  {
    this._colorPanel.hide();
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"italic",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_italic",title:QZFL.editor.lang.getLang("button_italic"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    if(QZFL.editor.button.checkStyle)
    {
      QZFL.editor.button.checkStyle(this._editorUniqueID);
    }
    _editor.execCommand("italic",true);
    this.query();
  }
  this.query=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    var _state=_editor.getEditor("html").editorDoc.queryCommandState("italic");
    if(_state)
    {
      QZFL.editor.button.highlight(this._buttonElement);
    }
    else
    {
      QZFL.editor.button.unHighlight(this._buttonElement);
    }
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"underline",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_underline",title:QZFL.editor.lang.getLang("button_underline"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    if(QZFL.editor.button.checkStyle)
    {
      QZFL.editor.button.checkStyle(this._editorUniqueID);
    }
    _editor.execCommand("underline",true);
    this.query();
  }
  this.query=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    var _state=_editor.getEditor("html").editorDoc.queryCommandState("underline");
    if(_state)
    {
      QZFL.editor.button.highlight(this._buttonElement);
    }
    else
    {
      QZFL.editor.button.unHighlight(this._buttonElement);
    }
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"cleanstyle",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_clean",title:QZFL.editor.lang.getLang("button_cleanstyle"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._buttonElement.innerHTML="";
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    _editor.execCommand("removeformat",true);
    _editor.getCurrentToolbar().queryState();
  }
  this.query=function()
  {
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"glowfont",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_light",title:QZFL.editor.lang.getLang("button_glowfont"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._colorPanel=QZFL.widget.colorPicker.bind(this._buttonElement);
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    this._colorPanel.onSelect=QZFL.event.bind(this,this.execute);
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function(color)
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    var _r=_editor.getCurrentEditor().getSelectionRange();
    if(_r.isCollapsed())
    {
      _editor.showTips(QZFL.editor.lang.getLang("tips_glowfont1"),
      {
        timeout:3000
      }
      );
      return
    }
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
      if(!this._notIE_tips)
      {
        _editor.showTips(QZFL.editor.lang.getLang("tips_glowfont3"),
        {
          timeout:3000
        }
        );
        this._notIE_tips=true;
      }
    }
    _editor.execCommand("removeformat",true);
    var _cEditor=_editor.getCurrentEditor();
    var _s=_cEditor.getSelection();
    var _r=_cEditor.getSelectionRange();
    var _html=_cEditor.getSelectHtml();
    var _p='<font class="lightFont" title="发光字" _glowColor="'+color+'" color="'+color+'">';
    var _b='</font>';
    var re=/(<(div|p)[^>]*>)(.*?)(<\/(div|p)[^>]*>)/ig;
    if(re.test(_html))
    {
      _html=_html.replace(re,"$1"+_p+"$3"+_b+"$4");
      _cEditor.fillHtml(_html);
    }
    else
    {
      _cEditor.fillHtml(_p+_html+_b);
    }
  }
  this.query=function()
  {
    this._colorPanel.hide();
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"justifycenter",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"typeset_center",title:QZFL.editor.lang.getLang("button_justifycenter"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    _editor.execCommand("justifycenter",true);
    _editor.getCurrentToolbar().queryState();
  }
  this.query=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    var _state=_editor.getEditor("html").editorDoc.queryCommandState("justifycenter");
    if(_state)
    {
      QZFL.editor.button.highlight(this._buttonElement);
    }
    else
    {
      QZFL.editor.button.unHighlight(this._buttonElement);
    }
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"justifyleft",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"typeset_left",title:QZFL.editor.lang.getLang("button_justifyleft"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    _editor.execCommand("justifyleft",true);
    _editor.getCurrentToolbar().queryState();
  }
  this.query=function()
  {
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"justifyright",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"typeset_right",title:QZFL.editor.lang.getLang("button_justifyright"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    if(!QZFL.userAgent.ie)
    {
      _editor.execCommand('styleWithCSS',false,false);
    }
    _editor.execCommand("justifyright",true);
    _editor.getCurrentToolbar().queryState();
  }
  this.query=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    var _state=_editor.getEditor("html").editorDoc.queryCommandState("justifyright");
    if(_state)
    {
      QZFL.editor.button.highlight(this._buttonElement);
    }
    else
    {
      QZFL.editor.button.unHighlight(this._buttonElement);
    }
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"historyback",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn inout_backout",title:QZFL.editor.lang.getLang("button_historyback"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._buttonElement.innerHTML="";
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    _editor.getCurrentEditor().history.back();
  }
  this.query=function()
  {
  }
}
}
);
QZFL.editor.buttons.insert(
{
name:"historynext",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn inout_resume",title:QZFL.editor.lang.getLang("button_historyforward"),isCustomButton:false
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
    }
    this._buttonElement.innerHTML="";
    this._initEvent();
    return this._buttonElement;
  }
  this._initEvent=function()
  {
    QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
  }
  this.getElement=function()
  {
    return this._buttonElement;
  }
  this.execute=function()
  {
    var _editor=QZFL.editor.get(this._editorUniqueID);
    _editor.getCurrentEditor().history.forward();
  }
  this.query=function()
  {
  }
}
}
);
QZFL.EFP=
{
getTarget:function()
{
  return parent._dialogFrame||parent;
}
};
QZFL.Menu=function()
{
QZFL.Menu.count++;
QZFL.Menu.items[QZFL.Menu.count]=this;
this.id=QZFL.Menu.count;
this.onrender=QZFL.emptyFn;
this.onbeforeClick=QZFL.emptyFn;
this.onafterClick=QZFL.emptyFn;
this.onshow=QZFL.emptyFn;
this.onhide=QZFL.emptyFn;
this.onunload=QZFL.emptyFn;
this.init();
this.lock=false;
this.bindList=[];
this.transferArgs=null;
this._isHide=true;
this._menuBindFN=QZFL.event.bind(this,this.show);
}
QZFL.Menu._bt=["contextmenu","click","mouseover"];
QZFL.Menu.prototype.init=function()
{
this.menuId="qzMenu_"+QZFL.Menu.count;
this.menuElement=document.createElement("div");
this.menuElement.id=this.menuId;
this.menuElement.className="qz_menu";
this.menuElement.style.visibility="hidden";
this.menuElement.innerHTML='<div class="qz_menu_shadow"><ul id="qz_menu_'+this.menuId+'" class="qz_menu_ul"></ul></div>';
document.body.appendChild(this.menuElement);
this.menuUL=QZFL.dom.get("qz_menu_"+this.menuId);
}
QZFL.Menu.prototype.setHeight=function(nHeight)
{
nHeight=parseInt(nHeight,10);
if(isNaN(nHeight)||nHeight<0)
{
  return false;
}
QZFL.dom.setStyle(this.menuUL,"overflowY","auto");
QZFL.dom.setStyle(this.menuUL,"height",nHeight);
return true;
}
QZFL.Menu.doItemClick=function(item,menu)
{
if(!item||!menu)
{
  return;
}
if(item.onclick)
{
  item.onclick.call(menu);
}
menu.hide();
menu.onafterClick(item,menu);
};
QZFL.Menu.prototype.render=function(items)
{
this.menuUL.innerHTML="";
var _arrHtml=[],o=this;
for(var k in items)
{
  var _item=document.createElement("li");
  _item.id="qzMenuItem_"+QZFL.Menu.count+"_"+k;
  if(items[k].separator)
  {
    _item.innerHTML='<div class="qz_menu_separator"/>';
  }
  else
  {
    QZFL.event.addEvent(_item,"click",QZFL.event.bind(items[k],function()
    {
      if(o.onbeforeClick(this,o))
      {
        return;
      }
      QZFL.Menu.doItemClick(this,o);
    }
    ));
    _item.innerHTML=['<a class="qz_menu_a" href="',(items[k].url||"javascript:;"),'" target="',(items[k].target||""),'"',((!items[k].url)?' onclick="return false;">':'>'),(items[k].checked?'<strong style="">√</strong>':''),items[k].text,'</a>'].join("");
  }
  this.menuUL.appendChild(_item);
}
this.menuSize=QZFL.dom.getSize(this.menuUL);
this.onrender();
}
QZFL.Menu.prototype.clear=function()
{
this.menuUL.innerHTML="";
}
QZFL.Menu.prototype.bind=function(el,type,menuArray,transferArgs)
{
if(!el)
{
  return;
}
el=(el.nodeType==9?el:QZFL.dom.get(el));
if(!el)
{
  return;
}
type=(el.nodeType==9||!type)?0:type;
this.bindList.push([el,QZFL.Menu._bt[type]]);
el.menuId=this.id;
QZFL.event.addEvent(el,QZFL.Menu._bt[type],this._menuBindFN,[el,type,menuArray,transferArgs]);
this.hide();
}
QZFL.Menu.prototype.unBind=function(el,type)
{
if(!el)
{
  return;
}
el=(el.nodeType==9?el:QZFL.dom.get(el));
if(!el)
{
  return;
}
type=(el.nodeType==9||!type)?0:type;
QZFL.event.removeEvent(el,QZFL.Menu._bt[type],this._menuBindFN);
el.menuId=null;
}
QZFL.Menu.prototype.show=function(e,el,type,menuArray,transferArgs)
{
if(menuArray)
{
  this.clear();
  this.render(menuArray);
}
if(el)
{
  var _isDoc=(el.nodeType==9),_xy=_isDoc?[0,0]:QZFL.dom.getXY(el),_size=_isDoc?[0,0]:QZFL.dom.getSize(el),_wL=QZFL.dom.getClientWidth()+QZFL.dom.getScrollLeft(),_hT=QZFL.dom.getClientHeight()+QZFL.dom.getScrollTop(),l,t;
  type=_isDoc?0:type;
  switch(type)
  {
    case 2:l=_xy[0]+_size[0]-2;
    t=_xy[1]-2;
    break;
    case 1:l=_xy[0];
    t=_xy[1]+_size[1];
    break;
    default:l=e.clientX+QZFL.dom.getScrollLeft();
    t=e.clientY+QZFL.dom.getScrollTop();
  }
  if(l+this.menuSize[0]>_wL)
  {
    l=l-this.menuSize[0]-((type==0||type==1)?0:_size[0]);
  }
  if(t+this.menuSize[1]>_hT)
  {
    t=t-this.menuSize[1]-(type==0?0:_size[1]);
  }
  QZFL.dom.setXY(this.menuElement,l,t);
  QZFL.event.preventDefault();
  QZFL.event.addEvent(document,"mousedown",QZFL.Menu.hideAll);
}
this.menuElement.style.visibility="visible";
QZFL.Menu._showItems[this.id]=this;
if(QZFL.lang.isHashMap(transferArgs))
{
  this.transferArgs=transferArgs;
};
this._isHide=false;
this.onshow.call(this,[e,el,type]);
}
QZFL.Menu.prototype.hide=function(ignoreLock)
{
if((this.lock&&!ignoreLock)||this._isHide)
{
  return;
}
this.menuElement.style.visibility="hidden";
delete QZFL.Menu._showItems[this.id];
try
{
  QZFL.event.removeEvent(document,"mousedown",QZFL.Menu.hideAll);
}
catch(ign)
{
}
this.onhide.call(this);
this.transferArgs=null;
this._isHide=true;
}
QZFL.Menu.prototype.unload=function()
{
for(var k in this.bindList)
{
  var _i=this.bindList[k][0];
  if(_i)
  {
    QZFL.event.removeEvent(_i,this.bindList[k][1],this.show)
  }
}
this._isHide=true;
this.bindList=null;
this.onunload();
}
QZFL.Menu.hideAll=function()
{
var el=QZFL.event.getTarget();
if(el)
{
  var _te=QZFL.dom.searchElementByClassName(el,"qz_menu");
  if(_te)
  {
    return;
  }
}
for(var k in QZFL.Menu._showItems)
{
  if(el&&el.menuId==QZFL.Menu._showItems[k].id)
  {
    continue;
  }
  QZFL.Menu._showItems[k].hide(true);
}
}
QZFL.Menu.items=
{
};
QZFL.Menu.count=0;
QZFL.Menu._showItems=
{
};
QZFL.widget.colorPicker=
{
panelHtmlCache:"",cssPath:"http://imgcache.qq.com/ac/qzfl/release/css/colorpicker.css",cssLoaded:false,count:0,bind:function(element)
{
  this.count++;
  return new QZFL.widget.colorPickerPanel(this.count,element);
}
}
QZFL.widget.colorPickerPanel=function(id,element)
{
this._id=id;
this._element=QZFL.dom.get(element)||null;
this._panel=null;
this._isHide=true;
this.onSelect=QZFL.emptyFn;
if(this._element)
{
  this._init();
}
if(!QZFL.widget.colorPicker.cssLoaded)
{
  QZFL.css.insertCSSLink(QZFL.widget.colorPicker.cssPath);
  QZFL.widget.colorPicker.cssLoaded=true;
}
};
QZFL.widget.colorPickerPanel.prototype=
{
_init:function()
{
  this._panel=QZFL.dom.createElementIn("div",document.body,false,
  {
    style:"display:none;position:absolute;border:1px solid #999;padding:3px;background:#fff;font-size:12px;z-index:10001"
  }
  );
  this._panel.className="qzfl_color_panel";
  this._panel.innerHTML=this._getHtml();
  this._colorViewer=QZFL.dom.get("colorViewer"+this._id);
  this._colorViewerCode=QZFL.dom.get("colorViewerCode"+this._id);
  QZFL.event.addEvent(this._element,"click",QZFL.event.bind(this,this.show));
  QZFL.event.addEvent(this._panel,"click",QZFL.event.bind(this,this._select));
}
,show:function(e)
{
  var _dialogWidth=220;
  var targetPos=QZFL.dom.getPosition(this._element);
  if(QZFL.dom.getClientWidth()-targetPos.left<_dialogWidth)
  {
    QZFL.dom.setXY(this._panel,targetPos.left-_dialogWidth+targetPos.width,targetPos.top+targetPos.height);
  }
  else
  {
    QZFL.dom.setXY(this._panel,targetPos.left,targetPos.top+targetPos.height);
  }
  this._panel.style.display="";
  this._bindD=QZFL.event.bind(this,this.hide);
  this._bindM=QZFL.event.bind(this,this._mouseMove);
  QZFL.event.addEvent(document,"mousedown",this._bindD);
  QZFL.event.addEvent(document,"mousemove",this._bindM);
  this._isHide=false;
  QZFL.event.preventDefault(e);
}
,_select:function(e)
{
  var _et=QZFL.event.getTarget(e);
  var _c=_et.getAttribute("select_color");
  if(_c)
  {
    this.onSelect(_c);
    this._hide();
  }
}
,hide:function()
{
  this._panel.style.display="none";
}
,_mouseMove:function(e)
{
  var _et=QZFL.event.getTarget(e);
  var _c=_et.getAttribute("select_color");
  this._colorViewer.style.backgroundColor=_c||"";
  this._colorViewerCode.value=_c||"";
}
,hide:function(e)
{
  if(this._isHide)
  {
    return
  }
  var target=QZFL.event.getTarget(e);
  if(target==this._panel||QZFL.dom.isAncestor(this._panel,target))
  {
  }
  else
  {
    this._hide();
  }
}
,_hide:function()
{
  this._panel.style.display="none";
  QZFL.event.removeEvent(document,"mousedown",this._bindD);
  QZFL.event.removeEvent(document,"mousemove",this._bindM);
  delete this._bindD;
  delete this._bindM;
  this._isHide=true;
}
,_getHtml:function()
{
  var _gc=QZFL.widget.colorPicker.g_ColorPanel;
  if(_gc)
  {
    return _gc;
  }
  var ColorHex=['00','33','66','99','CC','FF'];
  var colorTable=['<table border="1" cellspacing="0" cellpadding="0" class="qzColorPanel"><tr><td colspan="18" class="colorViewer">'];
  colorTable.push('<input id="colorViewer'+this._id+'" style="width:50px;background:#ECE9D8;height:auto" readonly><input id="colorViewerCode'+this._id+'" style="width:80px;height:auto" readonly></td></tr>');
  for(i=0;i<2;i++)
  {
    for(j=0;j<6;j++)
    {
      colorTable.push('<tr>');
      for(k=0;k<3;k++)
      {
        for(l=0;l<6;l++)
        {
          var c=ColorHex[k+i*3]+ColorHex[l]+ColorHex[j];
          colorTable.push('<td unselectable="on" style="background-color:#'+c+'" select_color = "#'+c+'"></td>');
        }
      }
      colorTable.push('</tr>');
    }
  }
  colorTable.push('</table>');
  _gc=colorTable.join("");
  return _gc;
}
};
QZFL.widget.emotion=
{
_themePath:"/qzone/em/theme",_defaultThemePath:"/qzone/em/theme",defaultEmotionPackage:(function()
{
  var dem=['微笑','撇嘴','色','发呆','得意','流泪','害羞','闭嘴','睡','大哭','尴尬','发怒','调皮','呲牙','惊讶','难过','酷','冷汗','抓狂','吐','偷笑','可爱','白眼','傲慢','饥饿','困','惊恐','流汗','憨笑','大兵','奋斗','咒骂','疑问','嘘','晕','折磨','衰','骷髅','敲打','再见','擦汗','抠鼻','鼓掌','糗大了','坏笑','左哼哼','右哼哼','哈欠','鄙视','委屈','快哭了','阴险','亲亲','吓','可怜','菜刀','西瓜','啤酒','篮球','乒乓','咖啡','饭','猪头','玫瑰','凋谢','示爱','爱心','心碎','蛋糕','闪电','炸弹','刀','足球','瓢虫','便便','月亮','太阳','礼物','拥抱','强','弱','握手','胜利','抱拳','勾引','拳头','差劲','爱你','NO','OK','爱情','飞吻','跳跳','发抖','怄火','转圈','磕头','回头','跳绳','挥手','激动','街舞','献吻','左太极','右太极'];
  var pack=[];
  while(dem.length)
  {
    pack[pack.length]=
    {
      title:dem.shift(),url:"/qzone/em/e"+(100+pack.length)+".gif",pre:"/qzone/em/e"+(100+pack.length)+".gif"
    };
  }
  return pack;
}
)(),_emotionList:
{
}
,bind:function(element,theme)
{
  theme=theme||["default"];
  return new QZFL.widget.emotionPanel(element,theme,this._themePath);
}
,setThemeMainPath:function(path)
{
  this._themePath=path;
}
,addEmotionList:function(emotionName,emotionPackage)
{
  QZFL.console.print("add Package");
  this._emotionList[emotionName]=emotionPackage;
}
,getEmotionPackage:function(emotionName)
{
  return this._emotionList[emotionName];
}
};
QZFL.widget.emotionPanel=function(element,theme,themePath)
{
this.element=QZFL.dom.get(element);
this.uniqueID="EM"+new Date().getTime().toString(36);
this.theme=theme;
this.panel=null;
this.package=[];
this.activeTab=0;
this.currentIndex=theme;
this.tabScrollTimer=null;
this.currentPageIndex=1;
this._defaultPageSize=105;
this.pageSize=36;
this._cssPath=themePath+"/"+this.theme+".css";
this._emPreview=null;
this._init();
this.onSelect=QZFL.emptyFn;
this.onShow=QZFL.emptyFn;
this._isHide=true;
};
QZFL.widget.emotionPanel.prototype._init=function()
{
var _this=this;
this.panel=QZFL.dom.createElementIn("div",document.body,false,
{
  style:"display:none;position:absolute;z-index:10001;overflow:hidden;"
}
);
this.panel.className="qz_expression_layer";
this.panel.id=this.uniqueID;
this.panel.innerHTML=QZFL.string.write('<div class="qz_expression_layer_topper">'+'<map id="qz_expression_layer_menu" name="qz_expression_layer_menu"><div class="avatars_menu" id="{0}_menu"></div></map>'+'<div class="avatars_menu_page"><a href="javascript:void(0);" onclick="return false;" title="向前" id="{0}_left" emaction="-1" class="qz_expression_menu_pre"><span>向前</span></a><a href="javascript:void(0);" onclick="return false;" id="{0}_right" title="向后" emaction="1" class="qz_expression_menu_next"><span>向后</span></a></div>'+'</div>'+'<div class="qz_expression_cont" id="{0}_content">'+'<table cellpadding=0 cellspacing=0 border=0 id="{0}_emPreview" class="qzfl_emotion_preview_default" style="width:84px;height:84px;display:none;text-align:center;line-height:84px;background-color:#FFFFFF;border:1px solid #999999;position:absolute;overflow:hidden;"><tbody><tr><td valign=middle align=center></td></tr></tbody></table><ul class="qzfl_emotion_default" id="{0}_list"></ul><p id="{0}_message" class="edit_list_msg">此分组中尚未添加表情</p><p id="{0}_loading" class="edit_list_msg">加载中。。。</p></div></div>'+'<div class="qz_expression_op">'+'<div class="link_manage" id="{0}_option"></div>'+'<div class="qz_expression_page"><a href="javascript:void(0);" onclick="return false;" id="{0}_prev">上一页</a> <span id="{0}_page_number">1/10</span> <a href="javascript:void(0);" onclick="return false;" id="{0}_next">下一页</a></div>'+'</div>',this.uniqueID);
this.contentPanel=$(this.uniqueID+"_content");
this._emPreview=$(this.uniqueID+"_emPreview");
this.emList=$(this.uniqueID+"_list");
this.message=$(this.uniqueID+"_message");
this.loading=$(this.uniqueID+"_loading");
this.emList.style.width="100%";
this.tabArea=$(this.uniqueID+"_menu");
this.tabArea.style.cssText="width:32767px;position:relative;top:0;left:0;";
this.scrollIconL=$(this.uniqueID+"_left");
this.scrollIconR=$(this.uniqueID+"_right");
this.prevPage=$(this.uniqueID+"_prev");
this.nextPage=$(this.uniqueID+"_next");
this.pageNumber=$(this.uniqueID+"_page_number");
QZFL.event.addEvent(this.scrollIconL,"mousedown",QZFL.event.bind(this,this.scrollTabs));
QZFL.event.addEvent(this.scrollIconR,"mousedown",QZFL.event.bind(this,this.scrollTabs));
QZFL.event.addEvent(this.prevPage,"mousedown",QZFL.event.bind(this,this.jumpPrevPage));
QZFL.event.addEvent(this.nextPage,"mousedown",QZFL.event.bind(this,this.jumpNextPage));
QZFL.event.addEvent(document,"mouseup",QZFL.event.bind(this,this.stopTabs));
QZFL.event.addEvent(this.contentPanel,"click",QZFL.event.bind(this,this.select));
QZFL.event.addEvent(this.element,"click",QZFL.event.bind(this,this.show));
QZFL.css.insertCSSLink(this._cssPath);
this.clear();
};
QZFL.widget.emotionPanel.prototype.setOptionPanel=function(html)
{
$(this.uniqueID+"_option").innerHTML=html;
};
QZFL.widget.emotionPanel.prototype.addEmotionGroup=function(groupName,callback)
{
emotions=typeof emotions=="object"&&emotions instanceof Array?emotions:[];
callback=typeof callback!="function"?QZFL.emptyFn:callback;
var tab=document.createElement("a");
tab.onclick=function()
{
  return false;
};
tab.name=this.uniqueID+"_tab_"+this.tabArea.childNodes.length;
tab.innerHTML="<span emotionpackid='"+this.tabArea.childNodes.length+"'>"+groupName+"</span>";
tab.id=this.uniqueID+"_tab_"+this.tabArea.childNodes.length;
tab.href="javascript:;";
this.tabArea.appendChild(tab);
var _this=this;
var _callback=function(e)
{
  _this.showTab(e);
  callback.call(_this);
};
QZFL.event.addEvent(tab,"click",QZFL.event.bind(this,_callback));
return tab;
};
QZFL.widget.emotionPanel.prototype.clear=function()
{
var _this=this;
this.tabArea.innerHTML=this.emList.innerHTML="";
this.loading.style.display="block";
this.message.style.display="none";
this.emList.style.display="none";
this.activeTab=0;
this.currentPageIndex=1;
var _defaultCallback=function()
{
  this._readerDefaultPanel(QZFL.widget.emotion.defaultEmotionPackage,this.currentPageIndex);
  this._showTab(0);
  _this.tabArea.style.left="0";
  _this.checkScrollIcon();
};
this.addEmotionGroup("默认",_defaultCallback);
_defaultCallback.call(this);
};
QZFL.widget.emotionPanel.prototype.reload=function(callback)
{
this.clear();
(callback||QZFL.emptyFn).call(this);
};
QZFL.widget.emotionPanel.prototype._readerDefaultPanel=function(pack,pageIndex)
{
var ems=[];
var i=(pageIndex-1)*this._defaultPageSize;
var l=Math.min(pack.length,pageIndex*this._defaultPageSize);
for(;i<l;i++)
{
  ems[ems.length]=QZFL.string.write('<li style="padding:1px;border:1px solid #fff;" onmouseover="this.style.borderColor=\'#69c\';" onmouseout="this.style.borderColor=\'#fff\';"><a href="javascript:;" emotionurl="{3}" emotionpre="{4}" onclick="return false;"><div emotionurl="{3}" emotionpre="{4}" class="icon emotion_{1}_{0}">{2}</div></a></li>',i,pack==QZFL.widget.emotion.defaultEmotionPackage?"default":"",pack==QZFL.widget.emotion.defaultEmotionPackage?"":'<img emotionurl="'+pack[i].url+'" emotionpre="'+pack[i].pre+'" src="'+pack[i].pre+'" width="24" height="24" border="0" onload="if(this.width>24||this.height>24){if(this.width/this.height>1){this.height=parseInt(24*this.height/this.width);this.width=24;}else{this.width=parseInt(24*this.width/this.height);this.height=24;}}"/>',pack[i].url,pack[i].pre);
}
this.emList.innerHTML=ems.join("");
this._lastEmotion=null;
this._emPreImg=this._emPreview.getElementsByTagName("td")[0];
this.pageNumber.innerHTML=this.currentPageIndex+"/"+(Math.ceil(pack.length/this._defaultPageSize)||1);
if(this.emList.childNodes.length)
{
  this.emList.style.display="block";
  this.message.style.display="none";
}
else
{
  this.emList.style.display="none";
  this.message.style.display="block";
}
this.prevPage.style.display="none";
this.nextPage.style.display="none";
this.pageNumber.style.display="none";
this.loading.style.display="none";
};
QZFL.widget.emotionPanel.prototype.fillContent=function(pack,pageIndex)
{
var ems=[];
var i=(pageIndex-1)*this.pageSize;
var l=Math.min(pack.length,pageIndex*this.pageSize);
for(;i<l;i++)
{
  ems[ems.length]=QZFL.string.write('<li style="padding:1px;border:1px solid #fff;" onmouseover="this.style.borderColor=\'#69c\';" onmouseout="this.style.borderColor=\'#fff\';"><a href="javascript:;" emotionurl="{3}" emotionpre="{4}" onclick="return false;"><div emotionurl="{3}" emotionpre="{4}" style="width:43px;height:46px;">{2}</div></a></li>',i,pack==QZFL.widget.emotion.defaultEmotionPackage?"default":"",pack==QZFL.widget.emotion.defaultEmotionPackage?"":'<img emotionurl="'+pack[i].url+'" emotionpre="'+pack[i].pre+'" src="'+pack[i].pre+'" border="0" onload="if(this.width>43||this.height>46){if(this.width/this.height>43/46){this.height=parseInt(43*this.height/this.width);this.width=43;}else{this.width=parseInt(46*this.width/this.height);this.height=46;}}" onerror="this.width=43;this.height=46;" />',pack[i].url,pack[i].pre);
}
this.emList.innerHTML=ems.join("");
this._lastEmotion=null;
this._emPreImg=this._emPreview.getElementsByTagName("td")[0];
this.pageNumber.innerHTML=this.currentPageIndex+"/"+(Math.ceil(pack.length/this.pageSize)||1);
if(this.emList.childNodes.length)
{
  this.emList.style.display="block";
  this.message.style.display="none";
}
else
{
  this.emList.style.display="none";
  this.message.style.display="block";
}
this.loading.style.display="none";
if(Math.ceil(pack.length/this.pageSize)<=1)
{
  this.prevPage.style.display="none";
  this.nextPage.style.display="none";
  this.pageNumber.style.display="none";
}
else
{
  if(pageIndex<=1)
  {
    this.prevPage.style.display="none";
    this.nextPage.style.display="";
  }
  else if(pageIndex>1&&pageIndex<Math.ceil(pack.length/this.pageSize))
  {
    this.prevPage.style.display="";
    this.nextPage.style.display="";
  }
  else
  {
    this.prevPage.style.display="";
    this.nextPage.style.display="none";
  }
  this.pageNumber.style.display="";
}
};
QZFL.widget.emotionPanel.prototype.showMessage=function(message)
{
this.emList.style.display="none";
this.message.style.display="block";
this.message.innerHTML=message;
this.loading.style.display="none";
};
QZFL.widget.emotionPanel.prototype.stopTabs=function(e)
{
window.clearInterval(this.tabScrollTimer);
};
QZFL.widget.emotionPanel.prototype.scrollTabs=function(e)
{
var target=QZFL.event.getTarget(e);
if(target.getAttribute("emaction"))
{
  var _this=this;
  window.clearInterval(this.tabScrollTimer);
this.tabScrollTimer=window.setInterval(function()
{
  _this.tabArea.style.left=Math.min(Math.max(parseInt(_this.tabArea.style.left)-parseInt(target.getAttribute("emaction"))*10,-(_this.tabArea.lastChild.offsetLeft+_this.tabArea.lastChild.offsetWidth-440+44)),0)+"px";
  _this.checkScrollIcon();
}
,50);
}
};
QZFL.widget.emotionPanel.prototype.checkScrollIcon=function()
{
if(parseInt(this.tabArea.style.left)<0&&this.scrollIconL.className!="qz_expression_menu_pre")
{
this.scrollIconL.className="qz_expression_menu_pre";
}
if(parseInt(this.tabArea.style.left)>=0&&this.scrollIconL.className!="qz_expression_menu_pre_n")
{
this.scrollIconL.className="qz_expression_menu_pre_n";
}
if(parseInt(this.tabArea.style.left)>-(this.tabArea.lastChild.offsetLeft+this.tabArea.lastChild.offsetWidth-440+44)&&this.scrollIconR.className!="qz_expression_menu_next")
{
this.scrollIconR.className="qz_expression_menu_next";
}
if(parseInt(this.tabArea.style.left)<=-(this.tabArea.lastChild.offsetLeft+this.tabArea.lastChild.offsetWidth-440+44)&&this.scrollIconR.className!="qz_expression_menu_next_n")
{
this.scrollIconR.className="qz_expression_menu_next_n";
}
}
QZFL.widget.emotionPanel.prototype.show=function(e)
{
this._show();
QZFL.event.preventDefault(e);
};
QZFL.widget.emotionPanel.prototype._show=function()
{
QZFL.console.print("show emotions");
var targetPos=QZFL.dom.getPosition(this.element);
this.panel.style.display="";
var _dialogWidth=QZFL.dom.getPosition(this.panel).width;
var _dialogHeight=QZFL.dom.getPosition(this.panel).height;
QZFL.dom.setXY(this.panel,Math.max(0,Math.min(targetPos.left,document.body.scrollWidth-_dialogWidth)),Math.max(0,Math.min(targetPos.top+targetPos.height,document.body.scrollHeight-_dialogHeight)));
if(!this._bindD)
{
this._bindD=QZFL.event.bind(this,this.hide);
this._bindM=QZFL.event.bind(this,this._mousemove);
QZFL.event.addEvent(document,"mousedown",this._bindD);
QZFL.event.addEvent(document,"mousemove",this._bindM);
}
this._panelPosition=QZFL.dom.getPosition(this.panel);
this._isHide=false
this.onShow(this.panel,this.element);
this.checkScrollIcon();
};
QZFL.widget.emotionPanel.prototype.select=function(e)
{
QZFL.console.print("select emotions");
var target=QZFL.event.getTarget(e);
var _eID=target.getAttribute("emotionurl");
if(_eID)
{
QZFL.console.print("emotion id:"+_eID);
this.onSelect(
{
  id:_eID,fileName:target.getAttribute("emotionurl")
}
);
this._hide();
}
QZFL.event.preventDefault(e);
};
QZFL.widget.emotionPanel.prototype._mousemove=function(e)
{
var target=QZFL.event.getTarget(e);
var _eID=target.getAttribute("emotionurl");
if(QZFL.dom.isAncestor(this.panel,target))
{
if(_eID&&this._lastEmotion!=_eID)
{
  this._emPreview.style.display="";
  this._lastEmotion=_eID;
  if(QZFL.event.mouseX(e)<this._panelPosition.left+this._panelPosition.width/2)
  {
    this._emPreview.style.left="";
    this._emPreview.style.right="6px";
  }
  else
  {
    this._emPreview.style.left="6px";
    this._emPreview.style.right="";
  }
  this._emPreImg.innerHTML=['<img style="display:inline;border:0 none #fff;margin:0;padding:0" src="',target.getAttribute("emotionpre"),'" onload="if(this.width>80||this.height>80){if(this.width/this.height>1){this.height=parseInt(80*this.height/this.width);this.width=80;}else{this.width=parseInt(80*this.width/this.height);this.height=80;}}"/>'].join("");
}
}
else
{
this._lastEmotion=null;
this._emPreview.style.display="none";
}
};
QZFL.widget.emotionPanel.prototype.hide=function(e)
{
if(this._isHide)
{
return;
}
var target=QZFL.event.getTarget(e);
if(target==this.panel||QZFL.dom.isAncestor(this.panel,target))
{
}
else
{
this._hide();
}
};
QZFL.widget.emotionPanel.prototype._hide=function()
{
this.panel.style.display="none";
QZFL.event.removeEvent(document,"mousedown",this._bindD);
QZFL.event.removeEvent(document,"mousemove",this._bindM);
delete this._bindD;
delete this._bindM;
this._isHide=true;
};
QZFL.widget.emotionPanel.prototype.showTab=function(e)
{
this.loading.style.display="block";
this.emList.style.display="none";
this.message.style.display="none";
var target=QZFL.event.getTarget(e);
if(target.getAttribute("emotionpackid")==this.theme)
{
return;
}
else
{
this._showTab(target.getAttribute("emotionpackid"));
}
};
QZFL.widget.emotionPanel.prototype._showTab=function(pack)
{
if($(this.uniqueID+"_tab_"+this.activeTab))
{
$(this.uniqueID+"_tab_"+this.activeTab).className="";
this.activeTab=pack;
$(this.uniqueID+"_tab_"+this.activeTab).className="nonce";
this.currentPageIndex=1;
}
};
QZFL.widget.emotionPanel.prototype.jumpPrevPage=function(e)
{
if(this._isHide)
{
return;
}
this.jumpPage(--this.currentPageIndex);
};
QZFL.widget.emotionPanel.prototype.jumpNextPage=function(e)
{
if(this._isHide)
{
return;
}
this.jumpPage(++this.currentPageIndex);
};
QZFL.widget.emotionPanel.prototype.jumpPage=QZFL.emptyFn;
QZFL.editor.buttons.insert(
{
name:"autoindent",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"typeset_auto",title:"自动对齐",isCustomButton:false
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this._autoIndent=false
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
}
this._initEvent=function()
{
  var _htmleditor=QZFL.editor.get(this._editorUniqueID).getEditor("html");
  if(_htmleditor)
  {
    var _doc=_htmleditor.getDocument();
    QZFL.event.addEvent(_doc,"keyup",QZFL.event.bind(this,this._keyup));
  }
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
}
this._keyup=function(e)
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  if(this._autoIndent　&&　e.keyCode=="13"&&!e.shiftKey)
  {
    _editor.getCurrentEditor().fillHtml("<br/>　　");
  }
}
this.getElement=function()
{
  return this._buttonElement;
}
this.execute=function()
{
  this._autoIndent　=　!this._autoIndent;
  if(this._autoIndent)
  {
    QZFL.editor.button.highlight(this._buttonElement,"hover");
  }
  else
  {
    QZFL.editor.button.unHighlight(this._buttonElement,"hover");
  }
}
this.query=function()
{
}
}
}
);
QZFL.editor.buttons.insert(
{
name:"ollist",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"typeset_ol",title:QZFL.editor.lang.getLang("button_orderedList"),isCustomButton:false
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
}
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
}
this.getElement=function()
{
  return this._buttonElement;
}
this.execute=function()
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  _editor.execCommand("InsertOrderedList",true);
}
this.query=function()
{
}
}
}
);
QZFL.editor.buttons.insert(
{
name:"ullist",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"typeset_ul",title:QZFL.editor.lang.getLang("button_unorderedList"),isCustomButton:false
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
}
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
}
this.getElement=function()
{
  return this._buttonElement;
}
this.execute=function()
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  _editor.execCommand("InsertUnorderedList",true);
}
this.query=function()
{
}
}
}
);
QZFL.editor.buttons.insert(
{
name:"url",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"font_btn font_link",title:QZFL.editor.lang.getLang("button_link"),isCustomButton:false
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
}
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this._openUrlBox));
}
this.getElement=function()
{
  return this._buttonElement;
}
this.execute=function(uData)
{
  var _editor=QZFL.editor.get(this._editorUniqueID),r=_editor.getCurrentEditor(),t;
  if(QZFL.userAgent.ie)
  {
    r.focus();
    this._lastRange.getRange().select();
  }
  else if(r.type=="text"&&(t=r._instance))
  {
    if(t.value&&typeof(t.selectionStart)!="undefined")
    {
      r.fillText('<a href="'+uData+'" target="_blank">'+
      (t.selectionStart==t.selectionEnd?uData:t.value.substring(t.selectionStart,t.selectionEnd))+'</a>');
      return;
    }
  }
  var _r=r.getSelectionRange();
  var _isCollapsed=_r.isCollapsed();
  if(_isCollapsed)
  {
    var _a=this._searchLink(_r.getCommonAncestorContainer());
    if(_a)
    {
      _a.href=uData;
    }
    else
    {
      r[(r.type=="text"?"fillText":"fillHtml")]('<a href="'+uData+'" target="_blank">'+uData+'</a>');
    }
  }
  else
  {
    r[(r.type=="text"?"fillText":"fillHtml")]('<a href="'+uData+'" target="_blank">'+_r.getHtmlContents()+'</a>');
  }
}
this.query=function()
{
}
this._openUrlBox=function(e)
{
  var _ce=QZFL.editor.get(this._editorUniqueID).getCurrentEditor();
  this._lastRange=_ce.getSelectionRange();
  var _a=this._searchLink(this._lastRange.getCommonAncestorContainer());
  QZFL.editor.openDialog(this._editorUniqueID,QZFL.editor.lang.getLang("button_link"),"assets/dialog/insert_link.html"+(_a?"#"+encodeURI(_a.href):""),445,230);
  QZFL.event.preventDefault(e);
}
this._searchLink=function(o)
{
  while(o.tagName&&o.tagName!="BODY")
  {
    if(o.tagName=="A")
    {
      return o;
    }
    o=o.parentNode;
  }
  return null;
}
}
}
);
QZFL.editor.buttons.insert(
{
name:"fullscreen",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"btn_fullscreen",title:"",isCustomButton:true
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
    this._buttonElement=document.createElement("button");
    this._buttonElement.className=this.options.className;
    this._buttonElement.title=QZFL.editor.lang.getLang("tips_switch_fullscreen");
    this._buttonElement.innerHTML="<span>全屏</span>";
  }
  this._initEvent();
  return this._buttonElement;
}
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
}
this.getElement=function()
{
  return this._buttonElement;
}
this.execute=function(e)
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  var _re=_editor.switchFullScreen();
  var _s=this._buttonElement.getElementsByTagName("SPAN");
  this._buttonElement.className=_re?"btn_norscreen":"btn_fullscreen";
  _s[0].innerHTML=_re?"返回":"全屏";
  if(_re)
  {
    _editor.showTips(QZFL.editor.lang.getLang("tips_fullscreen"),5000);
  }
  else
  {
    _editor.hideTips();
  }
  if(QZFL.userAgent.ie<7)
  {
    var _se=document.getElementsByTagName("SELECT");
    for(var i=0;i<_se.length;i++)
    {
      _se[i].style.display=_re?"none":"";
    }
  }
  QZFL.event.preventDefault(e);
}
this.query=function()
{
}
}
}
);
QZFL.editor.config=
{
editorOptions:
{
width:"100%",height:"300px",editorList:["html","text"],toolbarList:["html_mini","html_full","html_simple","text"],resizable:true
}
,editorCSS:"/qzonestyle/qzone_app/app_editor_v2/gb_editor.css",editorPath:"/qzone/qzfl/editor/",domain:"qq.com"
};
QZFL.editor.toolbar.setLayout("html_simple",
{
extendClass:"editor_tools simple_mode",layouts:[
{
width:"auto",height:"auto",className:"font_tools",buttons:["fontfamily","fontsize","bold","italic","underline","fontcolor"]
}
,
{
width:"auto",height:"auto",className:"typeset_tools",buttons:["justifyleft","justifycenter","justifyright"]
}
,
{
width:"auto",height:"auto",className:"expert_tools",buttons:["emotions_s","insertimage_s",(QZFL.userAgent.ie<=7?"screenshot_s":"dump")]
}
,
{
width:"auto",height:"auto",className:"other_tools",buttons:["advancedstyle","help"]
}
]
}
);
QZFL.editor.toolbar.setLayout("html_mini",
{
extendClass:"editor_tools simple_mode super_mode",layouts:[
{
width:"auto",height:"auto",className:"font_tools",buttons:["fontfamily","fontsize","bold","italic","underline","fontcolor","glowfont"]
}
,
{
width:"auto",height:"auto",className:"typeset_tools",buttons:["justifyleft","justifycenter","justifyright"]
}
,
{
width:"auto",height:"auto",className:"expert_tools super_simple_tools",buttons:["emotions_s_img","insertimage_s_img","qqshowbubble_s_img",(QZFL.userAgent.ie<=7?"screenshot_s_img":"dump"),"music_s_img","video_s_img","flash_s_img"]
}
,
{
width:"auto",height:"auto",className:"other_tools",buttons:["advancedstyle","help"]
}
]
}
);
QZFL.editor.toolbar.setLayout("html_full",
{
extendClass:"editor_tools",layouts:[
{
width:"auto",height:"auto",className:"font_tools",buttons:["fontfamily","fontsize","bold","italic","underline","fontcolor","glowfont","url","cleanstyle"]
}
,
{
width:"auto",height:"auto",className:"typeset_tools",buttons:["justifyleft","justifycenter","justifyright","autoindent","ollist","ullist"]
}
,
{
width:"auto",height:"auto",className:"expert_tools",buttons:["emotions","insertimage","qqshowbubble",(QZFL.userAgent.ie<=7?"screenshot":"dump"),"dynamicalbum","music","video","flash"]
}
,
{
width:"auto",height:"auto",className:"inout_tools",buttons:["historyback","historynext"]
}
,
{
width:"auto",height:"auto",className:"other_tools",buttons:["normalstyle","ubbmode","help"]
}
,
{
width:"auto",height:"auto",className:"secend_line",buttons:[(QZBlog.Util.getSpaceMode()<=4?"letter":"dump"),"fullscreen"]
}
]
}
);
QZFL.editor.toolbar.setLayout("text",
{
extendClass:"editor_tools ubb_mode",layouts:[
{
width:"auto",height:"auto",className:"inout_tools",buttons:["historyback","historynext","url","insertimage_s"]
}
,
{
width:"auto",height:"auto",className:"other_tools",buttons:["goback","help"]
}
]
}
);
QZFL.editor.buttons.insert(
{
name:"advancedstyle",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"btn_expertuse",title:"使用高级功能",isCustomButton:false,noHighlight:true
};
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
};
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
};
this.getElement=function()
{
  return this._buttonElement;
};
this.execute=function()
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  _editor.switchToolbar("html_full");
  try
  {
    _editor.hideTips();
  }
  catch(err)
  {
  }
};
this.query=function()
{
};
}
}
);
QZFL.editor.buttons.insert(
{
name:"normalstyle",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"btn_ofenuse",title:"使用常用功能",isCustomButton:false,noHighlight:true
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  else
  {
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
};
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
};
this.getElement=function()
{
  return this._buttonElement;
};
this.execute=function()
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  try
  {
    var nLoginUin=QZBlog.Logic.SpaceHostInfo.getLoginUin();
    _editor.switchToolbar(parent.g_oBlogSettingInfoMgr.getEditMode(nLoginUin)==parent.BlogEditMode["ADVANCE"]?"html_mini":'html_simple');
  }
  catch(err)
  {
    _editor.switchToolbar("html_mini");
  }
};
this.query=function()
{
};
}
}
);
QZFL.editor.buttons.insert(
{
name:"ubbmode",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"btn_html",title:"切换到html编辑模式",isCustomButton:false
};
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
};
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
};
this.getElement=function()
{
  return this._buttonElement;
};
this.execute=function()
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  var _panel=_editor.getPanel();
  if(!_panel["text"])
  {
    _editor.showTips("切换编辑器失败，请刷新页面重试.");
    return;
  }
  _editor.hideTips();
  _editor.switchEditor("text");
  _editor.switchToolbar("text");
  var strHTML=_editor.getEditor("html").getContents();
  _editor.getEditor("text").setContents(strHTML);
};
this.query=function()
{
};
}
}
);
QZFL.editor.buttons.insert(
{
name:"htmlmode",ButtonClass:function(editorUniqueID)
{
this.options=
{
  className:"btn_html",title:"切换到html编辑模式",isCustomButton:false
};
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
  if(element)
  {
    this._buttonElement=element;
  }
  this._buttonElement.innerHTML="";
  this._initEvent();
  return this._buttonElement;
};
this._initEvent=function()
{
  QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
};
this.getElement=function()
{
  return this._buttonElement;
};
this.execute=function()
{
  var _editor=QZFL.editor.get(this._editorUniqueID);
  var _panel=_editor.getPanel();
  if(!_panel["html"])
  {
    _editor.showTips("切换编辑器失败，请刷新页面重试.");
    return;
  }
  _editor.hideTips();
  _editor.switchEditor("html");
  _editor.switchToolbar("html_full");
};
this.query=function()
{
};
}
}
);
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:"截屏",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_print"+(this._mini?"_s":"");
        this._buttonElement.title=this.options.title;
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>截屏</span>');
      }
      this._init();
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
      var _editor=QZFL.editor.get(this._editorUniqueID);
      var _d=_editor.getCurrentEditor().editorDoc;
      QZFL.event.addEvent(_d,"keydown",QZFL.event.bind(this,this._paste));
      QZFL.event.addEvent(_d,"contextmenu",QZFL.event.bind(this,this.qzEditor_contextmenu));
      QZFL.event.addEvent(_d.body,"paste",QZFL.event.bind(this,this.qzEditor_paste));
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.query=function()
    {
    };
    this._paste=function(e)
    {
      if(e.ctrlKey&&(e.keyCode==86)||(e.keyCode==118))
      {
        var screencapture=this.getCaptureObject('ScreenCapture');
        if(!!screencapture&&screencapture.IsClipBoardImage)
        {
          this.qzEditor_paste();
          return false;
        }
        else
        {
          return true;
        }
      }
      if(e.ctrlKey&&(e.keyCode==67)||(e.keyCode==99))
      {
        this._DIYClipBoardImg=0;
      }
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.execute=function()
    {
      if(!QZFL.userAgent.ie)
      {
        var msg="很抱歉，目前不支持非ie浏览器。";
        QZFL.widget.msgbox.show(msg,1,3000);
        QZFL.event.preventDefault();
        return;
      }
      var _editor=QZFL.editor.get(this._editorUniqueID);
      if(!QZFL.userAgent.ie)
      {
        _editor.execCommand('styleWithCSS',false,false);
      }
      if(QZFL.editor.button.checkStyle)
      {
        QZFL.editor.button.checkStyle(this._editorUniqueID);
      }
      this.doCapture();
      this.query();
      QZFL.event.preventDefault();
    };
    this.activatePrivateMode=function()
    {
      this.blogType="7";
    }
    this._init=function()
    {
      try
      {
this.checkUserLocation(function()
{
}
);
}
catch(e)
{
}
this._initEvent();
};
this.query=function()
{
};
this.setUploadURL=function(url)
{
this._uploadURL=url;
};
this.setBlogType=function(type)
{
this.blogType=type;
};
this._userLocation="";
this._uploadURL="";
this._DIYClipBoardImg=0;
this._tempFileID="";
this.blogType="7";
this.checkUserLocation=function(func)
{
if(top.checkUserLocation_sending)
{
return;
}
if(this._uploadURL!="")
{
return;
}
if(top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL&&(top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL!=""))
{
this._uploadURL=top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL;
return;
}
var url='http://route.store.qq.com/GetRoute?UIN='+top.g_iLoginUin;
top.checkUserLocation_sending=true;
top.loadXMLAsync('checkUserLocation',url,(function(e)
{
return function()
{
  var x=top.g_XDoc['checkUserLocation'];
  e._userLocation=x.getElementsByTagName('u')[0].firstChild.nodeValue;
  top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL=e._uploadURL="http://"+e._userLocation+"/cgi-bin/upload/cgi_upload_illustrated";
  top.checkUserLocation_sending=false;
  func();
}
}
)(this),(function(e)
{
return function()
{
  top.checkUserLocation_sending=false;
  e.checkUserLocation_backUp(func);
}
}
)(this),true);
};
this.checkUserLocation_backUp=function(func)
{
if(this.checkUserLocation_sending)
{
return;
}
var url_backUp='http://rb.store.qq.com/GetRoute?UIN='+top.g_iLoginUin;
this.checkUserLocation_sending=true;
top.loadXMLAsync('checkUserLocationBackUp',url_backUp,(function(e)
{
return function()
{
  var x=top.g_XDoc['checkUserLocationBackUp'];
  e._userLocation=x.getElementsByTagName('u')[0].firstChild.nodeValue;
  top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL=e._uploadURL="http://"+e._userLocation+"/cgi-bin/upload/cgi_upload_illustrated";
  top.checkUserLocation_sending=false;
  func();
}
}
)(this),function()
{
var msg="无法正确获取您当前的地理位置，请稍后再试。"
top.checkUserLocation_sending=false;
QZFL.widget.msgbox.show(msg,1,3000);
}
,true);
};
this.getCaptureObject=function(id)
{
var obj;
try
{
obj=new ActiveXObject('TXGYMailActiveX.'+id);
}
catch(ex)
{
obj=null;
}
return obj;
};
this.captureFail=function(str)
{
var _r=/
{
.*
}
/ig;
if(!str.match(_r))
{
QZFL.widget.msgbox.show("上传图片失败，请稍后再试。",1,3000);
return false;
}
var strMsg='';
var o=eval("("+str+")");
if(o.error!=null)
{
strMsg=o.error;
QZFL.widget.msgbox.show(strMsg,1,3000);
return false;
}
else
{
QZFL.dataCenter.save("capturePic",o.url);
return true;
}
};
this.qzEditor_paste=function(e)
{
if(this._uploadURL=="")
{
this.checkUserLocation((function(e)
{
return function()
{
  e.paste();
};
}
)(this));
}
else
{
this.paste();
}
};
this.qzEditor_contextmenu=function()
{
var screencapture=this.getCaptureObject('ScreenCapture');
if(!screencapture)
{
return;
}
var fileID=screencapture.SaveClipBoardBmpToFile(1);
if(fileID!='')
{
this._tempFileID=fileID;
}
if(screencapture.IsClipBoardImage)
{
clipboardData.setData("Text","");
this._DIYClipBoardImg=1;
}
};
this.fillEditorHTML=function(imgHtml)
{
var _editor=QZFL.editor.get(this._editorUniqueID);
if(QZFL.userAgent.ie)
{
var _r=_editor.getCurrentEditor().getSelectionRange().getRange();
var _d=_editor.getCurrentEditor().getDocument();
if(_d.selection.type=="Control")
{
var _dom=_r.item(0);
var _s=QZFL.editor.selection.get(_d);
_s.empty();
_r=_s.createRange();
_r.moveToElementText(_dom);
}
_r.pasteHTML(imgHtml);
_r.select();
}
else
{
_editor.execCommand("insertHtml",imgHtml);
}
QZFL.widget.msgbox.hide();
};
this.pasteImg=function()
{
var _w=top,imgHtml,purl=QZFL.dataCenter.get("capturePic");
QZFL.widget.msgbox.hide();
try
{
_w.closePopup();
}
catch(e)
{
}
if(typeof(purl)!="undefined")
{
imgHtml='<img src="'+purl+'" alt="图片"/>';
this.fillEditorHTML(imgHtml);
QZFL.dataCenter.save("capturePic",null);
}
};
this.uploaderOnEvent=(function(e)
{
return function(obj,eventID,p1,p2,p3)
{
  if(eventID==1)
  {
    QZFL.widget.msgbox.show('处理截图预览时遇到错误，请稍后再试。',1,3000);
    uploader.OnEvent=null;
  }
  else if(eventID==2)
  {
    QZFL.widget.msgbox.show('正在处理图片预览，请稍候 : '+Math.round(p1/p2*100)+'%',1);
  }
  else if(eventID==3)
  {
    if(!e.captureFail(uploader.Response))return;
    e.pasteImg();
  }
}
}
)(this);
this.prePaste=function()
{
if(!window.uploader)
{
  window.uploader=this.getCaptureObject('Uploader');
}
if(!uploader)
{
  this.installCaptureObject();
  return;
}
else
{
  uploader.OnEvent=this.uploaderOnEvent;
}
};
this.uploadPic=function(fileID)
{
if(top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL&&(top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL!=""))
{
  this._uploadURL=top.QZEDITOR_SCREENSHOT_PIC_UPLOAD_URL;
}
if(this._uploadURL=="")
{
  var msg="无法正确获取您当前的地理位置，请稍后再试。"
  QZFL.widget.msgbox.show(msg,1,3000);
  return false;
}
if(fileID!='')
{
  uploader.URL=this._uploadURL;
  uploader.ClearFormItems();
  uploader.AddHeader('cookie',document.cookie);
  uploader.AddFormItem('picname2',1,0,fileID);
  uploader.AddFormItem('blogtype',0,0,this.blogType);
  uploader.AddFormItem('json',0,0,"1");
  uploader.AddFormItem('refer',0,0,'blog');
  uploader.StartUpload();
}
};
this.paste=function()
{
if(!window.uploadFilePartition)
{
  window.uploadFilePartition=this.getCaptureObject('UploadFilePartition');
}
var screencapture=this.getCaptureObject('ScreenCapture');
if(!screencapture)
{
  return true;
}
if(screencapture.IsClipBoardImage)
{
  this.prePaste();
  screencapture.BringToFront(window);
  var fileID=screencapture.SaveClipBoardBmpToFile(1);
  this.uploadPic(fileID);
  return false;
}
if(this._DIYClipBoardImg==1)
{
  this.prePaste();
  screencapture.BringToFront(window);
  var fileID=this._tempFileID;
  this.uploadPic(fileID);
  return false;
}
if(ua.ie&&ua.ie<=6)
{
  return false;
}
};
this.doCapture=function()
{
var screencapture=this.getCaptureObject('ScreenCapture');
if(!screencapture)
{
  this.installCaptureObject();
  return;
}
screencapture.OnCaptureFinished=(function(e)
{
return function()
{
  e.prePaste();
  screencapture.BringToFront(window);
  var fileID=screencapture.SaveClipBoardBmpToFile(1);
  e.uploadPic(fileID);
}
}
)(this);
screencapture.DoCapture();
};
this.installCaptureObject=function()
{
QZFL.editor.openDialog(this._editorUniqueID,"QQ空间截屏控件安装提示","http://"+IMGCACHE_DOMAIN+"/qzone/client/capture/install_hint.htm",342,150);
};
};
QZFL.editor.buttons.insert(
{
name:"screenshot",ButtonClass:_bc
}
);
QZFL.editor.buttons.insert(
{
name:"screenshot_s",ButtonClass:function(editorUniqueID)
{
return new _bc(editorUniqueID,true)
}
}
);
QZFL.editor.buttons.insert(
{
name:"screenshot_s_img",ButtonClass:function(editorUniqueID)
{
return new _bc(editorUniqueID,true,true)
}
}
);
}
)();;
var BLOGEDITOR_HTML_REMOVEABLE_TAG=/(\!doctype|html|head|link|base|title|body|input|frame|frameset|iframe|ilayer|layer|meta|textarea|form|style|area|bgsound|player|comment|button|select|option|script|applet|xml)$/i;
(function()
{
function removeExecutableAttribute(node)
{
  node.removeAttribute("id");
  node.removeAttribute("name");
  var attributes=node.attributes;
  if(!attributes)
  {
    return;
  }
  var arr=[];
  for(var i=0,l=node.attributes.length;i<l;i++)
  {
    if(/^on/i.test(node.attributes[i].name)&&node.getAttribute(node.attributes[i].name))
    {
      arr.push(node.attributes[i].name);
    }
  }
  if(arr.length)
  {
    if(QZFL.userAgent.opera||QZFL.userAgent.ie)
    {
      eval("node."+arr.join("=node.")+"= null;");
    }
    if(!QZFL.userAgent.ie)
    {
      while(arr.length)
      {
        node.removeAttribute(arr.pop());
      }
    }
  }
}
var filterInHTML=function(source)
{
  var remove_attrs=/(marquee)$/i;
  var df=document.createDocumentFragment().appendChild(document.createElement("div"))
  df.innerHTML=source.replace(/<script[\s\S]*?(<\/script>)/gi,"").replace(/<applet[\s\S]*?(<\/applet>)/gi,"").replace(/<xml[\s\S]*?(<\/xml>)/gi,"").replace(/<style[\s\S]*?(<\/style>)/gi,"").replace(/<(\/?\w+)([^>]*)?>/ig,function(matchText,tag,attributes)
  {
    if(BLOGEDITOR_HTML_REMOVEABLE_TAG.test(tag))
    {
      return"";
    }
    if(remove_attrs.test(tag))
    {
      return"<"+tag+">";
    }
    if(/\b(display\s*\:\s*none\s*|visibility\s*\:\s*hidden\s*)\b/i.test(attributes))
    {
      matchText=matchText.replace(/\b(display\s*\:\s*none\s*|visibility\s*\:\s*hidden\s*)\b/ig,"");
    }
    if(/\b(expression|behavior)\b/i.test(attributes))
    {
      return matchText.split(/(expression[\s\S]*?\)|behavior[\s\S]*?\))/).join("");
    }
    return matchText;
  }
  );
  for(var i=0,tags=df.getElementsByTagName("*");i<tags.length;i++)
  {
    removeExecutableAttribute(tags[i]);
  }
window.setTimeout(function()
{
  df.innerHTML="";
}
,50);
return df.innerHTML;
};
QZFL.editor.Core.prototype.secureHTML=function(strHTML)
{
return filterInHTML(strHTML);
};
QZFL.editor.Core.prototype.isSecuredHTML=function(strHTML)
{
strHTML=strHTML.replace(/<script[\s\S]*?(<\/script>)/gi,"").replace(/<applet[\s\S]*?(<\/applet>)/gi,"").replace(/<xml[\s\S]*?(<\/xml>)/gi,"").replace(/<style[\s\S]*?(<\/style>)/gi,"");
var res=null;
var reg=/<(\/?\w+)([^>]*)?>/ig;
while(res=reg.exec(strHTML))
{
  if(BLOGEDITOR_HTML_REMOVEABLE_TAG.test(res[1]))
  {
    return false;
  }
}
return true;
};
}
)();
(function()
{
  var _e=QZFL.editor.editPanel.getEditorConstructor("html");
  var _lang=
  {
    "flash":"Flash动画","qqVideo":"<a href='http://video.qq.com' target='_blank'>QQVideo</a> 视频","video":"视频","audio":"音乐","album":"动感影集"
  };
  var _tagList=
  {
    "IMG":function(e)
    {
      this.lastElment=QZFL.event.getTarget(e);
      var strSrc=(!!this.lastElment.originSrc?this.lastElment.originSrc:this.lastElment.src);
      var type=/blog_(flash|video|audio|qqVideo|album|music)/i.exec(this.lastElment.className);
      var isEM=/em\/e(\d
      {
        1,3
      }
      ).gif/i.test(strSrc);
      if(!isEM&&!type)
      {
        _procImageTips(e,strSrc);
      }
      else if(type&&type[1]!="music")
      {
        var cID=this.lastElment.getAttribute("_cacheID");
        var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID);
        if(!data)
        {
          var rID="img_"+parseInt(Math.random()*100000);
          this.lastElment.id=rID;
          _showTips('<div><b style="color:#ff000">受损的'+_lang[type[1]]+'文件.</b><a href="javascript:;" style="margin-left:5px;" id="_remove_img" title="删除'+_lang[type[1]]+'">删除</a></div>',e);
          QZFL.event.addEvent(QZFL.dom.get("_remove_img"),"click",function()
          {
            var editor=QZBlog.Util.getCurrentAppWindow().PageScheduler.editorObj.getCurrentEditor();
            if(!editor)
            {
              return;
            }
            var element=editor.getDocument().getElementById(rID);
            if(element)
            {
              element.parentNode.removeChild(element);
              _hideTips();
            }
          }
          );
        }
        else
        {
          var aUrl=(typeof data=="object"?data[0]:data);
          if(type[1]=='album')aUrl="http://"+IMGCACHE_DOMAIN+'/qzone/client/photo/swf/vphoto.swf?btn_play_btn=1&uin='+data[2]+'&fid='+aUrl;
          _showTips("<b>"+_lang[type[1]]+"地址:</b><br/> &nbsp;&nbsp;<input value='"+aUrl+"' style='width:250px;' readonly />"+
          (type[1]=="audio"?"":("<br/><b>大小:</b> "+(this.lastElment.offsetWidth-(type[1]=="album"?0:2))+" x "+(this.lastElment.offsetHeight-(type[1]=="album"?0:2)))),e);
        }
      }
    }
    ,"A":function(e)
    {
      this.lastElment=QZFL.event.getTarget(e);
      _showTips('超链接地址:<br/><input value="'+this.lastElment.href+'" readonly style="width:250px"/><br/><a id="_remove_link" href="javascript:void(0)">移除超链接</a>',e);
      QZFL.event.addEvent(QZFL.dom.get("_remove_link"),"click",function()
      {
        _hideTips();
        _tagList.lastElment.ownerDocument.body.focus();
        QZFL.editor.selection.createRange(_tagList.lastElment.ownerDocument).selectNode(_tagList.lastElment);
        _tagList.lastElment.ownerDocument.execCommand("Unlink",false,true);
        _tagList.lastElment=null;
        QZFL.event.preventDefault();
      }
      );
    }
  }
function _procImageTips(evt,strSrc)
{
  var showBubbleHref=/^(https?:\/\/)?([\w\-.]+|(\.)?)photo\.store\.qq\.com($|\/|\\)/i.test(strSrc);
  _showTips('<b>图片地址:</b><br/><input value="'+strSrc+'" readonly style="width:250px"/><br/>'+
  (showBubbleHref?'<img class="icon_qqshow_tip" src="/ac/b.gif" /><a href="javascript:;" style="margin-right:20px;text-decoration:underline;" id="_addshow_btn">添加QQ秀泡泡</a>':'')+'<a id="_resize_img" style="text-decoration:underline;" href="javascript:void(0)">默认尺寸</a>',evt);
  QZFL.event.addEvent(QZFL.dom.get("_addshow_btn"),"click",function()
  {
    QZBlog.Util.getCurrentAppWindow().EditorManager.openQQShowBubbleDlg(strSrc);
    QZFL.event.preventDefault();
  }
  );
  QZFL.event.addEvent(QZFL.dom.get("_resize_img"),"click",function()
  {
    var img=_tagList.lastElment;
    if(!img)
    {
      return;
    }
    if(img)
    {
      img.removeAttribute("width");
      img.removeAttribute("height");
      if(!!img.originHeight&&!!img.originWidth)
      {
        img.style.width=img.originWidth;
        img.style.height=img.originHeight;
      }
      else
      {
        img.style.width="auto";
        img.style.height="auto";
      }
      _resizeTips(img);
    }
    QZFL.event.preventDefault();
  }
  );
}
var _tips;
function _showTips(html,e)
{
  _tips.innerHTML=html;
  _tips.style.display="";
  var _el=QZFL.event.getTarget(e);
  _resizeTips(_el)
}
function _resizeTips(el)
{
  var _fe=el.ownerDocument[!QZFL.userAgent.ie?"defaultView":"parentWindow"].frameElement;
  if(!_fe)
  {
    return
  }
  var _fp=QZFL.dom.getPosition(_fe);
  var _ep=QZFL.dom.getPosition(el);
  var _tp=QZFL.dom.getPosition(_tips);
  var _l=Math.min(_ep.left+_fp.left+3,QZFL.dom.getClientWidth()-_tp.width);
  var _t=_ep.top+_ep.height+_fp.top-QZFL.dom.getScrollTop(el.ownerDocument);
  if(_fp.top+_fp.height-_tp.height<_t)
  {
    _t=Math.max(_t-_ep.height-_tp.height,_fp.top);
  }
  _tips.style.left=_l+"px";
  _tips.style.top=_t+"px";
}
function _hideTips()
{
  _tips.style.display="none";
}
function getParentByClass(source,className)
{
  while(source.offsetParent)
  {
    if(source.className.indexOf(className)>=0)
    {
      return source;
    }
    source=source.offsetParent;
  }
  return null;
}
_e.prototype._tips_init=function()
{
  _tips=document.createElement("div");
  _tips.className="qzEditor_tips";
  _tips.style.cssText="position:absolute;display:none;border:1px solid #71c3f2;background-color:#d7ecff;background-color:rgba(215,236,255,0.9);-moz-border-radius: 3px; -webkit-border-radius: 3px; padding:5px;color:#000A11;font-size:12px;z-index:9999;";
  document.body.appendChild(_tips);
  var _d=this.getDocument();
  QZFL.event.addEvent(_d,"mousedown",QZFL.event.bind(this,this._tips_mousedown));
  QZFL.event.addEvent(_d,"keydown",_hideTips);
  QZFL.event.addEvent(document,"mousedown",function(evt)
  {
    var el=QZFL.event.getTarget(evt);
    if(el&&getParentByClass(el,"qzEditor_tips"))
    {
      return;
    }
    _hideTips();
  }
  );
};
_e.prototype._tips_mousedown=function(e)
{
  var el=QZFL.event.getTarget(e);
  if(!el)
  {
    return;
  }
  while(el)
  {
    if(_tagList[el.tagName])
    {
      var isEM=/em\/e(\d
      {
        1,3
      }
      ).gif/i.test(el.src);
      if(!isEM)
      {
        _tagList[el.tagName](e);
        return;
      }
    }
    el=el.parentNode;
  }
  _hideTips();
};
_e.addPluginCallback("_tips_init");
_e=null;
}
)();
QZFL.editor.buttons.insert(
{
name:"fontfamily",ButtonClass:function(editorUniqueID)
{
  this.options=
  {
    className:"font_btn font_clean",highlight:"nonce",title:QZFL.editor.lang.getLang("button_family"),isCustomButton:true
  }
  this._editorUniqueID=editorUniqueID;
  this._buttonElement=null;
  this._font_list_cn="宋体,黑体,楷体_GB2312,新宋体,仿宋_GB2312".split(",");
  this._font_list_en="Arial,Verdana,Simsun,Mingliu,Helvetica".split(",");
  this._font_list_reg=new RegExp("("+QZFL.editor.lang.getLang("font_list").split(",").join("|")+")","i");
  this.initialize=function(element)
  {
    if(element)
    {
      this._buttonElement=element;
    }
    else
    {
      this._inID=this._editorUniqueID+'_fontname_text_'+Math.random();
      this._buttonElement=document.createElement("div");
      this._buttonElement.className="sel_simulate";
      this._buttonElement.innerHTML='<div unselectable="on"><span unselectable="on" id="'+this._inID+'">'+QZFL.editor.lang.getLang("button_family")+'</span><button>▼</button></div>';
      this._buttonElement.title=this.options.title;
    }
    var _menuData=[];
    var blank=["&nbsp;"].join.call
    for(var i=0;i<this._font_list_cn.length;i++)
    {
(function(id)
{
  _menuData.push(
  {
    text:'<font face="'+this._font_list_cn[id]+'">'+this._font_list_cn[id]+'</font>',onclick:QZFL.event.bind(this,function()
    {
      this.execute(this._font_list_cn[id])
    }
    )
  }
  )
}
).call(this,i);
}
for(var fontType in g_specialFontList)
{
_menuData.push(
{
  "text":"<font style='font-size:12px;' face='sefont'>"+g_specialFontList[fontType]["exampleName"]+"</font> <img src='/ac/b.gif' class='icon_vip_yl_s' title='黄钻专用' />","onclick":QZFL.event.bind(this,function(fontType)
  {
    return QZFL.event.bind(this,function()
    {
      this.execute(fontType);
    }
    );
  }
  )(fontType)
}
);
}
for(var i=0;i<this._font_list_en.length;i++)
{
(function(id)
{
  _menuData.push(
  {
    text:'<font face="'+this._font_list_en[id]+'">'+this._font_list_en[id]+'</font>',onclick:QZFL.event.bind(this,function()
    {
      this.execute(this._font_list_en[id])
    }
    )
  }
  )
}
).call(this,i);
}
if(!window.bSpecialFontExampleLoaded)
{
var sheet=$("pagestyle").sheet||document.styleSheets["pagestyle"];
try
{
  if(QZFL.userAgent.ie)
  {
    sheet.cssText+='\n@font-face { font-family: sefont; font-style: normal;font-weight: normal;src: url(/qzonestyle/act/font/eot/SELECT0.eot);}\n';
  }
  else
  {
    sheet.insertRule(' @font-face {font-style: normal; font-weight: normal; font-family: sefont; src: url(/qzonestyle/act/font/ttf/selectf.ttf) format("opentype");}',0);
  }
}
catch(err)
{
}
window.bSpecialFontExampleLoaded=true;
}
this._menu=new QZFL.Menu();
this._menu.bind(this._buttonElement,1,_menuData);
return this._buttonElement;
};
this.showMenu=function()
{
if(QZFL.userAgent.ie)
{
this._buttonElement.fireEvent("onclick");
}
else
{
var evt=document.createEvent('HTMLEvents');
evt.initEvent('click',true,true);
this._buttonElement.dispatchEvent(evt);
}
};
this._initEvent=function()
{
}
this.getElement=function()
{
return this._buttonElement;
};
this.dealSpecialFont=function(fontType)
{
var _editor=QZFL.editor.get(this._editorUniqueID);
if(!_editor)
{
return;
}
if(!QZFL.userAgent.ie)
{
_editor.showTips('<div><img src="/ac/b.gif" class="icon_hint" /><a target="_blank" class="unline c_tx" href="http://qzone.qq.com/helpcenter/yellow_info.htm?56">个性字体</a>仅在IE浏览器下才可查看效果，请更换浏览器或选择其它字体。</div>');
return;
}
var _cEditor=_editor.getCurrentEditor();
QZFL.editor.button.checkStyle(this._editorUniqueID);
var sr=_cEditor.getSelectionRange();
sr.getRange().execCommand("fontname",false,g_specialFontList[fontType]["className"]);
_cEditor.getDocument().execCommand("fontname",false,g_specialFontList[fontType]["className"]);
QZFL.dom.get(this._inID).innerHTML=fontType;
setTimeout(function()
{
  if(_editor.loadSpecialFontLib(_cEditor.getDocument(),fontType))
  {
    QZFL.widget.msgbox.show("正在加载个性字体，请稍候...",1,2000);
  }
}
,0);
if(!QZBlog.Logic.SpaceHostInfo.isVipUser())
{
  _editor.showTips('<div><img src="/ac/b.gif" class="icon_hint" /><font color="black">您当前选择的字体仅限黄钻用户使用，普通用户发表日志后无法显示个性效果。</font>&nbsp;&nbsp;<a class="unline c_tx" href="http://paycenter.qq.com/home?aid=zone.font" class="unline c_tx" target="_blank">加入黄钻贵族</a>&nbsp;&nbsp;<a target="_blank" class="unline c_tx" href="http://qzone.qq.com/helpcenter/yellow_info.htm?56">个性字体使用帮助</a></div>');
}
};
this.execute=function(fType)
{
if(!!g_specialFontList[fType])
{
  this.dealSpecialFont(fType);
  return false;
}
var _editor=QZFL.editor.get(this._editorUniqueID);
if(!QZFL.userAgent.ie)
{
  _editor.execCommand('styleWithCSS',false,false);
}
if(QZFL.editor.button.checkStyle)
{
  QZFL.editor.button.checkStyle(this._editorUniqueID);
}
_editor.execCommand("fontname",fType);
QZFL.dom.get(this._inID).innerHTML=fType;
return false;
};
this.query=function()
{
this._menu.hide();
var _editor=QZFL.editor.get(this._editorUniqueID);
var _value=_editor.getEditor("html").editorDoc.queryCommandValue("fontname");
if(_value)
{
  if(!this._font_list_reg.test(_value))
  {
    _value=this._querySpecialFontFamily();
    _value=g_specialFontList[_value]?_value:QZFL.editor.lang.getLang("button_family");
  }
}
else
{
  _value=QZFL.editor.lang.getLang("button_family");
}
QZFL.dom.get(this._inID).innerHTML=_value;
};
this._querySpecialFontFamily=function()
{
var ftFamily=QZFL.editor.lang.getLang("button_family");
var _editor=QZFL.editor.get(this._editorUniqueID);
var fNode=null;
var tagArr=["font","span"];
for(var index in tagArr)
{
  fNode=_editor.findElementByName(tagArr[index]);
  if(!fNode)
  {
    continue;
  }
  var _value=QZFL.dom.getStyle(fNode,"fontFamily");
  if(!_value)
  {
    continue;
  }
  for(var fontType in g_specialFontList)
  {
    if(g_specialFontList[fontType]["className"]==_value)
    {
      return fontType;
    }
  }
}
return ftFamily;
};
}
}
);
QZFL.editor.buttons.insert(
{
name:"fontsize",ButtonClass:function(editorUniqueID)
{
this.options=
{
className:"font_btn font_clean",highlight:"nonce",title:QZFL.editor.lang.getLang("button_size"),isCustomButton:true
}
this._editorUniqueID=editorUniqueID;
this._buttonElement=null;
this.initialize=function(element)
{
if(element)
{
  this._buttonElement=element;
}
else
{
  this._inID=this._editorUniqueID+'_fontsize_text_'+Math.random();
  this._buttonElement=document.createElement("div");
  this._buttonElement.className="sel_simulate font_size";
  this._buttonElement.innerHTML='<div unselectable="on"><span unselectable="on" id="'+this._inID+'" style="cursor:default">'+QZFL.editor.lang.getLang("button_size")+'</span><button>▼</button></div>';
  this._buttonElement.title=this.options.title;
}
this._initEvent();
var _menuData=[];
for(var i=1;i<7;i++)
{
(function(id)
{
  _menuData.push(
  {
    text:'<font size="'+id+'">'+QZFL.editor.lang.getLang("font_size_"+id)+'</font>',onclick:QZFL.event.bind(this,function()
    {
      this.execute(id)
    }
    )
  }
  )
}
).call(this,i);
}
this._menu=new QZFL.Menu();
this._menu.bind(this._buttonElement,1,_menuData)
return this._buttonElement;
}
this._initEvent=function()
{
}
this.getElement=function()
{
return this._buttonElement;
}
this.execute=function(size)
{
var _editor=QZFL.editor.get(this._editorUniqueID);
if(!QZFL.userAgent.ie)
{
_editor.execCommand('styleWithCSS',false,false);
}
_editor.execCommand("fontsize",size);
QZFL.dom.get(this._inID).innerHTML=QZFL.editor.lang.getLang("font_size_"+size);
return false;
}
this.query=function()
{
this._menu.hide();
var _editor=QZFL.editor.get(this._editorUniqueID);
var _value=_editor.getEditor("html").editorDoc.queryCommandValue("fontsize");
if(_value)
{
var _size=QZFL.editor.lang.getLang("font_size_"+_value);
if(_size=="font_size_"+_value)
{
  _size=QZFL.editor.lang.getLang("button_size")
};
QZFL.dom.get(this._inID).innerHTML=_size;
}
else
{
QZFL.dom.get(this._inID).innerHTML=QZFL.editor.lang.getLang("button_size");
}
}
}
}
);
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:"插入图片",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_img"+(this._mini?"_s":"");
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>图片</span>');
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this._openImageBox));
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.execute=function()
    {
      var data=QZBlog.Util.getCurrentAppWindow().PageScheduler.parsePhotoData(),_r;
      if(!data)
      {
        return;
      }
      var _editor=QZFL.editor.get(this._editorUniqueID),r=_editor.getCurrentEditor();
      if(QZFL.userAgent.ie)
      {
        r.focus();
        this._lastRange.select();
      }
      var strHTML="",arrHtml=[];
      for(var index=0;index<data.arrImgInfo.length;++index)
      {
        strHTML='<img appendurl="1" onload="parent.blogEditorProcImgOnload(this);" src="'+data.arrImgInfo[index].url+'" alt="图片" />';
        if(data.arrImgInfo.length!=1)
        {
          strHTML+='<br />';
        }
        if(data.bNameFlag&&data.arrImgInfo[index].name)
        {
          strHTML+="照片名称："+data.arrImgInfo[index].name;
          if(!data.bAlbumName||!data.arrImgInfo[index].album)
          {
            strHTML+="<br />";
          }
        }
        if(data.bAlbumName&&data.arrImgInfo[index].album)
        {
          if(data.bNameFlag&&data.arrImgInfo[index].name)
          {
            strHTML+="，";
          }
          strHTML+="所属相册：<a href='"+data.arrImgInfo[index].albumUrl+"' target='_blank'>"+data.arrImgInfo[index].album+"</a><br />";
        }
        if(data.bDescFlag&&data.arrImgInfo[index].desc)
        {
          strHTML+="照片描述："+data.arrImgInfo[index].desc+"<br />";
        }
        if(data.arrImgInfo.length!=1)
        {
          strHTML+="<br />";
        }
        arrHtml.push(strHTML);
      }
      _r=r.getSelectionRange().getRange();
      if(r.type=="text")
      {
        r.fillText(arrHtml.join(""));
      }
      else
      {
        if(QZFL.userAgent.ie)
        {
          var _d=_editor.getCurrentEditor().getDocument();
          if(_d.selection.type=="Control")
          {
            var _dom=_r.item(0);
            var _s=QZFL.editor.selection.get(_d);
            _s.empty();
            _r=_s.createRange();
            _r.moveToElementText(_dom);
          }
          _r.pasteHTML(arrHtml.join(""));
          _r.select();
        }
        else
        {
          _editor.execCommand("insertHtml",arrHtml.join(""));
          try
          {
            var arr=_editor.getEditor("html").getDocument().getElementsByTagName("img");
            for(var index=0;index<arr.length;++index)
            {
              blogEditorProcImgOnload(arr[index]);
            }
          }
          catch(err)
          {
          }
        }
      }
    };
    this.query=function()
    {
    };
    this._openImageBox=function(e)
    {
      var blogType=7;
      this._lastRange=QZFL.editor.get(this._editorUniqueID).getCurrentEditor().getSelectionRange().getRange();
      QZFL.FP._t.insertPhotoContent=null;
      QZFL.editor.openDialog(this._editorUniqueID,QZFL.editor.lang.getLang("button_picture"),"http://"+IMGCACHE_DOMAIN+"/qzone/client/photo/pages/qzone_v4/insert_photo.html#referer=blog_editor&blog_type="+blogType+"&uin="+QZBlog.Util.getSpaceUin()+"&albumid="+window.lastBlogAlbumId,608,480);
      QZFL.FP.appendPopupFn(QZFL.event.bind(this,this.execute));
      QZFL.event.preventDefault(e);
    };
  }
  QZFL.editor.buttons.insert(
  {
    name:"insertimage",ButtonClass:_bc
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"insertimage_s",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true)
    }
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"insertimage_s_img",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true,true)
    }
  }
  );
}
)();
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:QZFL.editor.lang.getLang("button_emotions"),isCustomButton:true
    }
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.title=QZFL.editor.lang.getLang("button_emotions");
        this._buttonElement.className="expert_face"+(this._mini?"_s":"");
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>表情</span>');
      }
      this._emotionPanel=QZFL.widget.emotion.bind(this._buttonElement);
      this._initEvent();
      return this._buttonElement;
    }
    this._initEvent=function()
    {
      this._emotionPanel.onSelect=QZFL.event.bind(this,this.execute);
      QZFL.widget.emotion.setThemeMainPath("/qzone/em/theme");
      var _this=this;
      if(top.g_iLoginUin>10000&&typeof g_Static_Blog=="undefined")
      {
        top.blogFaceCache=true;
function __getAlbumListCallBack(data)
{
  data=data.albums;
  top.blogFaceCache=false;
  for(var i=0;i<data.length;i++)
  {
_this._emotionPanel.addEmotionGroup(data[i].name,(function(group)
{
return function()
{
  PhotoLogic.getPhotoList(
  {
    uin:top.g_iLoginUin,id:group.id,callBack:__getPhotoListCallBack,errBack:__getPhotoListError,type:16,projectId:115,refresh:true,refer:"blogface"
  }
  );
};
}
)(data[i]));
}
_this._emotionPanel.checkScrollIcon();
}
function __getPhotoListError()
{
  _this._emotionPanel.showMessage("获取表情失败，请稍后重试");
  _this._emotionPanel.prevPage.style.display="none";
  _this._emotionPanel.nextPage.style.display="none";
  _this._emotionPanel.pageNumber.style.display="none";
}
function __getPhotoListCallBack(data)
{
  data=data.photos;
  if(data.length)
  {
    var ems=[];
    for(var n=0;n<data.length;n++)
    {
      ems[ems.length]=
      {
        title:data[n].name,pre:data[n].pre,url:data[n].url
      }
    }
    _this._emotionPanel.fillContent(ems,1);
    _this._emotionPanel.jumpPage=function(index)
    {
      if(index<1||index>Math.ceil(ems.length/_this._emotionPanel.pageSize))
      {
        index=Math.min(Math.max(1,_this._emotionPanel.currentPageIndex),Math.ceil(ems.length/_this._emotionPanel.pageSize));
      }
      this.currentPageIndex=pageIndex=Math.min(Math.max(1,_this._emotionPanel.currentPageIndex),Math.ceil(ems.length/_this._emotionPanel.pageSize));
      _this._emotionPanel.fillContent(ems,index);
    };
  }
  else
  {
    _this._emotionPanel.showMessage("此分组中尚未添加表情");
    _this._emotionPanel.prevPage.style.display="none";
    _this._emotionPanel.nextPage.style.display="none";
    _this._emotionPanel.pageNumber.style.display="none";
    _this._emotionPanel.jumpPage=QZFL.emptyFn;
  }
}
_this._emotionPanel.init=function()
{
  PhotoLogic.getAlbumList(
  {
    uin:top.g_iLoginUin,callBack:__getAlbumListCallBack,errBack:function(data)
    {
    }
    ,type:16,projectId:115,refresh:top.blogFaceCache,refer:"blogface"
  }
  );
};
window.showManagePanel=function(link)
{
  link.parentNode.parentNode.parentNode.style.display="none";
  top.QZONE.FrontPage.popupDialog("表情管理",
  {
    src:'/qzone/em/emotion_manage.htm'
  }
  );
};
var callback=function()
{
  _this._emotionPanel.setOptionPanel("<a href='javascript:void(0);' onclick='showManagePanel(this);return false;'>表情管理</a>");
  _this._emotionPanel.onShow=function()
  {
    if(top.blogFaceCache)
    {
      _this._emotionPanel.reload(_this._emotionPanel.init);
    }
  };
};
var script=new QZONE.jsLoader();
script.onload=callback;
script.load("/qzone/client/photo/pages/qzone_v4/script/photo_logic.js",document,"utf-8");
}
};
this.getElement=function()
{
return this._buttonElement;
}
this.execute=function(eObject)
{
var _editor=QZFL.editor.get(this._editorUniqueID);
_editor.getCurrentEditor().fillHtml('<img onresizestart="return false;" src="'+eObject.fileName+'" />')
}
this.query=function()
{
this._emotionPanel.hide();
}
}
QZFL.editor.buttons.insert(
{
name:"emotions",ButtonClass:_bc
}
);
QZFL.editor.buttons.insert(
{
name:"emotions_s",ButtonClass:function(editorUniqueID)
{
return new _bc(editorUniqueID,true)
}
}
);
QZFL.editor.buttons.insert(
{
name:"emotions_s_img",ButtonClass:function(editorUniqueID)
{
return new _bc(editorUniqueID,true,true)
}
}
);
}
)();
(function()
{
  var _bc=function(editorUniqueID,mini)
  {
    this.options=
    {
      className:"example_class",title:"插入动感影集",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_vphoto"+(this._mini?"_s":"");
        this._buttonElement.innerHTML='<span>影集</span>';
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this._openAlbumDlg));
    };
    this._openAlbumDlg=function()
    {
      this._lastRange=QZFL.editor.get(this._editorUniqueID).getCurrentEditor().getSelectionRange().getRange();
      top.g_XDoc["selectVphoto"]=null;
      top.popupCallback=QZFL.event.bind(this,function()
      {
        if(top.g_XDoc["selectVphoto"])
        {
          this.execute(top.g_XDoc["selectVphoto"]);
          top.g_XDoc["selectVphoto"]=null;
        }
      }
      );
      QZFL.editor.openDialog(this._editorUniqueID,"插入动感影集","http://"+IMGCACHE_DOMAIN+"/qzone/blog/ubb_vphoto.htm",430,283);
      QZFL.event.preventDefault();
    };
    this.execute=function(value)
    {
      var _editor=QZFL.editor.get(this._editorUniqueID);
      if(QZFL.userAgent.ie)
      {
        _editor.getCurrentEditor().focus();
        this._lastRange.select();
      }
      var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(value);
      var strHTML='<img src="'+value[1]+'" style="height:390px;width:520px;" onresizestart="return false;" class="blog_album" _cacheID="'+cacheID+'" />';
      QZFL.editor.get(this._editorUniqueID).fillBlogHTML(strHTML);
    };
    this.query=function()
    {
    };
  };
  QZFL.editor.buttons.insert(
  {
    name:"dynamicalbum",ButtonClass:_bc
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"dynamicalbum_s",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true)
    }
  }
  );
}
)();
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:"插入视频",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_video"+(this._mini?"_s":"");
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>视频</span>');
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this._openVideoDlg));
    };
    this._openVideoDlg=function()
    {
      this._lastRange=QZFL.editor.get(this._editorUniqueID).getCurrentEditor().getSelectionRange().getRange();
      top.popupCallback=QZFL.event.bind(this,function()
      {
        if(!!top.g_arrQZEditorReturnVal&&!!top.g_arrQZEditorReturnVal[this._editorUniqueID])
        {
          this.execute(top.g_arrQZEditorReturnVal[this._editorUniqueID]);
          top.g_arrQZEditorReturnVal[this._editorUniqueID]=null;
        }
      }
      );
      QZFL.editor.openDialog(this._editorUniqueID,"插入视频","http://"+IMGCACHE_DOMAIN+"/qzone/mall/v5/video/index.html?editorid="+this._editorUniqueID,526,450);
      QZFL.event.preventDefault();
    };
    this.execute=function(value)
    {
      var _editor=QZFL.editor.get(this._editorUniqueID);
      if(QZFL.userAgent.ie)
      {
        _editor.getCurrentEditor().focus();
        this._lastRange.select();
      }
      var strHTML=""
      if(value[0]<2)
      {
        var w=520;
        var h=425;
        var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(value[1]);
        strHTML='<img src="/ac/b.gif" class="blog_qqVideo" width="'+w+'" height="'+h+'" style="width:'+w+'px;height:'+h+'px;" _cacheID="'+cacheID+'" />';
      }
      else
      {
        var w=520;
        var h=425;
        var data=[value[1],value[5],value[6]];
        var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
        strHTML='<img src="/ac/b.gif" class="blog_video" width="'+w+'" height="'+h+'" style="width:'+w+'px;height:'+h+'px;" _cacheID="'+cacheID+'" />';
      }
      QZFL.editor.get(this._editorUniqueID).fillBlogHTML(strHTML);
    };
    this.query=function()
    {
    };
  };
  QZFL.editor.buttons.insert(
  {
    name:"video",ButtonClass:_bc
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"video_s",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true)
    }
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"video_s_img",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true,true)
    }
  }
  );
}
)();
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:"插入Flash动画",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_flash"+(this._mini?"_s":"");
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>FLASH</span>');
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this._openFlashDlg));
    };
    this._openFlashDlg=function()
    {
      this._lastRange=QZFL.editor.get(this._editorUniqueID).getCurrentEditor().getSelectionRange().getRange();
      top.popupCallback=QZFL.event.bind(this,function()
      {
        if(!!top.g_arrQZEditorReturnVal&&!!top.g_arrQZEditorReturnVal[this._editorUniqueID])
        {
          this.execute(top.g_arrQZEditorReturnVal[this._editorUniqueID]);
          top.g_arrQZEditorReturnVal[this._editorUniqueID]=null;
        }
      }
      );
      QZFL.editor.openDialog(this._editorUniqueID,"插入Flash动画","http://"+IMGCACHE_DOMAIN+"/qzone/newblog/v5/editor/dialog/flash.html?editorid="+this._editorUniqueID,430,233);
      QZFL.event.preventDefault();
    };
    this.execute=function(value)
    {
      var _editor=QZFL.editor.get(this._editorUniqueID);
      if(QZFL.userAgent.ie)
      {
        _editor.getCurrentEditor().focus();
        this._lastRange.select();
      }
      var w=(value[3]?value[3]:"520");
      var h=(value[2]?value[2]:"425");
      var strHTML="";
      if(value[4])
      {
        strHTML="[flasht,"+w+","+h+","+value[5]+","+value[6]+"]"+value[0]+"[/flasht]";
      }
      else
      {
        var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(value[0]);
        strHTML='<img src="/ac/b.gif" class="blog_flash" height="'+h+'" width="'+w+'" style="width:'+w+'px;height:'+h+'px;" _cacheID="'+cacheID+'" />';
      }
      QZFL.editor.get(this._editorUniqueID).fillBlogHTML(strHTML);
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.query=function()
    {
    };
  };
  QZFL.editor.buttons.insert(
  {
    name:"flash",ButtonClass:_bc
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"flash_s",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true);
    }
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"flash_s_img",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true,true);
    }
  }
  );
}
)();
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:"插入音乐",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_music"+(this._mini?"_s":"");
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>音乐</span>');
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this._openMusicDlg));
    };
    this._openMusicDlg=function()
    {
      top.popupCallback=QZFL.event.bind(this,function()
      {
        if(!!top.g_arrQZEditorReturnVal&&!!top.g_arrQZEditorReturnVal[this._editorUniqueID])
        {
          this.execute(top.g_arrQZEditorReturnVal[this._editorUniqueID]);
          top.g_arrQZEditorReturnVal[this._editorUniqueID]=null;
        }
      }
      );
      QZFL.editor.openDialog(this._editorUniqueID,"插入音乐","http://"+IMGCACHE_DOMAIN+"/music/musicbox_v2_1/doc/blog_add_song.html?editorid="+this._editorUniqueID,640,330);
      QZFL.event.preventDefault();
    };
    this.execute=function(value)
    {
      var arr=value.split("|");
      var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(value);
      var strHTML='<img src="/ac/b.gif" _cacheID="'+cacheID+'" class="blog_music'+((arr.length>7)?"_multiple":"")+'" onresizestart="return false;" />';
      QZFL.editor.get(this._editorUniqueID).fillBlogHTML(strHTML);
    };
    this.query=function()
    {
    };
  };
  QZFL.editor.buttons.insert(
  {
    name:"music",ButtonClass:_bc
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"music_s",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true)
    }
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"music_s_img",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true,true)
    }
  }
  );
}
)();
QZFL.editor.buttons.insert(
{
  name:"help",ButtonClass:function(editorUniqueID)
  {
    this.options=
    {
      className:"link_qmark",title:"帮助",isCustomButton:true
    };
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("a");
        this._buttonElement.className=this.options.className;
        this._buttonElement.innerHTML='<span>使用帮助</span>';
        this._buttonElement.href='http://qzone.qq.com/helpcenter/basic_info192.htm';
        this._buttonElement.target='_blank';
        this._buttonElement.title=this.options.title;
        this._buttonElement.hidefocus=true;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this._initEvent=function()
    {
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.execute=function()
    {
    };
    this.query=function()
    {
    };
  }
}
);
QZFL.editor.buttons.insert(
{
  name:"goback",ButtonClass:function(editorUniqueID)
  {
    this.options=
    {
      className:"link_return",title:"返回所见即所得编辑模式",isCustomButton:true
    };
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("a");
        this._buttonElement.className=this.options.className;
        this._buttonElement.innerHTML='<span>返回</span>';
        this._buttonElement.href='javascript:;';
        this._buttonElement.title=this.options.title;
        this._buttonElement.hidefocus=true;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.execute=function()
    {
      var _editor=QZFL.editor.get(this._editorUniqueID);
      var _panel=_editor.getPanel();
      if(!_panel["html"])
      {
        _editor.showTips("切换编辑器失败，请刷新页面重试.");
        return;
      }
function removeExecutableAttribute(html)
{
  return html.replace(/(\"(?:[^\r\n\"]*?\\(?:\"|\r\n|\n))*[^\r\n\"]*?\")|(\'(?:[^\r\n\']*?\\(?:\'|\r\n|\n))*[^\r\n\']*?\')/g,function(match){return match.replace(/>/g,"&gt;
  ");}).replace(/<([^>]+)?>/g,function(match,tag_attrs,pos,raw){return"<"+tag_attrs.split(/\bon[a-z]+\s*\=\s*(?:(?:\"(?:[^\r\n\"]*?\\(?:\"|\r\n|\n))*[^\r\n\"]*?\")|(?:\'(?:[^\r\n\']*?\\(?:\'|\r\n|\n))*[^\r\n\']*?\')|[\S]*)/i).join("")+">";});}
  _editor.hideTips();
  _editor.setContent(removeExecutableAttribute(_editor.getCurrentEditor().getContents()));
  _editor.switchEditor("html");
  _editor.switchToolbar("html_full");
  QZFL.event.cancelBubble();
  return false;
};
this.query=function()
{
};
}
}
);
(function()
{
  var _bc=function(editorUniqueID,mini,bImgOnly)
  {
    this.options=
    {
      className:"example_class",title:"插入QQ秀泡泡",isCustomButton:true
    };
    this._mini=mini||false;
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="expert_qshow"+(this._mini?"_s":"");
        this._buttonElement.innerHTML=(bImgOnly?'':'<span>泡泡</span>');
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,function()
      {
        this._openQQShowDlg();
      }
      ));
    };
    this._openQQShowDlg=function(url,albumid)
    {
      parent._tempQFCallback=function(url,width,height,sContent)
      {
        var param=[];
        param.push(url);
        param.push(Math.floor(width));
        param.push(Math.floor(height));
        param.push(sContent);
        var editor=QZFL.EFP.getTarget().QZFL.editor.getEditorByDialog();
        var toolbar=editor.getCurrentToolbar();
        var button=toolbar.getButton("qqshowbubble")||toolbar.getButton("qqshowbubble_s")||toolbar.getButton("qqshowbubble_s_img");
        if(button)
        {
          editor.getCurrentEditor().focus();
          button.execute(param);
        }
      };
      QZFL.editor.openDialog(this._editorUniqueID,"插入QQ秀泡泡","http://ptlogin2.qq.com/showbub?uin="+QZONE.cookie.get('zzpaneluin')+"&clientkey="+QZONE.cookie.get('zzpanelkey')+(!!url?('&url='+url.URLencode()):'')+(!!albumid?("&albid="+albumid):''),905,550);
      QZFL.event.preventDefault();
    };
    this.execute=function(value)
    {
      var _editor=QZFL.editor.get(this._editorUniqueID);
      if(QZFL.userAgent.ie)
      {
        _editor.getCurrentEditor().focus();
        QZFL.editor.get(this._editorUniqueID).getCurrentEditor().getSelectionRange().getRange().select();
      }
      var pw=value[1];
      var ph=value[2];
      var sContent=value[3];
      value=(!!value[0]?value[0]:value);
      var rID="postImg_"+parseInt(Math.random()*10000);
      var strSrc="http://"+IMGCACHE_DOMAIN+IMGCACHE_BLOG_V5_PATH+"/editor/css/loading.gif";
      var strHTML='<img content="'+sContent.toInnerHTML().toInnerHTML()+'" originHeight="'+ph+'" originWidth="'+pw+'" originSrc="'+value+'" transImg=1 id="'+rID+'" src="'+strSrc+'" orgSrc="'+value+'" />';
      QZFL.editor.get(this._editorUniqueID).fillBlogHTML(strHTML);
      var _d=QZFL.editor.get(this._editorUniqueID).getCurrentEditor().getDocument();
      var img=new Image();
      img.onerror=img.onload=function()
      {
        var sImg=_d.getElementById(rID);
        if(sImg)
        {
          sImg.src=this.src;
          if(QZFL.userAgent.ie)
          {
            sImg.orgSrc="";
            if(!!parseInt(sImg.transImg,10))
            {
              if(QZFL.userAgent.ie<7)
              {
                sImg.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src="+this.src+", sizingmethod=scale);";
              }
              sImg.style.height=sImg.originHeight=ph;
              sImg.style.width=sImg.originWidth=pw;
              sImg.originSrc=value;
              if(QZFL.userAgent.ie<7)
              {
                sImg.src="http://"+IMGCACHE_DOMAIN+"/ac/b.gif";
              }
              else
              {
                sImg.src=this.src;
              }
            }
          }
          else
          {
            sImg.setAttribute("orgSrc","");
          }
        }
        this.onerror=this.onload=null;
      }
      img.src=value;
    };
    this.query=function()
    {
    };
  };
  QZFL.editor.buttons.insert(
  {
    name:"qqshowbubble",ButtonClass:_bc
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"qqshowbubble_s",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true)
    }
  }
  );
  QZFL.editor.buttons.insert(
  {
    name:"qqshowbubble_s_img",ButtonClass:function(editorUniqueID)
    {
      return new _bc(editorUniqueID,true,true)
    }
  }
  );
}
)();
QZFL.editor.buttons.insert(
{
  name:"letter",ButtonClass:function(editorUniqueID)
  {
    this.options=
    {
      className:"btn_opaper",title:"插入信纸",isCustomButton:true
    };
    this._editorUniqueID=editorUniqueID;
    this._buttonElement=null;
    this.initialize=function(element)
    {
      if(element)
      {
        this._buttonElement=element;
      }
      else
      {
        this._buttonElement=document.createElement("button");
        this._buttonElement.className="btn_opaper";
        this._buttonElement.innerHTML='<span>信纸</span>';
        this._buttonElement.title=this.options.title;
      }
      this._initEvent();
      return this._buttonElement;
    };
    this._initEvent=function()
    {
      QZFL.event.addEvent(this._buttonElement,"click",QZFL.event.bind(this,this.execute));
    };
    this.getElement=function()
    {
      return this._buttonElement;
    };
    this.execute=function()
    {
      EditorManager.openPaperLetterDlg();
      QZFL.event.preventDefault();
    };
    this.query=function()
    {
    };
  }
}
);
QZFL.editor.Core.prototype.showDefinePanel=function(strHtml,width)
{
  var dlg=$("paperEditorPanel");
  if(!dlg)
  {
    dlg=QZFL.dom.createElementIn("div",this._dom_area,false,
    {
      "id":"paperEditorPanel","style":"position:absolute;right:0px;"
    }
    );
  }
  dlg.style.right=QZFL.userAgent.ie?"0px":"8px";
  this.refreshDefinePanelTopPos();
  dlg.innerHTML=strHtml;
  dlg.style.display="";
};
QZFL.editor.Core.prototype.hideDefinePanel=function()
{
  var dlg=$("paperEditorPanel");
  if(dlg)
  {
    dlg.style.display="none";
  }
};
QZFL.editor.Core.prototype.refreshDefinePanelTopPos=function()
{
  var dlg=$("paperEditorPanel");
  if(!dlg)
  {
    return;
  }
  var pos=QZFL.dom.getPosition(this.getCurrentToolbar().getRoot());
  dlg.style.top="-2px";
};
QZFL.editor.Core.prototype.resizeArea=function()
{
  if(this.isFullScreen)
  {
    var _clientHeight=QZFL.dom.getClientHeight();
    this._dom_area.style.height=(_clientHeight-QZFL.dom.getSize(this._dom_toolbar)[1]-QZFL.dom.getSize(this._dom_resize)[1])+"px";
  }
  this.getCurrentEditor().getInstance().style.height=this._dom_area.style.height;
  if(this.getCurrentEditor().type=="text"&&!!this.iPaperStyle&&!!this.iPaperID)
  {
    this.getCurrentEditor().getInstance().style.height=parseInt(this._dom_area.style.height,10)-25+"px";
  }
}
QZFL.editor.Core.prototype.setPaperLetter=function(iPaperStyle,iPaperID)
{
  this.iPaperStyle=iPaperStyle;
  this.iPaperID=iPaperID;
  if(QZBlog.Util.getSpaceMode()>=5)
  {
    return;
  }
  if(!this.isEdited())
  {
    this.bEmptyEditPaper=true;
    var strTip="点击这里输入日志正文";
    this.setContentHTML("<div>"+strTip+"</div>");
    this.setContentText(strTip);
  }
  var oHTMLContainer=this.getEditor("html").getDocument().body;
  var oTextContainer=this.getEditor("text").getInstance();
  if(this.bEmptyEditPaper)
  {
    this._detectPaperEvent=function(evt)
    {
      if(this.bEmptyEditPaper==true)
      {
        this.bEmptyEditPaper=false;
        this.clearContent();
        this.focus();
      }
    }
    var eventFunc=QZONE.event.bind(this,this._detectPaperEvent);
    QZFL.event.addEvent(this.getEditor("html").getDocument(),"keydown",eventFunc);
    QZFL.event.addEvent(oTextContainer,"keydown",eventFunc);
    QZFL.event.addEvent(oHTMLContainer,"mousedown",eventFunc);
    QZFL.event.addEvent(oTextContainer,"mousedown",eventFunc);
  }
  var paperToolbarHeight=25;
  var arrContainers=[oHTMLContainer,oTextContainer];
  var color=parent.PaperLetterInfo.prototype.TITLECOLOR[(this.iPaperStyle>>16)&0xff];
  var strBgUrl="/qzone/space_item/orig/"+this.iPaperID%16+"/"+this.iPaperID+"_bg.jpg";
  for(var index in arrContainers)
  {
    arrContainers[index].style.color="#"+color;
    arrContainers[index].style.paddingTop=paperToolbarHeight+"px";
  }
  QZBlog.Util.ImageManager.loadImage(strBgUrl,true,function()
  {
    for(var index in arrContainers)
    {
      arrContainers[index].style.backgroundImage="url("+strBgUrl+")";
    }
  }
  );
  oTextContainer.style.height=parseInt(this._dom_area.style.height,10)-paperToolbarHeight+"px";
  this._setHrefColor("#"+color);
};
QZFL.editor.Core.prototype._setHrefColor=function(color)
{
  if(!QZFL.userAgent.ie)
  {
    return;
  }
  try
  {
    var styleSheet=this.getEditor("html").getDocument().styleSheets[0];
    styleSheet.addRule("a:link","{color:"+color+";}",styleSheet.length);
    styleSheet.addRule("a:visited","{color:"+color+";}",styleSheet.length);
  }
  catch(err)
  {
  }
};
QZFL.editor.Core.prototype.removeLetterPaper=function()
{
  this.iPaperStyle=null;
  this.iPaperID=null;
  var oHTMLContainer=this.getEditor("html").getDocument().body;
  var oTextContainer=this.getEditor("text").getInstance();
  var arrContainers=[oHTMLContainer,oTextContainer];
  for(var index in arrContainers)
  {
    arrContainers[index].style.backgroundImage="";
    arrContainers[index].style.color="#000";
    arrContainers[index].style.paddingTop="0px";
  }
  oTextContainer.style.height=parseInt(this._dom_area.style.height,10)+25+"px";
  if(QZFL.userAgent.ie)
  {
    try
    {
      var styleSheet=this.getEditor("html").getDocument().styleSheets[0];
      styleSheet.removeRule(styleSheet.length-1);
      styleSheet.removeRule(styleSheet.length-1);
    }
    catch(err)
    {
    }
  }
  if(this.bEmptyEditPaper==true)
  {
    this.setContentHTML("");
    this.setContentText("");
    this.bEmptyEditPaper=false;
  }
};
QZFL.editor.Core.prototype.getPaperLetterData=function()
{
  return
  {
    style:this.iPaperStyle,id:this.iPaperID
  };
};
var SPACE_MAIN_DOMAIN=parent.g_Main_Domain;
var CGI_BLOG_DOMAIN=parent.g_NewBlog_Domain;
var IMGCACHE_DOMAIN=parent.imgcacheDomain;
var IMGCACHE_BLOG_V5_PATH="/qzone/newblog/v5";
String.prototype.toInnerHTML=function()
{
  var s=this.replace(/&/g,"&amp;").replace(/\"/g,"&quot;
  ").replace(/\'/g,"&#39;
  ").replace(/</g,"&lt;
  ").replace(/>/g,"&gt;
  ");return QZFL.userAgent.ie?s.replace(/&apos;/g,"&#39;
  "):s;};QZFL.editor.Core.prototype.setBlogCSS=function(){var dom=this.getEditor("html").getDocument();var cssLink=dom.createElement("link");cssLink.rel="stylesheet";cssLink.rev="stylesheet";cssLink.type="text/css";cssLink.media="screen";cssLink.href=(IMGCACHE_BLOG_V5_PATH+"/editor/css/blog_editor.css");dom.getElementsByTagName("head")[0].appendChild(cssLink);dom.body.style.lineHeight="1.8em";};QZFL.editor.Core.prototype.setHTMLFontSize=function(fontSize){var dom=this.getEditor("html").getDocument();dom.body.style.fontSize=fontSize;};QZFL.editor.Core.prototype.isEdited=function(){if(this.getContent().length==0){return false;}
  if(!!this.bEmptyEditPaper)
  {
    return false;
  }
  return true;
};
QZFL.editor.Core.prototype.clearContent=function()
{
  this.getCurrentEditor().contents.set("");
};
QZFL.editor.Core.prototype.getContent=function()
{
  return this.getCurrentEditor().contents.get().replace(/\x20+$/,"");
};
QZFL.editor.Core.prototype.getConvertedUBBContent=function()
{
  if(!this.isHTMLMode())
  {
    this.getEditor("html").setContents(this.getEditor("text").getContents());
  }
  return this.getEditor("html").contents.get().replace(/\x20+$/,"");
};
QZFL.editor.Core.prototype.getConvertedHTMLContent=function()
{
  if(!this.isHTMLMode())
  {
    this.getEditor("html").setContents(this.getEditor("text").getContents());
  }
  if(this._strConvertedHTML&&this._strOldHTML&&this._strOldHTML==this.getEditor("html").getContents())
  {
    return this._strConvertedHTML;
  }
  var strHTML=this.getSecuredHTML();
  strHTML=QZFL.editor.parser.doInputRules("html","encodeUBBToHTML",strHTML);
  strHTML=QZFL.editor.parser.replaceBlogUBB(strHTML,true);
  strHTML=QZFL.editor.parser.simpleUBBToHTML(strHTML,true);
  strHTML=strHTML.toRealStr();
  this._strConvertedHTML=this.convertOutSpecialHTML(strHTML);
  this._strOldHTML=this.getEditor("html").getContents();
  return this._strConvertedHTML;
};
QZFL.editor.Core.prototype.setConvertedHTMLContent=function(strHTML)
{
  this.getEditor("html").setContents(this.convertInSpecialHTML(strHTML));
};
QZFL.editor.Core.prototype.setContent=function(str)
{
  this.getCurrentEditor().contents.set(str);
};
QZFL.editor.Core.prototype.reloadContent=function(str)
{
  this.setContent(this.getContent());
};
QZFL.editor.Core.prototype.focus=function()
{
  this.getCurrentEditor().focus();
};
QZFL.editor.Core.prototype.isHTMLMode=function()
{
  return(this.getCurrentEditor().type=="html");
};
QZFL.editor.Core.prototype.setFontSize=function(nSize)
{
  try
  {
    this.focus();
    this.execCommand("fontsize",nSize);
    this.getCurrentToolbar().getButton("fontsize").query();
  }
  catch(err)
  {
  }
};
QZFL.editor.Core.prototype.fillBlogHTML=function(strHTML)
{
  if(!this.isHTMLMode())
  {
    return;
  }
  var _d=this.getCurrentEditor().getDocument();
  if(QZFL.userAgent.ie)
  {
    var _r=this.getCurrentEditor().getSelectionRange().getRange();
    if(_d.selection.type=="Control")
    {
      var _dom=_r.item(0);
      var _s=QZFL.editor.selection.get(_d);
      _s.empty();
      _r=_s.createRange();
      _r.moveToElementText(_dom);
    }
    _r.pasteHTML(strHTML);
    _r.select();
  }
  else
  {
    this.execCommand("insertHtml",strHTML);
  }
  this._strConvertedHTML=null;
  this._strOldHTML=null;
};
QZFL.editor.Core.prototype.getSecuredHTML=function()
{
  return this.secureHTML(this.getEditor("html").getContents());
};
QZFL.editor.Core.prototype.reloadSecureHTML=function()
{
  this.getEditor("html").setContents(this.getSecuredHTML());
};
QZFL.editor.Core.prototype.setContentHTML=function(strHTML)
{
  this.getEditor("html").setContents(strHTML);
};
QZFL.editor.Core.prototype.setContentText=function(strText)
{
  this.getEditor("text").setContents(strText);
};
QZFL.editor.Core.prototype.setMaxContentLength=function(nLen)
{
  if(isNaN(parseInt(nLen,10))||nLen<=0)
  {
    return false;
  }
  this._maxContentLen=nLen;
  return true;
};
QZFL.editor.Core.prototype.initBlogEvents=function()
{
  if(!!this.bBlogEventsBinded)
  {
    return;
  }
  this.bBlogEventsBinded=true;
  var re=/<(table|tr|td|span|object|script|embed|h1|h2|h3|h4|h5|hr|ul|li|ol|strike)/i;
function keyup_event()
{
  if(!this._maxContentLen)
  {
    return;
  }
  var curLen=this.getContent().getRealLength();
  if(curLen>this._maxContentLen)
  {
    this.showTips('<font color="red">您输入的文字超出 <b>'+(curLen-this._maxContentLen)+'</b> 字符，请您进行适当删减后再进行发表。</font>');
  }
  else
  {
    if(!this.isHTMLMode()||!re.test(this.getEditor("html").getContents()))
    {
      this.hideTips();
    }
  }
}
if(this.getEditor("text"))
{
  QZFL.event.addEvent(this.getEditor("text").getInstance(),"keyup",QZFL.event.bind(this,keyup_event));
}
if(this.getEditor("html"))
{
  QZFL.event.addEvent(this.getEditor("html").getDocument(),"keyup",QZFL.event.bind(this,keyup_event));
  QZFL.event.addEvent(this.getEditor("html").getDocument().body,"paste",QZFL.event.bind(this,function()
  {
    setTimeout(QZFL.event.bind(this,function()
    {
      if(re.test(this.getCurrentEditor().getContents()))
      {
        this.showTips('<font color="red">您粘贴的内容中，有部分效果无法识别，<a href="javascript:;" class="unline c_tx" onclick="QZFL.editor.get(\''+this.uniqueID+'\').reloadContent(); QZFL.editor.get(\''+this.uniqueID+'\').hideTips();return false;">点击此处查看发表后的效果</a></font>');
      }
    }
    ),1000);
  }
  ));
}
};
QZFL.editor.Core.prototype.setupHTMLEvent=function()
{
QZFL.event.addEvent(this.getEditor("html").getDocument().body,"paste",QZFL.event.bind(this,function()
{
  setTimeout(QZFL.event.bind(this,function()
  {
    var strHTML="";
    var re=/<(table|tr|td|span|object|script|embed|h1|h2|h3|h4|h5|hr|ul|li|ol|strike)/i;
    if(re.test(this.getEditor("html").getContents()))
    {
      strHTML+='<p>您粘贴的部分内容格式（如表格），在最近公开日志模块可能无法正常显示，稍后会进行支持。</p>';
    }
    if(!this.isSecuredHTML(this.getEditor("html").getContents()))
    {
      strHTML+='<p>您粘贴的内容中，有部分效果无法识别，<a href="javascript:;" class="unline c_tx" onclick="QZFL.editor.get(\''+this.uniqueID+'\').reloadSecureHTML(); QZFL.editor.get(\''+this.uniqueID+'\').hideTips();return false;">点击此处查看发表后的效果</a></p>';
    }
    if(strHTML.length>0)
    {
      this.showTips(strHTML);
      return;
    }
    if(QZFL.dom.getScrollWidth(this.getEditor("html").getDocument())>(QZFL.dom.getClientWidth(this.getEditor("html").getDocument())+50))
    {
      this.showTips('<p>您输入的内容超过了日志的显示宽度，可能无法完整显示，请进行编辑</p>');
      return;
    }
  }
  ),1000);
}
));
if(QZFL.userAgent.ie)
{
  QZFL.event.addEvent(this.getEditor("html").getDocument().body,"keydown",QZFL.event.bind(this,function(event)
  {
    try
    {
      event=QZFL.event.getEvent(event);
      if(event.keyCode!=13)
      {
        return;
      }
      var selectedRange=this.getEditor("html").getSelectionRange();
      var tarObj=selectedRange.getCommonAncestorContainer();
      var fontValue=QZFL.dom.getStyle(tarObj,"fontFamily");
      for(var fontType in g_specialFontList)
      {
        if(g_specialFontList[fontType]["className"]==fontValue)
        {
          this.execCommand("fontname",fontValue);
          break;
        }
      }
    }
    catch(err)
    {
    }
  }
  ));
}
QZFL.event.addEvent(this.getEditor("html").getDocument(),"keydown",QZFL.event.bind(this,function()
{
  this._strConvertedHTML=null;
  this._strOldHTML=null;
}
));
this.initQuoteExternalImgTimer();
};
QZFL.editor.Core.prototype.loadSpecialFontLib=function(doc,fontName)
{
if(!doc||!g_specialFontList[fontName])
{
  return false;
}
if(!!g_specialFontList[fontName]["fontLibLoaded"])
{
  return false;
}
var sheet=doc.getElementById("pagestyle").sheet||doc.styleSheets["pagestyle"];
if(QZFL.userAgent.ie)
{
  sheet.cssText+='\n@font-face { font-family: '+g_specialFontList[fontName]["className"]+'; font-style: normal;font-weight: normal;src: url('+g_specialFontList[fontName]["urlPath"]+');}\n'+'.'+g_specialFontList[fontName]["classPrefix"]+'_12{font:12px '+g_specialFontList[fontName]["className"]+';};\n'+'.'+g_specialFontList[fontName]["classPrefix"]+'_16{font:16px '+g_specialFontList[fontName]["className"]+';}';
}
else
{
}
g_specialFontList[fontName]["fontLibLoaded"]=true;
return true;
};
QZFL.editor.Core.prototype.findElementByName=function(tName)
{
var oNode=null;
tName=tName.toUpperCase();
try
{
  if(!QZFL.userAgent.ie)
  {
    var selection=this.getCurrentEditor().editorWindow.getSelection();
    if(!!selection&&!!selection.getRangeAt)
    {
      var range=selection.getRangeAt(0);
      if(!range||!range.startContainer)
      {
        return oNode;
      }
      if(!range.startContainer.tagName&&range.startContainer.nodeType==3)
      {
        if(!!range.startContainer.parentNode&&range.startContainer.parentNode.tagName.toUpperCase()==tName)
        {
          oNode=range.startContainer.parentNode;
        }
      }
      else if(range.startContainer.tagName.toUpperCase()==tName)
      {
        oNode==range.startContainer;
      }
      else if(range.startContainer.tagName.toUpperCase()=="BODY")
      {
        oNode=range.startContainer.childNodes.item(range.startOffset);
        if(!oNode||!oNode.tagName||oNode.tagName.toUpperCase()!=tName)
        {
          oNode=null;
        }
      }
    }
  }
  else
  {
    var redo=10;
    var selectedRange=this.getCurrentEditor().getSelectionRange();
    oNode=selectedRange.getCommonAncestorContainer();
    while(oNode&&oNode.tagName.toUpperCase()!=tName)
    {
      if(redo<0)
      {
        return null;
      }
      oNode=oNode.parentNode;
      redo--;
    }
  }
}
catch(err)
{
  oNode=null;
}
return oNode;
};
QZFL.editor.blogEditorCacheMgr=
{
_cacheData:new Object(),addEditorCache:function(data)
{
  var cacheID=Math.random();
  this._cacheData["editor_"+cacheID]=data;
  return cacheID;
}
,getEditorCache:function(cacheID)
{
  try
  {
    return this._cacheData["editor_"+cacheID];
  }
  catch(e)
  {
    return null;
  }
}
,clearEditorCache:function(cacheID)
{
  this._cacheData["editor_"+cacheID]=null;
}
};
function blogEditorProcImgOnload(imgObj)
{
  if(!imgObj)
  {
    return;
  }
  imgObj.onload=null;
  var img=new Image();
  img.onload=function()
  {
    this.onload=null;
    var width=parseInt(this.width,10);
    var height=parseInt(this.height,10);
    if(width!=0&&height!=0)
    {
      imgObj.setAttribute("width",width);
      imgObj.setAttribute("height",height);
    }
  };
  img.src=imgObj.src;
}
var qzEditorLoaded=true;
(function()
{
function isInWhiteList(url)
{
  var isQQVideo=/^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(url);
  var isImgCache=/^http:\/\/(?:cnc.|edu.|ctc.)?imgcache.qq.com/i.test(url)||/^http:\/\/(?:cm.|cn.|os.|cnc.|edu.)?qzs.qq.com/i.test(url);
  var isComic=/^http:\/\/comic.qq.com/i.test(url);
  return(isQQVideo||isImgCache||isComic);
}
function Music_OutHTML(str)
{
  var nCount=0;
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_music/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);
      var ubb=/fromubb="([^"]+)"/i.exec(arguments[1]);++nCount;var arr=data.split("|");return'<object codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=8,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+((arr.length>7)?440:410)+'" height="'+((arr.length>7)?190:100)+'" src="'+"http://"+IMGCACHE_DOMAIN+"/music/musicbox_v2_1/img/MusicFlash.swf"+'" bgcolor="#ffffff" scale="showall" menu="true" allowScriptAccess="always" name="musicFlash**" id="'+"musicFlash"+(nCount-1)+'" ubb="'+data+'" class="blog_music"'+(ubb?(' fromubb="'+ubb[1]+'"'):'')+'><param name="movie" value="http://'+IMGCACHE_DOMAIN+'/music/musicbox_v2_1/img/MusicFlash.swf" />'+'<param name="bgColor" value="#ffffff" /><param name="scale" value="showall" /><param name="wmode" value="transparent" /><param name="menu" value="true" />'+'<param name="allowScriptAccess" value="always" /></object>';}}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    return str;
  }
function Music_InHTML(str)
{
  str=str.replace(/<object([^>]+)>(.*?)<\/object>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_music/i.test(arguments[1])){var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);
      var data=/ ubb="([^"]+)"/i.exec(arguments[1]);if(!!fromubb){return"[music]"+data[1]+"[/music]";}
      else
      {
        var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data[1]);
        var arr=data[1].split("|");
        return'<img src="/ac/b.gif" _cacheID="'+cacheID+'" class="blog_music'+((arr.length>7)?"_multiple":"")+'" onresizestart="return false;" />';
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Album_OutHTML(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_album/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);if(cID&&data){return'<embed class="blog_album"'+(fromubb?(' fromubb="'+fromubb[1]+'"'):'')+' imgurl="'+data[1]+'" id="'+Math.random()+'" allowFullScreen="true" allowNetworking="all" enableContextMenu="false" src="http://'+IMGCACHE_DOMAIN+'/qzone/client/photo/swf/vphoto.swf?btn_play_btn=1&uin='+data[2]+'&fid='+data[0]+'" width="520" height="390" showstatusbar="1" />';}}}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    return str;
  }
function Album_InHTML(str)
{
  str=str.replace(/<embed([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_album/i.test(arguments[1])){var src=/src="([^"]+)"/i.exec(arguments[1]);
      var url=/imgurl="([^"]+)"/i.exec(arguments[1]);var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);
      var value=new Array();
      value.push(src[1].getUrlParamValue("fid"));
      value.push(url[1]);
      value.push(src[1].getUrlParamValue("uin"));
      if(fromubb)
      {
        return"[vphoto,"+value[0]+","+value[2]+"]"+value[1]+"[/vphoto]";
      }
      else
      {
        var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(value);
        return'<img src="'+value[1]+'" style="height:390px;width:520px;" onresizestart="return false;" class="blog_album" _cacheID="'+cacheID+'" />';
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Video_OutHTML(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_video/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);if(cID&&data){var w=/WIDTH(:|=|: )(\d{1,3})/i.exec(arguments[1]);var h=/HEIGHT(:|=|: )(\d{1,3})/i.exec(arguments[1]);var isQQVideo=/^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(data[0]);var url='<embed class="blog_video"'+(fromubb?(' fromubb="'+fromubb[1]+'"'):'')+' allowNetworking="'+(isInWhiteList(data[0])?'all" allowScriptAccess="always"':'internal')+'" id="'+Math.random()+'" enableContextMenu="False" width="'+w[2]+'" height="'+h[2]+'" loop="'+data[1]+'" autostart="'+data[2]+'" showstatusbar="1" invokeURLs="false" src="'+data[0]+'" />';if(!isQQVideo){return url;}
      return'<object class="blog_video" id="'+Math.random()+'" codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=8,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+w[2]+'" height="'+h[2]+'">'+'<param name="loop" value="'+data[1]+'" />'+'<param name="autostart" value="'+data[2]+'" />'+'<param name="movie" value="'+data[0]+'" />'+'<param name="allowFullScreen" value="true" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allownetworking" value="all" />'+
      url+'</object>';
    }
  }
}
catch(err)
{
}
return arguments[0];
}
);
return str;
}
function Video_InHTML(str)
{
  str=str.replace(/<object([^>]+)>(.*?)<\/object>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_video/i.test(arguments[1])){var res=/(<embed([^>]+)>)/ig.exec(arguments[2]);if(!!res){return res[1];}}}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    str=str.replace(/<embed([^>]+)>/ig,function()
    {
      try
      {
        if(/class=("|')*blog_video/i.test(arguments[1])){var width=/width="([^"]+)"/i.exec(arguments[1]);
        var height=/height="([^"]+)"/i.exec(arguments[1]);var loop=/loop="([^"]+)"/i.exec(arguments[1]);
        var autostart=/autostart="([^"]+)"/i.exec(arguments[1]);var src=/src="([^"]+)"/i.exec(arguments[1]);
        var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);var data=[src[1],loop[1],autostart[1]];if(fromubb){return"[video,"+width[1]+","+height[1]+","+data[1]+","+data[2]+"]"+data[0]+"[/video]";}
        else
        {
          var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
          return'<img src="/ac/b.gif" class="blog_video" style="width:'+width[1]+'px;height:'+height[1]+'px;" _cacheID="'+cacheID+'" />';
        }
      }
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function Audio_OutHTML(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_audio/i.test(arguments[1])){var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);if(cID&&data){return'<embed class="blog_audio" allowNetworking="internal"'+(fromubb?(' fromubb="'+fromubb[1]+'"'):'')+' id="'+Math.random()+'" src="'+data[0]+'" loop="'+data[1]+'" autostart="'+data[2]+'"'+((data[3]=="true")?' height="0" width="0"':'')+' showstatusbar="1" invokeURLs="false" />';}}}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    return str;
  }
function Audio_InHTML(str)
{
  str=str.replace(/<embed([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_audio/i.test(arguments[1])){var width=/width="([^"]+)"/i.exec(arguments[1]);
      var height=/height="([^"]+)"/i.exec(arguments[1]);var loop=/loop="([^"]+)"/i.exec(arguments[1]);
      var autostart=/autostart="([^"]+)"/i.exec(arguments[1]);var src=/src="([^"]+)"/i.exec(arguments[1]);
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);var data=[src[1],loop[1],autostart[1]];if(!!width&&!!height){data.push("true");}
      else
      {
        data.push("false");
      }
      if(fromubb)
      {
        return"[audio,"+data[1]+","+data[2]+","+data[3]+"]"+data[0]+"[/audio]";
      }
      else
      {
        var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
        return'<img src="/ac/b.gif" class="blog_audio" _cacheID="'+cacheID+'" />';
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function Flash_OutHTML(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])){var className=/class=("|')*blog_(qqVideo|flash)/i.exec(arguments[1]);var cID=/_cacheID="([^"]+)"/i.exec(arguments[1]);var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);var data=QZFL.editor.blogEditorCacheMgr.getEditorCache(cID[1]);if(cID&&data){var w=/WIDTH(:|=|: )(\d{1,3})/i.exec(arguments[1]);var h=/HEIGHT(:|=|: )(\d{1,3})/i.exec(arguments[1]);var flag=isInWhiteList(data);var isQQSound=/qzone\/flashmod\/ivrplayer\/ivrplayer.swf/i.test(data);var isQQVideo=/^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(data);var url='<embed class="blog_'+className[2]+'"'+(fromubb?(' fromubb="'+fromubb[1]+'"'):'')+' id="'+Math.random()+'" menu="false" invokeURLs="false" allowNetworking="'+(flag?'all':'internal')+'" allowFullScreen="'+
      (flag?'true':'false')+'" allowscriptaccess="'+(flag?'always':'never')+'"'+((isQQSound&&flag)?(' flashvars="autoplay=1"'):'')+' wmode="transparent" src="'+data+'" height="'+h[2]+'" width="'+w[2]+'" />';
      if(isQQVideo)
      {
        return'<object class="blog_'+className[2]+'" id="'+Math.random()+'" codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=8,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+w[2]+'" height="'+h[2]+'">'+'<param name="movie" value="'+data+'" /><param name="wmode" value="transparent" /><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allownetworking" value="all" />'+url+'</object>';
      }
      return url;
    }
  }
}
catch(err)
{
}
return arguments[0];
}
);
return str;
}
function Flash_InHTML(str)
{
  str=str.replace(/<object([^>]+)>(.*?)<\/object>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])){var res=/(<embed([^>]+)>)/ig.exec(arguments[2]);if(!!res){return res[1];}}}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    str=str.replace(/<embed([^>]+)>/ig,function()
    {
      try
      {
        if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])){var className=/class=("|')*blog_(qqVideo|flash)/i.exec(arguments[1]);var width=/width="([^"]+)"/i.exec(arguments[1]);var height=/height="([^"]+)"/i.exec(arguments[1]);var src=/src="([^"]+)"/i.exec(arguments[1]);var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(fromubb){return"[flash,"+width[1]+","+height[1]+"]"+src[1]+"[/flash]";}
        else
        {
          var cacheID=QZFL.editor.blogEditorCacheMgr.addEditorCache(src[1]);
          return'<img src="/ac/b.gif" class="blog_'+className[2]+'" style="width:'+(width[1]==0?400:width[1])+'px;height:'+(height[1]==0?300:height[1])+'px;" _cacheID="'+cacheID+'" />';
        }
      }
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function QQshow_OutHTML(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      var args=arguments;
      var orgSrc=/orgSrc="([^"]+)"/i.exec(args[1]);var src=(orgSrc&&orgSrc[1])?orgSrc[1]:(/src="([^"]+)"/i.exec(args[1])[1]);
      var w=/WIDTH(: |=)(\d
      {
        1,3
      }
      )/i.exec(args[1]);
      var h=/HEIGHT(: |=)(\d
      {
        1,3
      }
      )/i.exec(args[1]);
      var t=/TRANSIMG=(\"*)(\d{1})/i.exec(args[1]);var ow=/ORIGINWIDTH=(\"*)(\d{1,3})/i.exec(args[1]);var oh=/ORIGINHEIGHT=(\"*)(\d{1,3})/i.exec(args[1]);var oContent=/CONTENT="([^"]+)"/i.exec(args[1]);
      var osrc=/ORIGINSRC="([^"]+)"/i.exec(args[1]);var fromubb=/fromubb="([^"]+)"/i.exec(args[1]);
      if(!!t&&!!ow&&!!oh)
      {
        if(!w)
        w=ow;
        if(!h)
        h=oh;
        src=(!!osrc?osrc[1]:src);
        return'<img'+(oContent?(' content="'+oContent[1]+'"'):'')+(fromubb?(' fromubb="'+fromubb[1]+'"'):'')+' src="'+src+'" transImg="1" originHeight="'+oh[2]+'" originWidth="'+ow[2]+'" style="width:'+w[2]+'px;height:'+h[2]+'px;" originSrc="'+src+'" />';
      }
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function QQshow_InHTML(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      var args=arguments;
      var orgSrc=/orgSrc="([^"]+)"/i.exec(args[1]);var src=(orgSrc&&orgSrc[1])?orgSrc[1]:(/src="([^"]+)"/i.exec(args[1])[1]);
      var w=/WIDTH(: |=)(\d
      {
        1,3
      }
      )/i.exec(args[1]);
      var h=/HEIGHT(: |=)(\d
      {
        1,3
      }
      )/i.exec(args[1]);
      var t=/TRANSIMG=(\"*)(\d{1})/i.exec(args[1]);var ow=/ORIGINWIDTH=(\"*)(\d{1,3})/i.exec(args[1]);var oh=/ORIGINHEIGHT=(\"*)(\d{1,3})/i.exec(args[1]);var oContent=/CONTENT="([^"]+)"/i.exec(args[1]);
      var osrc=/ORIGINSRC="([^"]+)"/i.exec(args[1]);var fromubb=/fromubb="([^"]+)"/i.exec(args[1]);
      if(!!t&&!!ow&&!!oh)
      {
        if(!w)
        w=ow;
        if(!h)
        h=oh;
        src=(!!osrc?osrc[1]:src);
        if(fromubb)
        {
          return"[qqshow,"+ow[2]+","+oh[2]+","+w[2]+","+h[2]+(oContent?(","+oContent[1]):"")+"]"+src+"[/qqshow]";
        }
        else
        {
          if(QZFL.userAgent.ie&&QZFL.userAgent.ie<7)
          {
            return'<img'+(oContent?(' content="'+oContent[1]+'"'):'')+' src="/ac/b.gif" transImg="1" originHeight="'+oh[2]+'" originWidth="'+ow[2]+'" style="width:'+w[2]+'px;height:'+h[2]+'px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src='+src+', sizingmethod=scale);" originSrc="'+src+'" />';
          }
          else
          {
            return'<img'+(oContent?(' content="'+oContent[1]+'"'):'')+' src="'+src+'" transImg="1" originHeight="'+oh[2]+'" originWidth="'+ow[2]+'" style="width:'+w[2]+'px;height:'+h[2]+'px;" originSrc="'+src+'" />';
          }
        }
      }
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function GlowFont_OutHtml(str)
{
  str=str.replace(/<font([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*lightFont/i.test(arguments[1])){var color=/_glowColor="([^"]+)"/i.exec(arguments[1]);
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);return'<font class="lightFont"'+(fromubb?(' fromubb="'+fromubb[1]+'"'):'')+' _glowColor="'+color[1]+'" style="filter: glow(color='+color[1]+',strength=3);
      display:inline-block;
      color:#FFFFFF;
      ">';}}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    return str;
  }
function GlowFont_InHtml(str)
{
  str=str.replace(/<font([^>]+)>([^\\<]+)<\/font>/ig,function()
  {
    try
    {
      if(/class=("|')*lightFont/i.test(arguments[1])){var color=/_glowColor="([^"]+)"/i.exec(arguments[1]);
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(fromubb){return"[ffg,"+color[1]+",#FFFFFF]"+arguments[2]+"[/ft]";}
      else
      {
        return'<font _glowColor="'+color[1]+'" color="'+color[1]+'" class="lightFont" title="发光字">'+arguments[2]+'</font>';
      }
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function AllFlash_OutHtml(str)
{
  str=str.replace(/<embed([^>]+)>/ig,function()
  {
    try
    {
      if(/invokeURLs="([^"]+)"/ig.test(arguments[1])){return arguments[0];}
      return'<embed invokeURLs="false" '+arguments[1]+'>';
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function AllHref_OutHtml(str)
{
  str=str.replace(/<a([^>]+)>(.*?)<\/a>/ig,function()
  {
    try
    {
      var hashTarget=/target=("|')_blank("|')/i.exec(arguments[1]);if(hashTarget){return arguments[0];}
      return('<a target="_blank"'+arguments[1]+'>'+arguments[2]+'</a>');
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function AllImages_OutHtml(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      var src=/src="([^"]+)"/i.exec(arguments[1]);if(/\/qzone\/em\//i.test(src[1])){return arguments[0];}
      var res=("<img"+arguments[1].replace(/src="([^"]+)"/i,function(){return'src="'+LOADING_GIF+'" orgSrc="'+src[1]+'"';}))+">";var appendurl=/appendurl="([^"]+)"/i.exec(arguments[1]);
      if(appendurl)
      {
        res='<a href="'+src[1]+'" appendurl="1" target="_blank">'+res+'</a>';
      }
      return res;
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function AllImages_InHtml(str)
{
  str=str.replace(/<img([^>]+)>/ig,function()
  {
    try
    {
      var src=/(?:\s)src="([^"]+)"/i.exec(arguments[1]);if(/\/qzone\/em\//i.test(src[1])){return arguments[0];}
      var orgsrc=/orgSrc="([^"]+)"/i.exec(arguments[1]);var res=("<img"+arguments[1].replace(/(?:\s)src="([^"]+)"/i,function()
      {
        return' src="'+orgsrc[1]+'"';
      }
      ))+">";
      res=res.replace(/orgSrc="([^"]+)"/ig,function(){return"";});return res;}
      catch(err)
      {
      }
      return arguments[0];
    }
    );
    return str;
  }
function Marque_OutHtml(str)
{
  var reg=/\[marque\]([^\[]+?)\[\/marque\]/ig;
  str=str.replace(reg,function()
  {
    return'<marquee fromubb="1">'+arguments[1]+'</marquee>';
  }
  );
  return str;
}
function Marque_InHtml(str)
{
  str=str.replace(/<marquee([^>]+)>(.*?)<\/marquee>/ig,function()
  {
    try
    {
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(!fromubb){return arguments[0];}
      return'[marque]'+arguments[2]+"[/marque]";
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
  return str;
}
function FloatFlash_OutHtml(str)
{
  var reg=/\[flasht,(\d
  {
    1,4
  }
  ),(\d
  {
    1,4
  }
  ),(\d
  {
    1,4
  }
  ),(\d
  {
    1,4
  }
  )\]([^\[]+?)\[\/flasht\]/ig;
  str=str.replace(reg,function()
  {
    var args=arguments;
    return'<embed wmode="transparent" invokeURLs="false" allowscriptaccess="never" type="application/octet-stream" style="position:absolute;left:'+args[3]+'px;top:'+args[4]+'px;" quality="high" menu="false" id="'+Math.random()+'" allownetworking="internal" src="'+args[5]+'" height="'+args[2]+'" width="'+args[1]+'" left="'+args[3]+'" top="'+args[4]+'" class="blog_flasht" />';
  }
  );
  return str;
}
function FloatFlash_InHtml(str)
{
  str=str.replace(/<embed([^>]+)>/ig,function()
  {
    try
    {
      if(/class=("|')*blog_flasht/i.test(arguments[1])){var width=/width="([^"]+)"/i.exec(arguments[1]);
      var height=/height="([^"]+)"/i.exec(arguments[1]);var src=/src="([^"]+)"/i.exec(arguments[1]);
      var left=/left="([^"]+)"/i.exec(arguments[1]);var top=/top="([^"]+)"/i.exec(arguments[1]);
      return"[flasht,"+width[1]+","+height[1]+","+left[1]+","+top[1]+"]"+src[1]+"[/flasht]";
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
return str;
}
function AllGeneralUbb_InHtml(str)
{
  var qzReg=new Object();
function createRegEX(key,pattern,flags)
{
  qzReg[key]=new RegExp('');
  qzReg[key].compile(pattern,flags);
}
function convertSymmetricUbb(str,htmltag,ubbtag)
{
  createRegEX(htmltag+ubbtag,'<('+htmltag+')([^>]+)>(.*?)<\\/('+htmltag+')>','ig');
  return str.replace(qzReg[htmltag+ubbtag],function()
  {
    try
    {
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[2]);if(!fromubb){return arguments[0];}
      return'['+ubbtag+']'+arguments[3]+'[/'+ubbtag+']';
    }
    catch(err)
    {
    }
    return arguments[0];
  }
  );
}
createRegEX('fullFont','<font[^>]+style="[^"].+color=#(\\w+).+color:\s#(\\w+).+"[^>]*>([^\\<]+)<\\/font[^>]*>','ig');
str=str.replace(/<img([^>]+)>/ig,function()
{
  try
  {
    var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(!fromubb){return arguments[0];}
    if(/em\/e(\d
    {
      1,3
    }
    ).gif/ig.test(arguments[1]))
    {
      var em=/em\/e(\d
      {
        1,3
      }
      ).gif/ig.exec(arguments[1]);
      return'[em]e'+em[1]+'[/em]';
    }
    var orgSrc=/orgSrc="([^"]+)"/i.exec(arguments[1]);var src=(orgSrc&&orgSrc[1])?orgSrc[1]:(/src="([^"]+)"/i.exec(arguments[1])[1]);
    var w=/WIDTH([\D]
    {
      0,2
    }
    )(\d
    {
      1,4
    }
    )/i.exec(arguments[1]);
    var h=/HEIGHT([\D]
    {
      0,2
    }
    )(\d
    {
      1,4
    }
    )/i.exec(arguments[1]);
    if(w&&h)
    {
      return"[img,"+w[2]+","+h[2]+"]"+src+"[/img]";
    }
    return"[img]"+src+"[/img]";
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
str=convertSymmetricUbb(str,"strong|b","B");
str=convertSymmetricUbb(str,"ins|u","U");
str=convertSymmetricUbb(str,"em|i","I");
str=convertSymmetricUbb(str,"ol","ol");
str=convertSymmetricUbb(str,"ul","ul");
str=convertSymmetricUbb(str,"li","li");
str=str.replace(/<(div|p)([^>])+align.
{
  0,2
}
(center|right)([^>]*)>(.*?)<\/(div|p)>/ig,function()
{
  try
  {
    var fromubb=/fromubb="([^"]+)"/i.exec(arguments[4]);if(!fromubb){return arguments[0];}
    var tag=(arguments[3]=="center"?"M":"R");
    return("["+tag+"]"+arguments[5]+"[/"+tag+"]");
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
str=str.replace(/<a([^>]+)>(.*?)<\/a>/ig,function()
{
  try
  {
    var appendurl=/appendurl="([^"]+)"/i.exec(arguments[1]);if(appendurl){return arguments[2];}
    var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(!fromubb){return arguments[0];}
    var res=/href="mailto:(.*?)"/ig.exec(arguments[1]);
    if(res)
    {
      return"[email="+res[1]+"]"+arguments[2]+"[/email]";
    }
    res=/link="nameCard_(\d+)"/ig.exec(arguments[1]);
    if(res)
    {
      return"[card="+res[1]+"]"+arguments[2]+"[/card]";
    }
    res=/href="(.*?)"/ig.exec(arguments[1]);
    if(res)
    {
      return"[url="+res[1]+"]"+arguments[2]+"[/url]";
    }
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
str=str.replace(/<font([^>]+)>(.*?)<\/font>/ig,function()
{
  try
  {
    var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(!fromubb){return arguments[0];}
    var color=/color([^#\w]
    {
      0,2
    }
    )([#\w]
    {
      1,7
    }
    )/.exec(arguments[1]);
    var size=/size=["]?(\d{1})/.exec(arguments[1]);var face=/face=("|)([^"\s]+)("|)/.exec(arguments[1]);
    return"[ft="+(color?color[2]:"")+","+(size?size[1]:"")+","+(face?face[2]:"")+"]"+arguments[2]+"[/ft]";
  }
  catch(err)
  {
  }
  return arguments[0];
}
);
if(!QZFL.userAgent.ie)
{
  str=str.replace(/<(div|span)([^>]+)>(.*?)<\/(div|span)>/ig,function()
  {
    try
    {
      var fromubb=/fromubb="([^"]+)"/i.exec(arguments[1]);if(!fromubb){return arguments[0];}
      var color=/color: ([^;
      ]+)/.exec(arguments[2]);
      var face=/font-family: ([^;
      ]+)/.exec(arguments[2]);
      return"[ft="+(color?color[1]:"")+",,"+(face?face[1]:"")+"]"+arguments[3]+"[/ft]";
    }
    catch(err)
    {
    }
  }
  );
}
return str;
}
QZFL.editor.Core.prototype.convertOutSpecialHTML=function(strHtml)
{
strHtml=Marque_OutHtml(strHtml);
strHtml=FloatFlash_OutHtml(strHtml);
strHtml=Music_OutHTML(strHtml);
strHtml=Album_OutHTML(strHtml);
strHtml=Video_OutHTML(strHtml);
strHtml=Audio_OutHTML(strHtml);
strHtml=Flash_OutHTML(strHtml);
strHtml=QQshow_OutHTML(strHtml);
strHtml=GlowFont_OutHtml(strHtml);
strHtml=AllImages_OutHtml(strHtml);
strHtml=AllHref_OutHtml(strHtml);
strHtml=AllFlash_OutHtml(strHtml);
return strHtml;
};
QZFL.editor.Core.prototype.convertInSpecialHTML=function(strHtml)
{
strHtml=Marque_InHtml(strHtml);
strHtml=FloatFlash_InHtml(strHtml);
strHtml=Music_InHTML(strHtml);
strHtml=Album_InHTML(strHtml);
strHtml=Video_InHTML(strHtml);
strHtml=Audio_InHTML(strHtml);
strHtml=Flash_InHTML(strHtml);
strHtml=QQshow_InHTML(strHtml);
strHtml=GlowFont_InHtml(strHtml);
strHtml=AllImages_InHtml(strHtml);
strHtml=AllGeneralUbb_InHtml(strHtml);
return strHtml;
};
QZFL.editor.Core.prototype.getSpecialFontNameList=function(strHtml)
{
var arr=[];
strHtml=strHtml.replace(/<(font|span)([^>]+)>/ig,function()
{
  var res=/face=("|)([^"\s]+)("|)/.exec(arguments[2]);if(res&&res[2]){for(var type in g_specialFontList){if(res[2].indexOf(g_specialFontList[type]["className"])!=-1){arr.push(type);}}}
  return arguments[0];
}
);
strHtml=strHtml.replace(/<(div|span)([^>]+)>(.*?)<\/(div|span)[^>]*>/ig,function()
{
  var res=/font-family: ([^;
  ]+)/ig.exec(arguments[2]);
  if(res&&res[2])
  {
    for(var type in g_specialFontList)
    {
      if(res[2].indexOf(g_specialFontList[type]["className"])!=-1)
      {
        arr.push(type);
      }
    }
  }
  return arguments[0];
}
);
return QZFL.lang.uniqueArray(arr);
};
}
)();
QZFL.editor.Core.prototype.showTips=function(html,options)
{
options=options||
{
};
options.priority=(typeof(options.priority)=="undefined"?1:options.priority);
if(this._tipsOpened)
{
if(this._dom_tips.options.priority>options.priority)
{
  return;
}
}
this._dom_tips.options=options;
this._dom_tips.style.display="";
this._dom_tips.innerHTML='<div id="'+this.uniqueID+'_tips_close" class="bt_hint_close '+(options.close==0?'none':'')+'" title="关闭">X</div><div class="editor_hint_cont">'+html+'</div>';
this._dom_tips.style.height="auto";
if(!this._tipsOpened)
{
var _size=QZFL.dom.getSize(this._dom_tips);
var _t=new QZFL.Tween(this._dom_tips,"height",QZFL.transitions.regularEaseInOut,"0px",(Math.max(28,_size[1])+"px"),0.3);
_t.start();
}
this._tipsOpened=true;
QZFL.event.addEvent($(this.uniqueID+'_tips_close'),"click",QZFL.event.bind(this,this.hideTips));
if(options.timeout)
{
var o=this;
setTimeout(function()
{
  o.hideTips();
  o=null;
}
,options.timeout);
}
}
QZFL.editor.Core.prototype.hideTips=function(options)
{
if(!this._tipsOpened)
{
return;
}
options=options||
{
};
options.priority=(typeof(options.priority)=="undefined"?1:options.priority);
if(this._dom_tips.options.priority>options.priority)
{
return;
}
var _t=new QZFL.Tween(this._dom_tips,"height",QZFL.transitions.regularEaseInOut,"28px","0px",0.3);
var o=this;
_t.onMotionStop=function()
{
o._dom_tips.style.display="none";
o._tipsOpened=false;
o=null;
}
_t.start();
}
QZFL.editor.Core.prototype.initQuoteExternalImgTimer=function()
{
this._getExternalImages=function(html)
{
var arr=[];
html=html.replace(/<img([^>]+)>/ig,function()
{
  try
  {
    var em=/em\/e(\d
    {
      1,3
    }
    ).gif/i.exec(arguments[1]);
    if(em)
    {
      return;
    }
    var src=/orgSrc="([^"]+)"/i.exec(arguments[1]);if(!src){src=/src="([^"]+)"/i.exec(arguments[1]);
  }
  if(!/^http:\/\/[^\s]*photo.store.qq.com/i.test(src[1]))
  {
    arr.push(src[1]);
  }
}
catch(err)
{
}
return arguments[0];
}
);
return QZONE.lang.uniqueArray(arr);
};
this._nQuoteImgTimer=setInterval(QZFL.event.bind(this,function()
{
if(!this.isHTMLMode())
{
return;
}
var contentHTML=this.getEditor("html").getContents();
var arr=this._getExternalImages(contentHTML);
if(arr.length==0)
{
this.hideTips(
{
  "priority":0
}
);
return;
}
var strHTML="您的日志中包含有非Qzone相册图片，为了保证日志可以正常显示，建议您<a href='javascript:;' class='c_tx unline' onclick='QZFL.editor.get(\""+this.uniqueID+"\").quoteExternalImg();return false;'>转存图片到自己的相册</a>。";
this.showTips(strHTML,
{
"close":0,"priority":0
}
);
}
),1000);
};
QZFL.editor.Core.prototype.quoteExternalImg=function()
{
if(QZONE.media.getFlashVersion().major<9)
{
var dlg=new parent.QZFL.widget.Confirm('温馨提示','您的浏览器未安装Flash控件或版本过低，请<a href="http://get.adobe.com/flashplayer/" class="c_tx" target="_blank">安装最新版本</a>后再使用转存图片功能。',
{
"type":1,"icontype":"error"
}
);
dlg.show();
return;
}
var contentHTML=this.getEditor("html").getContents();
var arr=this._getExternalImages(contentHTML);
if(arr.length==0)
{
this.hideTips();
return;
}
parent.g_XDoc["blogSubmit"]=
{
};
parent.g_XDoc["blogSubmit"]["html"]=contentHTML;
parent.g_XDoc["blogSubmit"]["externImgArr"]=arr;
parent.g_XDoc["blogSubmit"]["callback"]=QZONE.event.bind(this,function(strHTML)
{
this.getEditor("html").setContents(strHTML);
this.hideTips(
{
"priority":0
}
);
}
);
QZBlog.Util.popupDialog('转存图片','<iframe frameborder="no" id="quoteExternImgFrame" style="width:100%;height:285px;" src="'+IMGCACHE_BLOG_V5_PATH+'/quote_extern_image_dlg.html?blogid"></iframe>',467,313);
};
