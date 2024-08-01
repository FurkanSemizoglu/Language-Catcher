import DetectLanguage from 'detectlanguage'
import { languages } from './types'
import type { LanguageLocation, LanguageData, RealValues, ExtensionResponse } from './types'
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

setInterval(function () {
  const languageCatcherExist = new CustomEvent('language-catcher-exist', {
    detail: {
      languageCatcherExist: true
    }
  })

  window.dispatchEvent(languageCatcherExist)
}, 1 * 1000)

/* setTimeout(() => {
  const languageCatcherExist = new CustomEvent('language-catcher-exist', {
    detail: {
      languageCatcherExist: true
    }
  })

  window.dispatchEvent(languageCatcherExist)
}, 1000)
 */

window.addEventListener('language-catcher-start', (e) => {
  /*   const languageCatcherExist = new CustomEvent('language-catcher-exist', {
    detail: {
      languageCatcherExist: true
    }
  })
  
  window.dispatchEvent(languageCatcherExist) */
  console.log('Language catcher is starting')
  const event = e as CustomEvent
  const url = event.detail.url
  const urlList: string[] = event.detail.url.split(',')
  console.log('domaain ', urlList)

  let index = 0

  const languageCatcherResultArray: ExtensionResponse[] = []

  recurciveProcess(url, languageCatcherResultArray, urlList, index)

  // Burada kullanıcı bilgisi uygulamadan istenilebliir
  // Burasında uygulama bütün siteleri açıp yapıyor
  /*  for (let index = 0; index < urlList.length; index++) {
    chrome.runtime.sendMessage({ message: 'URL-sended', url: urlList[index] }, (response: any) => {
      console.log('message sent to background to run in application')
      console.log('response from background for url sended for application ', response)
  
      let langName: string = '-'
      let langNativeName: string = '-'
      const status = response.language === 'not detected' ? 'failed' : 'completed'
      if (status === 'completed') {
        langName = languages[response.language].name
        langNativeName = languages[response.language].nativeName
      }
      const date = new Date()
      console.log('real values : ', response.realValues)
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
          date: date
        }
      })

      const languageCatcherResultArray : extensionResponse[] =  []
      languageCatcherResultArray.push(languageCatcherResult.detail)
      console.log('languageCatcherResultArray : ', languageCatcherResultArray)
      languageCatcherResultArray.forEach((result) => {
        const languageCatcherResult = new CustomEvent('languageCatcherResult', {
          detail: result
        });
        window.dispatchEvent(languageCatcherResult);
      });
    }) */
})

const recurciveProcess = (
  URL: string,
  languageCatcherResultArray: ExtensionResponse[],
  urlList: string[],
  index: number
) => {
  chrome.runtime.sendMessage({ message: 'URL-sended', url: urlList[index] }, (response: any) => {
    console.log('message sent to background to run in application')
    console.log('response from background for url sended for application ', response)

    let langName: string = '-'
    let langNativeName: string = '-'
    const status = response.language === 'not detected' ? 'failed' : 'completed'
    if (status === 'completed') {
      langName = languages[response.language].name
      langNativeName = languages[response.language].nativeName
    }
    const date = new Date()
    console.log('real values : ', response.realValues)
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
        date: date
      }
    })

    languageCatcherResultArray.push(languageCatcherResult.detail)

    const progressLength = urlList.length % 2 === 0 ? urlList.length : urlList.length + 1
    const progress = (index / progressLength) * 100
    console.log('progress content: ', progress)
    // burda sadece yüzde elli yeterli mi yoksa 25 75 civarı değerlerde de gönderilmeli mi
    if (progress % 25 === 0 || progress % 20 === 0) {
      const updateProgress = new CustomEvent('updateProgress', {
        detail: {
          progress: progress
        }
      })
      window.dispatchEvent(updateProgress)
    }

    if (index < urlList.length - 1) {
      recurciveProcess(URL, languageCatcherResultArray, urlList, index + 1)
    } else {
      const languageCatcherResultArrayEvent = new CustomEvent('languageCatcherResult', {
        detail: languageCatcherResultArray
      })

      window.dispatchEvent(languageCatcherResultArrayEvent)
    }
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('who is sender', sender)
  console.log('content received message', request)
  if (request.action === 'ready-to-detect') {
    console.log('ready-to-detect')
    console.log('tab id : ', request.tabID)
    languageDetectPrediction().then((data) => {
      console.log('data from content.ts for new tab url : ', data)

      console.log('requested tab id ', request.tabID)

      sendResponse(data)
    })
  } else if (request.action === 'show-language-in-same-page') {
    console.log('show-language-in-same-page in content.ts')
    languageDetectPrediction().then((data) => {
      console.log('data from content.ts : ', data)

      sendResponse(data)
    })
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
  /*   const searchDivText: boolean = false */
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

  /* if (pTagTextsArray.length < 2) {
    searchDivText = true
  } */

  console.log('pTagsArray', pTagTextsArray)
  pTagTextsArray.forEach((text) => {
    console.log(text.length)
  })

  /*   if (searchDivText) {
    document.querySelectorAll('div').forEach((div) => {
      if (
        div.innerText.trim().length > 50 &&
        div.innerText !== ' ' &&
        !div.innerText.includes('Copyright')
      ) {
        pTagTextsArray.push(div.innerText)
      }
    })
  } */

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
    detectedPlaces.push('url')

    console.log('detected languages from url : ', returnedUrl)
    urlFlag = true
  }
}

const checkHtmlLang = (detectedLanguages: string[], detectedPlaces: string[]) => {
  const detectedLangFromHTML = detectHtmlLang()
  if (detectedLangFromHTML !== '') {
    if (detectedLanguages.length > 0 && detectedLanguages[0] === detectedLangFromHTML) {
      detectedPlaces.push('lang etiketi')
      htmlTag = true
    } else if (detectedLanguages.length === 0) {
      detectedLanguages.push(detectedLangFromHTML)
      detectedPlaces.push('lang etiketi')
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
      detectedPlaces.push('meta tag')
      console.log('detected meta tag : ', detectedMetaTag)
      metaTag = true
    } else if (detectedLanguages.length === 0) {
      detectedLanguages.push(detectedMetaTag)
      detectedPlaces.push('meta tag')
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
  const updateProgress = new CustomEvent('updateProgress', {
    detail: {
      progress: 50
    }
  })
  // Burada update eventi gönderilerek progress barın güncellenmesi sağlanabilir
  /* window.dispatchEvent(updateProgress) */
  if (detectedLanguages.length === 1) {
    console.log('paragphh in sendresponse')
    const data = {
      language: detectedLanguages[0],
      findedPlaces: detectedPlaces,
      paragraphLang: paragraphCorrectObj.value,
      languageLocation: languageLocation,
      accuracy: accuracy,
      realValues: realValues
    }
    console.log('returned data from content.ts  to send background : ', data)
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
  console.log('detected places : ', detectedPlaces)
  console.log('detected languages : ', detectedLanguages)
  console.log('paragraph Correct : ', paragraphCorrectObj.value)
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
