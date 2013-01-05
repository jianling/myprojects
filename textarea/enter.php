<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml"> 
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<title>Enter与Ctrl+Enter切换</title>
<style type="text/css">
	p {
		background-color:#F7F9FA;
		border:1px dashed #8CACBB;
		padding:5px;
		line-height:1.5em;
	}
</style>
<script type="text/javascript" src="./yahoo-dom-event.js"></script>
</head> 
 
<body>
<p></p>
<img src="http://www.baidu.com/img/baidu_logo.gif" onClick="insertSmileylocal('[/cry/]');"/>
<form name="myForm">
    <textarea name="textarea" cols="50" rows="10" id="textarea">预置内容预置内容</textarea><br />
    <input type="radio" name="check" value="enter" checked="checked" />Enter发送 &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="check" value="ctrl_enter" />Ctrl + Enter发送
    <input type="submit" name="button" id="button" value="提交" /> 
</form>

<script type="text/javascript"> 
	var textarea = document.getElementById("textarea"),
		button = document.getElementById("button");
	textarea.onkeydown = function(e){
		var checkedValue;
		if(window.event){
			e = window.event;
		}
		if(e == null)
			return;
		if(e.ctrlKey && e.keyCode == 13){
			var i,checked = document.forms["myForm"].elements["check"];
			for(i = 0;i < checked.length;i ++){
				if(checked[i].checked){
					checkedValue = checked[i].value;
					break;
				}
			}
			if(checkedValue == "ctrl_enter"){
				alert("发送");
			}else{
				if(typeof document.selection != "undefined"){
					document.selection.createRange().text = "\r\n";
				}else{
					var length = textarea.value.length,
						toEndLength = length - textarea.selectionEnd;
					textarea.value = textarea.value.substr(0,textarea.selectionStart) + "\r\n" + textarea.value.substring(textarea.selectionEnd,textarea.value.length);
					textarea.selectionEnd = textarea.value.length - toEndLength;//处理光标位置
				}
			}
		}else if(e.keyCode == 13){
			var i,checked = document.forms["myForm"].elements["check"];
			for(i = 0;i < checked.length;i ++){
				if(checked[i].checked){
					checkedValue = checked[i].value;
					break;
				}
			}
			if(checkedValue == "enter"){
				//alert("发送");
				e.preventDefault();
				return false;
			}
		}
	};
	function insertSmileylocal(str){
		textarea.focus();
		if(typeof document.selection != "undefined"){
			document.selection.createRange().text = "[baidu]";
		}else{
			var length = textarea.value.length,
				toEndLength = length - textarea.selectionEnd;
			textarea.value = textarea.value.substr(0,textarea.selectionStart) + "[baidu]" + textarea.value.substring(textarea.selectionEnd,textarea.value.length);
			textarea.selectionEnd = textarea.value.length - toEndLength;
		}
	}
</script>
</body> 
</html> 