/**
 * areaChart
 * @function
 * @param {Object} options function options
 * @config {String|HTMLElement} canvas canvas id or canvas el
 * @config {Array} abscissa values show in abscissa
 * @config {Array} values values show in charts
 * @config {Boolean} multiDataSource whether data source is multi or not, default false
 * @config {Number} yAxisMaxValue max value of Y-axis
 * @config {Boolean} yAxisValuePerType whether type of yAxisValue is percentage or not, default false
 * @config {Boolean} showValue whether show values in charts, default true
 */
Canchar.areaChart = function(options){
	var canvas = options.canvas,
		abscissa = options.abscissa,
		values = options.values,
		yAxisMaxValue = options.yAxisMaxValue || 100,
		yAxisValuePerType = options.yAxisValuePerType || false,
		multiDataSource = options.multiDataSource || false,
		showValue = (options.showValue != undefined && options.showValue == false) ? false : true,
		
		context = canvas.getContext("2d"),
		canvas_h = canvas.height,
        canvas_w= canvas.width,
		char_margin_top = 20,	//图表相对于canvas顶端的间距
		char_margin_bottom = 80,	//图表相对于canvas低端的间距
		char_margin_horizontal = 50;		//图表相对于canvas两端的间距
	if(multiDataSource){
        cells = values[0].length - 1;    //图表基线每行的单元格数
    }else{
        cells = values.length - 1;    //图表基线每行的单元格数
    }
	
	//绘制图表基线
    var row_n = 0,
        col_n = 0,
        char_w = canvas_w - char_margin_horizontal*2,
        char_h = canvas_h - char_margin_bottom,
        cell_w = char_w/(abscissa.length - 1),
        cell_h = char_h/5,
        position_x = char_margin_horizontal,
        position_y = char_margin_top;
    
    for(var i=0; i<5; i++){
        for(var j=0; j<cells; j++){
            context.beginPath();
            context.rect(position_x, position_y, cell_w, cell_h);
            if(col_n%2 == 0){
                context.fillStyle = "#607F9D";
                context.fill();
            }
            
            context.strokeStyle = "#FFFFFF";
            context.lineCap = "round";
            context.stroke();
            context.closePath();
            col_n++;
            position_x += cell_w;
        }
        row_n++;
        col_n++;
        position_x = char_margin_horizontal;    //新行起始位
        position_y += cell_h;
    }
    
    context.beginPath();
    context.rect(char_margin_horizontal, char_margin_top, char_w, char_h);
    context.strokeStyle = "#FFF";
    context.lineCap = "round";
    context.stroke();
    context.closePath();
    
    //绘制纵坐标
    var per_y = char_margin_top,
        yAxisValue = yAxisMaxValue;
    
    context.fillStyle = "#FFF";
    context.textBaseline = "middle";
    for(var i=0; i<=5; i++){
        if(yAxisValuePerType){
            var per_x = char_margin_horizontal - (String(yAxisValue).length + 1) * 7;
            context.fillText(yAxisValue + "%", per_x, per_y);
        }else{
            var per_x = char_margin_horizontal - (String(yAxisValue).length) * 7;
            context.fillText(yAxisValue, per_x, per_y);
        }
        yAxisValue = yAxisValue - yAxisMaxValue/5;
        per_y += cell_h;
    }
    
    //绘制横坐标
    var abscissa_x = char_margin_horizontal,
        abscissa_y = char_margin_top + char_h + 15;
    context.fillStyle = "#FFF";
    context.textAlign = "center";
    for(var i=0; i<abscissa.length; i++){
        context.fillText(abscissa[i], abscissa_x, abscissa_y);
        abscissa_x += cell_w;
    }
    
    /**
     * render values
     * @function
     */
    var renderValues = function(datas){
        //绘制连接线
        context.beginPath();
        for(var i=0; i<datas.length; i++){
            var item = datas[i];
            var x = char_margin_horizontal + cell_w*i;
            var y = char_margin_top + (char_h - char_h/yAxisMaxValue*item);
            context.lineTo(x, y);
            context.strokeStyle = "#FFF";
            context.stroke();
            
            // if(i<datas.length){
                // context.beginPath();
                // context.moveTo(x, y);
            // }
        }
        x = char_margin_horizontal + char_w;
        y = char_margin_top + char_h;
        context.lineTo(x, y);
        x = char_margin_horizontal;
        y = char_margin_top + char_h;
        context.lineTo(x, y);
        x = char_margin_horizontal;
        y = char_margin_top + (char_h - char_h/yAxisMaxValue*datas[0]);
        context.lineTo(x, y);
        context.fillStyle = Canchar["getRandomColor"](0.5);
        context.fill();
        context.closePath();
        
        if(showValue){
            //绘制数据点对应的值
            context.fillStyle = "#FFF";
            for(var i=0; i<datas.length; i++){
                var item = datas[i];
                var x = char_margin_horizontal + cell_w*i;
                var y = char_margin_top + (char_h - char_h/yAxisMaxValue*item);
                if(yAxisValuePerType){
                    context.fillText(datas[i] + "%", x, y - 10);
                }else{
                    context.fillText(datas[i], x, y - 10);
                }
            }
        }
    };
    
    if(multiDataSource){
        for(var i=0; i<values.length; i++){
            renderValues(values[i]);
        }
    }else{
        renderValues(values);
    }
    
};