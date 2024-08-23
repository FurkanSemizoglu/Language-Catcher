console.log('background is running')

import type { bodyFormData, extensionResult, LanguageData } from './types'

let showTable = true

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    console.log('open bg')
    chrome.tabs.sendMessage(tab.id, { action: 'toogleTable', showTable: showTable })
    showTable = !showTable
  }
})

const login = (request: {bodyFormData : bodyFormData}) => {
  const bodyFormData = request.bodyFormData
  console.log("body form data", bodyFormData) ;
  return new Promise( async(resolve) => {
    // Burada Promise içinde await kullanılmaz hatası çıkıyor lintte ama düzgün çalışıyor 
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyFormData)
    })

    const data = await response.json()

    if (response.ok) {
      // Assuming data.token contains the token
      const token = data.token
      console.log('data token ', token)

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0]
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'saveToken', token }, (response) => {
            console.log('response from content languages data  : ', response)
            resolve(data)
          })
        }
      })
    } else {
      resolve(data)
    }
  })
}

const getToken = (request: any, sendResponse: (response?: any) => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getToken' }, (response) => {
        console.log('response from content languages data  : ', response)

        sendResponse(response.token)
      })
    }
  })
}

const register = (request: {bodyFormData : bodyFormData}) => {
  const bodyFormData  = request.bodyFormData
  return new Promise(async (resolve, reject) => {
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyFormData)
    })

    // Parse the response
    const data = await response.json()
    resolve(data)
  })
}

const getUser = (request: { token: string }) => {
  console.log('get user func called')
  const { token } = request

  return new Promise(async (resolve, reject) => {
    console.log('get user func called 2')

    try {
      const response = await fetch('http://localhost:5000/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      })

      const data = await response.json()
      console.log('get user response : ', data)

      if (response.ok) {
        resolve(data)
      } else {
        reject(data)
      }
    } catch (error) {
      console.error('Error in getUser:', error)
      reject(error)
    }
  })
}

const deletesLanguages = (request: { email: string; languageIdList: string[] }) => {
  return new Promise(async (resolve, reject) => {
    const { email, languageIdList } = request
    /*     const email: string = request.email
    const languageIdList: string[] = request.languageIdList */
    console.log('delete language func called 2', email, languageIdList)

    try {
      const response = await fetch('http://localhost:5000/api/deletesLanguages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, languageIdList: languageIdList })
      })

      const data = await response.json()
      console.log('delete language response : ', data)

      if (response.ok) {
        resolve(data)
      } else {
        reject(data)
      }
    } catch (error) {
      console.error('Error in deleteLanguage:', error)
      reject(error)
    }
  })
}

const logOut = (request: any) => {
  return new Promise(async (resolve, reject) => {
    console.log('log out func called 2')

    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log('log out response : ', data)

      if (response.ok) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0]
          if (activeTab && activeTab.id) {
            chrome.tabs.sendMessage(activeTab.id, { action: 'deleteToken' }, () => {
              resolve(data)
            })
          }
        })
      } else {
        reject(data)
      }
    } catch (error) {
      console.error('Error in logOut:', error)
      reject(error)
    }
  })
}

const addLanguage = (request: { languageData: LanguageData; email: string }) => {
  return new Promise(async (resolve, reject) => {
    const { languageData, email } = request


    try {
      const response = await fetch('http://localhost:5000/api/addLanguage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ languageData: languageData, email: email })
      })

      const data = await response.json()

      if (response.ok) {
        resolve(data)
      } else {
        reject(data)
      }
    } catch (error) {
      console.error('Error in addLanguage:', error)
      reject(error)
    }
  })
}

const getUserLanguages = (request: { email: string }) => {
  return new Promise(async (resolve, reject) => {
    const email = request.email
    console.log('get user language', email)
    const response = await fetch(
      'http://localhost:5000/api/getUserLanguages?' + new URLSearchParams({ email: email }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    console.log('Fetched user languages:', data)

    resolve(data)
  })
}

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
const storeReturnedValues = (
  request: { returnedValues: extensionResult },
  sendResponse: (response?: any) => void
) => {
  const returnedValues: extensionResult = request.returnedValues
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: 'storeReturnedValues', returnedValues: returnedValues },
        (response) => {
          sendResponse(response)
        }
      )
    }
  })
}

const deleteReturnedValues = (
  request: { returnedValues: extensionResult },
  sendResponse: (response?: any) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const activeTab = tabs[0]
    const returnedValues: extensionResult = request.returnedValues
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: 'deleteReturnedValues', returnedValues: returnedValues },
        (response) => {
          sendResponse(response)
        }
      )
    }
  })
}

const getReturnedValues = (request: any, sendResponse: (response?: any) => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getReturnedValues' }, (response) => {
        sendResponse(response)
      })
    }
  })
}
const urlSendedFunction = (requestUrl: string): Promise<LanguageData> => {
  return new Promise(async (resolve) => {
    const newURL: string = requestUrl

    try {
      chrome.windows
        .create({ url: newURL, state: 'minimized' })
        .then((window: chrome.windows.Window) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
            if (changeInfo.status === 'complete' && tab.windowId === window.id) {
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
                          resolve(langData)

                          chrome.tabs.remove(tabs[0].id)
                        }
                      }
                    )
                  }
                })

                return true
              } catch (error) {
                console.log('error in background', error)
              }
            }
          })
        })
    } catch (error) {
      console.log('error while creating new tab', error)
    }
    return true
  })
}

const languageCatcherStart = (request: {url : string}, sendResponse: (response?: any) => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'start-language-catcher', url: request.url },
      (response) => {
        sendResponse(response)
      }
    )
  })
}
const updateProgress = (request: {progress : number}) => {
  chrome.runtime.sendMessage({
    message: 'updateProgress',
    progress: request.progress
  })
}

const tokenHandlers: {
  [key: string]: (request: any, sendResponse: (response?: any) => void) => void
} = {
  getToken: getToken,
  getReturnedValues: getReturnedValues,
  storeReturnedValues: storeReturnedValues,
  deleteReturnedValues: deleteReturnedValues
}

const languageHandlers: {
  [key: string]: (request: any) => Promise<any>
} = {
  getUserLanguages: getUserLanguages,
  addLanguage: addLanguage,
  deletesLanguages: deletesLanguages,
  logOut: logOut
}

const authHandlers: {
  [key: string]: (request: any) => Promise<any>
} = {
  login: login,
  register: register,
  getUser: getUser
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background received message', request)

  if (tokenHandlers[request.message]) {
    tokenHandlers[request.message](request, sendResponse)
    return true
  } else if (languageHandlers[request.message]) {
    languageHandlers[request.message](request).then((data) => {
      sendResponse(data)
    })
    return true
  } else if (authHandlers[request.message]) {
    try {
      authHandlers[request.message](request).then((data) => {
        sendResponse(data)
      })
    } catch (error: any) {
      console.error('Error during login:', error)
      sendResponse({ error: error.message })
    }
    return true
  }

  if (request.message === 'URL-sended') {
    urlSendedFunction(request.url).then((data) => {
      sendResponse(data)
    })
    return true
  } else if (request.message === 'updateProgress') {
    updateProgress(request)
    return true
  }

  if (request.action === 'language-catcher-start') {
    languageCatcherStart(request, sendResponse)
    return true
  }
  return false
})
