import DetectLanguage from 'detectlanguage'
import { languages } from './types'
import type {
  LanguageLocation,
  LanguageData,
  RealValues,
  ExtensionResponse,
  bodyFormData
} from './types'

console.log('content is running for language-catcher-extension')

let htmlTag: boolean = false
let metaTag: boolean = false
let urlFlag: boolean = false
let paragraph: boolean = false
let locallStorage: boolean = false
let sessionnStorage: boolean = false

const realValues: RealValues = {
  realLangPath: '',
  realLangAttr: '',
  realLangStorage: '',
  realLangLocalStorage: '',
  realLangMeta: ''
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToken') {
    localStorage.setItem('token', request.token)
    sendResponse({ status: 'success' })

    return true
  } else if (request.action === 'deleteToken') {
    localStorage.removeItem('token')
    sendResponse({ status: 'success' })

    return true
  } else if (request.action === 'getToken') {
    const token = localStorage.getItem('token')
    sendResponse({ token: token })

    return true
  } else if (request.action === 'getReturnedValues') {
    const getReturnedValues = localStorage.getItem('returnedValues')

    if (getReturnedValues === null) {
      sendResponse([])
    } else {
      sendResponse(getReturnedValues)
    }

    return true
  } else if (request.action === 'storeReturnedValues') {
    localStorage.setItem('returnedValues', JSON.stringify(request.returnedValues))
    sendResponse({ status: 'success' })

    return true
  } else if (request.action === 'deleteReturnedValues') {
    localStorage.removeItem('returnedValues')
    localStorage.setItem('returnedValues', JSON.stringify(request.returnedValues))
    sendResponse({ status: 'success' })

    return true
  }
})

window.addEventListener('logOutFromApp', () => {
  chrome.runtime.sendMessage({ message: 'logOut' }, (response) => {
    const logOutResponse = new CustomEvent('logOutResponse', {
      detail: {
        response: response
      }
    })

    window.dispatchEvent(logOutResponse)
  })
})

window.addEventListener('deleteLanguagesFromApp', (e) => {
  const event = e as CustomEvent
  const email: string = event.detail.email
  const languageIdlist: string[] = event.detail.languageIdList
  chrome.runtime.sendMessage(
    { message: 'deletesLanguages', email: email, languageIdList: languageIdlist },
    (response) => {
      const deletesLanguageResponse = new CustomEvent('deletesLanguagesResponse', {
        detail: {
          response: response
        }
      })

      window.dispatchEvent(deletesLanguageResponse)
    }
  )
})

window.addEventListener('loginFromApp', (e) => {
  const event = e as CustomEvent
  const bodyFormData: bodyFormData = event.detail.bodyFormData

  chrome.runtime.sendMessage({ message: 'login', bodyFormData: bodyFormData }, (response) => {
    const loginResponse = new CustomEvent('loginResponse', {
      detail: {
        response: response
      }
    })

    window.dispatchEvent(loginResponse)
  })
})

window.addEventListener('registerFromApp', (e) => {
  const event = e as CustomEvent
  const bodyFormData : bodyFormData = event.detail.bodyFormData
  chrome.runtime.sendMessage({ message: 'register', bodyFormData: bodyFormData }, (response) => {
    const registerResponse = new CustomEvent('registerResponse', {
      detail: {
        response: response
      }
    })

    window.dispatchEvent(registerResponse)
  })
})

window.addEventListener('existUser', (e) => {
  const event = e as CustomEvent

  const bodyFormData = {
    email: event.detail.user,
    password: 'Furkan55?'
  }

  chrome.runtime.sendMessage({ message: 'login', bodyFormData: bodyFormData }, (response) => {
    return true
  })
})

window.addEventListener('getUserFromApp', (e) => {
  const event = e as CustomEvent
  const token  : string = event.detail.token
  chrome.runtime.sendMessage({ message: 'getUser', token: token }, (response) => {
    const getUserResponse = new CustomEvent('getUserResponse', {
      detail: {
        response: response
      }
    })

    window.dispatchEvent(getUserResponse)
  })
})

window.addEventListener('getUserLanguagesFromApp', (e) => {
  const event = e as CustomEvent
  const email : string = event.detail.email
  chrome.runtime.sendMessage({ message: 'getUserLanguages', email: email }, (response) => {
    const getUserLanguagesResponse = new CustomEvent('getUserLanguagesResponse', {
      detail: {
        response: response
      }
    })

    window.dispatchEvent(getUserLanguagesResponse)
  })
})

window.addEventListener('addLanguageFromApp', (e) => {
  const event = e as CustomEvent
  const email : string = event.detail.email
  const languageData : LanguageData = event.detail.languageData
  chrome.runtime.sendMessage(
    { message: 'addLanguage', email: email, languageData: languageData },
    (response) => {
      const addLanguageResponse = new CustomEvent('addLanguageResponse', {
        detail: {
          response: response
        }
      })

      window.dispatchEvent(addLanguageResponse)
    }
  )
})



function showTableContent() {
  const container = document.getElementById('placeToShowExtensionTable')
  if (container) {
    const iframe = document.createElement('iframe')
    /*  iframe.src = 'http://localhost:5173/' */
    iframe.src = chrome.runtime.getURL('popup.html')
    iframe.id = 'popupIframe'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = 'none'
    container.appendChild(iframe)
  }
}

showTableContent()


function removeTableContent() {
  const popupDiv = document.getElementById('popupIframe')
  if (popupDiv) {
    popupDiv.remove()
    
  }
}


window.addEventListener('language-catcher-start', (e) => {
  console.log('Language catcher is starting')
  const event = e as CustomEvent
  const url : string= event.detail.url
  const urlList: string[] = event.detail.url.split(',').map((url: string) => url.trim())

  const index = 0

  const languageCatcherResultArray: ExtensionResponse[] = []

  recurciveProcessForApp(url, languageCatcherResultArray, urlList, index)
})


const languageCatcherStart = (url: string): Promise<ExtensionResponse[]> => {
  const urlList: string[] = url.split(',').map((url: string) => url.trim())

  const index = 0
  const languageCatcherResultArray: ExtensionResponse[] = []

  return new Promise((resolve, reject) => {
    const processNextURL = (index: number) => {
      if (index >= urlList.length) {
        resolve(languageCatcherResultArray)
        return
      }

      recurciveProcess(urlList[index], languageCatcherResultArray, urlList, index)
        .then(() => processNextURL(index + 1))
        .catch((error) => reject(error))
    }

    processNextURL(index)
  })
}

const recurciveProcess = (
  URL: string,
  languageCatcherResultArray: ExtensionResponse[],
  urlList: string[],
  index: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: 'URL-sended', url: urlList[index] }, (response: any) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }

      let langName: string = '-'
      let langNativeName: string = '-'
      const status = response.language === 'not detected' ? 'failed' : 'completed'
      if (status === 'completed') {
        langName = languages[response.language].name
        langNativeName = languages[response.language].nativeName
      }
      const date = new Date()
      const languageCatcherResult = new CustomEvent('languageCatcherResult', {
        detail: {
          status: status,
          domain: urlList[index],
          language: response.language,
          languageFetchedFrom: response.findedPlaces,
          langName: langName,
          langNativeName: langNativeName,
          languageLocation: response.languageLocation,
          languageAccuracy: response.accuracy,
          realValues: response.realValues,
          date: date.toString()
        }
      })

      languageCatcherResultArray.push(languageCatcherResult.detail)

      sendProgressEvent(index + 1, urlList.length)
      resolve()
    })
  })
}

const sendProgressEventForApp = (index: number, arrayLength: number) => {
  const updateProgress = new CustomEvent('updateProgress', {
    detail: {
      progress: index / arrayLength
    }
  })
  window.dispatchEvent(updateProgress)

}

const sendProgressEvent = (index: number, arrayLength: number) => {

  chrome.runtime.sendMessage({ message: 'updateProgress', progress: index / arrayLength })
}

const recurciveProcessForApp = (
  URL: string,
  languageCatcherResultArray: ExtensionResponse[],
  urlList: string[],
  index: number
): ExtensionResponse[] | null => {
  chrome.runtime.sendMessage({ message: 'URL-sended', url: urlList[index] }, (response: any) => {

    let langName: string = '-'
    let langNativeName: string = '-'
    const status = response.language === 'not detected' ? 'failed' : 'completed'
    if (status === 'completed') {
      langName = languages[response.language].name
      langNativeName = languages[response.language].nativeName
    }
    const date = new Date()
    const languageCatcherResult = new CustomEvent('languageCatcherResult', {
      detail: {
        status: status,
        domain: urlList[index],
        language: response.language,
        languageFetchedFrom: response.findedPlaces,
        langName: langName,
        langNativeName: langNativeName,
        languageLocation: response.languageLocation,
        languageAccuracy: response.accuracy,
        realValues: response.realValues,
        date: date.toString()
      }
    })

    languageCatcherResultArray.push(languageCatcherResult.detail)

    sendProgressEventForApp(index + 1, urlList.length)

    if (index < urlList.length - 1) {
      recurciveProcessForApp(URL, languageCatcherResultArray, urlList, index + 1)
    } else {
      const languageCatcherResultArrayEvent = new CustomEvent('languageCatcherResult', {
        detail: languageCatcherResultArray
      })

      window.dispatchEvent(languageCatcherResultArrayEvent)
      return languageCatcherResultArray
    }
  })
  return null
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'ready-to-detect') {
    languageDetectPrediction().then((data) => {
      sendResponse(data)
    })
  } else if (request.action === 'show-language-in-same-page') {
    languageDetectPrediction().then((data) => {
      sendResponse(data)
    })
  } else if (request.action === 'toogleTable') {
    if (request.showTable) {
      showTableContent()
    } else {
      removeTableContent()
    }
  } else if (request.action === 'start-language-catcher') {
    languageCatcherStart(request.url)
      .then((responseArray) => {
        console.log('responseArray:', responseArray)
        sendResponse(responseArray)
      })
      .catch((error) => {
        console.error('Error processing language catcher:', error)
        sendResponse([])
      })
    return true
    /* return true  */
  }
  return true // şurası return true olunca çalıştı
})

const parseURL = (/* url: string */): string => {
  const url: string = window.location.pathname

  // if we use lacotion.hostname there is no need to parse with slash

  if (url.startsWith('/en')) {
    realValues.realLangPath = '/en'
    return 'en'
  } else if (url.startsWith('/tr')) {
    realValues.realLangPath = '/tr'
    return 'tr'
  }

  console.log('location href ', url)
  const parsedUrl: string[] = url.split('/')

  let array: string[] = []
  parsedUrl.forEach((url) => {
    array = array
      .concat(url.split('.'))
      .filter((word) => word.length < 3 && word.length !== 0 && languages[word])
  })

  console.log(parsedUrl)
  console.log(array)

  console.log('language detected from url : ', array)

  if (array.length === 1) {
    realValues.realLangPath = `/${array[0]}`
    return array[0]
  } else {
    return ''
  }

  // burdan sonra ya apiye veri göndericez herbir kelime için ya da kendi json dosyamızda aratıcaz
  // 3 harften küçük olan kelimeleri ararsak performans artabilir

  /*     const parsedWords : string[]  = parsedUrl.forEach((word : string) => { word.split('/[\s,.]+/')}) */
}

const detectMetaTag = (): string => {
  const languageContent: string | null | undefined = document
    .querySelector('meta[name="language"]')
    ?.getAttribute('content')

  if (languageContent) {
    realValues.realLangMeta = languageContent
    console.log('language was detected by meta tag : ', languageContent)
    return languageContent.toLowerCase()
  } else {
    console.log("language couldn't be detected by meta tag")
    return ''
  }
}

const detectHtmlLang = (): string => {
  const lang = document.documentElement.lang

  if (lang) {
    console.log('language detected from lang attribute: ', lang)
    realValues.realLangAttr = lang
    if (lang.includes('-')) {
      const langArray = lang.split('-')
      console.log('langArray : ', langArray)

      return langArray[0].toLowerCase()
    } else if (lang.includes('_')) {
      const langArray = lang.split('_')
      console.log('langArray : ', langArray)

      return langArray[0].toLowerCase()
    } else {
      return lang.toLowerCase()
    }
  } else {
    console.log('lang is not detected')

    return ''
  }
}

const takeParagraphs = async (): Promise<string> => {
  const listOfParagraphTags = document.getElementsByTagName('p')
  const newArray = Array.from(listOfParagraphTags)
  const pTagTextsArray: string[] = []

  for (let index = 0; index < newArray.length; index++) {
    if (
      newArray[index].innerText.trim().length > 50 &&
      newArray[index].innerText !== ' ' &&
      !newArray[index].innerText.includes('Copyright')
    ) {
      pTagTextsArray.push(newArray[index].innerText)
    }

    if (pTagTextsArray.length === 5) {
      break
    }
  }



  console.log('pTagsArray', pTagTextsArray)
  pTagTextsArray.forEach((text) => {
    console.log(text.length)
  })


  try {
    const detectLang = new DetectLanguage('73902226a060dd3911c0419b0dec1c66')
    const result = await detectLang.detect(pTagTextsArray)

    console.log(result[0])
    console.log(JSON.stringify(result))

    const languages = result.map((item) =>
      item.length > 0 && item[0].isReliable ? item[0].language : null
    )

    console.log('mapped languages  : ', languages)

    // bu fonksiyon revize edilmeli ilki farklıysa yanlış çalışır
    // en çok tekrar eden dilin seçilmesi gerekiyor
    let count: number = 0
    languages.forEach((lang) => {
      if (lang === languages[0]) {
        console.log('detected language : ', lang)
        count += 1
      }
    })

    if (count === languages.length) {
      console.log('all languages are same works fine', languages[0])
      return languages[0] || ''
    } else if (count > languages.length / 2) {
      console.log('most of the languages are same works fine')
      return languages[0] || ''
    } else {
      console.log('languages are not the same')
      return ''
    }
  } catch (error) {
    console.error('Error detecting language:', error)
    return ''
  }
}

const getLanguageFromLocalStorage = (): string | null => {
  return localStorage.getItem('siteLanguage')
}

const getLanguageFromSessionStorage = (): string | null => {
  return sessionStorage.getItem('siteLanguage')
}

const checkUrl = (detectedLanguages: string[], detectedPlaces: string[]) => {
  const returnedUrl = parseURL()
  urlFlag = false
  if (returnedUrl !== '') {
    detectedLanguages.push(returnedUrl)
    detectedPlaces.push('Url')

    console.log('detected languages from url : ', returnedUrl)
    urlFlag = true
  }
}

const checkHtmlLang = (detectedLanguages: string[], detectedPlaces: string[]) => {
  const detectedLangFromHTML = detectHtmlLang()
  if (detectedLangFromHTML !== '') {
    if (detectedLanguages.length > 0 && detectedLanguages[0] === detectedLangFromHTML) {
      detectedPlaces.push('Lang Etiketi')
      htmlTag = true
    } else if (detectedLanguages.length === 0) {
      detectedLanguages.push(detectedLangFromHTML)
      detectedPlaces.push('Lang Etiketi')
      htmlTag = true
    } else {
      console.log('url lang etiketinden farklı ')
      htmlTag = false
    }
  }
}

const checkStorage = (detectedLanguages: string[], detectedPlaces: string[]) => {
  const localStorageLang = getLanguageFromLocalStorage()
  const sessionStorageLang = getLanguageFromSessionStorage()

  if (
    localStorageLang &&
    detectedLanguages.length > 0 &&
    detectedLanguages[0] === localStorageLang
  ) {
    detectedLanguages.push(localStorageLang)
    detectedPlaces.push('local storage')
    locallStorage = true
  } else if (localStorageLang && detectedLanguages.length === 0) {
    detectedLanguages.push(localStorageLang)
    detectedPlaces.push('local storage')
    locallStorage = true
  }

  if (
    sessionStorageLang &&
    detectedLanguages.length > 0 &&
    detectedLanguages[0] === sessionStorageLang
  ) {
    detectedLanguages.push(sessionStorageLang)
    detectedPlaces.push('session storage')
    sessionnStorage = true
  }
}

const checkMetaTag = (detectedLanguages: string[], detectedPlaces: string[]) => {
  const detectedMetaTag = detectMetaTag()
  if (detectedMetaTag !== '') {
    if (detectedLanguages.length > 0 && detectedLanguages[0] === detectedMetaTag) {
      detectedPlaces.push('Meta Tag')
      console.log('detected meta tag : ', detectedMetaTag)
      metaTag = true
    } else if (detectedLanguages.length === 0) {
      detectedLanguages.push(detectedMetaTag)
      detectedPlaces.push('Meta Tag')
      console.log('detected meta tag : ', detectedMetaTag)
      metaTag = true
    } else {
      metaTag = false
    }
  }
}

const checkParagraphs = async (
  detectedLanguages: string[],
  paragraphCorrectObj: { value: boolean }
) => {
  const paragraphLang = await takeParagraphs()

  console.log('paragraph lang : ', paragraphLang)

  if (paragraphLang !== '') {
    if (paragraphLang === detectedLanguages[0]) {
      paragraphCorrectObj.value = true
      paragraph = true
    } else {
      paragraphCorrectObj.value = false
      paragraph = false
    }
  }
}

const sendResponse = (
  detectedLanguages: string[],
  detectedPlaces: string[],
  paragraphCorrectObj: { value: boolean },
  languageLocation: LanguageLocation,
  accuracy: string,
  realValues: RealValues
): LanguageData => {

  if (detectedLanguages.length === 1) {

    const data = {
      language: detectedLanguages[0],
      findedPlaces: detectedPlaces,
      paragraphLang: paragraphCorrectObj.value,
      languageLocation: languageLocation,
      accuracy: accuracy,
      realValues: realValues
    }

    return data
  } else {
    return {
      language: 'not detected',
      findedPlaces: detectedPlaces,
      paragraphLang: paragraphCorrectObj.value,
      languageLocation: languageLocation,
      accuracy: 'low',
      realValues: realValues
    }
  }
}

const languageDetectPrediction = async (): Promise<LanguageData> => {
  const detectedLanguages: string[] | any[] = []
  const detectedPlaces: string[] = []
  const paragraphCorrectObj = { value: false }
  let accuracy: string = ''
  checkUrl(detectedLanguages, detectedPlaces)
  checkHtmlLang(detectedLanguages, detectedPlaces)
  checkMetaTag(detectedLanguages, detectedPlaces)
  checkStorage(detectedLanguages, detectedPlaces)
  await checkParagraphs(detectedLanguages, paragraphCorrectObj)

  const languageLocation = {
    localStorage: locallStorage,
    sessionStorage: sessionnStorage,
    metaTag: metaTag,
    htmlTag: htmlTag,
    url: urlFlag,
    paragraph: paragraph
  }
  accuracy = accuracyCalculator(detectedPlaces, paragraphCorrectObj.value)

  return sendResponse(
    detectedLanguages,
    detectedPlaces,
    paragraphCorrectObj,
    languageLocation,
    accuracy,
    realValues
  )
}

const accuracyCalculator = (detectedPlaces: string[], paragraphCorrectObj: boolean): string => {
  if (
    detectedPlaces[0] === 'url' ||
    (detectedPlaces.length === 1 && paragraphCorrectObj) ||
    detectedPlaces.length >= 2
  ) {
    return 'high'
  } else if (detectedPlaces.length === 1) {
    return 'medium'
  } else {
    return 'low'
  }
}
