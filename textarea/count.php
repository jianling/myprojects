<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml"> 
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<title>文本域字符(字节)数判断</title>
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
<p>使用onkeypress()、onkeydown()进行监听时，输入的字符实际上还没有到textarea中，所以不计数!!<br />另外可以使用定时器监听输入的字符数</p>
<div id="count">已输入0个字(0个字符)，还能输入100个字[不计算换行符]</div>
<textarea name="" cols="50" rows="10" id="textarea">预置内容预置内容</textarea><br />

<script type="text/javascript"> 
	var count = document.getElementById("count"),
		textarea = document.getElementById("textarea"),
		button = document.getElementById("button");
	textarea.onkeyup = textarea.onmouseup = textarea.onblur = function(){
		var str = textarea.value,charLength;
		if(arguments.length>0)	//不计算换行符
			str = str.replace(/(\n)|(\r\n)/g,'');
		charLength = checkLength(str,true);
		count.innerHTML = "已输入" + str.length + "个字，（" + charLength + "个字符）还能输入" + (100 - str.length) + "个字";
	};
	var checkLength = function(strTemp){
		var i,sum;
		sum=0;
		for(i=0;i <strTemp.length;i++){
			if ((strTemp.charCodeAt(i)>=0) && (strTemp.charCodeAt(i) <=255)){
				sum=sum+1;
			}else{
				sum=sum+2;
			}
		}
		return sum;
	};
	
</script>
</body> 
</html> 