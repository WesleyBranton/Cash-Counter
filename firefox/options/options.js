/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function save() {
    browser.storage.local.set({
        setting: {
            currency: document.settings.symbol.value.trim(),
            displayroll: document.settings.displayroll.value == 'yes',
            show12coin: document.settings.show12coin.value == 'yes'
        },
        roll: {
            d00001: parseInt(document.settings.d00001.value) * 0.01,
            d00005: parseInt(document.settings.d00005.value) * 0.05,
            d00010: parseInt(document.settings.d00010.value) * 0.10,
            d00025: parseInt(document.settings.d00025.value) * 0.25,
            d00100: parseInt(document.settings.d00100.value) * 1,
            d00200: parseInt(document.settings.d00200.value) * 2
        }
    });

    updateUI();
}

function restore(data) {
    data = loadDefaults(data);

    // Load settings
    document.settings.symbol.value = data.setting.currency;
    document.settings.displayroll.value = (data.setting.displayroll) ? 'yes' : 'no';
    document.settings.show12coin.value = (data.setting.show12coin) ? 'yes' : 'no';

    // Load coin roll settings
    document.settings.d00001.value = data.roll.d00001 / 0.01;
    document.settings.d00005.value = data.roll.d00005 / 0.05;
    document.settings.d00010.value = data.roll.d00010 / 0.10;
    document.settings.d00025.value = data.roll.d00025 / 0.25;
    document.settings.d00100.value = data.roll.d00100;
    document.settings.d00200.value = data.roll.d00200 / 2;

    updateUI();
}

function updateUI() {
    // Hide coin roll counters
    if (document.settings.displayroll.value == 'yes') {
        document.settings.classList.add('displayroll_enabled');
    } else {
        document.settings.classList.remove('displayroll_enabled');
    }

    // Show $1 and $2 coin roll counters
    if (document.settings.show12coin.value == 'yes') {
        document.settings.classList.add('show12coin_enabled');
    } else {
        document.settings.classList.remove('show12coin_enabled');
    }

    // Update currency symbol
    document.documentElement.style.setProperty('--currency-symbol', '"' + document.settings.symbol.value.trim() + '"');
}

browser.storage.local.get().then(restore);
document.settings.addEventListener('change', save);
