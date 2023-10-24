const CATEGORY = 'CATEGORY';

// get
const getCategory = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(CATEGORY, (item) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(item);
        });
    });
};

// set
const setCategory = (value) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [CATEGORY]: value }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve({ CATEGORY: value });
        });
    });
};
