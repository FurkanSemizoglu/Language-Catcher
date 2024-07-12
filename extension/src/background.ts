console.log('background is running')

/* chrome.action.onClicked.addListener((tab) => {

  console.log('action clicked')
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    console.log('activeTab : ', activeTab)
  
  })
}) */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background received message', request)
  console.log('URL : ', request.url)

  if (request.message === 'URL-sended') {
    console.log('URL-sended')
    const newURL: string = request.url

    try {
      console.log('trying new tab creation')
      chrome.windows.create({ url: newURL }).then(() => {
        console.log('tab created successfully')

        chrome.tabs.onUpdated.addListener(async function listener(tabId, changeInfo, tab) {
          console.log('new window has been triggered')

          console.log('message from background to content')
          if (changeInfo.status === 'complete') {
            console.log('tab is complete')

            // Error handling response: TypeError: Cannot read properties of undefined (reading 'id')
            // Cehck for above error

            try {
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  { action: 'ready-to-detect', tabID: tabs[0].id, tabUrl: tabs[0].url }/* ,
                  (response: any) => {
                    if (chrome.runtime.lastError) {
                      console.error(chrome.runtime.lastError)
                    } else {
                      console.log('tab was sended to content script')
                      chrome.tabs.onUpdated.removeListener(listener)
                    }
                  } */
                )
              })
            } catch (error) {
              console.log('errror bavgorund', error)
            }
          }

          /* }
        chrome.tabs.onUpdated.removeListener(listener); */
        })
      })
    } catch (error) {
      console.log('error while creating new tab', error)
    }
  }
  else if(request.message === 'show-language-in-same-page') {
    console.log('show-language-in-same-page task is working in background.ts')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'show-language-in-same-page' }
      )
    })
  }
  else if (request.message === 'get-website-url') {
    console.log('get-website-url is working in background.ts')
    sendResponse({ message: 'get-website-url', response: 'url' })
  } else if (request.message === 'HTML-Tag-Name') {
    console.log('HTML-Tag-Name')
    sendResponse({ message: 'HTML-Tag-Name', response: 'html' })
  }
  sendResponse('background received message')
  return true
})
