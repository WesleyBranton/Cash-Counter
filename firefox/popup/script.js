/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const UI = {
    rows: document.getElementsByClassName('cash-row'),
    table: document.getElementById('cash-table'),
    total: document.getElementById('grand-total'),
    buttons: {
        clear: document.getElementById('clear'),
        print: document.getElementById('print'),
        options: document.getElementById('options')
    }
};
const cash = getUI();
let storage = {};
let canSave = false;

browser.storage.local.get().then(load);

UI.table.addEventListener('change', update);
UI.buttons.clear.addEventListener('click', clear);
UI.buttons.print.addEventListener('click', print);
UI.buttons.options.addEventListener('click', openOptions);

/**
 * Get cash data
 * @returns Cash data object
 */
function getUI() {
    let c = {};
    for (row of UI.rows) {
        // Create template object
        const tmp = {
            face: null,
            input: null,
            subtotal: {
                value: 0,
                output: null
            },
            roll: {
                container: null,
                progress: null,
                count: 0,
                limit: 0
            }
        };

        tmp.face = parseFloat(row.getElementsByClassName('value')[0].textContent.trim());
        tmp.input = row.getElementsByTagName('input')[0];
        tmp.subtotal.output = row.getElementsByClassName('subtotal')[0];
        
        // Add coin roll (if possible)
        let roll = row.getElementsByClassName('roll');
        if (roll.length == 1) {
            tmp.roll.container = roll[0];
            tmp.roll.progress = tmp.roll.container.children[0];
        } else {
            tmp.roll = null;
        }

        c[row.id] = tmp;
    }

    return c;
}

/**
 * Load data from the storage API
 * @param {Object} data 
 */
function load(data) {
    // Load data
    storage = loadDefaults(data);
    fill();
    canSave = true;

    // Show/hide coin rolls
    if (!storage.setting.displayroll) {
        UI.table.classList.add('hide-rolls');
    } else {
        UI.table.classList.remove('hide-rolls');
    }

    // Show/hide coin rolls for $1 and $2
    if (!storage.setting.show12coin) {
        UI.table.classList.add('hide-12-rolls');
    } else {
        UI.table.classList.remove('hide-12-rolls');
    }

    // Update currency symbol
    document.documentElement.style.setProperty('--currency-symbol', '"' + storage.setting.currency + '"');
}

/**
 * Fill count from storage API into table
 */
function fill() {
    const keys = Object.keys(storage.count);
    for (k of keys) {
        cash[k].input.value = storage.count[k];
    }

    update();
}

/**
 * Save data to storage API
 */
function save() {
    if (!canSave) return;
    browser.storage.local.set(storage);
}

/**
 * Update the UI
 */
function update() {
    let total = 0;

    // Update each cash row
    for (row of UI.rows) {
        const data = cash[row.id];
        storage.count[row.id] = parseInt(data.input.value);
        data.subtotal.value = data.face * storage.count[row.id];
        data.subtotal.output.textContent = data.subtotal.value.toFixed(2);
        total += data.subtotal.value;

        // Update coin roll progress (if necessary)
        if (data.roll != null) {
            const percent = data.subtotal.value / storage.roll[row.id] * 100;
            data.roll.progress.style.width = percent + '%';
        }
    }

    UI.total.textContent = total.toFixed(2);

    save();
}

/**
 * Reset all counters
 */
function clear() {
    storage.count = defaults.count;
    fill();
}

/**
 * Print page
 */
function print() {
    // Collects date & time data
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();

    // Adds leading 0 to minutes (if necessary)
    if (minute < 10) {
        minute = '0' + minute;
    }

    // Converts month to word format
    var monthList = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    month = monthList[month];

    // Complies full date/time formats
    var fullDate = month + ' ' + day + ', ' + year;
    var fullTime = hour + ':' + minute;

    // Added date & time to receipt
    document.title = 'Cash Counter Receipt - ' + fullDate + ' @ ' + fullTime;
    document.getElementById('printDate').textContent = fullDate;
    document.getElementById('printTime').textContent = fullTime;

    // Removes arrows from input boxes
    var inputBox = document.getElementsByTagName('input');
    for (i = 0; i < inputBox.length; i++) {
        inputBox[i].type = 'text';
    }

    // Opens print dialog
    window.print();

    // Restores arrows on input boxes
    for (i = 0; i < inputBox.length; i++) {
        inputBox[i].type = 'number';
    }
}

/**
 * Open options UI
 */
function openOptions() {
    browser.runtime.openOptionsPage();
}