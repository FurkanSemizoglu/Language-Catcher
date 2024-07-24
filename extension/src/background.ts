console.log('background is running')

interface LanguageData {
  language: string
  findedPlaces: string[]
  paragraphLang?: boolean
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background received message', request)
  console.log('URL : ', request.url)

  let langData: LanguageData = {
    language: '',
    findedPlaces: [],
    paragraphLang: false
  }

  if (request.message === 'URL-sended') {
    console.log('URL-sended')
    const newURL: string = request.url

    try {
      console.log('trying new tab creation')
      chrome.windows.create({ url: newURL }).then(() => {
        console.log('tab created successfully')

        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
          console.log('new window has been triggered')

          if (changeInfo.status === 'complete') {
            console.log('tab is complete')

            try {
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  {
                    action: 'ready-to-detect',
                    tabID: tabs[0].id,
                    tabUrl: tabs[0].url
                  },
                  (response: any) => {
                    console.log('response from content languages data  : ', response)
                    langData.language = response.language
                    langData.findedPlaces = response.findedPlaces

                    if (response.paragraphLang) {
                      langData.paragraphLang = response.paragraphLang
                    }
                    
                    if(response){

                      /* chrome.tabs.remove(tabs[0].id) */
                      console.log('lang data checker for ready-to-detect', langData)
                      console.log('lang data checker for ready to detect', langData.findedPlaces)
                      sendResponse(langData)
                      return true
                    }
                   
                  }
                )
              })

              return true // Indicate that sendResponse will be called asynchronously
            } catch (error) {
              console.log('error in background', error)
            }
          }
        }) 
      })
    } catch (error) {
      console.log('error while creating new tab', error)
    }
    // kod hata verince returnleri gpt ekledi düzeltti
    return true // Indicate that sendResponse will be called asynchronously
  } else if (request.message === 'show-language-in-same-page') {
    console.log('show-language-in-same-page task is working in background.ts')

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'show-language-in-same-page' },
        (response: any) => {
          console.log('response from content languages data  : ', response)
          langData.language = response.language
          langData.findedPlaces = response.findedPlaces

          if (response.paragraphLang) {
            langData.paragraphLang = response.paragraphLang
          }
          console.log('lang data checker', langData)
          console.log('lang data checker', langData.findedPlaces)

          sendResponse(langData)
        }
      )
    })
    return true
  }
  /* console.log("last data from background", langData); */
  /*   sendResponse(langData) */
  return false
})
