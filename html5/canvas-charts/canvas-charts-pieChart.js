/**
 * pieChart
 * @function
 * @param {Object} options function options
 * @config {String|HTMLElement} canvas canvas id or canvas el
 * @config {Array} abscissa values show in abscissa
 * @config {Array} values values show in charts
 * @config {Boolean} doughnut whether doughnut or not
 */
Canchar.pieChart = function(options){
	var canvas = options.canvas,
		abscissa = options.abscissa,
		values = options.values,
		doughnut = options.doughnut,
		
		context = canvas.getContext("2d"),
		canvas_h = canvas.height,
        canvas_w= canvas.width,
		totalValue = 0;   //保存各数值的和
		
    for(var i = 0, len = values.length; i<len; i++){
        totalValue += values[i];
    }
	
	/**
	 * 计算饼的半径
	 */
	function getRadius(){
	    var i = 0, len = values.length, a = [], margin = 0, radius = 0;
	    
	    for(; i<len; i++){
	        a[i] = abscissa[i] + '' + values[i];
	        if(a[i].length > margin){
	            margin = a[i].length;    //每个字符宽度为7px
	        }
	    }
	    margin = margin*7;
	    
	    var m_top = 20 + 30,
            m_hor = 20 + 30 + 10 + margin;
            
        if((canvas_h - m_top*2) > (canvas_w - m_hor*2)){
            radius = (canvas_w - m_hor*2)/2;
        }else{
            radius = (canvas_h - m_top*2)/2;
        }
        
	    return radius;
	}
	
	/**
	 * 计算每个值在饼图中对应的角度
	 */
	function getAngle(){
	    var i = 0, len = values.length, angle = [];
        
        i = 0;
        for(; i<len; i++){
            angle[i] = values[i]*2*Math.PI/totalValue;
        }
        
        return angle;
	}
	
	var pieRadius = getRadius();   //获取饼的半径
	var angle = getAngle();    //保存每个值在饼图中对应的角度
    
    
    context.save();
    //绘制饼图    
    for(var i = 0, len = angle.length, angle_start = 0; i<len; i++){
        context.beginPath();
        context.moveTo(canvas_w/2, canvas_h/2);
        context.arc(canvas_w/2, canvas_h/2, pieRadius, angle_start, angle_start + angle[i], false);
        context.fillStyle = Canchar["getRandomColor"]();
        context.fill();
        context.closePath();
        angle_start += angle[i];
    }
    
    //如果设置了doughnut（环形图），将饼图中心挖空
    if(doughnut){
        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.arc(canvas_w/2, canvas_h/2, pieRadius/2, 0, 2*Math.PI, false);
        context.fill();
    }
    
    context.restore();
    
    //绘制标注
    for(var i = 0, len = values.length; i<len; i++){
        var value = values[i],
            accumulate  = 0,
            _accumulate  = 0,
            _fix_begin = {
                "x": 0,
                "y": 0
            },
            _fix_end = {
                "x": 0,
                "y": 0
            },
            x = canvas_w/2,
            y = canvas_h/2;
        
        for(var j=0; j<i; j++){
            accumulate = accumulate + values[j]*2;
            _accumulate = _accumulate + values[j]*2;
        }
        accumulate += values[i];
        _accumulate += values[i];
        
        _accumulate = _accumulate/2;
        while(_accumulate > totalValue/2){
            _accumulate = _accumulate - totalValue/2;
        }
        if(_accumulate > totalValue/4){
            _accumulate = totalValue/2 - _accumulate;
        }
        _fix_begin["x"] = Math.cos((_accumulate)/totalValue*2*Math.PI)*pieRadius;
        _fix_begin["y"] = Math.sin((_accumulate)/totalValue*2*Math.PI)*pieRadius;
        
        _fix_end["x"] = Math.cos((_accumulate)/totalValue*2*Math.PI)*(pieRadius + 30);
        _fix_end["y"] = Math.sin((_accumulate)/totalValue*2*Math.PI)*(pieRadius + 30);
        
        //根据实际所处的象限，绘制标注
        context.strokeStyle = "#D64646";
        context.fillStyle = "#D64646";
        context.textBaseline = "middle";
        accumulate = accumulate/2;
        if(accumulate <= totalValue/4){ //第一象限
            x1 = x + _fix_begin["x"];
            y1 = y + _fix_begin["y"];
            
            x2 = x + _fix_end["x"];
            y2 = y + _fix_end["y"];
            
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x2 + 10, y2);
            context.stroke();
            context.closePath();
            
            context.fillText(abscissa[i] + " " + values[i], x2 + 15, y2);
        }else if(accumulate <= totalValue/2){   //第二象限
            x1 = x - _fix_begin["x"];
            y1 = y + _fix_begin["y"];
            
            x2 = x - _fix_end["x"];
            y2 = y + _fix_end["y"];
            
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x2 - 10, y2);
            context.stroke();
            context.closePath();
            
            context.fillText(abscissa[i] + " " + values[i], x2 - 10 - (abscissa[i] + " " + values[i]).length*7, y2);
        }else if(accumulate <= totalValue*3/4){ //第三象限
            x1 = x - _fix_begin["x"];
            y1 = y - _fix_begin["y"];
            
            x2 = x - _fix_end["x"];
            y2 = y - _fix_end["y"];
            
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x2 - 10, y2);
            context.stroke();
            context.closePath();
            
            context.fillText(abscissa[i] + " " + values[i], x2 - 10 - (abscissa[i] + " " + values[i]).length*7, y2);
        }else{  //第四象限
            x1 = x + _fix_begin["x"];
            y1 = y - _fix_begin["y"];
            
            x2 = x + _fix_end["x"];
            y2 = y - _fix_end["y"];
            
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x2 + 10, y2);
            context.stroke();
            context.closePath();
            
            context.fillText(abscissa[i] + " " + values[i], x2 + 10, y2);
        }
        
    }
    
    
};