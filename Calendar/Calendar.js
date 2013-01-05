var initCalendar = function(thisArea){
   var $ = function (id) {
      return "string" == typeof id ? document.getElementById(id) : id;
   };

	var getLeft = function (e){
		var offset = e.offsetLeft;
		if(e.offsetParent != null)
		offset += getLeft(e.offsetParent);
		return offset;
	};
	var getTop = function (e){
	   var offset = e.offsetTop;
	   if(e.offsetParent != null)
	   offset += getTop(e.offsetParent);
	   return offset;
	};
	var createCalendar = function(){
		var cal = document.createElement("div");
		cal.id="Calendar";
		cal.className = "Calendar";
		cal.innerHTML = '<div id="idCalendarPre">&lt;&lt;</div>' + 
						'<div id="idCalendarNext">&gt;&gt;</div>' + 
						'<span id="idCalendarYear">2009</span>�� <span id="idCalendarMonth">11</span>��' + 
						'<table cellspacing="0">' + 
						 ' <thead><tr class="head"><td>��</td><td>һ</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td></tr></thead>' + 
						  '<tbody id="idCalendar"></tbody>' + 
						'</table>' + 
						'<input type="button" value="����" onclick="getToday();" /><input type="button" value="�ر�" onclick="hideCalendar();" />';
		document.body.appendChild(cal);
	};
	
	var showCalendar = function (obj){
	   var x_Calendar = getLeft(obj);
	   var y_Calendar = getTop(obj);
	   document.getElementById("Calendar").style.display = "block";
	   document.getElementById("Calendar").style.left = x_Calendar + 0 + "px";
	   document.getElementById("Calendar").style.top = y_Calendar + 28 + "px";
	};
	
	if(!$("Calendar")){
		createCalendar();
	}
	
   var Class = {
      create : function() {
         return function() {
            this.initialize.apply(this, arguments);
         }
      }
   };

   Object.extend = function(destination, source) {
      for (var property in source) {
         destination[property] = source[property];
      }
      return destination;
   };


   var Calendar = Class.create();
   Calendar.prototype = {
      initialize : function(container, options) {
         this.Container = $(container);
         // ����(table�ṹ)
         this.Days = [];
         // ���ڶ����б�

         this.SetOptions(options);

         this.Year = this.options.Year;
         this.Month = this.options.Month;
         this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
         this.onSelectDay = this.options.onSelectDay;
         this.onToday = this.options.onToday;
         this.onFinish = this.options.onFinish;

         this.Draw();
      },
      // ����Ĭ������
      SetOptions : function(options) {
         this.options = {
            // Ĭ��ֵ
            Year : 			new Date().getFullYear(), // ��ʾ��
            Month : 			new Date().getMonth() + 1, // ��ʾ��
            SelectDay : 		null, // ѡ������
            onSelectDay : 	function(){}, // ��ѡ�����ڴ���
            onToday : 		function(){}, // �ڵ������ڴ���
            onFinish : 		function(){}// ��������󴥷�
         };
         Object.extend(this.options, options || {});
      },
      // ��һ����
      PreMonth : function() {
         // ��ȡ����һ���µ����ڶ���
         var d = new Date(this.Year, this.Month - 2, 1);
         // ����������
         this.Year = d.getFullYear();
         this.Month = d.getMonth() + 1;
         // ���»�����
         this.Draw();
      },
      // ��һ����
      NextMonth : function() {
         var d = new Date(this.Year, this.Month, 1);
         this.Year = d.getFullYear();
         this.Month = d.getMonth() + 1;
         this.Draw();
      },
      // ������
      Draw : function() {
         // �������������б�
         var arr = [];
         // �õ��µ�һ����һ���е�����ֵ��Ϊ�������һ�������
         for(var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay();i <= firstDay;i ++ ){
            arr.push("&nbsp;");
         }
         // �õ������һ����һ�����е�����ֵ��Ϊ���µ�����
         for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate();i <= monthDay;i ++ ){
            arr.push(i);
         }

         var frag = document.createDocumentFragment();

         this.Days = [];

         while(arr.length > 0){
            // ÿ�����ڲ���һ��tr
            var row = document.createElement("tr");
            // ÿ��������7��
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
                     // �ж��Ƿ����
                     if(this.IsSame(new Date(this.Year, this.Month - 1, d), new Date())){
                        this.onToday(cell);

                     }
                     // �ж��Ƿ�ѡ������
                     if(this.SelectDay && this.IsSame(new Date(this.Year, this.Month - 1, d), this.SelectDay)){
                        this.onSelectDay(cell);

                     }
                  }
               }
               row.appendChild(cell);
            }
            frag.appendChild(row);
         }
		
         // ����������ٲ���(ie��table������innerHTML)
         while(this.Container.hasChildNodes()){
            this.Container.removeChild(this.Container.firstChild);
         }
         this.Container.appendChild(frag);

         this.onFinish();
      },
      // �ж��Ƿ�ͬһ��
      IsSame : function(d1, d2) {
         return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
      }
     
   };//prototype
   
   var cale = new Calendar("idCalendar", {
      onSelectDay : function(o){
         o.className = "onSelect";
         alert(thisArea);
      },
      onToday : function(o){
         o.className = "onToday";
      },
      onFinish : function(){
         $("idCalendarYear").innerHTML = this.Year;
         $("idCalendarMonth").innerHTML = this.Month;
         for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate();  i <= monthDay; i ++ ){
            this.Days[i].innerHTML = "<a class=\"day\" onclick=\"document.getElementById(\'currentArea\').value=\'" + this.Year + "-" + this.Month + "-" + i + "\'; \">" + i + "</a>";
         }
      }
   });

   $("idCalendarPre").onclick = function(){
      cale.PreMonth();
   }
   $("idCalendarNext").onclick = function(){
      cale.NextMonth();
   }
   
	showCalendar(thisArea);
		
    try{
        document.getElementById("currentArea").id="getday";
    }catch(Exception){
        thisArea.id = "currentArea";
    }

   thisArea.id = "currentArea";
}

//------------------------------
function hideCalendar(){
	document.getElementById("Calendar").style.display = "none";
	document.getElementById("currentArea").id = "getday";
}
function getToday(){
   var month = parseInt((new Date()).getMonth()) + 1;
   var day = parseInt((new Date()).getDate());
   document.getElementById("currentArea").value =new Date().getFullYear() + "-" + month + "-" + day;
}