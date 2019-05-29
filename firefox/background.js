function handleInstalled(details) {
	// Creates Setting Defaults After Installation
	if (details.reason == 'install') {
		browser.storage.local.set({
			setting: {
				displayroll: true,
				set12coin: false
			},
			roll: {
				d00001: 50*0.01,
				d00005: 40*0.05,
				d00010: 50*0.1,
				d00025: 40*0.25,
				d00100: 25*1,
				d00200: 25*2
			},
			count: {
				d00001: 0,
				d00005: 0,
				d00010: 0,
				d00025: 0,
				d00100: 0,
				d00200: 0,
				d00500: 0,
				d01000: 0,
				d02000: 0,
				d05000: 0,
				d10000: 0
			}
		});
	}
}
browser.runtime.onInstalled.addListener(handleInstalled);