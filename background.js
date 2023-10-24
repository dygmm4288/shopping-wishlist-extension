async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
// 아이콘 클릭 시 wisi list 페이지 이동
chrome.action.onClicked.addListener((tabId) => {
    chrome.tabs.create({
        url: 'popup.html',
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.msg == 'getGlobalValue') {
        chrome.windows.getAll({ populate: true }, (window_list) => {
            for (let i = 0; i < window_list.length; i++) {
                const window = window_list[i];
                for (let j = 0; j < window.tabs.length; j++) {
                    const tab = window.tab[j];
                    if (checkContentScriptExists(tab)) {
                        sendResponse({ data: window });
                    }
                }
            }
        });

        return;
    }
});
