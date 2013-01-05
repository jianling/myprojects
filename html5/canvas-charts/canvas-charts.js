/**
 * canvas charts
 * author: jianling
 * date: 2011-12-28
 */


//TODO 横坐标，纵坐标加上单位的option
//TODO 动画效果
//TODO 鼠标点击效果
//TODO 当横坐标/纵坐标文字过长是截断
//TODO 图标的边距使用参数设置？
//TODO 加上网格

var Canchar = {
    "version": "0.9",
    "color": ["AFD8F8", "F6BD0F", "8BBA00", "FF8E46", "008E8E", "D64646", "8E468E", "588526", "B3AA00", "008ED6", "9D080D", "A186BE", "CC6600", "FDC689", "ABA000", "F26D7D", "FFF200", "0054A6", "F7941C", "CC3300", "006600", "663300", "6DCFF6"],
    "getRandomColor": (function(){
        var index = -1;
        return function(alpha){
            index++;
            if(index > Canchar["color"].length){
                index = 0;
            }
            var color = "#" + Canchar["color"][index];
            if(arguments.length == 1){
            	var rgb = Canchar["parseHexColor"](color);
            	color = "rgba(" + rgb["r"] + "," + rgb["g"] + "," + rgb["b"] + "," + alpha + ")";
            }
	            
	        return color;
        }
    })(),
    "parseHexColor": function(hexColor) {
	    return {
	        r: parseInt(hexColor.slice(1, 3), 16),
	        g: parseInt(hexColor.slice(3, 5), 16),
	        b: parseInt(hexColor.slice(5, 7), 16)
	    };
	}
};