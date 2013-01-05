<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml"> 
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<title>textarea的focus修复</title>
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
<p>测试情景：对已有内容的textarea执行focus()<br />
	测试结果：只有Firefox（gecko内核）能将光标定位在文本最后</p>
<textarea name="" cols="50" rows="10" id="textarea">预置内容预置内容</textarea><br />
<label> 
  <input type="submit" name="button" id="button" value="focus修复"  /> 
</label>

<script type="text/javascript">
	var textarea = document.getElementById("textarea"),
		button = document.getElementById("button");
	textarea.focus();
	button.onclick = function(){
		if(YAHOO.env.ua.ie){
			var rng = textarea.createTextRange();
			rng.text = textarea.value;
			rng.select();
			rng.collapse(false);
		}else if (YAHOO.env.ua.webkit){
			textarea.select();
			window.getSelection().collapseToEnd();
		}else{
			textarea.selectionStart = textarea.value.length;
			textarea.focus();
		}
	};
</script>
</body> 
</html> 