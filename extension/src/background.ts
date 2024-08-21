console.log('background is running')

import type { LanguageData } from './types'

let showTable = true

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    console.log('open bg')
    chrome.tabs.sendMessage(tab.id, { action: 'toogleTable', showTable: showTable })
    showTable = !showTable
  }
})

const login = (bodyFormData: { email: string; password: string }) => {
  return new Promise(async (resolve, reject) => {
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
    }
  })
}

const getToken = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getToken' }, (response) => {
        console.log('response from content languages data  : ', response)
      })
    }
  })
}

const register = (bodyFormData: { email: string; password: string }) => {
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

const getUser = (token: string) => {
  console.log('get user func called')

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

const deletesLanguages = (email: string, languageIdList: string[]) => {
  return new Promise(async (resolve, reject) => {
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

const logOut = () => {
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
            chrome.tabs.sendMessage(activeTab.id, { action: 'deleteToken' }, (response) => {
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

const addLanguage = (languageData: LanguageData, email: string) => {
  return new Promise(async (resolve, reject) => {
    console.log('add language func called 2')

    try {
      const response = await fetch('http://localhost:5000/api/addLanguage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ languageData: languageData, email: email })
      })

      const data = await response.json()
      console.log('add language response : ', data)

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

const getUserLanguages = (email: string) => {
  return new Promise(async (resolve, reject) => {
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

  if (request.message === 'login') {
    console.log('Login part worked', request.bodyFormData)

    try {
      login(request.bodyFormData).then((data) => {
        sendResponse(data)
      })

      /* sendResponse(data); */
    } catch (error: any) {
      console.error('Error during login:', error)
      sendResponse({ error: error.message })
    }

    // Return true to indicate that the response will be sent asynchronously
    return true
  }

  if (request.message === 'getUser') {
    console.log('get user received from bg')
    try {
      getUser(request.token).then((data) => {
        sendResponse(data)
      })
    } catch (error: any) {
      console.error('Error during login:', error)
      sendResponse({ error: error.message })
    }

    return true
  }

  if (request.message === 'URL-sended') {
    console.log('URL-sended')
    const newURL: string = request.url

    try {
      console.log('trying new tab creation')
      chrome.windows
        .create({ url: newURL, state: 'minimized' })
        .then((window: chrome.windows.Window) => {
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
  } else if (request.action === 'showTable') {
    console.log('backgronn aldı mesajı')
  } else if (request.message === 'existUser') {
    console.log('bg mesajı aldı ', request.user)
    const user = request.user

    console.log('user : ', user)
    /* localStorage.setItem('user', JSON.stringify(user)) */
    chrome.runtime.sendMessage({
      message: 'existUser',
      user: request.user
    })

    chrome.storage.local.set({ userExistence: { message: 'existUser', user: user } })
    return true
  } else if (request.message === 'updateProgress') {
    chrome.runtime.sendMessage({
      message: 'updateProgress',
      progress: request.progress
    })

    return true
  } else if (request.message === 'loginnn') {
    console.log('Login part worked', request.bodyFormData)

    try {
      /*   const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.bodyFormData),
      });

      const data = await response.json(); */
      /*   console.log('response from bg', data); */
      // Send the response back to the popup script
      /*  sendResponse(data); */
    } catch (error: any) {
      console.error('Error during login:', error)
      sendResponse({ error: error.message })
    }

    // Return true to indicate that the response will be sent asynchronously
    return true
  } else if (request.message === 'register') {
    console.log('register part worked', request.bodyFormData)

    try {
      register(request.bodyFormData).then((data) => {
        sendResponse(data)
      })
    } catch (error: any) {
      console.error('Error during login:', error)
      sendResponse({ error: error.message })
    }

    // Return true to indicate that the response will be sent asynchronously
    return true
  } else if (request.message === 'getUserrr') {
    /*     const response = await axios.post('http://localhost:5000/auth/user', {
      token: request.token
    })

    sendResponse(response.data) */
    console.log('get user started', request)

    try {
      getUser(request.token).then((data) => {
        sendResponse(data)
      })
    } catch (error: any) {
      console.error('Error during login:', error)
      sendResponse({ error: error.message })
    }

    return true
  } else if (request.message === 'getUserLanguages') {
    getUserLanguages(request.email).then((data) => {
      sendResponse(data)
    })
    return true
  } else if (request.message === 'addLanguage') {
    addLanguage(request.languageData, request.email).then((data) => {
      sendResponse(data)
    })
    return true
  } else if (request.message === 'deletesLanguages') {
    console.log('bg aldı language id list', request.languageIdList)
    deletesLanguages(request.email, request.languageIdList).then((data) => {
      sendResponse(data)
    })
    return true
  } else if (request.message === 'logOut') {
    logOut().then((data) => {
      sendResponse(data)
    })
    return true
  } else if (request.message === 'getToken') {
    console.log('get token çalıştı')

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'getToken' }, (response) => {
          console.log('response from content languages data  : ', response)

          sendResponse(response.token)
        })
      }
    })
    return true
  } else if (request.message === 'getReturnedValues') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'getReturnedValues' }, (response) => {
          sendResponse(response)
        })
      }
    })
    return true
  } else if (request.message === 'storeReturnedValues') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'storeReturnedValues' , returnedValues : request.returnedValues}, (response) => {
          console.log("bg   responee" , response);
          sendResponse(response)
        })
      }
    })
    return true
  }

  if (request.action === 'language-catcher-start') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'start-language-catcher', url: request.url },
        (response) => {
          console.log('response geldi gözüküyo')
          console.log('responsee ', response)
          sendResponse(response)
        }
      )
    })
    return true
    /* 
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'language-catcher-start',
          url: request.url
        });
      });
    }); */
  }
  return false
})
