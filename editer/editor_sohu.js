
$register('sohu.editor.*',function()
{
  window.Editor=
  {
  };
  Editor.MODE=
  {
    visual:'1',source:'2'
  };
  Editor.getElById=function(el)
  {
    if(typeof(el)=='string')
    el=document.getElementById(el);
    return el;
  };
  Editor.getIptVal=function(el)
  {
    el=Editor.getElById(el)
    var tag=el.tagName.toLowerCase();
    if(tag=='input')
    {
      switch(el.type)
      {
        case'checkbox':case'radio':return el.checked?true:false;
        break;
      }
    }
    return el.value;
  };
  Editor.Event=
  {
    observe:function(o,t,f)
    {
      if(o.addEventListener)o.addEventListener(t,f,false);
      else if(o.attachEvent)o.attachEvent('on'+t,f);
      else o['on'+t]=f;
    }
    ,stopObserving:function(o,t,f)
    {
      if(o.removeEventListener)o.removeEventListener(t,f,false);
      else if(o.detachEvent)o.detachEvent('on'+t,f);
      else o['on'+t]=null;
    }
    ,stop:function(e)
    {
      e.cancelBubble=true;
      if(e.stopPropagation)
      {
        e.stopPropagation();
      }
      e.returnValue=false;
      if(e.preventDefault)
      {
        e.preventDefault();
      }
    }
    ,element:function(e)
    {
      return e.target||e.srcElement;
    }
  }
  Editor.Dom=
  {
    create:function(tag,class2,parent)
    {
      var element=document.createElement(tag);
      if(class2)element.className=class2;
      if(!parent)parent=document.body;
      parent.appendChild(element);
      return element;
    }
    ,show:function(element)
    {
      element.style.display="block";
    }
    ,hide:function(element)
    {
      element.style.display="none";
    }
    ,getOffsetRect:function(element)
    {
      var rect=
      {
        left:0,top:0,width:0,height:0,bottom:0,right:0
      };
      if(element==document)
      {
        element=document.documentElement;
        rect.left=element.scrollLeft;
        rect.top=element.scrollTop;
        if(kola.Browser.ie)
        {
          rect.width=element.offsetWidth;
          rect.height=element.offsetHeight;
        }
        else
        {
          rect.width=window.innerWidth;
          rect.height=window.innerHeight;
        }
      }
      else
      {
        rect.left=element.offsetLeft;
        rect.top=element.offsetTop;
        if(element==document.body&&!kola.Browser.ie)
        {
          element=document.documentElement;
          rect.width=element.scrollWidth;
          rect.height=element.scrollHeight;
        }
        else
        {
          rect.width=element.offsetWidth;
          rect.height=element.offsetHeight;
        }
      }
      rect.bottom=rect.top+rect.height;
      rect.right=rect.left+rect.width;
      return rect;
    }
    ,getRect:function(element)
    {
      var rect=Editor.Dom.getOffsetRect(element);
      var parent=element.offsetParent;
      while(parent)
      {
        var tempRect=Editor.Dom.getOffsetRect(parent);
        rect.left+=tempRect.left;
        rect.top+=tempRect.top;
        parent=parent.offsetParent;
      }
      rect.bottom=rect.top+rect.height;
      rect.right=rect.left+rect.width;
      return rect;
    }
    ,setPosition:function(element,position)
    {
      element.style.left=position.left+"px";
      element.style.top=position.top+"px";
    }
  }
  Editor.model=new sohu.core.Model(
  {
    actions:
    {
      formatSWF:
      {
        url:'/a/app/share/info/formatUrl.do',params:['url'],method:'post',format:'json',encode:'uri'
      }
    }
    ,url:''
  }
  );
  Editor.init=function(options)
  {
    Editor._initOptions(options);
    Editor._initElements();
    Editor.initMenuRect();
    if(!kola.Browser.ie&&Editor.coder.value.trim().length!=0)
    {
      Editor.coder.value=Editor.Video.replaceEmbed(Editor.coder.value);
    }
    Editor._initMenuBar();
window.setTimeout(function()
{
  Editor._initEditorIframe();
}
,0);
Editor._initScrollMenu();
return this;
};
Editor._initOptions=function(options)
{
Editor.initHeight=options.height?options.height:330;
Editor.outMenus=options.outMenus?options.outMenus:Editor.Config.tool.data.outMenus;
Editor.lastHeight=Editor.initHeight;
Editor.lastBodyHeight=0;
Editor.controls=null;
Editor.iframe=null;
Editor.iWin=null;
Editor.iWin=null;
Editor.iDoc=null;
Editor.iBody=null;
Editor.cache=null;
Editor.coder=null;
Editor.range=null;
Editor.selection=null;
Editor.rangeCache=null;
Editor._selectedEl=null;
Editor.mode=Editor.MODE.visual;
};
Editor.initMenuRect=function()
{
var navbar=null,menuEl=$('#menuContainer'),menuPos=menuEl.pos();
Editor.menuHeight=menuEl.height();
Editor.menuInitTop=menuPos.top;
Editor.menuInitLeft=menuPos.left;
Editor.menuMinTop=(navbar=$('#navbar'))?navbar.height():0;
Editor.menuRltvTop=Editor.menuInitTop-Editor.menuMinTop;
Editor.setMenuWidth();
};
Editor._initElements=function()
{
Editor.menu=Editor.getElById("menuContainer");
Editor.coder=Editor.getElById("entryContent");
Editor.container=Editor.getElById("editorContainer");
Editor.txtContainer=Editor.getElById("txtEditorContainer");
Editor.ifrContainer=Editor.getElById("ifrEditorContainer");
Editor.fotContainer=Editor.getElById("fotEditorContainer");
};
Editor._initMenuBar=function()
{
var menuData=Editor.Config.tool.data.allMenus,outMenus=Editor.outMenus,css=Editor.Config.tool.css;
Editor.setMenuWidth();
Editor.controls=new Object();
for(var part in menuData)
{
  var partWrap=Editor.Dom.create("div",css[part],Editor.menu),partData=menuData[part];
  Editor.menu[part]=partWrap;
  for(var i=0,l=partData.length;i<l;i++)
  {
    var toolData=partData[i],type=toolData[0],key=toolData[1];
    if(outMenus&&outMenus[key])continue;
    if(type=="separator")
    {
      Editor.Dom.create("div",css.menuSeparator,partWrap);
    }
    else if(type=="a")
    {
      var tool=Editor.Dom.create("a",css.menuLink,partWrap);
      tool.innerHTML=toolData[2];
      tool.href="javascript:void(0);";
      tool.onclick=toolData[3];
    }
    else
    {
      var name=toolData[2],downCall=toolData[3],upCall=toolData[4],selectCall=toolData[5],cancelCall=toolData[6];
      var tool=Editor.Dom.create("div",key,partWrap);
      tool.title=name;
      if(key=="fontname"||key=="fontsize")
      {
        tool.innerHTML=name;
      }
      tool.sohu=
      {
        id:key,type:type,state:0,tool:tool,downCall:downCall
      }
      Editor.controls[key]=tool;
      if(upCall)
      {
        tool.sohu.upCall=upCall;
        if(selectCall)tool.sohu.selectCall=selectCall;
        if(cancelCall)tool.sohu.cancelCall=cancelCall;
      }
      else
      {
        tool.sohu.upCall=downCall;
      }
      Editor.Event.observe(tool,"mouseover",Editor.toolMouseOver.bind(Editor,tool));
      Editor.Event.observe(tool,"mouseout",Editor.toolMouseOut.bind(Editor,tool));
      Editor.Event.observe(tool,"mousedown",Editor.toolMouseDown.bind(Editor,tool));
      Editor.Event.observe(tool,"mouseup",Editor.toolMouseUp.bindEvent(Editor,tool));
      Editor.Event.observe(tool,"mousedown",Editor._clickMonitor.bind(Editor,key));
    }
  }
}
Editor.menu.onselectstart=function()
{
  return false;
};
};
Editor._clickMonitor=function(key)
{
$call('sohu.sa.cc(\'blog_editor_'+key+'\')','sohu.sa.*');
}
,Editor._initEditorIframe=function()
{
Editor.ifrContainer.innerHTML='<iframe id="editorIframe" style="height:'+Editor.initHeight+'px;" frameborder="0" scroll="no" src="http://'+PATH.domain+'/a/app/blog/editor.html"></iframe>';
Editor.ifrContainer.style.height='auto';
};
Editor.initElements=function()
{
var css=Editor.Config.tool.css;
Editor.cache=Editor.Dom.create("div",css.cache,document.body);
Editor.iframe=Editor.getElById('editorIframe');
Editor.iWin=Editor.iframe.contentWindow;
Editor.iDoc=Editor.iWin.document;
Editor.iBody=Editor.iDoc.body;
Editor.iBody.style.overflow='hidden';
Editor.iBody.innerHTML=Editor.coder.value==''?'<p>&nbsp;</p>':Editor.coder.value;
if(kola.Browser.ie)
{
  Editor.iBody.contentEditable=true;
  Editor.Event.observe(Editor.iBody,"beforedeactivate",Editor.cacheRange);
  Editor.Event.observe(Editor.iDoc,"click",Editor.focusContent);
  Editor.Event.observe(Editor.iBody,"focus",Editor.focusContent);
  Editor.Event.observe(Editor.iDoc,"selectionchange",Editor._onSelectionChange.bindEvent(Editor));
  Editor.History.init(Editor.iDoc);
}
else
{
  Editor.iDoc.designMode="on";
  Editor.Event.observe(Editor.iBody,"mouseup",Editor._checkMenusState);
  Editor.Event.observe(Editor.iDoc,"keypress",Editor._checkMenusState);
  Editor.Event.observe(Editor.iBody,"click",Editor._showEditMenu.bindEvent(Editor));
}
Editor._checkMenusState();
window.setTimeout(Editor.addHeightListener,3000);
};
Editor.onKeyPress
Editor.hide=function()
{
Editor.iframe.style.visibility='hidden';
}
,Editor.show=function()
{
Editor.iframe.style.visibility='visible';
}
,Editor._onSelectionChange=function(e)
{
Editor._checkMenusState();
Editor._showEditMenu(e);
};
Editor._showEditMenu=function(e)
{
if(typeof(e)=='undefined')return;
var el=kola.Event.element(e),tag=null;
if(kola.Browser.ie)
{
  var el=Editor.getElement();
  if(el)el=$(el);
  else return;
}
if(el&&(tag=el.prop('tagName').toLowerCase()))
{
  if("img,a,embed".indexOf(tag)!=-1)
  {
    var pos=el.pos(),tip=$('#editor_edit_menu_tip'),scrollTop=document.body&&document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop;
    if(!tip)
    {
      tip=kola.Element.create("div",
      {
        id:'editor_edit_menu_tip','class':'editorTip',style:'position:absolute'
      }
      ),tip.width(150);
      $(document.body).append(tip);
    }
    tip.pos(
    {
      left:Editor.menuInitLeft+pos.left,top:Editor.menuInitTop+Editor.menuHeight+el.height()+pos.top+-scrollTop+5
    }
    );
    if(tag=="img")
    {
      if(el.attr('src').indexOf(PATH.img+'emots/base/')!=-1)
      {
        tip.html(Editor.Config.lister.emotData.editTip).show();
      }
      else
      {
        tip.html(Editor.Config.lister.imageData.editTip).show();
      }
    }
    else if(tag=="a")
    {
      tip.html(Editor.Config.lister.urlData.editTip).show();
    }
    else if(tag=="embed")
    {
      tip.html(Editor.Config.lister.videoData.editTip).show();
    }
    Editor._selectedEl=el;
    return;
  }
}
var tip=$('#editor_edit_menu_tip');
if(tip)
{
  tip.hide();
  Editor._selectedEl=null;
}
};
Editor.hideEditTip=function()
{
var tip=$('#editor_edit_menu_tip');
if(tip)setTimeout(function()
{
  tip.hide();
}
,100);
}
,Editor.getSelected=function(tag)
{
var el=Editor._selectedEl;
if(el&&el.parent())
{
  if(!!tag)return el.elements()[0];
  else return el;
}
else return null;
};
Editor.delSelected=function()
{
var el=Editor._selectedEl;
try
{
  if(el.prop('tagName').toLowerCase()=="a")
  {
    Editor.clearLink();
  }
  else
  {
    Editor.removeSelected();
  }
}
catch(e)
{
}
};
Editor.removeSelected=function()
{
if(Editor._selectedEl)
{
  try
  {
    Editor._selectedEl.remove();
  }
  catch(e)
  {
  }
  Editor._selectedEl=null;
}
};
Editor.setContent=function()
{
if(Editor.isView())
{
  var content=Editor.iBody.innerHTML;
  if(Editor.iDoc)
  {
    if(content.indexOf('src=')!=-1)
    {
      Editor.coder.value=content;
    }
    else if(content.replace(/<[^>]+>/gm,'').replace(/&nbsp;/gm,'').trim()=='')
    {
      Editor.coder.value='';
    }
    else
    {
      Editor.coder.value=content;
    }
    if(!kola.Browser.ie&&Editor.coder.value!='')
    {
      Editor.coder.value=Editor.Video.replaceIframe(Editor.coder.value);
    }
  }
}
};
Editor.setHtml=function(value)
{
Editor.iBody.innerHTML='';
Editor.pasteHTML(value);
Editor.focusContent();
};
Editor.formatSource=function()
{
$call(function()
{
  kola.helper.HtmlFormatter.format(Editor.coder.value,function(formatted)
  {
    Editor.coder.value=formatted;
  }
  ,function()
  {
  }
  );
}
,'kola.helper.HtmlFormatter');
};
Editor._checkMenusState=function()
{
if(!Editor.isChecking)
{
  Editor.isChecking=true;
  if(!Editor._stateArray)
  {
    Editor.stateChecking=true;
    if(kola.Browser.ie)
    {
      Editor._stateArray=["Undo","Redo","FontName","FontSize","Bold","Italic","Underline","JustifyLeft"];
    }
    else
    {
      Editor._stateArray=["undo","redo","fontname","fontsize","bold","italic","underline","justifyleft"];
    }
  }
  try
  {
    var range=Editor.iDoc;
    if(range)
    {
      for(var i=0,l=Editor._stateArray.length;i<l;i++)
      {
        Editor._checkRangeState(Editor._stateArray[i],range);
      }
    }
  }
  catch(e)
  {
  }
  finally
  {
    Editor.isChecking=false;
  }
}
};
Editor._checkRangeState=function(command,range)
{
var stateValue=false,menuKey=command.toLowerCase(),menuEl=Editor.controls[menuKey];
switch(menuKey)
{
  case"cut":case"copy":case"paste":
  {
    stateValue=range.queryCommandEnabled(command);
    if(stateValue)Editor._setMenuState(menuEl,0);
    else Editor._setMenuState(menuEl,-3);
    break;
  }
  case"fontname":case"fontsize":
  {
    stateValue=range.queryCommandValue(command);
    if(menuKey=="fontname")
    {
      if(stateValue=="")stateValue="字体";
      else
      {
        stateValue=stateValue.replace(/'/g,"");var dotIndex=stateValue.indexOf(",");if(dotIndex>0)stateValue=stateValue.substr(0,dotIndex);dotIndex=stateValue.indexOf("_");if(dotIndex>0)stateValue=stateValue.substr(0,dotIndex);}}else if(menuKey=="fontsize"){if(stateValue=="")stateValue="字号";else{var i=0,hasValue=false;if(kola.Browser.webkit){var values=Editor.Config.lister.fontSizeData.text;}else{var values=Editor.Config.lister.fontSizeData.value;}
        for(i=0;i<values.length;i++)
        {
          if(values[i]==stateValue)
          {
            if(i==0)break;
            stateValue=Editor.Config.lister.fontSizeData.text[i];
            hasValue=true;
            break;
          }
        }
        if(!hasValue)stateValue="字号";
      }
    }
    menuEl.sohu.tool.innerHTML=stateValue;
    break;
  }
  case"justifyleft":case"justifycenter":case"justifyright":
  {
    var left=0,center=0,right=0;
    if(kola.Browser.ie)
    {
      left=range.queryCommandState("JustifyLeft")?-2:0;
      center=range.queryCommandState("JustifyCenter")?-2:0;
      right=range.queryCommandState("JustifyRight")?-2:0;
    }
    else
    {
      stateValue=range.queryCommandValue(command);
      if(stateValue=="left")left=-2;
      if(stateValue=="center")center=-2;
      if(stateValue=="right")right=-2;
    }
    Editor._setMenuState(Editor.controls["justifyleft"],left);
    Editor._setMenuState(Editor.controls["justifycenter"],center);
    Editor._setMenuState(Editor.controls["justifyright"],right);
    break;
  }
  case"undo":case"redo":
  {
    stateValue=Editor.iDoc.queryCommandEnabled(command);
    if(stateValue||(kola.Browser.ie&&Editor.History['get'+command+'State']()))
    {
      Editor._setMenuState(menuEl,0);
    }
    else Editor._setMenuState(menuEl,-3);
    break;
  }
  default:
  {
    stateValue=range.queryCommandState(command);
    if(stateValue)Editor._setMenuState(menuEl,-2);
    else Editor._setMenuState(menuEl,0);
    break;
  }
}
return stateValue;
};
Editor._execCommand=function(command,option)
{
var returnValue=false;
if(Editor.isView())
{
  Editor.checkRange();
  if(option&&option=="#"&&kola.Browser.ie)
  {
    Editor.removeColor(command);
  }
  else
  {
    try
    {
      if(!kola.Browser.ie)command=command.toLowerCase();
      Editor.iDoc.execCommand(command,false,option);
      if(!kola.Browser.ie)Editor.focusContent();
    }
    catch(e)
    {
    }
  }
}
return returnValue;
};
Editor.getText=function()
{
var range=Editor.getRange();
if(range)
{
  if(Editor.selection.type.toLowerCase()=="control")
  {
    html=range.item(0).innerHTML;
  }
  else
  {
    html=range.text;
  }
  if(!html)html="";
}
return html;
};
Editor.removeColor=function(command)
{
var html=Editor.getText();
if(html.length>0)
{
  var element=Editor.getSpecialElement("font",true);
  if(element&&element.innerHTML==html)
  {
    if(command=="ForeColor")
    {
      element.color="";
    }
    else
    {
      element.style.backgroundColor="";
    }
  }
}
else
{
  Editor.iDoc.execCommand(command,false,"#");
}
};
Editor._setMenuState=function(menuEl,menuState,menuKey)
{
if(!menuEl)menuEl=Editor.controls[menuKey];
if(menuEl)
{
  var cssConfig=Editor.Config.tool.css,toolType=menuEl.sohu.id;
  menuEl.sohu.state=menuState;
  switch(menuState)
  {
    case 1:menuEl.className=toolType+' '+toolType+cssConfig.toolOver;
    break;
    case 0:menuEl.className=toolType;
    break;
    case-1:case-2:menuEl.className=toolType+' '+toolType+cssConfig.toolDown;
    break;
    case-3:menuEl.className=toolType+' '+toolType+cssConfig.toolDisabled;
    break;
  }
}
};
Editor.toolMouseOver=function(menuEl)
{
if(menuEl.sohu.state==0)
{
  Editor._setMenuState(menuEl,1);
}
};
Editor.toolMouseOut=function(menuEl)
{
if(menuEl.sohu.state==1)
{
  Editor._setMenuState(menuEl,0);
}
};
Editor.toolMouseDown=function(menuEl)
{
if(menuEl.sohu.state!=-3)
{
  if(Editor.Lister.now)
  {
    if(!(menuEl.sohu.lister&&menuEl.sohu.lister==Editor.Lister.now))
    {
      Editor.Lister.now.cancel(false);
    }
  }
  if(menuEl.sohu.state!=-1&&menuEl.sohu.state!=-2)Editor._setMenuState(menuEl,-1);
}
};
Editor.toolMouseUp=function(e,menuEl)
{
if(menuEl.sohu.state!=-3)
{
  var newState=1;
  if(menuEl.sohu.state==-1)newState=menuEl.sohu.downCall.call(Editor);
  if(menuEl.sohu.state==-2)newState=menuEl.sohu.upCall.call(Editor);
  Editor._setMenuState(menuEl,newState);
  Editor.Event.stop(e);
  Editor._checkMenusState();
}
};
Editor.clearFormat=function()
{
$call(function()
{
  Editor.replaceContent(kola.helper.HtmlFilter(Editor.iBody.innerHTML));
  Editor._setMenuState(null,0,"clearformat");
}
,'kola.helper.HtmlFilter')
return-1;
};
Editor.undo=function()
{
if(kola.Browser.ie)
{
  Editor.History.undo();
}
else
{
  Editor._execCommand("Undo",1);
}
return-1;
};
Editor.redo=function()
{
if(kola.Browser.ie)
{
  Editor.History.redo();
}
else
{
  Editor._execCommand("Redo",1);
}
return-1;
};
Editor.showFontNameList=function()
{
var menuEl=Editor.controls["fontname"],fontNameData=Editor.Config.lister.fontNameData;
menuEl.sohu.lister=new Editor.Lister(menuEl,fontNameData,1,Editor.Config.lister.option).show();
return-2;
};
Editor.hideFontNameList=function()
{
Editor.destoryMenuLister(Editor.controls["fontname"],true);
return 1;
};
Editor.setFontName=function(fontName)
{
if(!fontName)fontName=Editor.Config.lister.fontNameData.dftName;
Editor._execCommand("FontName",fontName);
Editor._checkRangeState(Editor._stateArray[2],Editor.iDoc);
Editor.cancelFontName();
};
Editor.cancelFontName=function()
{
Editor.destoryMenuLister(Editor.controls["fontname"],false);
Editor._setMenuState(null,0,"fontname");
};
Editor.showFontName=function(fontName,fontValue)
{
var menuEl=Editor.controls["fontname"].sohu.tool;
var str="字体";
if(fontName)str=fontName;
else if(fontValue)
{
  var i=0;
  var fontNameData=Editor.Config.lister.fontNameData
  for(i=0;i<fontNameData.value.length;i++)
  {
    if(fontNameData.value[i]==fontValue)
    {
      str=fontNameData.text[i];
    }
  }
}
menuEl.innerHTML=str;
};
Editor.showFontSizeList=function()
{
var menuEl=Editor.controls["fontsize"],fontSizeData=Editor.Config.lister.fontSizeData;
menuEl.sohu.lister=new Editor.Lister(menuEl,fontSizeData,1,Editor.Config.lister.option).show();
return-2;
};
Editor.hideFontSizeList=function()
{
Editor.destoryMenuLister(Editor.controls["fontsize"],true);
return 1;
};
Editor.setFontSize=function(fontSize)
{
if(!fontSize)fontSize=Editor.Config.lister.fontSizeData.dftSize;
Editor._execCommand("FontSize",fontSize);
Editor._checkRangeState(Editor._stateArray[3],Editor.iDoc);
Editor.cancelFontSize();
};
Editor.cancelFontSize=function()
{
Editor.destoryMenuLister(Editor.controls["fontsize"],false);
Editor._setMenuState(null,0,"fontsize");
};
Editor.showFontSize=function(fontName,fontValue)
{
var menuEl=Editor.controls["fontsize"].sohu.tool;
var str="字号";
if(fontName)str=fontName;
else if(fontValue)
{
  var i=0;
  var fontNameData=Editor.Config.lister.fontSizeData
  for(i=0;i<fontNameData.value.length;i++)
  {
    if(fontNameData.value[i]==fontValue)
    {
      str=fontNameData.text[i];
    }
  }
}
menuEl.innerHTML=str;
};
Editor.setBold=function()
{
return Editor._execCommand("Bold")?-2:0;
};
Editor.setItalic=function()
{
return Editor._execCommand("Italic")?-2:0;
};
Editor.setUnderline=function()
{
return Editor._execCommand("Underline")?-2:0;
};
Editor.showForeColorList=function()
{
var menuEl=Editor.controls["forecolor"],colorData=Editor.Config.lister.foreColorData;
menuEl.sohu.lister=new Editor.Lister(menuEl,colorData,6,Editor.Config.lister.option).show();
return-2;
};
Editor.hideForeColorList=function()
{
Editor.destoryMenuLister(Editor.controls["forecolor"],true);
return 1;
};
Editor.setForeColor=function(foreColor)
{
if(foreColor)Editor._execCommand("ForeColor",foreColor);
Editor.cancelForeColor();
};
Editor.cancelForeColor=function()
{
Editor.destoryMenuLister(Editor.controls["forecolor"],false);
Editor._setMenuState(null,0,"forecolor");
};
Editor.showBackColorList=function()
{
var menuEl=Editor.controls["backcolor"],colorData=Editor.Config.lister.backColorData;
menuEl.sohu.lister=new Editor.Lister(menuEl,colorData,6,Editor.Config.lister.option).show();
return-2;
};
Editor.hideBackColorList=function()
{
Editor.destoryMenuLister(Editor.controls["backcolor"],true);
return 1;
};
Editor.setBackColor=function(backColor,element)
{
if(backColor)
{
  if(kola.Browser.ie)Editor._execCommand("BackColor",backColor);
  else Editor._execCommand("hilitecolor",backColor);
}
Editor.cancelBackColor();
};
Editor.cancelBackColor=function()
{
Editor.destoryMenuLister(Editor.controls["backcolor"],false);
Editor._setMenuState(null,0,"backcolor");
};
Editor.setLeft=function()
{
var element=Editor.getSpecialElement(["img","embed"]);
if(element)Editor.setElementJustify(element,"left");
else Editor._execCommand("JustifyLeft");
return-1;
};
Editor.setCenter=function()
{
var element=Editor.getSpecialElement(["img","embed"]);
if(element)Editor.setElementJustify(element,"center");
else Editor._execCommand("JustifyCenter");
return-1;
};
Editor.setRight=function()
{
var element=Editor.getSpecialElement(["img","embed"]);
if(element)Editor.setElementJustify(element,"right");
else Editor._execCommand("JustifyRight");
return-1;
};
Editor.getAlignStyle=function(align)
{
switch(align)
{
  case"left":align="float: left; margin: 0px 10px 10px 0px";
  break;
  case"center":align="display: block; margin: 0px auto 10px; text-align: center";
  break;
  case"right":align="float: right; margin: 0px 0px 10px 10px";
  break;
  default:align="display: block";
  break;
}
return align;
};
Editor.setElementJustify=function(element,value)
{
element.style.cssText=Editor.getAlignStyle(value);
};
Editor.showLink=function(isEdit)
{
var menuEl=Editor.controls["url"],submitTitle='立即插入';
if(!menuEl.sohu.lister)
{
  menuEl.sohu.lister=new Editor.Lister(menuEl,Editor.Config.lister.urlData,6,Editor.Config.lister.option);
}
if(typeof(isEdit)=='boolean'&&isEdit&&Editor.getSelected())
{
  submitTitle='确认修改';
}
Editor.Url.init(submitTitle);
menuEl.sohu.lister.show();
return-2;
};
Editor.hideLink=function()
{
var menuEl=Editor.controls["url"];
if(menuEl.sohu.lister)menuEl.sohu.lister.hide(false);
Editor._setMenuState(null,0,"url");
return 1;
};
Editor.clearLink=function()
{
if(kola.Browser.ie)
{
  Editor._execCommand("Unlink");
}
else
{
  var html="",linkElement;
  if(kola.Browser.ie)linkElement=Editor.getSpecialElement("a",true);
  else linkElement=Editor.getSpecialElement("a",false);
  if(linkElement)
  {
    html=linkElement.innerHTML;
    if(!kola.Browser.ie)
    {
      var tempRange=Editor.iDoc.createRange();
      tempRange.selectNode(linkElement);
      var sel=Editor.iWin.getSelection();
      if(sel)
      {
        sel.removeAllRanges();
        sel.addRange(tempRange);
      }
    }
    Editor.pasteHTML(html);
  }
}
Editor.hideLink();
};
Editor.cancelLink=function()
{
Editor.hideLink();
};
Editor.addLink=function(obj)
{
if(obj)
{
  var linkElement=Editor.getSpecialElement("a");
  if(linkElement||(linkElement=Editor.getSelected(true)))
  {
    linkElement.href=obj.link;
    linkElement.target=obj.target;
  }
  else
  {
    var html='<a href="'+obj.link+'" target="'+obj.target+'">'+obj.text+'</a>';
    Editor.pasteHTML(html,true);
  }
}
Editor.hideLink();
};
Editor.showImg=function(isEdit)
{
var menuEl=Editor.controls["image"],imgElement=Editor.getSpecialElement("img",true),type=sohu.ctrl.MultiPhotoSelector.TYPE.all,photoLink='http://',showAlign='default'
submitTitle='立即插入';
if(typeof(isEdit)=='boolean'&&isEdit&&Editor.getSelected())
{
  type=sohu.ctrl.MultiPhotoSelector.TYPE.edit;
  photoLink=Editor.getSelected().attr('src');
  showAlign=Editor.getSelected().attr('t');
  submitTitle='确认修改';
  if('default|left|center|right'.indexOf(showAlign)==-1)showAlign='default';
}
menuEl.sohu.lister=new Editor.Lister(menuEl,Editor.Config.lister.imageData,6,Editor.Config.lister.option);
Editor.imageSelector=new sohu.ctrl.MultiPhotoSelector(Editor.getElById('imageSelector'),
{
  type:type,button:submitTitle,selectCallback:Editor.addImg,cancelCallback:Editor.cancelImg,showAlign:showAlign,photoLink:photoLink
}
);
Editor.imageSelector.show();
menuEl.sohu.lister.show();
return-2;
};
Editor.hideImg=function()
{
var menuEl=Editor.controls["image"];
if(menuEl.sohu.lister)menuEl.sohu.lister.cancel(false);
return 1;
};
Editor.cancelImg=function()
{
Editor._setMenuState(null,0,"image");
Editor.hideImg();
};
Editor.addImg=function(imgs,align)
{
if(imgs&&imgs.length>0)
{
  var html='';
  for(var i=0;i<imgs.length;i++)
  {
    html+='<img t="'+align+'" src="'+imgs[i]+'" border="0" style="'+Editor.getAlignStyle(align)+'"></img>';
  }
  Editor.pasteHTML(html,true);
  if(kola.Browser.webkit)
  {
    Editor.removeSelected();
  }
  Editor.hideImg();
}
else
{
  Editor.alert('插入图片','对不起,请先选择你要插入的照片。');
}
}
Editor.showMv=function(isEdit)
{
var menuEl=Editor.controls["video"],mvElement=Editor.getSpecialElement("embed",true),videoLink='http://',showAlign='default',submitTitle='立即插入';
if(typeof(isEdit)=='boolean'&&isEdit&&Editor.getSelected())
{
  videoLink=Editor.getSelected().attr('src');
  showAlign=Editor.getSelected().attr('t');
  submitTitle='确认修改';
  if('default|left|center|right'.indexOf(showAlign)==-1)showAlign='default';
}
if(!menuEl.sohu.lister)
{
  menuEl.sohu.lister=new Editor.Lister(menuEl,Editor.Config.lister.videoData,6,Editor.Config.lister.option);
}
Editor.Video.init(videoLink,submitTitle,showAlign);
menuEl.sohu.lister.show();
return-2;
};
Editor.hideMv=function()
{
var menuEl=Editor.controls["video"];
if(menuEl.sohu.lister)menuEl.sohu.lister.cancel(false);
return 1;
};
Editor.cancelMv=function()
{
Editor._setMenuState(null,0,"video");
Editor.hideMv();
};
Editor.addMv=function(video)
{
if(video&&video.type=="net")
{
  var width,height,mediaType="video",align=Editor.getAlignStyle(video.align),mvElement=Editor.getSpecialElement("embed"),mediaFile=video.videoUrl.substring(video.videoUrl.lastIndexOf('.')+1).toLowerCase();
  if(/mp3|wma|wav|mid/.test(mediaFile))
  {
    mediaType='audio';
  }
  width=(mediaType=="audio")?300:480;
  height=(mediaType=="audio")?45:418;
  if(mvElement)
  {
    var range=Editor.getRange();
    mvElement.src=video.videoUrl;
    mvElement.style.cssText=align;
  }
  else
  {
    var html='<embed t="v" style="'+align+'" src="'+video.videoUrl+'" width="'+width+'" height="'+height+'" wmode="transparent"></embed>';
    if(!kola.Browser.ie)
    {
      html=Editor.Video.replaceEmbed(html);
    }
    Editor.pasteHTML(html,true);
  }
}
Editor.hideMv();
};
Editor.insertVideo=function(video)
{
if(video&&video.videoUrl)
{
  var video=Object.extend(
  {
    align:"margin: 0px 0px 10px 0px",width:480,height:418,start:'no',loop:'no'
  }
  ,video||
  {
  }
  );
  var html='<embed t="v" style="'+video.align+'" src="'+video.videoUrl+'" width="'+video.width+'" height="'+video.height+'" wmode="transparent"></embed><br />&nbsp;';
  if(!kola.Browser.ie)
  {
    html=Editor.Video.replaceEmbed(html);
  }
  Editor.pasteHTML(html,false);
}
};
Editor.showBrow=function()
{
var menuEl=Editor.controls["emot"];
if(!menuEl.sohu.lister)
{
  menuEl.sohu.lister=new Editor.Lister(menuEl,Editor.Config.lister.emotData,6,Editor.Config.lister.option);
}
Editor.emote=sohu.ctrl.Emote.init(
{
  parent:Editor.getElById('emotBox'),onSelect:Editor.addBrow
}
);
if(!Editor.emote)
{
  Editor.emote=sohu.ctrl.Emote.init(
  {
    parent:Editor.getElById('emotBox'),onSelect:Editor.addBrow
  }
  );
}
Editor.emote.setPos(
{
  left:1,top:1
}
);
Editor.emote.emBox.attr('class','');
menuEl.sohu.lister.show();
return-2;
};
Editor.hideBrow=function()
{
var menuEl=Editor.controls["emot"];
if(menuEl.sohu.lister)menuEl.sohu.lister.cancel(false);
return 1;
};
Editor.addBrow=function(browUbb,browtTag)
{
if(browtTag)
{
  var html=browtTag;
  Editor.pasteHTML(html,true);
  if(kola.Browser.webkit)
  {
    Editor.removeSelected();
  }
}
Editor._setMenuState(null,0,"emot");
Editor.hideBrow();
};
Editor.cancelBrow=function()
{
var menuEl=Editor.controls["emot"];
if(menuEl.sohu.lister)menuEl.sohu.lister.cancel(false);
Editor._setMenuState(null,0,"emot");
};
Editor.destoryMenuLister=function(menuEl,cancel)
{
var lister=menuEl.sohu.lister;
if(lister)
{
  if(cancel)lister.cancel(false);
  lister.destory();
  lister=null;
}
};
Editor.isView=function()
{
return(Editor.mode==Editor.MODE.visual);
};
Editor.switchMode=function()
{
var M=Editor.MODE,newMode=Editor.mode==M.visual?M.source:M.visual;
Editor.mode=newMode;
if(newMode==M.source)
{
  Editor.coder.value=Editor.iBody.innerHTML;
  Editor.menu.menuLeft.style.display='none';
  Editor.ifrContainer.style.display='none';
  Editor.menu.menuFormat.style.display='block';
  Editor.coder.style.height=Editor.iframe.style.height;
  Editor.coder.style.display='';
  Editor.coder.focus();
  return-2;
}
else if(newMode==M.visual)
{
  Editor.iBody.innerHTML=Editor.coder.value;
  Editor.menu.menuFormat.style.display='none';
  Editor.coder.style.display='none';
  Editor.menu.menuLeft.style.display='';
  Editor.ifrContainer.style.display='';
  if(kola.Browser.ie)
  {
    var range=Editor.iBody.createTextRange();
    range.setEndPoint("EndToStart",range);
    range.select();
  }
  else
  {
    Editor.iDoc.designMode="on";
  }
  if(Editor.iframe.focus)Editor.iframe.focus();
  return 0;
}
};
Editor.focusContent=function()
{
Editor.iWin.focus();
};
Editor.replaceContent=function(html)
{
Editor._execCommand("SelectAll",1);
Editor.pasteHTML(html,false);
};
Editor.pasteHTML=function(html,hasRange)
{
var returnValue=false;
if(Editor.isView())
{
  if(kola.Browser.ie)
  {
    var range=null;
    if(hasRange)
    {
      range=Editor.rangeCache;
    }
    else
    {
      range=Editor.getRange();
    }
    if(typeof(range.htmlText)=="undefined")
    {
      var tempRange=Editor.iBody.createTextRange();
      tempRange.moveToElementText(range.item(0));
      range=tempRange;
    }
    try
    {
      range.pasteHTML(html);
    }
    catch(e)
    {
      alert(html);
      alert(e.message);
    }
    range.select();
  }
  else
  {
    Editor._execCommand("inserthtml",html);
    Editor.focusContent();
  }
  returnValue=true;
}
return returnValue;
};
Editor.getSelectedHTML=function()
{
var range=Editor.getRange();
if(range)
{
  if(kola.Browser.ie)
  {
    if(range.htmlText)return range.htmlText;
    else
    {
      try
      {
        return range.item(0).outerHTML;
      }
      catch(e)
      {
        return"";
      }
    }
  }
  else
  {
    if(Editor.selection.rangeCount>0)
    {
      var tRange=Editor.selection.getRangeAt(0);
      var dFragment=tRange.cloneContents();
      Editor.cache.innerHTML="";
      Editor.cache.appendChild(dFragment);
      return Editor.cache.innerHTML;
    }
  }
}
return"";
};
Editor.cacheRange=function()
{
Editor.selection=Editor.iDoc.selection;
Editor.rangeCache=Editor.selection.createRange();
};
Editor.checkRange=function()
{
if(Editor.rangeCache)
{
  Editor.focusContent();
  Editor.rangeCache.select();
  Editor.rangeCache=false;
}
};
Editor.getRange=function()
{
if(kola.Browser.ie)
{
  if(Editor.rangeCache)return Editor.rangeCache;
  else
  {
    Editor.focusContent();
    Editor.selection=Editor.iDoc.selection;
    return Editor.selection.createRange();
  }
}
else
{
  Editor.selection=Editor.iWin.getSelection();
  return Editor.iDoc;
}
};
Editor.getElement=function()
{
var sel,range,element=null;
if(kola.Browser.ie)
{
  sel=Editor.iDoc.selection;
  switch(sel.type.toLowerCase())
  {
    case"none":break;
    case"text":range=sel.createRange();
    element=range.parentElement();
    break;
    case"control":var ranges=sel.createRange();
    element=ranges.item(0);
    break;
  }
}
else
{
  sel=Editor.iWin.getSelection();
  if(sel.rangeCount>0)
  {
    range=sel.getRangeAt(0);
    if(range.startContainer==range.endContainer)
    {
      if(range.startContainer.nodeType!=3)
      {
        element=range.startContainer.childNodes[range.startOffset];
      }
      else element=range.startContainer;
    }
    else element=range.commonAncestorContainer;
  }
  if(element&&element.nodeType==3)element=element.parentNode;
}
return element;
};
Editor.getSpecialElement=function(tagName,isFoucs)
{
var element=null;
var tempElement=Editor.getElement();
if(tempElement)
{
  if(typeof(tagName)=="string")tagName=[tagName];
  while(tempElement&&tempElement.tagName)
  {
    for(var i=tagName.length-1;i>=0;i--)
    {
      if(tagName[i]==tempElement.tagName.toLowerCase())
      {
        element=tempElement;
        break;
      }
    }
    if(element)break;
    else tempElement=tempElement.parentNode;
  }
}
if(isFoucs&&element)
{
  if(kola.Browser.ie)
  {
    Editor.rangeCache=false;
    var range=Editor.iBody.createTextRange();
    range.moveToElementText(element);
    range.select();
  }
  else
  {
    var sel=Editor.iWin.getSelection();
    if(sel)
    {
      var range=sel.getRangeAt(0);
      range.selectNode(element);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
return element;
};
Editor.onFocus=function(callback)
{
if(!Editor.iBody)
{
window.setTimeout(function()
{
  Editor.onFocus(callback);
}
,500);
}
else
{
Editor.Event.observe(Editor.iBody,"click",callback);
}
};
Editor.alert=function(title,content,callback)
{
sohu.ctrl.Dialog.alert(content,
{
title:title,callback:callback
}
);
};
Editor.addHeightListener=function()
{
window.setInterval(function()
{
  if(iframe=Editor.iframe)
  {
    var height;
    if(iframe.contentDocument&&iframe.contentDocument.body.offsetHeight)
    {
      height=iframe.contentDocument.body.offsetHeight;
    }
    else if(iframe.Document&&iframe.Document.body.scrollHeight)
    {
      height=iframe.Document.body.scrollHeight;
    }
    if(!Editor.lastBodyHeight||Editor.lastBodyHeight!=height)
    {
      Editor.lastBodyHeight=height;
      Editor.setHeight(height);
    }
  }
}
,500);
};
Editor.setHeight=function(height)
{
if(Editor.initHeight<height)
{
  if(Editor.lastHeight!=height)
  {
    if(Editor.lastHeight<height)Editor.lastHeight=height+250;
    else Editor.lastHeight=height+250;
  }
}
else if(Editor.initHeight>height)
{
  Editor.lastHeight=Editor.initHeight;
}
try
{
  Editor.iframe.style.height=Editor.lastHeight+'px';
  if(Editor.coder.value.trim()!='')Editor.focusContent();
}
catch(e)
{
  sohu.log('Editor: Set Editor Height Exception:'+e.message);
}
};
Editor.setMenuWidth=function()
{
if(Editor.menu&&Editor.ifrContainer)
{
  var ifrWidth=$(Editor.ifrContainer).width();
  if(ifrWidth>0)
  {
    try
    {
      $(Editor.menu).width(ifrWidth-2);
    }
    catch(e)
    {
    }
  }
}
}
Editor._initScrollMenu=function()
{
window.onscroll=Editor._stratScrollMenu;
};
Editor._stratScrollMenu=function()
{
var menu=$(Editor.menu),scrollTop=document.body&&document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop,isIe6=(kola.Browser.ie&&kola.Browser.version=='6.0');
if(scrollTop!=Editor.menuRltvTop)
{
  if(scrollTop>Editor.menuRltvTop)
  {
    if(isIe6)
    {
      menu.addClass('menu_container_absolute');
      menu.css('top',scrollTop+'px');
    }
    else
    {
      menu.addClass('menu_container_fix');
      menu.css('top',Editor.menuMinTop+'px');
    }
  }
  else
  {
    menu.removeClass('menu_container_absolute');
    menu.removeClass('menu_container_fix');
    menu.css('top',Editor.menuInitTop+'px');
  }
}
};
Editor.History=
{
init:function(iDoc)
{
  this._queue=[];
  this._index=0;
  this._maxCount=100;
  this._iDoc=iDoc;
  this._iBody=this._iDoc.body;
  this._lastData='';
  this._saveHandle=null;
  Editor.Event.observe(this._iBody,"keydown",function(e)
  {
    if(e.keyCode==90&&e.ctrlKey)
    {
      this.undo.bind(this).timeout(0.1);
    }
    else if(e.keyCode==89&&e.ctrlKey)
    {
      this.redo.bind(this).timeout(0.1);
    }
    else if(e.keyCode!=18&&e.keyCode!=17)
    {
      window.clearTimeout(this._saveHandle);
      this._saveHandle=window.setTimeout(this.save.bind(this),500);
    }
  }
  .bindEvent(this));
  this.save();
}
,redo:function()
{
  if(this._index<this._queue.length-1)
  {
    if(this._index<0)this._index=0;
    this._apply(this._queue[++this._index]);
  }
}
,undo:function()
{
  if(this._queue.length<1)return;
  if(this._index>0)
  {
    if(this._index>this._queue.length-1)this._index=this._queue.length-1;
    this._apply(this._queue[--this._index]);
  }
}
,getUndoState:function()
{
  if(this._queue.length>0&&this._index>0)
  {
    return true;
  }
  return false;
}
,getRedoState:function()
{
  if(this._index<this._queue.length-1)
  {
    return true;
  }
  return false;
}
,save:function()
{
  var data=this._getData();
  if(!data)return;
  this._queue[this._index]=data;
  if(this._queue.length>this._maxCount)this._queue.shift();
  this._index=this._queue.length;
}
,_apply:function(item)
{
  this._iBody.innerHTML=item.data;
  if(item.selrange)
  {
    var range=this._iDoc.selection.createRange();
    range.moveToBookmark(item.selrange);
    range.select();
  }
}
,_getData:function()
{
  var data=this._iBody.innerHTML;
  if(data!=this._lastData)
  {
    var item=
    {
      data:data
    }
    if(this._iDoc.selection.type=='Text')
    {
      item.selrange=this._iDoc.selection.createRange().getBookmark();
    }
    return item;
  }
  else
  {
    return null;
  }
}
};
Editor.Lister=Class.create(
{
initialize:function(menuEl,listData,colCount,options)
{
  this._data=listData;
  this._type=this._data.type;
  this._menuEl=menuEl;
  this._columns=colCount;
  this._containerClass=options.containerClass;
  this._itemClass=this._data.itemClass?this._data.itemClass:options.itemClass;
  this._itemOverClass=this._data.itemOverClass?this._data.itemOverClass:options.itemOverClass;
  this._itemSelectClass=this._data.itemSelectClass?this._data.itemSelectClass:options.itemSelectClass;
  if(!this._data.text)
  {
    this._data.text=this._data.value;
  }
  this._outClickCall=false;
  this._visible=false;
  this._buildContainer();
  return this;
}
,_buildContainer:function()
{
  var oldLister=$('#'+this._data.id);
  if(oldLister)oldLister.remove();
  this._containerEl=kola.Element.create('div',
  {
    id:this._data.id
  }
  ).hide();
  if(this._type=="other")
  {
    $(document.body).append(this._containerEl);
  }
  else
  {
    $(Editor.menu).append(this._containerEl);
  }
  this._buildContent();
  return this;
}
,_buildContent:function()
{
  var contentHtml1='<div class="decor">'+'<span class="tl"></span><span class="tr"></span><span class="br"></span><span class="bl"></span>'+'</div>',contentHtml2='<div class="content" id="'+this._data.id+'_content"></div>';
  switch(this._type)
  {
    case"auto":
    {
      this._containerEl.addClass(this._containerClass);
      this._containerEl.html(contentHtml1+contentHtml2);
      this._contentEl=$('#'+this._data.id+'_content');
      var contentEl=this._contentEl.elements()[0];
      for(var i=0,l=this._data.value.length;i<l;i++)
      {
        if(i%this._columns==0&&i>0)
        {
          Editor.Dom.create("div","newLine",contentEl);
        }
        this._buildAutoItem(i,contentEl);
      }
      break;
    }
    case"manual":
    {
      this._containerEl.addClass(this._containerClass);
      this._containerEl.html(contentHtml1+contentHtml2);
      this._contentEl=$('#'+this._data.id+'_content');
      var contentEl=this._contentEl.elements()[0];
      for(var i=0,l=this._data.value.length;i<l;i++)
      {
        this._buildManualItem(i,contentEl);
      }
      break;
    }
    case"other":
    {
      this._containerEl.html(contentHtml2);
      this._contentEl=$('#'+this._data.id+'_content');
      this._contentEl.html(this._data.content);
      break;
    }
  }
  return this;
}
,_buildAutoItem:function(index,parent)
{
  var data=this._data,text=data.text[index],value=data.value[index],pattern=data.pattern,itemClass=this._itemClass,itemEl=null,isTitleOrSelected=false;
  text=pattern.replace(/\$=text\$/ig,text).replace(/\$=value\$/ig,value);
  if(index==0&&data.title)
  {
    itemClass=data.titleClass;
    isTitleOrSelected=true;
  }
  if(index>0&&value===data.selectedValue)
  {
    itemClass=this._itemSelectClass;
    isTitleOrSelected=true;
  }
  itemEl=Editor.Dom.create("div",itemClass,parent);
  itemEl.innerHTML=text;
  var itemClickFunc=this.selectedCall.bind(this,value);
  Editor.Event.observe(itemEl,"click",itemClickFunc);
  if(!isTitleOrSelected)
  {
    var itemOverFunc=this.itemMouseOver.bind(this,itemEl);
    var itemOutFunc=this.itemMouseOut.bind(this,itemEl);
    Editor.Event.observe(itemEl,"mouseover",itemOverFunc);
    Editor.Event.observe(itemEl,"mouseout",itemOutFunc);
  }
  return this;
}
,_buildManualItem:function(index,parent)
{
  var data=this._data,vPrefix=data.vPrefix,vPostfix=data.vPostfix,text=data.value[index][0],value=data.value[index][1];
  if(text)
  {
    var isSelected=(value===data.selectedValue),itemClass=this._itemClass,itemEl=null;
    if(isSelected)itemClass=this._itemSelectClass;
    itemEl=Editor.Dom.create("div",itemClass,parent);
    itemEl.innerHTML=vPrefix+text+vPostfix;
    var itemClickFunc=this.selectedCall.bind(this,value);
    Editor.Event.observe(itemEl,"click",itemClickFunc);
    if(!isSelected)
    {
      var itemOverFunc=this.itemMouseOver.bind(this,itemEl);
      var itemOutFunc=this.itemMouseOut.bind(this,itemEl);
      Editor.Event.observe(itemEl,"mouseover",itemOverFunc);
      Editor.Event.observe(itemEl,"mouseout",itemOutFunc);
    }
  }
  else
  {
    Editor.Dom.create("div",data.value[index][2],parent);
  }
  return this;
}
,itemMouseOver:function(itemEl)
{
  itemEl.className=this._itemOverClass;
  return this;
}
,itemMouseOut:function(itemEl)
{
  itemEl.className=this._itemClass;
  return this;
}
,selectedCall:function(value)
{
  this.hide();
  this._menuEl.sohu.selectCall.call(Editor,value,this._menuEl);
  this._data.selectedValue=value;
  return this;
}
,cancel:function(e)
{
  if(this._visible)
  {
    var canCancel=true;
    if(typeof(e)!="boolean")
    {
      e=window.event||e;
      if(e)
      {
        var containerEl=this._containerEl.elements()[0];
        eventEle=Editor.Event.element(e);
        while(eventEle)
        {
          if(containerEl==eventEle)
          {
            canCancel=false;
            break;
          }
          eventEle=eventEle.parentNode;
        }
      }
    }
    if(canCancel)
    {
      this.hide();
      this._menuEl.sohu.cancelCall.call(this._menuEl);
    }
  }
  return this;
}
,_close:function()
{
  $(document.body).append(this._containerEl.hide());
  if(this._visible)
  {
    this._menuEl.sohu.cancelCall.call(this._menuEl);
  }
  return this;
}
,destory:function()
{
  this._containerEl.remove();
  return this;
}
,show:function()
{
  if(!this._visible)
  {
    this._visible=true;
    if(this._type=="other")
    {
      this._dialog=new sohu.ctrl.Dialog(
      {
        title:this._data.name,width:this._data.width,pos:this._data.pos,mask:true,close:
        {
          callback:this._close.bind(this)
        }
      }
      );
      this._dialog.body.append(this._containerEl.show());
      this._dialog.show();
    }
    else
    {
      var rect=Editor.Dom.getRect(this._menuEl);
      this._containerEl.css('left',rect.left+'px');
      this._outClickCall=this.cancel.bind(this);
      Editor.Event.observe(document,"mouseup",this._outClickCall);
      Editor.Event.observe(Editor.iDoc,"mouseup",this._outClickCall);
    }
    this._containerEl.show();
    Editor.Lister.now=this;
  }
  return this;
}
,hide:function()
{
  Editor.Lister.now=false;
  this._visible=false;
  if(this._type=="other")
  {
    this._dialog.close();
  }
  else
  {
    if(this._outClickCall)
    {
      Editor.Event.stopObserving(document,"mouseup",this._outClickCall);
      Editor.Event.stopObserving(Editor.iDoc,"mouseup",this._outClickCall);
      this._outClickCall=false;
    }
    this._containerEl.hide();
  }
  return this;
}
}
);
Editor.Lister.now=false;
Editor.Url=
{
};
Editor.Url.init=function(submitTitle)
{
var linkElement=Editor.getSpecialElement("a",true),linkTextTitle=Editor.getElById("linkTextTitle"),linkTextInput=Editor.getElById("linkTextInput"),linkAddBtn=Editor.getElById("linkAddBtn"),linkDelBtn=Editor.getElById("linkDelBtn");
this.linkText=Editor.getElById("linkText");
this.linkUrl=Editor.getElById("linkHref");
this.linkText.value="默认添加链接的文字";
this.linkUrl.value="http://";
linkAddBtn.innerHTML=submitTitle;
if(linkElement||(linkElement=Editor.getSelected(true)))
{
  this.linkText.value=linkElement.innerHTML;
  this.linkUrl.value=linkElement.href;
  linkDelBtn.style.display="inline-block";
}
else
{
  var selectedText=Editor.getSelectedHTML();
  linkDelBtn.style.display="none";
  if(selectedText.length<1)
  {
    this.linkText.value='';
  }
  else
  {
    this.linkText.value=selectedText;
  }
}
};
Editor.Url.onOK=function()
{
if(Editor.Url.valid(this.linkUrl))
{
  var returnValue=
  {
    text:this.linkText.value.trim(),link:this.linkUrl.value.trim(),target:'_blank'
  };
  if(returnValue.text=='')returnValue.text=returnValue.link;
  Editor.controls["url"].sohu.selectCall.call(null,returnValue);
}
return false;
}
Editor.Url.onDel=function()
{
Editor.clearLink();
Editor.controls["url"].sohu.cancelCall.call(null);
return false;
};
Editor.Url.valid=function(linkUrl)
{
var url=linkUrl.value.trim();
if(url==''||url=='http://')
{
  kola.Anim(linkUrl).fadeColor();
  linkUrl.focus();
  return false;
}
else
{
  var expUrl=/^([a-zA-z]+:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  if(!expUrl.test(url))
  {
    Editor.alert("好像出错了","网址格式不正确！");
    linkUrl.focus();
    return false;
  }
}
if(!/^((https?|ftp):\/\/)/.test(linkUrl.value))
{
  linkUrl.value="http://"+linkUrl.value;
}
return true;
}
Editor.Url.onCancel=function()
{
Editor.controls["url"].sohu.upCall.call();
}
Editor.Video=
{
_align:''
};
Editor.Video.init=function(videoUrl,submitTitle,showAlign)
{
Editor.getElById('videoUrl').value=videoUrl;
Editor.getElById('videoAddBtn').innerHTML=submitTitle;
var alignItems=$('div.ppItem',$('#lister_svideo'));
$('#videoAlignWrap').down(('div.pp-'+showAlign)).addClass('on');
alignItems.on('mouseover',function(e)
{
  var alignItem=kola.Event.element(e);
  if(alignItem&&!alignItem.hasClass('on'))alignItem.addClass('ppOver');
}
.bindEvent(this)).on('mouseout',function(e)
{
  var alignItem=kola.Event.element(e);
  if(alignItem&&!alignItem.hasClass('on'))alignItem.removeClass('ppOver');
}
.bindEvent(this)).on('click',function(e)
{
  alignItems.removeClass('on');
  Editor.Video._align=kola.Event.element(e).removeClass('ppOver').addClass('on').data('value');
}
.bindEvent(this));
}
Editor.Video.onOK=function()
{
Editor.Video.onNet();
};
Editor.Video.onCancel=function()
{
Editor.Video.cancel();
}
Editor.Video.onNet=function()
{
var linkUrl=Editor.getElById("videoUrl");
var url=linkUrl.value.trim();
if(url==''||url=='http://')
{
  kola.Anim(linkUrl).fadeColor();
  linkUrl.focus();
  return false;
}
else
{
  var expUrl=/^([a-zA-z]+:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  if(!expUrl.test(url))
  {
    Editor.alert("好像出错了","视频地址格式不正确！");
    linkUrl.focus();
    return false;
  }
}
var param=
{
  type:"net",videoUrl:Editor.getIptVal("videoUrl"),align:Editor.Video._align
};
Editor.Video.callback(param);
return false;
}
Editor.Video.callback=function(param)
{
var desc=param.videoUrl;
if(desc.substring(desc.length-4,desc.length).toLowerCase()=='.swf')
{
  Editor.controls["video"].sohu.selectCall.call(null,param);
}
else
{
  var form=$('#lister_svideo_content');
  btn=form.down('button');
  if(btn)
  {
    btn.prop('disabled','disabled');
    btn.html('提交中...');
  }
  Editor.model.formatSWF(
  {
    url:desc
  }
  ,
  {
    success:function(data)
    {
      Editor.Video.cancel();
      btn.prop('disabled',false);
      btn.html('立即插入');
      if(!kola.Browser.ie)
      {
        data=data.replace(/embed/g,'iframe t="v"');
      }
      Editor.pasteHTML(data,true);
    }
    ,failure:function(error)
    {
      sohu.ctrl.Dialog.alert(sohu.config('error',error),
      {
        title:'出错了'
      }
      );
    }
  }
  );
};
}
Editor.Video.cancel=function()
{
Editor.controls["video"].sohu.cancelCall.call();
}
Editor.Video.replaceEmbed=function(src)
{
if(src&&src.trim()!="")
{
  return src.replace(/<embed(.|\s)*?t="v"(.|\s)*?<\/embed>/g,function(sMatch)
  {
    return sMatch.replace(/embed/g,'iframe');
  }
  );
}
else
{
  return"";
}
}
Editor.Video.replaceIframe=function(src)
{
src=src.trim();
if(src&&src!=""&&Editor.Video.existed())
{
  return src.replace(/<iframe(.|\s)*?t="v"(.|\s)*?<\/iframe>/g,function(sMatch)
  {
    return sMatch.replace(/iframe/g,'embed');
  }
  );
}
else
{
  return src;
}
}
Editor.Video.existed=function()
{
var src=Editor.iBody.innerHTML.toLowerCase();
return src.indexOf('<iframe')!=-1&&src.toLowerCase().indexOf('t="v"')!=-1;
};
Editor.Config=
{
tool:
{
  rPath:PATH.cssApp+'blog/i/editor/',data:
  {
    allMenus:
    {
      menuLeft:[["img","clearformat","一键清除格式",Editor.clearFormat,Editor.clearFormat],["separator","separator"],["img","undo","撤销上一步操作",Editor.undo,Editor.undo],["img","redo","重做上一步操作",Editor.redo,Editor.redo],["separator","separator"],["img","fontname","字体",Editor.showFontNameList,Editor.hideFontNameList,Editor.setFontName,Editor.cancelFontName],["img","fontsize","字号",Editor.showFontSizeList,Editor.hideFontSizeList,Editor.setFontSize,Editor.cancelFontSize],["img","bold","粗体",Editor.setBold,Editor.clearBold],["img","italic","斜体",Editor.setItalic],["img","underline","下划线",Editor.setUnderline],["img","forecolor","文字颜色",Editor.showForeColorList,Editor.hideForeColorList,Editor.setForeColor,Editor.cancelForeColor],["img","backcolor","文字背景色",Editor.showBackColorList,Editor.hideBackColorList,Editor.setBackColor,Editor.cancelBackColor],["separator","separator"],["img","justifyleft","左对齐",Editor.setLeft,Editor.setLeft],["img","justifycenter","居中",Editor.setCenter,Editor.setCenter],["img","justifyright","右对齐",Editor.setRight,Editor.setRight],["separator","separator"],["img","url","插入超链接",Editor.showLink,Editor.hideLink,Editor.addLink,Editor.cancelLink],["img","image","插入图片",Editor.showImg,Editor.hideImg,Editor.addImg,Editor.cancelImg],["img","video","插入视频",Editor.showMv,Editor.hideMv,Editor.addMv,Editor.cancelMv],["img","emot","插入表情",Editor.showBrow,Editor.hideBrow,Editor.addBrow,Editor.cancelBrow]],menuFormat:[["a","format","代码格式化",Editor.formatSource,Editor.formatSource]],menuRight:[["img","code","代码",Editor.switchMode,Editor.switchMode]]
    }
    ,outMenus:
    {
    }
  }
  ,css:
  {
    menuLeft:'tool_left',menuFormat:'tool_format',menuRight:'tool_right',menuSeparator:'tool_block',menuLink:'',tool:"",toolOver:"_over",toolDown:"_down",toolDisabled:"_disabled",editor:"editor",cache:"editor_cache",footer:"editor_footer clearfix",coder:"editor_coder2"
  }
}
,lister:
{
  option:
  {
    containerClass:"popLayer",itemClass:"listerItem",itemOverClass:"listerItem_over"
  }
  ,fontNameData:
  {
    type:"auto",id:'lister_fontName',title:true,titleClass:"listerTitle",itemClass:"listerItem",itemOverClass:"listerItem_over",itemSelectClass:'listerItem_select',pattern:'<div><div style="font-family:$=value$">$=text$</div></div>',text:['恢复默认字体','宋体','黑体','隶书','楷体','幼圆','微软雅黑','Arial','Impact','Georgia','Verdana','Sans-serif','Tahoma','Courier New','Times New Roman'],selectedValue:'',value:['宋体','宋体','黑体','隶书','楷体_GB2312','幼圆','微软雅黑','Arial','Impact','Georgia','Verdana','Sans-serif','Tahoma','Courier New','Times New Roman'],dftName:'宋体'
  }
  ,fontSizeData:
  {
    type:"auto",id:'lister_fontSize',title:true,titleClass:"listerTitle",itemClass:"listerItem",itemOverClass:"listerItem_over",itemSelectClass:'listerItem_select',pattern:'<div><div style="font-size:$=text$" >$=text$</div></div>',text:['恢复默认字号','10px','12px','16px','18px','24px','32px','48px'],selectedValue:'',value:[3,0,2,3,4,5,6,7],dftSize:'3'
  }
  ,urlData:
  {
    type:"other",id:'lister_url',name:'插入链接',pos:
    {
      left:350
    }
    ,content:'<form onsubmit=" Editor.Url.onOK();return false;">'+'<div class="updatePhoto">'+'<div id="tC_2" style="display:block">'+'<dl class="fieldset">'+'<dt id="linkTextTitle" style="display:none;">文字：</dt>'+'<dd id="linkTextInput" style="display:none;">'+'<input type="text" id="linkText" maxlength="1024" class="text" style="width: 90%" value="默认添加链接的文字" onfocus="this.select()" />'+'</dd>'+'<dt>链接地址：</dt>'+'<dd>'+'<input type="text" maxlength="1024" id="linkHref" class="text" style="width: 90%" value="http://" onfocus="this.select()" />'+'</dd>'+'<dd>'+'<span class="button button-main"><span><button type="submit" id="linkAddBtn">立即插入</button></span></span>'+'<span class="button" id="linkDelBtn"><span><button type="button" onclick="Editor.Url.onDel()">去除链接</button></span></span>'+'<a href="javascript:void(0)" onclick="Editor.Url.onCancel()" >取消</a>'+'</dd>'+'</dl>'+'</div>'+'</div>'+'</form>',editTip:'<a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.showLink(true);">修改链接</a> - <a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.delSelected();">去除链接</a>'
  }
  ,videoData:
  {
    type:"other",id:'lister_svideo',name:'插入视频',pos:
    {
      left:350
    }
    ,content:'<form onsubmit="Editor.Video.onOK();return false;">'+'<div class="updatePhoto">'+'<div id="tC_2" style="display:block">'+'<dl class="fieldset">'+'<dt>视频地址：</dt>'+'<dd>'+'<input type="text" maxlength="1024" onfocus="this.select()" value="http://" style="width: 90%" title="输入音乐或视频地址" class="text" id="videoUrl"/>'+'<div class="meta">可以直接输入搜狐播客、优酷、土豆、酷6等网站的视频地址~</div>'+'</dd>'+'<dt>视频位置：</dt>'+'<dd>'+'<div id="videoAlignWrap" class="picPositions">'+'<div class="ppItem pp-default" data-value=""></div>'+'<div class="ppItem pp-left" data-value="left"></div>'+'<div class="ppItem pp-center" data-value="center"></div>'+'<div class="ppItem pp-right" data-value="right"></div>'+'</div>'+'</dd>'+'<dd><span class="button button-main"><span>'+'<button type="submit" id="videoAddBtn">立即插入</button>'+'</span></span><a href="javascript:void(0)" onclick="Editor.Video.onCancel()" >取消</a></dd>'+'</dl>'+'</div>'+'</div>'+'</form>',editTip:'<a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.showMv(true);">修改视频</a> - <a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.delSelected();">删除视频</a>'
  }
  ,imageData:
  {
    type:"other",id:'lister_simg',name:'插入图片',width:450,pos:
    {
      left:350
    }
    ,content:'<div id="imageSelector"></div></div>',editTip:'<a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.showImg(true);">修改图片</a> - <a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.delSelected();">删除图片</a>'
  }
  ,emotData:
  {
    type:"other",id:'lister_emot',name:'插入表情',width:260,pos:
    {
      left:430
    }
    ,content:'<div id="emotBox"></div>',editTip:'<a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.showBrow();">修改表情</a> - <a href="javascript:void(0);" onclick="Editor.hideEditTip();Editor.delSelected();">删除表情</a>'
  }
  ,colorData:
  {
    type:"manual",id:'lister_color',itemClass:"colorItem",itemOverClass:"colorItem_over",itemSelectClass:'colorItem_select',vPrefix:'<div class="colorBlockItem" style="background-color:',vPostfix:';"></div>',selectedValue:'',value:[['#000000','#000000'],['#444444','#444444'],['#666666','#666666'],['#999999','#999999'],['#cccccc','#cccccc'],['#eeeeee','#eeeeee'],['#f3f3f3','#f3f3f3'],['#ffffff','#ffffff'],[false,false,'blankRow'],['#ff0000','#ff0000'],['#ff9900','#ff9900'],['#ffff00','#ffff00'],['#00ff00','#00ff00'],['#00ffff','#00ffff'],['#0000ff','#0000ff'],['#9900ff','#9900ff'],['#ff00ff','#ff00ff'],[false,false,'blankRow'],['#f4cccc','#f4cccc'],['#fce5cd','#fce5cd'],['#fff2cc','#fff2cc'],['#d9ead3','#d9ead3'],['#d0e0e3','#d0e0e3'],['#cfe2f3','#cfe2f3'],['#d9d2e9','#d9d2e9'],['#ead1dc','#ead1dc'],[false,false,'newLine'],['#ea9999','#ea9999'],['#f9cb9c','#f9cb9c'],['#ffe599','#ffe599'],['#b6d7a8','#b6d7a8'],['#a2c4c9','#a2c4c9'],['#9fc5e8','#9fc5e8'],['#b4a7d6','#b4a7d6'],['#d5a6bd','#d5a6bd'],[false,false,'newLine'],['#e06666','#e06666'],['#f6b26b','#f6b26b'],['#ffd966','#ffd966'],['#93c47d','#93c47d'],['#76a5af','#76a5af'],['#6fa8dc','#6fa8dc'],['#8e7cc3','#8e7cc3'],['#c27ba0','#c27ba0'],[false,false,'newLine'],['#cc0000','#cc0000'],['#e69138','#e69138'],['#f1c232','#f1c232'],['#6aa84f','#6aa84f'],['#45818e','#45818e'],['#3d85c6','#3d85c6'],['#674ea7','#674ea7'],['#a64d79','#a64d79'],[false,false,'newLine'],['#990000','#990000'],['#b45f06','#b45f06'],['#bf9000','#bf9000'],['#38761d','#38761d'],['#134f5c','#134f5c'],['#0b5394','#0b5394'],['#351c75','#351c75'],['#741b47','#741b47'],[false,false,'newLine'],['#660000','#660000'],['#783f04','#783f04'],['#7f6000','#7f6000'],['#274e13','#274e13'],['#0c343d','#0c343d'],['#073763','#073763'],['#20124d','#20124d'],['#4c1130','#4c1130'],[false,false,'newLine']]
  }
  ,foreColorData:
  {
    selectedValue:''
  }
  ,backColorData:
  {
    selectedValue:''
  }
}
};
(function()
{
  var lister=Editor.Config.lister;
  lister.foreColorData=Object.extend(lister.foreColorData,lister.colorData);
  lister.backColorData=Object.extend(lister.backColorData,lister.colorData);
}
)();
Editor.validate=function()
{
  Editor.setContent();
  var titleWords=Editor.getIptVal("entryTitle").length;
  var contentWords=Editor.getIptVal(Editor.coder).replace('<br>','').length;
  var tip='';
  if(titleWords<2)
  {
    tip='日志标题不能少于 2 个字';
  }
  else if(titleWords>100)
  {
    tip='日志标题不能大于 100 个字';
  }
  if(tip!='')return[false,1,tip];
  if(contentWords<4)
  {
    tip='日志内容不能少于 4 个字';
  }
  else if(contentWords>60000)
  {
    tip='日志内容不能大于 60000 个字，要不你分两次发吧';
  }
  if(tip!='')return[false,2,tip];
  return[true];
};
}
,'sohu.ctrl.Dialog,sohu.ctrl.Emote,sohu.ctrl.MultiPhotoSelector,kola.anim.*, sohu.core.*');
