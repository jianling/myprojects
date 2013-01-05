<html>
<head>
	<title>获取textarea中光标的坐标（IE）</title>
    <script language="JavaScript" type="text/javascript">
        function initPosition(textBox) {
            var storedValue = textBox.value;
            textBox.value = "";
            textBox.select();
            var caretPos = document.selection.createRange();
            textBox.__boundingTop = caretPos.boundingTop;
            textBox.__boundingLeft = caretPos.boundingLeft;
            textBox.value = " ";
            textBox.select();
            caretPos = document.selection.createRange();
            textBox.__boundingWidth = caretPos.boundingWidth;
            textBox.__boundingHeight = caretPos.boundingHeight;
            textBox.value = storedValue;
        }
 
        function storePosition(textBox) {
            var caretPos = document.selection.createRange(); 
            var boundingTop = (caretPos.offsetTop + textBox.scrollTop) - textBox.__boundingTop;
            var boundingLeft = (caretPos.offsetLeft + textBox.scrollLeft) - textBox.__boundingLeft;
            textBox.__Line = (boundingTop / textBox.__boundingHeight) + 1;
            textBox.__Column = (boundingLeft / textBox.__boundingWidth) + 1;
        } 

        function updatePosition(textBox) {
            storePosition(textBox);
            document.forms[0].txtLine.value = textBox.__Line;
            document.forms[0].txtColumn.value = textBox.__Column;
        }
    </script>

    <style type="text/css">
        body, td, tg, input, select {
            font-family: Verdana;
            font-size: 10px;
        }
    </style>

</head>

<body onload="initPosition(document.forms[0].txtLayoutViewer)">
form:<a href="http://geekswithblogs.net/svanvliet/archive/2005/03/24/textarea-cursor-position-with-javascript.aspx">http://geekswithblogs.net/svanvliet/archive/2005/03/24/textarea-cursor-position-with-javascript.aspx</a>
    <form>
        <table cellspacing="0" cellpadding="3">
            <tr>
                <td colspan="3">
                    Change Font Size
                    <select onchange="this.form.txtLayoutViewer.style.fontSize = this.options[this.selectedIndex].value; initPosition(this.form.txtLayoutViewer);">
                        <option value="10">10px</option>
                        <option value="12">12px</option>
                        <option value="14">14px</option>
                        <option value="16">16px</option>
                        <option value="18">18px</option>
                        <option value="20">20px</option>
                        <option value="24">24px</option>
                        <option value="36">36px</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <textarea name="txtLayoutViewer"
                        onmouseup="updatePosition(this)"
                        onmousedown="updatePosition(this)"
                        onkeyup="updatePosition(this)"
                        onkeydown="updatePosition(this)"
                        onfocus="updatePosition(this)"
                        rows="15"
                        cols="75">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec ornare aliquam quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Pellentesque et quam in dui consequat tempor. Etiam lorem lectus, sollicitudin laoreet, tincidunt nec, pharetra in, magna. Mauris accumsan velit et augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</textarea></td>
            </tr>
            <tr>
                <td width="70%">
                    &nbsp;</td>
                <td width="10%">
                    Line <input type="text" name="txtLine" style="width: 25px" readonly></td>
                <td width="20%">
                    Column <input type="text" name="txtColumn" style="width: 25px" readonly></td>
            </tr>
        </table>
    </form>
</body>
</html>