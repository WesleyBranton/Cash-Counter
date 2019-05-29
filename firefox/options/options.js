function saveOptions() {
	// Declared Variables
	var showroll = document.getElementById('showroll');
	var show12coin = document.getElementById('show12coin');
	var optd00001 = document.getElementById('d00001');
	var optd00005 = document.getElementById('d00005');
	var optd00010 = document.getElementById('d00010');
	var optd00025 = document.getElementById('d00025');
	var optd00100 = document.getElementById('d00100');
	var optd00200 = document.getElementById('d00200');
	var rollvalues = document.getElementsByClassName('rollvalues');

	// Checks Valid Input
	for (i = 0; i < rollvalues.length; i++) {
		if(isNaN(parseInt(rollvalues[i].value)) || rollvalues[i].value < -1) {
		rollvalues[i].value = 1;
		}
	}
	// Saves Settings To Local Storage
	browser.storage.local.set({
		setting: {
			displayroll: showroll.checked,
			set12coin: show12coin.checked
		}
	});
	browser.storage.local.set({
		roll: {
			d00001: parseInt(optd00001.value)*0.01,
			d00005: parseInt(optd00005.value)*0.05,
			d00010: parseInt(optd00010.value)*0.1,
			d00025: parseInt(optd00025.value)*0.25,
			d00100: parseInt(optd00100.value)*1,
			d00200: parseInt(optd00200.value)*2
		}
	});
	setActive();
}

function restoreOptions() {
	// Loads & Outputs Saved Settings
	browser.storage.local.get('setting', (res) => {
		var showroll = document.getElementById('showroll');
		var show12coin = document.getElementById('show12coin');
		showroll.checked = res.setting.displayroll;
		show12coin.checked = res.setting.set12coin;
	});
	browser.storage.local.get('roll', (res) => {
		var optd00001 = document.getElementById('d00001');
		var optd00005 = document.getElementById('d00005');
		var optd00010 = document.getElementById('d00010');
		var optd00025 = document.getElementById('d00025');
		var optd00100 = document.getElementById('d00100');
		var optd00200 = document.getElementById('d00200');
		optd00001.value = res.roll.d00001 / 0.01;
		optd00005.value = res.roll.d00005 / 0.05;
		optd00010.value = res.roll.d00010 / 0.1;
		optd00025.value = res.roll.d00025 / 0.25;
		optd00100.value = res.roll.d00100;
		optd00200.value = res.roll.d00200 / 2;
		setActive();
	});
}

function setActive() {
	if (document.getElementById('showroll').checked) {
		document.getElementById('rollset').style.display = 'block';
	} else {
		document.getElementById('rollset').style.display = 'none';
	}
	if (document.getElementById('show12coin').checked) {
		document.getElementById('coin12options').style.display = 'block';
	} else {
		document.getElementById('coin12options').style.display = 'none';
	}
}

restoreOptions();
document.querySelector("form").addEventListener("change", saveOptions);