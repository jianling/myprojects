<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>编辑器示例</title>
<style type="text/css" media="all">
body{ font-size:12px;}
.precontent{ display:none;}
.editor{ width:500px; height:226px; margin:0px auto;  border:#FF9900 1px solid;}
.editor iframe{ margin:0px; padding:0px; width:500px; height:190px; border:0px;}
.button{ text-align:center; width:500px; margin:16px auto;}
.editor .bar{ margin:0px; padding:0px; padding:3px 6px; height:60px; border-bottom:#FF9900 1px solid; font-size:14px; letter-spacing:2px;}
.editor .bar input{ border:#FFFFFF 1px solid; background-color:#F8EFD6; cursor:pointer; height:19px; font-size:12px;}
</style>
<title>无标题文档</title>
</head>

<body>
<div class="editor">
    <div class="bar">
		<input type="button" onclick="runCMD('UnderLine')" value="下划线" /> 
		<input type="button" onclick="runCMD('bold')" value="粗体" /> 
		<input type="button" onclick="runCMD('Undo')" value="撤销" /> 
		<input type="button" onclick="runCMD('Redo')" value="还原" /> 
		<input type="button" onclick="runCMD('JustifyLeft')" value="左对齐" /> 
		<input type="button" onclick="runCMD('JustifyCenter')" value="居中对齐" /> 
		<input type="button" onclick="runCMD('JustifyRight')" value="右对齐" />
		<br />
		<input type="button" onclick="runCMD('Copy')" value="复制" />
		<input type="button" onclick="runCMD('Cut')" value="剪切" />
		<input type="button" onclick="runCMD('Delete')" value="删除" />
		<input type="button" onclick="runCMD('Paste')" value="粘贴" />
		
		<input type="button" onclick="runCMD('InsertOrderedList')" value="有序列表" />
		<input type="button" onclick="runCMD('InsertUnorderedList')" value="无序列表" />
		<input type="button" onclick="runCMD('Indent')" value="增加缩进" />
		<input type="button" onclick="runCMD('Outdent')" value="减少缩进" />
		
		<input type="button" onclick='runCMD("fontname","","宋体")' value="黑体" />
		<input type="button" onclick='runCMD("fontsize","","12")' value="12号" />
		<input type="button" onclick='runCMD("ForeColor","","red")' value="高亮" />
		<input type="button" onclick='runCMD("BackColor","","blue")' value="背景色" /><!--Firefox、Opera错将body设置背景色-->
		<input type="button" onclick='runCMD("InsertImage","","http://a.tbcdn.cn/sys/wangwang/smiley/48x48/1.gif")' value="插入表情" />
		<input type="button" onclick='runCMD("CreateLink","","http://www.baidu.com")' value="链接" />

    </div>
    <iframe id='editor_body_area' name='editor_body_area' style='border:none; overflow-x:auto;' frameborder='0'></iframe>
</div>
<script type="text/javascript" language="javascript">
var ifr = document.getElementById("editor_body_area");
var ifrdoc = ifr.contentWindow.document;
ifrdoc.open();
ifrdoc.write('<html><head></head><body>sdsfdsafdsafdsafdsafdsfdsfdsfdsfd</body></html>');
ifrdoc.close();
ifrdoc.designMode="on";     //文档进入可编辑模式
ifrdoc.contentEditable=true;
function show(){alert(ifrdoc.body.innerHTML);}

function runCMD(type,ui,value){
	if(type == "" || type == null)
		return;
	_value = value || null;
	ifrdoc.execCommand(type,false,_value);
}
</script>
<div class="button"><input type="button" value="显示编辑器内容" onclick="show()" /></div>
</body>
</html>