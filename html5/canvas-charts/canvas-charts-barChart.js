/**
 * barChart
 * @function
 * @param {Object} options function options
 * @config {String|HTMLElement} canvas canvas id or canvas el
 * @config {Array} abscissa values show in abscissa
 * @config {Array} values values show in charts
 * @config {Number} xAxisMaxValue max value of x-axis
 * @config {Boolean} xAxisValuePerType whether type of xAxisValue is percentage or not, default false
 * @config {Boolean} showValue whether show values in charts, default true
 */
Canchar.barChart  = function(options){
	var canvas = options.canvas,
		abscissa = options.abscissa,
		values = options.values,
		xAxisMaxValue = options.xAxisMaxValue || 100,
		xAxisValuePerType = options.xAxisValuePerType || false,
		multiDataSource = Object.prototype.toString.call(values[0]) == "[object Array]" ? true : false,
		showValue = (options.showValue != undefined && options.showValue == false) ? false : true,
		
		context = canvas.getContext("2d"),
		canvas_h = canvas.height,
        canvas_w= canvas.width,
		char_margin_top = 80,	//图表相对于canvas顶端的间距
		char_margin_bottom = 20,	//图表相对于canvas低端的间距
		char_margin_horizontal = 60;		//图表相对于canvas两端的间距
	if(multiDataSource){
        cells = values[0].length - 1;    //图表基线每行的单元格数
    }else{
        cells = values.length - 1;    //图表基线每行的单元格数
    }
	
	//绘制图表基线
    var char_w = canvas_w - char_margin_horizontal*2,
        char_h = canvas_h - char_margin_bottom - char_margin_top,
        cell_w = char_w/5,
        cell_h = char_h/abscissa.length,
        position_x = char_margin_horizontal,
        position_y = char_margin_top;
    
    for(var i=0; i<5; i++){
        context.beginPath();
        context.rect(position_x, position_y, cell_w, char_h);
        if(i%2 == 0){
            context.fillStyle = "#607F9D";
            context.fill();
        }
        context.closePath();
        position_x += cell_w;
    }
    
    context.beginPath();
    context.rect(char_margin_horizontal, char_margin_top, char_w, char_h);
    context.strokeStyle = "#FFF";
    context.lineCap = "round";
    context.stroke();
    context.closePath();
    
    //绘制横坐标
    var per_x = char_margin_horizontal,
    	per_y = char_margin_top - 10,
        xAxisValue = 0;
    
    context.fillStyle = "#FFF";
    context.textAlign = "center";
    for(var i=0; i<=5; i++){
        if(xAxisValuePerType){
            context.fillText(xAxisValue + "%", per_x, per_y);
        }else{
            context.fillText(xAxisValue, per_x, per_y);
        }
        xAxisValue = xAxisValue + xAxisMaxValue/5;
        per_x += cell_w;
    }
    
    //绘制纵坐标
    var abscissa_x = 0,
        abscissa_y = char_margin_top + cell_h/2;
    context.textBaseline = "middle";
    context.textAlign = "right";
    for(var i=0, len=abscissa.length; i<len; i++){
    	var item = abscissa[i];
        abscissa_x = char_margin_horizontal - 3;
        context.fillText(item, abscissa_x, abscissa_y);
        abscissa_y += char_h/len;
    }
    
    /**
     * 绘制条形图
     * @function
     * @param {Number} index the index of bar
     * @param {Number} count the count of bar
     */
    var renderValues = function(datas, index, count){
        for(var i=0; i<datas.length; i++){
            var item = datas[i];
            var x = char_margin_horizontal;
            if(typeof index == 'undefined'){
                var bar_h = cell_h*0.8,
                    y = char_margin_top + cell_h*i + cell_h*0.1;
            }else{
                var bar_h = cell_h*(1 - 0.1*(count+1))/count,
                    y = char_margin_top + cell_h*i + cell_h*0.1*index + bar_h*(index-1);
            }
            context.beginPath();
            context.rect(x, y, char_w/xAxisMaxValue*item, bar_h);
            context.fillStyle = "#" + Canchar["color"][index%Canchar["color"].length || 2];;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = "#FFF";
            context.stroke();
            context.closePath();
        }
        
        if(showValue){
            //绘制数据点对应的值
            context.fillStyle = "#FFF";
            context.textAlign = "left";
            for(var i=0; i<datas.length; i++){
                var item = datas[i];
                var x = char_margin_horizontal + char_w/xAxisMaxValue*item + 20;
                if(typeof index == 'undefined'){
                    var y = char_margin_top + cell_h*i + cell_h/2;
                }else{
                    var y = char_margin_top + cell_h*i + cell_h/10*index + bar_h*index - bar_h/2;
                }
                
                if(xAxisValuePerType){
                    context.fillText(datas[i] + "%", x, y);
                }else{
                    context.fillText(datas[i], x, y);
                }
            }
        }
    };
    
    if(multiDataSource){
        for(var i=0; i<values.length; i++){
            renderValues(values[i], i+1, values.length);
        }
    }else{
        renderValues(values);
    }
    
};