console.log('background is running')

import type { LanguageData } from './types'


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background received message', request)
  console.log('URL : ', request.url)

  const langData: LanguageData = {
    language: '',
    findedPlaces: [],
    paragraphLang: false,
    languageLocation: {
      localStorage: false,
      sessionStorage: false,
      metaTag: false,
      htmlTag: false,
      url: false,
      paragraph: false
    },
    accuracy: 'low',
    realValues: {
      realLangPath: '',
      realLangAttr: '',
      realLangStorage: '',
      realLangLocalStorage: '',
      realLangMeta: ''
    }
  }

  if (request.message === 'URL-sended') {
    console.log('URL-sended')
    const newURL: string = request.url

    try {
      console.log('trying new tab creation')
      chrome.windows.create({ url: newURL }).then((window: chrome.windows.Window) => {
        console.log('tab created successfully')
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
          console.log('new window has been triggered')
          if (changeInfo.status === 'complete' && tab.windowId === window.id) {
            console.log('tab is complete')
            try {
              chrome.tabs.query({ active: true, windowId: window.id }, (tabs: any) => {
                if (tabs.length > 0) {
                  chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                      action: 'ready-to-detect',
                      tabID: tabs[0].id,
                      tabUrl: tabs[0].url
                    },
                    (response) => {
                      console.log('response from content languages data  : ', response)

                      if (response) {
                        langData.language = response.language
                        langData.findedPlaces = response.findedPlaces
                        langData.paragraphLang = response.paragraphLang ?? false
                        langData.languageLocation = response.languageLocation
                        langData.accuracy = response.accuracy
                        langData.realValues = response.realValues
                        sendResponse(langData)

                        chrome.tabs.remove(tabs[0].id)
                      }
                    }
                  )
                }
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
    return true // Indicate that sendResponse will be called asynchronously
  } else if (request.message === 'show-language-in-same-page') {
    console.log('show-language-in-same-page task is working in background.ts')

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'show-language-in-same-page' }, (response) => {
        console.log('response from content languages data  : ', response)
        langData.language = response.language
        langData.findedPlaces = response.findedPlaces

        if (response.paragraphLang) {
          langData.paragraphLang = response.paragraphLang
        }
        console.log('lang data checker', langData)
        console.log('lang data checker', langData.findedPlaces)

        sendResponse(langData)
      })
    })
    return true
  }
  return false
})
