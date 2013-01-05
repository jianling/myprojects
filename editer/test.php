<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>编辑器示例</title>
<style type="text/css" media="all">
body{ font-size:12px;}
.editor{ width:500px; height:226px; margin:0px auto;  border:#FF9900 1px solid;}
.editor iframe{ margin:0px; padding:0px; width:500px; height:190px; border:0px;}
.button{ text-align:center; width:500px; margin:16px auto;}
.editor .bar{ margin:0px; padding:0px; padding:3px 6px; height:60px; border-bottom:#FF9900 1px solid; font-size:14px; letter-spacing:2px;}
.editor .bar input{ border:#FFFFFF 1px solid; background-color:#F8EFD6; cursor:pointer; height:19px; font-size:12px;}
</style>
</head>

<body>
<div class="editor">
    <div class="bar">
		<input type="button" onclick='createLink();' value="链接" />
    </div>
    <iframe id='editor_body_area' name='editor_body_area' style='border:none; overflow-x:auto;' frameborder='0'></iframe>
</div>
<script type="text/javascript" language="javascript">
var ifr = document.getElementById("editor_body_area");
var ifrdoc = ifr.contentWindow.document || ifr.contentDocument;
ifrdoc.open();
ifrdoc.write('<html><head></head><body>sdsfdsafdsafdsafdsafdsfdsfdsfdsfd</body></html>');
ifrdoc.close();
//ifrdoc.designMode="on";
ifrdoc.body.contentEditable=true;

function createLink(){
	ifrdoc.execCommand("bold",false,null);	//非IE浏览器不能与其他方式混合使用
	alert(ifrdoc.body.innerHTML)
	if(document.selection && ifrdoc.selection.createRange().execCommand){//ie-only
		var oRange = ifrdoc.selection.createRange();//创建一个range
		var text = oRange.text;
		
		oRange.execCommand("createlink",true,"");
		
		//var newLink = '<a href="http://www.baidu.com">' + text + '</a>';
		//oRange.pasteHTML(newLink);
	}else if(document.getSelection){//other browsers
		var oRange = ifr.contentWindow.getSelection();
		var text = oRange.getRangeAt(0);
		var linkEle = ifrdoc.createElement("a");
		linkEle.href = "http://www.baidu.com";
		text.surroundContents(linkEle);
	}
}
</script>
</body>
</html>