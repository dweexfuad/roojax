

//DOM strings helper
const DOMstrings = {
	divCal: 'cal',
	divCalQ: '#cal',
	monthLabel: 'label',
	btnPrev: 'prev',
	btnNext: 'next',
	sunLabel: 'eformSun',
	monLabel: 'eformMon',
	tueLabel: 'eformTue',
	wedLabel: 'eformWed',
	thuLabel: 'eformThu',
	friLabel: 'eformFri',
	satLabel: 'eformSat',
	tdDay: '.eformDay'
}
window.control_datePickerForm = function(owner){
    if (owner){
        window.control_datePickerForm.prototype.parent.constructor.call(this, owner);
		this.className = "control_datePickerForm";
        this.width = 140;
        this.height = 132;
        this.onSelect = new control_eventHandler();        
        this.monthName = [];
        this.monthName["01"] = "January";
        this.monthName["02"] = "Febuary";
        this.monthName["03"] = "March";
        this.monthName["04"] = "April";
        this.monthName["05"] = "May";
        this.monthName["06"] = "June";
        this.monthName["07"] = "July";
        this.monthName["08"] = "Augustus";
        this.monthName["09"] = "Sepember";
        this.monthName["10"] = "October";
        this.monthName["11"] = "November";
		this.monthName["12"] = "December";
		let wrap, label, calYear, calMonth, calDateFormat, firstDay, isIE11;

		this.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

		//check global variables for calendar widget and set default localization values
		this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		this.shortDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
		this.firstDayCombinations = [
			[0, 1, 2, 3, 4, 5, 6],
			[1, 2, 3, 4, 5, 6, 0],
			[2, 3, 4, 5, 6, 0, 1],
			[3, 4, 5, 6, 0, 1, 2],
			[4, 5, 6, 0, 1, 2, 3],
			[5, 6, 0, 1, 2, 3, 4],
			[6, 0, 1, 2, 3, 4, 5]
		];
		//first day of week combinations array
		
		var minDate = "01-01-2016";
		var maxDate = "31-12-2022";
		var dateFormat = "dd/MM/yyyy";
		this.eFormMinimalDate = this.DateParse(minDate);
        this.eFormMaximalDate = this.DateParse(maxDate);
		//this.eFormCalendarElement = element;
		var firstDayOfWeek = 1;
		this.firstDay = firstDayOfWeek;
		this.createCalendar = {cache : {} };
        //create html and push it into DOM
        
		
		this.calDateFormat = dateFormat;
        this.wrap = document.getElementById(this.getFullId() + "_" + DOMstrings.divCal);
        this.label = document.getElementById(this.getFullId() + "_" + DOMstrings.monthLabel);

        //register events
        document.getElementById(this.getFullId() + "_" + DOMstrings.btnPrev).addEventListener('click', () => { this.switchMonth(false); });
        document.getElementById(this.getFullId() + "_" + DOMstrings.btnNext).addEventListener('click', () => { this.switchMonth(true); });
        this.label.addEventListener('click', () => { this.switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });

        //shorter day version labels
        const dayCombination = this.firstDayCombinations[firstDayOfWeek];

        document.getElementById(this.getFullId() + "_" + DOMstrings.sunLabel).textContent = this.shortDays[dayCombination[0]];
        document.getElementById(this.getFullId() + "_" + DOMstrings.monLabel).textContent = this.shortDays[dayCombination[1]];
        document.getElementById(this.getFullId() + "_" + DOMstrings.tueLabel).textContent = this.shortDays[dayCombination[2]];
        document.getElementById(this.getFullId() + "_" + DOMstrings.wedLabel).textContent = this.shortDays[dayCombination[3]];
        document.getElementById(this.getFullId() + "_" + DOMstrings.thuLabel).textContent = this.shortDays[dayCombination[4]];
        document.getElementById(this.getFullId() + "_" + DOMstrings.friLabel).textContent = this.shortDays[dayCombination[5]];
        document.getElementById(this.getFullId() + "_" + DOMstrings.satLabel).textContent = this.shortDays[dayCombination[6]];

        //fire inicialization event trigger
		this.label.click();
		
    }
};
window.control_datePickerForm.extend(window.control_commonForm);
window.datePickerForm = window.control_datePickerForm;
//---------------------------- Function ----------------------------------------
window.control_datePickerForm.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    var r = this.resourceId;
		var t = window.system.getName();
		canvas.css({width:240, height:240,  display : "none",zIndex :999999});

	    // canvas.style.width = "140";
	    // canvas.style.height = "132";
	    // canvas.style.background = "#FFFFFF";
	    // canvas.style.display = "none";
	    // canvas.style.zIndex = "999999";

	   var left = 0;
		
		var html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' >"+
					'<div id="' + n + '_cal" class="cal" style="position:absolute;top:0px;left:0px;z-index:1;">'+
					'<div class="header"><span class="left button" id="' + n + '_prev"> &lang; </span><span class="left hook"></span><span class="month-year" id="' + n + '_label"> Calendar </span><span class="right hook"></span><span class="right button" id="' + n + '_next"> &rang; </span></div >'+
					'<table id="' + n + '_days" class="days"><tr><td id="' + n + '_eformSun">sun</td><td id="' + n + '_eformMon">mon</td><td id="' + n + '_eformTue">tue</td><td id="' + n + '_eformWed">wed</td><td id="' + n + '_eformThu">thu</td><td id="' + n + '_eformFri">fri</td><td id="' + n + '_eformSat">sat</td></tr></table>'+
					'<div id="' + n + '_cal_frame" class="cal_frame"><table class="curr"><tbody></tbody></table></div></div >'
					+"</div>";
	    this.setInnerHTML(html, canvas);
		
	},
	switchMonth: function(next, month, year) {
        var curr = this.label.textContent.trim().split(' '), calendar, tempYear = parseInt(curr[1], 10);
        month = month || ((next) ? ((curr[0] === this.months[11]) ? 0 : this.months.indexOf(curr[0]) + 1) : ((curr[0] === this.months[0]) ? 11 : this.months.indexOf(curr[0]) - 1));
        if (!year) {
            if (next && month === 0) {
                year = tempYear + 1;
            } else if (!next && month === 11) {
                year = tempYear - 1;
            } else {
                year = tempYear;
            }
        }

        //set month and year for widget scope
        this.calMonth = month + 1;
        this.calYear = year;

        calendar = this.createCal(year, month);

        var curr = document.querySelector('.curr')
        curr.innerHTML = '';
		curr.appendChild(calendar.calendar());
		$(".eformDay").click((e) => {
			console.log($(e.target).html());
			var element = e.target;
			this.year = this.calYear;
			this.month = this.calMonth;
			const dateResult = DateToString(new Date(this.calYear, this.calMonth-1, parseInt(element.innerHTML)), this.calDateFormat);
			console.log(dateResult);
			var day = parseFloat($(e.target).html());
			this.onSelect.call(this, this.calYear, this.calMonth, day, dateResult);
			this.setSelectedDate(this.calYear, this.calMonth, day, dateResult);
			this.close();
		});


		//disable days below minimal date
		
        if (this.eFormMinimalDate !== undefined) {
			
            if (year < this.eFormMinimalDate.year || year <= this.eFormMinimalDate.year && month <= this.eFormMinimalDate.month - 1) {
                const emptyCount = document.querySelector('.curr table').rows[0].querySelectorAll('td:empty').length;
				const tdDisabled = document.querySelectorAll('.eformDay');
				
                for (var i = 0; i < tdDisabled.length; ++i) {
                    if (i - emptyCount + 1 < this.eFormMinimalDate.day || month < this.eFormMinimalDate.month - 1 || year < this.eFormMinimalDate.year) {
                        tdDisabled[i].classList.add('eformDayDisabled');
                        tdDisabled[i].onclick = function () {
                            return false;
                        }
                    }
                }
            }
        }

        //disable days above maximal date
        if (this.eFormMaximalDate !== undefined) {
			
            if (year > this.eFormMinimalDate.year || year >= this.eFormMaximalDate.year && month >= this.eFormMaximalDate.month - 1) {
                const emptyCount = document.querySelector('.curr table').rows[0].querySelectorAll('td:empty').length;
                const tdDisabled = document.querySelectorAll('.eformDay');
                for (var i = 0; i < tdDisabled.length; ++i) {
                    if (i - emptyCount + 1 > this.eFormMaximalDate.day || month > this.eFormMaximalDate.month - 1 || year > this.eFormMaximalDate.year) {
                        tdDisabled[i].classList.add('eformDayDisabled');
                        tdDisabled[i].onclick = function () {
                            return false;
                        }
                    }
                }
            }
        }

        this.label.textContent = calendar.label;
    },
	createCal: function(year, month) {
        var day = 1, i, j, haveDays = true,
            startDay = new Date(year, month, day).getDay(),
            daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            calendar = [];

        startDay -= this.firstDay;
        if (startDay < 0) {
            startDay = 7 + startDay;
        }

        if (this.createCalendar.cache[year] && !this.isIE11) {
            if (this.createCalendar.cache[year][month]) {
                return this.createCalendar.cache[year][month];
            }
        } else {
            this.createCalendar.cache[year] = {};
        }

        i = 0;
        while (haveDays) {
            calendar[i] = [];
            for (j = 0; j < 7; j++) {
                if (i === 0) {
                    if (j === startDay) {
                        calendar[i][j] = day++;
                        startDay++;
                    }
                } else if (day <= daysInMonths[month]) {
                    calendar[i][j] = day++;
                } else {
                    calendar[i][j] = '';
                    haveDays = false;
                }
                if (day > daysInMonths[month]) {
                    haveDays = false;
                }
            }
            i++;
        }

        ////6th week of month fix IF NEEDED
        //if (calendar[5]) {
        //    for (i = 0; i < calendar[5].length; i++) {
        //        if (calendar[5][i] !== '') {
        //            calendar[4][i] = '<span>' + calendar[4][i] + '</span><span>' + calendar[5][i] + '</span>';
        //        }
        //    }
        //    calendar = calendar.slice(0, 5);
        //}

        for (i = 0; i < calendar.length; i++) {
            calendar[i] = '<tr><td class="eformDay" >' + calendar[i].join('</td><td class="eformDay" >') + '</td></tr>';
        }
        const calendarInnerHtml = calendar.join('');
        calendar = document.createElement('table', { class: 'curr' });
        calendar.innerHTML = calendarInnerHtml;
        const tdEmty = calendar.querySelectorAll('td:empty');
        for (var i = 0; i < tdEmty.length; ++i) {
            tdEmty[i].classList.add('nil');
		}
		
        if (month === new Date().getMonth()) {
            const calTd = calendar.querySelectorAll('td');
            const calTdArray = Array.prototype.slice.call(calTd); 
            calTdArray.forEach(function (current, index, array) {
				
                if (current.innerHTML === new Date().getDate().toString()) {
					
                    current.classList.add('today');
                }
            });
        }
		
        this.createCalendar.cache[year][month] = { calendar: function () { return calendar }, label: this.months[month] + ' ' + year };//calendar.clone()

        return this.createCalendar.cache[year][month];
	},
	
	DateParse: function(date) {
        let parsedDate, newDate;
        const currentDate = date;
        if (currentDate != null) {
            splitedDate = currentDate.split('-');
            newDate = { year: splitedDate[0], month: splitedDate[1], day: splitedDate[2] };
        }
        return newDate;
    },
	show: function(){
		window.control_datePickerForm.prototype.parent.show.call(this);
	    var dt = new Date();

	    this.todayDay = dt.getDate();
	    this.todayMonth = dt.getMonth() + 1;
	    this.todayYear = dt.getFullYear();
	    
	    this.month = this.selectedMonth;
	    this.year = this.selectedYear;
	    
	    //this.rearrange();       
	},
	// rearrange: function(){
	// 	try{
	// 	    var dt = new Date(this.year, this.month-1, 1);
	// 	    this.startPos = dt.getDay();

	// 	    if (this.startPos == 0)
	// 	        this.startPos = 7;

	// 	    var obj;
	// 	    var strMonth = dt.getMonth();
	// 	    var n = this.getFullId();

	// 	    i = 1;
	// 	    if (this.month < 10)
	// 	        $(n + "_caption").innerHTML = this.monthName["0" + this.month] + " " + this.year;
	// 	    else
	// 	        $(n + "_caption").innerHTML = this.monthName[this.month] + " " + this.year;

	// 	    while(i < this.startPos)
	// 	    {
	// 	        obj = $(n + "_" + i);
	// 	        obj.innerHTML = "";		
	// 	        obj.style.cursor = "default";
	// 	        obj.style.backgroundColor = "#FFFFFF";
	// 	        i++;
	// 	    }

	// 	    var cont = true;
	// 	    var change = false;

	// 	    while(cont)
	// 	    {
	// 	        obj = $(n + "_" + i);
	// 	        obj.innerHTML = dt.getDate();
	// 	        obj.style.cursor = "pointer";
	// 			obj.style.width = 17;
	// 	        if ((dt.getDate() == this.todayDay) && (this.year == this.todayYear) && (this.month == this.todayMonth))
	// 	        {
	// 	            obj.style.backgroundColor="#b7b50c";
	// 	            change = true;
	// 	        }

	// 	        if ((dt.getDate() == this.selectedDay) && (this.year == this.selectedYear) && (this.month == this.selectedMonth))
	// 	        {
	// 	            obj.style.backgroundColor ="#40abc6";
	// 	            change = true;
	// 	        }

	// 	        if (!change)
	// 	            obj.style.backgroundColor = "";

	// 	        if ((i%7) == 0)
	// 	            obj.style.color = "red";
	// 	        else
	// 	            obj.style.color = "black";

	// 	        dt.setTime(dt.getTime() + 86400000);

	// 	        if (dt.getMonth() != strMonth)
	// 	        {
	// 	            cont = false;
	// 	        }

	// 	        i++;
	// 	        change = false;
	// 	    }

	// 	    this.stopPos = i-1;

	// 	    while (i <= 37)
	// 	    {
	// 	        obj = $(n + "_" + i);
	// 	        obj.innerHTML = "";
	// 	        obj.style.cursor = "default";
	// 	        obj.style.backgroundColor = "";
	// 	        i++;
	// 	    }
	// 	}
	// 	catch (e){
	// 		    alert("[datePicker] :: rearrange: " + e);
	// 	}
	// },
	doClick: function(button){	
		try{
			if ((button >= this.startPos) && (button <= this.stopPos)){
				var day = button - this.startPos + 1;        
				this.onSelect.call(this, this.year, this.month, day);
				this.setSelectedDate(this.year, this.month, day);
			}
			this.close();
		}catch(e){
			systemAPI.alert(this+"$doClick()",e);
		}
	},
	doDblClick: function(button){	
		try{		
			this.close();
						
		}catch(e){
			systemAPI.alert(this+"$doDblClick()",e);
		}
	},
	doButtonMouseOver: function(event, id){
	    var htmlObj = $(this.getFullId() + "_" + id);
	    htmlObj.style.backgroundPosition = "center left";
	},
	doButtonMouseDown: function(event, id){
	    var htmlObj = $(this.getFullId() + "_" + id);
	    htmlObj.style.backgroundPosition = "bottom left";
	},
	doButtonMouseOut: function(event, id){
	    var htmlObj = $(this.getFullId() + "_" + id);
	    htmlObj.style.backgroundPosition = "top left";
	},
	doButtonClick: function(event, button){
	    if (button == "prev"){
	        if (this.month > 1)
	            this.setMonth(this.month-1);
	        else{
	            this.setMonth(12);
	            this.setYear(this.year - 1);
	        }
	    }
	    else{
	        if (this.month < 12)
	            this.setMonth(this.month + 1);
	        else{
	            this.setMonth(1);
	            this.setYear(this.year + 1);
	        }
	    }
	},
	doDeactivate: function(){
		window.control_datePickerForm.prototype.parent.doDeactivate.call(this);
	},
	setDate: function(yy, mm, dd){
	    this.year = yy;
	    this.month = mm;
	    this.day = dd;
	},
	setSelectedDate: function(year, month, day){
	    this.selectedDay = day;
	    this.selectedMonth = month;
	    this.selectedYear = year;
		this.year = year;
	    this.month = month;
	    this.day = day;
		///this.rearrange();
	},
	getMonth: function(){
		return this.month;
	},
	setMonth: function(data){
	    this.month = data;
	    //this.rearrange();
	},
	getYear: function(){
		return this.year;
	},
	setYear: function(data){
	    this.year = data;
	    //this.rearrange();
	}
});
function joinObj(obj, seperator) {
	var out = [];
	for (k in obj) {
		out.push(k);
	}
	return out.join(seperator);
}
function DateToString(inDate, formatString) {
	var dateObject = {
		M: inDate.getMonth() + 1,
		d: inDate.getDate(),
		D: inDate.getDate(),
		h: inDate.getHours(),
		m: inDate.getMinutes(),
		s: inDate.getSeconds(),
		y: inDate.getFullYear(),
		Y: inDate.getFullYear()
	};
	// Build Regex Dynamically based on the list above.
	// Should end up with something like this "/([Yy]+|M+|[Dd]+|h+|m+|s+)/g"
	var dateMatchRegex = joinObj(dateObject, "+|") + "+";
	var regEx = new RegExp(dateMatchRegex, "g");
	formatString = formatString.replace(regEx, function (formatToken) {
		var datePartValue = dateObject[formatToken.slice(-1)];
		var tokenLength = formatToken.length;

		// A conflict exists between specifying 'd' for no zero pad -> expand to '10' and specifying yy for just two year digits '01' instead of '2001'.  One expands, the other contracts.
		// so Constrict Years but Expand All Else
		if (formatToken.indexOf('y') < 0 && formatToken.indexOf('Y') < 0) {
			// Expand single digit format token 'd' to multi digit value '10' when needed
			var tokenLength = Math.max(formatToken.length, datePartValue.toString().length);
		}
		var zeroPad;
		try {
			zeroPad = (datePartValue.toString().length < formatToken.length ? "0".repeat(tokenLength) : "");
		} catch (ex) {//IE11 repeat catched
			zeroPad = (datePartValue.toString().length < formatToken.length ? repeatStringNumTimes("0", tokenLength) : "");
		}
		return (zeroPad + datePartValue).slice(-tokenLength);
	});

	return formatString;
}
Date.prototype.ToString = function (formatStr) { return DateToString(this.toDateString(), formatStr); }