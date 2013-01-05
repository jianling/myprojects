/**
 * scatterDiagram
 * @function
 * @param {Object} options function options
 * @config {String|HTMLElement} canvas canvas id or canvas el
 * @config {Array} values values show in charts
 * @config {Number} xAxisMaxValue max value of X-axis
 * @config {Number} yAxisMaxValue max value of Y-axis
 */
Canchar.scatterDiagram = function(options){
	var canvas = options.canvas,
		values = options.values,
		xAxisMaxValue = options.xAxisMaxValue || 100,
		yAxisMaxValue = options.yAxisMaxValue || 100,
		
		context = canvas.getContext("2d"),
		canvas_h = canvas.height,
        canvas_w= canvas.width,
		char_margin_top = 20,	//图表相对于canvas顶端的间距
		char_margin_bottom = 50,	//图表相对于canvas低端的间距
		char_margin_horizontal = 50,		//图表相对于canvas两端的间距
		char_h = canvas_h - char_margin_top - char_margin_bottom,
		char_w = canvas_w - char_margin_horizontal*2,
	    cell_h = char_h/5,
	    cell_w = char_w/5;
	    
	
    //绘制纵坐标
    var per_y = char_margin_top,
        yAxisValue = yAxisMaxValue;
    context.moveTo(char_margin_horizontal, char_margin_top);
    context.lineTo(char_margin_horizontal, canvas_h - char_margin_bottom);
    context.strokeStyle = "#fff";
    context.stroke();
    context.fillStyle = "#FFF";
    context.textBaseline = "middle";
    for(var i=0; i<=5; i++){
        var per_x = char_margin_horizontal - (String(yAxisValue).length) * 7;
        context.fillText(yAxisValue, per_x, per_y);
        yAxisValue = yAxisValue - yAxisMaxValue/5;
        per_y += cell_h;
    }
    
    //绘制横坐标
    var per_x = char_margin_horizontal,
        per_y = canvas_h - char_margin_bottom + 10,
        xAxisValue = 0;
    context.moveTo(char_margin_horizontal, canvas_h - char_margin_bottom);
    context.lineTo(canvas_w - char_margin_horizontal, canvas_h - char_margin_bottom);
    context.strokeStyle = "#fff";
    context.stroke();
    context.textAlign = "center";
    for(var i=0; i<5; i++){
        per_x += cell_w;
        xAxisValue = xAxisValue + yAxisMaxValue/5;
        context.fillText(xAxisValue, per_x, per_y);
    }
    
    
    //依次渲染所有的值
    for(var i=0; i<values.length; i++){
        var item = values[i];
        var x = char_margin_horizontal + item[0]/xAxisMaxValue*char_w;
        var y = canvas_h - char_margin_bottom - item[1]/yAxisMaxValue*char_h;
        context.beginPath();
        context.arc(x, y, 4, 0, 2*Math.PI, false);
        context.fillStyle = "rgba(250,250,250,0.5)";
        context.fill();
        context.closePath();
    }
    
};