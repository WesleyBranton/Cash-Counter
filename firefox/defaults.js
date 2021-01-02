// The default storage API values
const defaults = {
    setting: {
        displayroll: true,
        show12coin: false
    },
    roll: {
        d00001: 50 * 0.01,
        d00005: 40 * 0.05,
        d00010: 50 * 0.1,
        d00025: 40 * 0.25,
        d00100: 25 * 1,
        d00200: 25 * 2
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
};

/**
 * Validates the data loaded from storage
 * Ensures that missing settings are replaced with the defaults
 * @param {Object} data Data from storage
 * @returns Data with defaults 
 */
function loadDefaults(data) {
    const keys1 = Object.keys(defaults);
    for (k1 of keys1) {
        if (!data[k1]) {
            data[k1] = defaults[k1];
        } else {
            const keys2 = Object.keys(defaults[k1]);
            for (k2 of keys2) {
                if (typeof data[k1][k2] != typeof defaults[k1][k2]) {
                    data[k1][k2] = defaults[k1][k2];
                }
            }
        }
    }

    return data;
}