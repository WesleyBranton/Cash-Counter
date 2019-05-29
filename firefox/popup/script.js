browser.storage.local.get('setting',startup);
document.getElementsByTagName('table')[0].addEventListener('change',calculate);
browser.storage.local.get("count", load);
document.getElementById('clear').addEventListener('click',clear);
document.getElementById('print').addEventListener('click',printReceipt);
document.getElementById('options').addEventListener('click',options);

function calculate() {
	// Declared Variables
	var faceValue = document.getElementsByClassName('faceValue');
	var quantity = document.getElementsByTagName('input');
	var subTotal = document.getElementsByClassName('subTotal');
	var coinroll = document.getElementsByClassName('coinroll');
	var coinbar = document.getElementsByClassName('progressBar');
	var grandTotal = document.getElementById('grandTotal');
	var cashTypes = quantity.length;
	var runningTotal = 0;

	// Calculates Sub Totals
	for (i = 0; i < cashTypes; i++) {
		var currentFaceValue = parseFloat(faceValue[i].textContent);
		var currentQuantity = parseFloat(quantity[i].value);
		currentQuantity = Math.round(currentQuantity);
		quantity[i].value = currentQuantity;
		// Prevents NaN
		if (isNaN(currentQuantity)) {
			quantity[i].value = 0;
			currentQuantity = 0;
		}
		var currentSubTotal = currentFaceValue * currentQuantity;
		subTotal[i].textContent = currentSubTotal.toFixed(2);
		browser.storage.local.get('roll', loadRolls);
	}

	// Calculates Grand Total
	for (i = 0; i < cashTypes; i++) {
		runningTotal += parseFloat(subTotal[i].textContent);
	}
	grandTotal.textContent = runningTotal.toFixed(2);
	save();
}

function save() {
	// Declares Input Counters
	var quantity = document.getElementsByTagName('input');
	
	// Saves Active Count To Local Storage
	browser.storage.local.set({
		count: {
			d00001: quantity[0].value,
			d00005: quantity[1].value,
			d00010: quantity[2].value,
			d00025: quantity[3].value,
			d00100: quantity[4].value,
			d00200: quantity[5].value,
			d00500: quantity[6].value,
			d01000: quantity[7].value,
			d02000: quantity[8].value,
			d05000: quantity[9].value,
			d10000: quantity[10].value
		}
	});
}

function load(item) {
	// Declares Input Counters
	var inputBox = document.getElementsByTagName('input');
	
	// Loads Previous Values
	inputBox[0].value = item.count.d00001;
	inputBox[1].value = item.count.d00005;
	inputBox[2].value = item.count.d00010;
	inputBox[3].value = item.count.d00025;
	inputBox[4].value = item.count.d00100;
	inputBox[5].value = item.count.d00200;
	inputBox[6].value = item.count.d00500;
	inputBox[7].value = item.count.d01000;
	inputBox[8].value = item.count.d02000;
	inputBox[9].value = item.count.d05000;
	inputBox[10].value = item.count.d10000;
	
	// Calculates Count
	calculate();
}

function loadRolls(item) {
	// Declares Variables
	var subTotal = document.getElementsByClassName('subTotal');
	var coinbar = document.getElementsByClassName('progressBar');
	var crset = [item.roll.d00001,item.roll.d00005,item.roll.d00010,item.roll.d00025,item.roll.d00100,item.roll.d00200];
	
	// Sets Coin Roll Progress Bar
	for (i = 0; i < coinbar.length; i++) {
		coinbar[i].style.backgroundSize = parseFloat(subTotal[i].textContent) / crset[i] *100 + '% 100%';
	}
}

function clear() {
	// Declares Input Counters
	var inputBox = document.getElementsByTagName('input');
	
	// Zeros All Counters
	for (i = 0; i < inputBox.length; i++) {
		inputBox[i].value = '0';
	}
	
	// Calculates Count
	calculate();
}

function startup(item) {
	// Hides $1 & $2 Coin Roller Progress Bars
	if (!item.setting.set12coin) {
		document.getElementsByName('d00100')[0].style.display = 'none';
		document.getElementsByName('d00200')[0].style.display = 'none';
	}
	
	// Hides All Coin Roller Progress Bars
	if (!item.setting.displayroll) {
		var coinroll = document.getElementsByClassName('coinroll');
		for (i = 0; i < coinroll.length; i++) {
			coinroll[i].style.display = 'none';
		}
	}
}

function options() {
	// Opens Addon Options
	chrome.runtime.openOptionsPage();
}

function printReceipt() {
	// Collects Date & Time Data
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	
	// Adds Leading 0 To Minutes (If Necessary)
	if (minute < 10) {
		minute = '0' + minute;
	}
	
	// Converts Month To Word Format
	var monthList = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	month = monthList[month];
	
	// Complies Full Date/Time Formats
	var fullDate = month + ' ' + day + ', ' + year;
	var fullTime = hour + ':' + minute;

	// Added Date & Time To Receipt
	document.title = 'Cash Counter Receipt - ' + fullDate + ' @ ' + fullTime;
	document.getElementById('printDate').textContent = fullDate;
	document.getElementById('printTime').textContent = fullTime;

	// Removes Arrows From Input Boxes
	var inputBox = document.getElementsByTagName('input');
	for (i = 0; i < inputBox.length; i++) {
		inputBox[i].type = 'text';
	}
	
	// Opens Print Dialog
	window.print();
	
	// Restores Arrows On Input Boxes
	for (i = 0; i < inputBox.length; i++) {
		inputBox[i].type = 'number';
	}
}