console.log('background is running')

/* chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create(
        {
            url: chrome.extension.getURL('./popup/popup.html'),
        },
        function (tab) { }
    );
}); */


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background received message', request)
    console.log("URL : " , request.url);

    if(request.message === 'URL-sended') {
        console.log('URL-sended')
        const newURL : string = request.url  
      

        try {
            console.log("trying new tab creation");
            chrome.tabs.create({ url: newURL });
            console.log("tab created successfully");
        } catch (error) {
            console.log("error while creating new tab", error);
        }
        
    }
    sendResponse('background received message')
    return true
})