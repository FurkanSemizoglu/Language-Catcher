console.log('background is running')

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create(
        {
            url: chrome.extension.getURL('./popup/popup.html'),
        },
        function (tab) { }
    );
});