/**
 * calendar组件
 * Version: 0.9
 * Author: jianling <jianling@github.com>
 * Require: jQuery 1.7.1
 */

//TODO: 正常的日历一次显示5周，Windows系统日历显示6周

/**
 * calendar
 * @class
 * @name calendar
 * @grammar new calendar()
 * @param {$|String|HTMLElement} el 触发calendar的元素
 * @param {Object} options 配置参数
 * @config {$|String|HTMLElement} container calendar的容器
 * @config {Array} monthNames 用于显示月份的名字，默认为['January','February','March','April','May','June','July','August','September','October','November','December']
 * @config {Array} monthNamesShort 用于显示月份的短名字，默认为['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
 * @config {Array} dayNames 用于显示一周内每一天的名字，默认为["一","二","三","四","五","六","七"]
 * @config {Boolean} changeYear 是否可以选择年份
 * @config {Boolean} changeMonth 是否可以选择月份
 * @config {String} dateFormat 选中日期后返回的日期格式
 * @config {Date} defaultDate 默认选择的日期
 * @config {Boolean} showToday 是否高亮当前日期
 * @config {Integer} firstDayOfWeek 每周的第一天，默认为周日
 * @config {Date} maxDate 可选择的最大日期
 * @config {Date} minDate 可选择的最小日期
 * @config {Array} offset 相对于attach元素的偏移量
 * @config {Boolean} showMuiltMonth 是否同时显示两个月
 * @config {Boolean} showPreMonthDate 在当前月份的日历面板中显示上个月的日期
 * @config {Boolean} showNextMonthDate 在当前月份的日历面板中显示下个月的日期
 */
function calendar(el, options){

	this.options = {
		"monthNames": ['January','February','March','April','May','June','July','August','September','October','November','December']
		,"monthNamesShort": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		,"dayNames": ["一","二","三","四","五","六","七"]
		,"changeYear": false
		,"changeMonth": false
		,"dateFormat": "YYYY-MM-DD"
		,"defaultDate": new Date()
		,"showToday": true
		,"firstDayOfWeek": 0
		,"maxDate": new Date()
		,"minDate": new Date()
		,"offset": [0, 0]
		,"showMuiltMonth": false
		,"showPreMonthDate": true
		,"showNextMonthDate": true

	}

	$.extend(this.options, options);

}
calendar.prototype = 
/** @lends calendar.prototype */
{
	disable: function(){

	}

	,enable: function(){

	}

	,show: function(){

	}

	,hide: function(){

	}

	,attach: function(){

	}

	,getSelectedDate: function(){

	}

	,setSelectedDate: function(){

	}

	,nextMonth: function(){

	}

	,preMonth: function(){

	}

	,gotoYear: function(){

	}

	,gotoMonth: function(){

	}

	,adjustPosition: function(){

	}

	/**
	* 显示上一个月的补充日期
	* @public
	*/
	,showPreMonthDate: function(){
		$("#calendar .calendar-premonth-day").show();
	}

	/**
	* 隐藏上一个月的补充日期
	* @public
	*/
	,hidePreMonthDate: function(){
		$("#calendar .calendar-premonth-day").hide();
	}

	/**
	* 显示下一个月的补充日期
	* @public
	*/
	,showNextMonthDate: function(){
		$("#calendar .calendar-nextmonth-day").show();
	}

	/**
	* 隐藏下一个月的补充日期
	* @public
	*/
	,hideNextMonthDate: function(){
		$("#calendar .calendar-nextmonth-day").hide();
	}

	/**
	* 获取某个月份每一天对应的dayName
	* @public
	* @param {Number} year 年份
	* @param {Number} month 月份，从0开始计算
	* @return {Array} 包含该月份每一天对象的数组（根据配置参数，可能还包含上个月和下个月的补充日期），每一天是一个对象，有四个属性：year、month（从零开始计算）、date、day
	*/
	,getDaysOfMonth: function(year, month){
		var me = this,
			date = new Date(year, month),
			daynames = [],
			totalDays = me.getMonthsOfYear(year)[month],
			i = 0;

		for(; i<totalDays; i++){
			daynames.push({
				"year": year
				,"month": month
				,"date": date.getDate()
				,"day": date.getDay()
			});
			date.setDate(date.getDate() + 1);
		}

		//补上最后一周包含的下个月的几天
		if(me.options.showNextMonthDate){
			var daysOfNextMon = 6 + me.options.firstDayOfWeek - daynames[daynames.length - 1]["day"];

			i = 0;

			for(; i<daysOfNextMon; i++){
				daynames.push({
					"year": date.getFullYear()
					,"month": date.getMonth()
					,"date": date.getDate()
					,"day": date.getDay()
				});
				date.setDate(date.getDate() + 1);
			}
		}

		//补上第一周包含的上个月的几天
		if(me.options.showPreMonthDate){
			var daysOfPreMon = daynames[0]["day"] - me.options.firstDayOfWeek;

			date = new Date(year, month);
			i = 0;

			for(; i<daysOfPreMon; i++){
				date.setDate(date.getDate() - 1);
				daynames.unshift({
					"year": date.getFullYear()
					,"month": date.getMonth()
					,"date": date.getDate()
					,"day": date.getDay()
				});
			}
		}


		return daynames;
	}

	/**
	* 获取某个年份每个月天数的列表
	* @public
	* @param {Number} year 年份
	* @return {Array} 每个月天数的列表，例如[31,28,31,30,31,30,31,31,30,31,30,31]
	*/
	,getMonthsOfYear: function(year){
		if(!year){
			var year = new Date().getYear();
		}
		if( (year%4 == 0 && year%100 != 0) || year%400 == 0 )
			return [31,29,31,30,31,30,31,31,30,31,30,31];
		else
			return [31,28,31,30,31,30,31,31,30,31,30,31];
	}

	,distory: function(){

	}
};