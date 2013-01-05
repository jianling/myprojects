function initCalendar(thisArea){
   var $ = function (id) {
      return "string" == typeof id ? document.getElementById(id) : id;
   }
   ;

   var Class = {
      create : function() {
         return function() {
            this.initialize.apply(this, arguments);
         }
      }
   }

   Object.extend = function(destination, source) {
      for (var property in source) {
         destination[property] = source[property];
      }
      return destination;
   }


   var Calendar = Class.create();
   Calendar.prototype = {
      initialize : function(container, options) {
         this.Container = $(container);
         // 容器(table结构)
         this.Days = [];
         // 日期对象列表

         this.SetOptions(options);

         this.Year = this.options.Year;
         this.Month = this.options.Month;
         this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
         this.onSelectDay = this.options.onSelectDay;
         this.onToday = this.options.onToday;
         this.onFinish = this.options.onFinish;

         this.Draw();
      }
      ,
      // 设置默认属性
      SetOptions : function(options) {
         this.options = {
            // 默认值
            Year : 			new Date().getFullYear(), // 显示年
            Month : 			new Date().getMonth() + 1, // 显示月
            SelectDay : 		null, // 选择日期
            onSelectDay : 	function(){
            }
            , // 在选择日期触发
            onToday : 		function(){
            }
            , // 在当天日期触发
            onFinish : 		function(){
            }
            // 日历画完后触发
         }
         ;
         Object.extend(this.options, options || {
         }
         );
      }
      ,
      // 上一个月
      PreMonth : function() {
         // 先取得上一个月的日期对象
         var d = new Date(this.Year, this.Month - 2, 1);
         // 再设置属性
         this.Year = d.getFullYear();
         this.Month = d.getMonth() + 1;
         // 重新画日历
         this.Draw();
      }
      ,
      // 下一个月
      NextMonth : function() {
         var d = new Date(this.Year, this.Month, 1);
         this.Year = d.getFullYear();
         this.Month = d.getMonth() + 1;
         this.Draw();
      }
      ,
      // 画日历
      Draw : function() {
         // 用来保存日期列表
         var arr = [];
         // 用当月第一天在一周中的日期值作为当月离第一天的天数
         for(var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay();
         i <= firstDay;
         i ++ ){
            arr.push("&nbsp;");

         }
         // 用当月最后一天在一个月中的日期值作为当月的天数
         for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate();
         i <= monthDay;
         i ++ ){
            arr.push(i);

         }

         var frag = document.createDocumentFragment();

         this.Days = [];

         while(arr.length > 0){
            // 每个星期插入一个tr
            var row = document.createElement("tr");
            // 每个星期有7天
            for(var i = 1; i <= 7; i ++ ){
               var cell = document.createElement("td");
               cell.innerHTML = "&nbsp;";
               if(arr.length > 0){
                  var d = arr.shift();
                  if(d != "&nbsp;"){
                     cell.className = "isday";
                     cell.id = "isday";
                  }
                  cell.innerHTML = d;
                  if(d > 0){
                     this.Days[d] = cell;
                     // 判断是否今日
                     if(this.IsSame(new Date(this.Year, this.Month - 1, d), new Date())){
                        this.onToday(cell);

                     }
                     // 判断是否选择日期
                     if(this.SelectDay && this.IsSame(new Date(this.Year, this.Month - 1, d), this.SelectDay)){
                        this.onSelectDay(cell);

                     }
                  }
               }
               row.appendChild(cell);
            }
            frag.appendChild(row);
         }

         // 先清空内容再插入(ie的table不能用innerHTML)
         while(this.Container.hasChildNodes()){
            this.Container.removeChild(this.Container.firstChild);

         }
         this.Container.appendChild(frag);

         this.onFinish();
      }
      ,
      // 判断是否同一日
      IsSame : function(d1, d2) {
         return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
      }
   }
   ;
   var cale = new Calendar("idCalendar", {
      onSelectDay : function(o){
         o.className = "onSelect";
         alert(thisArea);
      }
      ,
      onToday : function(o){
         o.className = "onToday";

      }
      ,
      onFinish : function(){
         $("idCalendarYear").innerHTML = this.Year;
         $("idCalendarMonth").innerHTML = this.Month;
         for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate();  i <= monthDay; i ++ ){
            this.Days[i].innerHTML = "<a class=\"day\" onclick=\"setDay(" + this.Year + ", " + this.Month + ", " + i + "); \">" + i + "</a>";
         }
      }
   }
   );

   $("idCalendarPre").onclick = function(){
      cale.PreMonth();

   }
   $("idCalendarNext").onclick = function(){
      cale.NextMonth();

   }
   showCalendar(thisArea);
//   thisArea.id = "currentArea";
    try{
        document.getElementById("currentArea").id="getday";
    }catch(Exception){
        thisArea.id = "currentArea";
    }

//   alert(currentAreas.length);
//   for(i = 0;i<currentAreas.length;i++){
//        currentAreas[i].id = "getday"; 
//        alert("ss");  
//   }
   thisArea.id = "currentArea";
}

//------------------------------
function setDay(year, month, day) {
    var currentArea = document.getElementById("currentArea");
   currentArea.value = year + "-" + month + "-" + day;
   return false;
}

function getLeft(e){
   var offset = e.offsetLeft;
   if(e.offsetParent != null)
   offset += getLeft(e.offsetParent);
   return offset;
}
function getTop(e){
   var offset = e.offsetTop;
   if(e.offsetParent != null)
   offset += getTop(e.offsetParent);
   return offset;
}

function showCalendar(obj){
   var x_Calendar = getLeft(obj);
   var y_Calendar = getTop(obj);
   document.getElementById("Calendar").style.display = "block";
   document.getElementById("Calendar").style.left = x_Calendar + 0 + "px";
   document.getElementById("Calendar").style.top = y_Calendar + 28 + "px";
}

function getToday(){
   var month = parseInt((new Date()).getMonth()) + 1;
   var day = parseInt((new Date()).getDate()) + 1;
   document.getElementById("currentArea").value = new Date().getYear() + "-" + month + "-" + day;
}

function hideCalendar(){
   document.getElementById("Calendar").style.display = "none";
   document.getElementById("currentArea").id = "getday";
}
