<!DOCTYPE HTML>
<html>
<head>
<title>获取光标所在行(不准确)</title>
<script type="text/javascript">
	function getCursor(nBox){
		var cursorPos = 0;
         	if (document.selection){ 
	         	nBox.focus();
             	var tmpRange = document.selection.createRange();
  	         	tmpRange.moveStart('character',-nBox.value.length);
        	 	cursorPos = tmpRange.text.length;
     		}else{
				if(nBox.selectionStart || nBox.selectionStart == '0'){
					cursorPos = nBox.selectionStart;
				}
			}
		var lineNumber =  parseInt(cursorPos/25) + 1;  // 25 is the number of textarea columns//不准确!!
		alert('行：' + lineNumber);
		alert(cursorPos);
  	}

</script>
</head>
<body>
	<form action="">
		<textarea name='area1' cols='25' rows='10'>That's one small step for man, one giant leap for mankind.</textarea>
		<br><br>
		<input type='button' value='Get Cursor Position' onclick="getCursor(this.form.area1)">
	</form>
</body>
</html>