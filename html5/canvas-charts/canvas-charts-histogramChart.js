/**
 * histogramChart 柱状图
 * @function
 * @param {Object} options function options
 * @config {String|HTMLElement} canvas canvas id or canvas el
 * @config {Array} abscissa values show in abscissa
 * @config {Array} values values show in charts
 * @config {Number} yAxisMaxValue max value of Y-axis
 * @config {Boolean} yAxisValuePerType whether type of yAxisValue is percentage or not, default false
 * @config {Boolean} showValue whether show values in charts, default true
 */
Canchar.histogramChart = function(options){
	var canvas = options.canvas,
		abscissa = options.abscissa,
		values = options.values,
		yAxisMaxValue = options.yAxisMaxValue || 100,
		yAxisValuePerType = options.yAxisValuePerType || false,
		multiDataSource = Object.prototype.toString.call(values[0]) == "[object Array]" ? true : false,
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
    var char_w = canvas_w - char_margin_horizontal*2,
        char_h = canvas_h - char_margin_bottom - char_margin_top,
        cell_w = char_w/abscissa.length,
        cell_h = char_h/5,
        position_x = char_margin_horizontal,
        position_y = char_margin_top;
    
    for(var i=0; i<5; i++){
        context.beginPath();
        context.rect(position_x, position_y, char_w, cell_h);
        if(i%2 == 0){
            context.fillStyle = "#607F9D";
            context.fill();
        }
        context.closePath();
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
    context.textAlign = "right";
    for(var i=0; i<=5; i++){
        var per_x = char_margin_horizontal - 3;
        if(yAxisValuePerType){
            context.fillText(yAxisValue + "%", per_x, per_y);
        }else{
            context.fillText(yAxisValue, per_x, per_y);
        }
        yAxisValue = yAxisValue - yAxisMaxValue/5;
        per_y += cell_h;
    }
    
    //绘制横坐标
    var abscissa_x = char_margin_horizontal + cell_w/2,
        abscissa_y = char_margin_top + char_h + 15;
    context.fillStyle = "#FFF";
    context.textAlign = "center";
    for(var i=0; i<abscissa.length; i++){
        context.fillText(abscissa[i], abscissa_x, abscissa_y);
        abscissa_x += cell_w;
    }
    
    /**
     * 绘制柱状图
     * @function
     * @param {Number} index the index of bar
     * @param {Number} count the count of bar
     */
    var renderBars = function(datas, index, count){
        for(var i=0; i<datas.length; i++){
            (function(){
                var item = datas[i];
                var j = i;
                var h = char_h/yAxisMaxValue*item;
                var y = char_margin_top + char_h;
                if(typeof index == 'undefined'){
                    var bar_w = cell_w*0.8,
                        x = char_margin_horizontal + cell_w*i + cell_w*0.1;
                }else{
                    var bar_w = cell_w*(1 - 0.1*(count+1))/count,
                        x = char_margin_horizontal + cell_w*i + cell_w*0.1*index + bar_w*(index-1);
                }
                var _h = 0, over = false;
                //动画
                var timer = setInterval(function(){
                    if(_h + h/50 >= h){
                        _h = h;
                        y = char_margin_top + char_h - h;
                        over = true;
                    }else{
                        _h = _h + h/50;
                        y = char_margin_top + char_h - _h;
                    }
                    context.beginPath();
                    context.rect(x, y, bar_w, _h);
                    context.fillStyle = "#" + Canchar["color"][index%Canchar["color"].length || 2];
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = "#FFF";
                    context.stroke();
                    context.closePath();
                    if(over){
                        //绘制数据点对应的值
                        context.fillStyle = "#FFF";
                        showValue && drawData(index, j, bar_w);
                        clearInterval(timer);
                        return;
                    }
                }, 10);
            })();
        }
    };
    
    /**
     * 绘制数据点对应的值
     * @param {Number} index the index of bar
     * @param {Number} i the index of value
     * @param {Number} bar_w the width of bar
     */
    function drawData(index, i, bar_w){
        if(multiDataSource){
            var data = values[index-1][i];
            var x = char_margin_horizontal + cell_w*i + cell_w/10*index + bar_w*index - bar_w/2;
        }else{
            var data = values[i];
            var x = char_margin_horizontal + cell_w*i + cell_w/2;
        }
        var y = char_margin_top + (char_h - char_h/yAxisMaxValue*data);
        
        if(yAxisValuePerType){
            context.fillText(data + "%", x, y - 10);
        }else{
            context.fillText(data, x, y - 10);
        }
    }
    
    
    //绘制柱状图
    if(multiDataSource){
        for(var i=0; i<values.length; i++){
            renderBars(values[i], i+1, values.length);
        }
    }else{
        renderBars(values);
    }
    
};