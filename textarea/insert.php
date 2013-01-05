<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>获取光标坐标，插入字符</title>
</head>
<body>
<script>
var start=0;
    var end=0;
    function add(){      
        var textBox = document.getElementById("ta");
        var pre = textBox.value.substr(0, start);
        var post = textBox.value.substr(end);
        textBox.value = pre + document.getElementById("inputtext").value + post;
    }
    function savePos(textBox){
        if(typeof(textBox.selectionStart) == "number"){	//Firefox
            start = textBox.selectionStart;
            end = textBox.selectionEnd;
        }
        else if(document.selection){	//IE
            var range = document.selection.createRange();
            if(range.parentElement().id == textBox.id){
				//计算选区开始位
                var range_all = document.body.createTextRange();
                range_all.moveToElementText(textBox);
                for (start=0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
                    range_all.moveStart('character', 1);
                for (var i = 0; i <= start; i ++){
                    if (textBox.value.charAt(i) == '\n')
                        start++;
                }
                //计算选区结束位
                var range_all = document.body.createTextRange();
                range_all.moveToElementText(textBox);
                for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end ++)
                    range_all.moveStart('character', 1);
                    for (var i = 0; i <= end; i ++){
                        if (textBox.value.charAt(i) == '\n')
                            end ++;
                    }
                }
            }
        document.getElementById("start").value = start;
        document.getElementById("end").value = end;
    }
	function insertSmileylocal(str){
		var objtext=document.getElementById("reccont");
		var objtextlength=objtext.value.length;
		objtext.value=objtext.value.substr(0,start)+str+objtext.value.substring(start,objtextlength);
	}
</script>
<img src="http://www.baidu.com/img/baidu_logo.gif" onClick="insertSmileylocal('[/cry/]');"/>
<form action="a.cgi">
<table border="1" cellspacing="0" cellpadding="0">
    <tr>
        <td>start: <input type="text" id="start" size="3"/></td>
        <td>end: <input type="text" id="end" size="3"/></td>
    </tr>
    <tr>
        <td colspan="2">
            <textarea id="reccont" onKeydown="savePos(this)"
                              onKeyup="savePos(this)"
                              onmousedown="savePos(this)"
                              onmouseup="savePos(this)"
                              onfocus="savePos(this)"
                              rows="14" cols="50"></textarea>
        </td>
    </tr>
</table>
</form>

</body>
</html>