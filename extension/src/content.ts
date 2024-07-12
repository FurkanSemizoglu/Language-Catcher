/* chrome.runtime.sendMessage({ message: 'get-website-url' }, (response) => {
  console.log('message sent to background')
  console.log('response from background  : ', response)
}) */
import DetectLanguage from 'detectlanguage'
import languages from './types'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('content received message', request)
  if (request.action === 'ready-to-detect') {
    console.log('ready-to-detect')
    console.log('tab id : ', request.tabID)
    languageDetectPrediction(request.tabUrl)
  } else if (request.action === 'show-language-in-same-page') {
    console.log('show-language-in-same-page in content.ts')

    languageDetectPrediction(window.location.href)
  }

  sendResponse('content received message')
})

console.log('content is running for language-catcher-extension')

const parseURL = (url: string): string[] => {
  console.log('url for parsing :   ', url)

  const parsedUrl: string[] = url.split('/')

  let array: string[] = []
  parsedUrl.forEach((url) => {
    array = array.concat(url.split('.')).filter((word) => word.length < 3 && word.length !== 0)
  })

  console.log(parsedUrl)
  console.log(array)

  console.log('language detected from url : ', array)

  let detectedLanguages: string[] | any[] = []

  if (array.length > 0) {
    array.forEach((word) => {
      /*       if (word.toLowerCase().includes('tr')) {
        return 'tr'
      }
      if (word.toLowerCase().includes('en')) {
        return 'en'
      } */

      if (languages[word]) {
        detectedLanguages.push(word)
      }

      const data = languages[word]
      console.log('native name :', data.nativeName)
      console.log('name :', data.name)
    })
  } else {
    console.log("language couldn't be detected from url")
    return []
  }

  return detectedLanguages

  // burdan sonra ya apiye veri göndericez herbir kelime için ya da kendi json dosyamızda aratıcaz
  // 3 harften küçük olan kelimeleri ararsak performans artabilir

  /*     const parsedWords : string[]  = parsedUrl.forEach((word : string) => { word.split('/[\s,.]+/')}) */
}

const detectMetaTag = (): string => {
  const languageContent: string | null | undefined = document
    .querySelector('meta[name="language"]')
    ?.getAttribute('content')

  if (languageContent) {
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

const takeParagraphs = async () => {
  let listOfParagraphTags = document.getElementsByTagName('p')

  const newArray = Array.from(listOfParagraphTags)
  let searchDivText: boolean = false

  let pTagTextsArray: string[] = []

  for (let index = 0; index < newArray.length; index++) {
    if (
      newArray[index].innerText.trim().length > 50 &&
      newArray[index].innerText !== ' ' &&
      newArray[index].innerText.includes('Copyright') === false
    ) {
      pTagTextsArray.push(newArray[index].innerText)
    }

    if (pTagTextsArray.length === 5) {
      break
    }
  }
  if (pTagTextsArray.length < 2) {
    // burada div taglarına bakılacak
    searchDivText = true
  }

  // arraydeki veriyi azalt 5 ya da 6 tane veri yeterli olucaktır
  console.log('pTagsArray', pTagTextsArray)

  pTagTextsArray.forEach((text) => {
    console.log(text.length)
  })
/*   const detectLang = new DetectLanguage('')
  detectLang.detect(pTagTextsArray).then(function (result) {
    console.log(result[0])
    console.log(JSON.stringify(result))
    const languages = result.map((item) =>
      item.length > 0 && item[0].isReliable ? item[0].language : null
    )

    console.log('mapped languages  : ', languages)
  }) */
}

const detectLangFromStorage = () => {
  // Finds the language from storage
}

interface LanguageData {

  language: string,
  findedPlaces: string[]
}


const languageDetectPrediction = (url: string) : LanguageData => {
  let detectedLanguages: string[] | any[] = []

  let detectedPlaces: string[] = []
  if (detectHtmlLang() !== '') {
    detectedLanguages.push(detectHtmlLang())
    console.log('detected html lang : ', detectHtmlLang())
    detectedPlaces.push('lang etiketi')
  }
  if (parseURL(url).length > 0) {
    if (detectedLanguages[0] === parseURL(url)[0]) {
      console.log('not increasing because ther are same')
      detectedPlaces.push('url')
      detectedLanguages.concat(parseURL(url))
    } else {
      detectedPlaces.push('url')
      detectedLanguages.concat(parseURL(url))
    }
    console.log('detected languages from url : ', parseURL(url))
  }
  if (detectMetaTag() !== '') {
    detectedLanguages.push(detectMetaTag())
    detectedPlaces.push('meta tag')
    console.log('detected meta tag : ', detectMetaTag())
  }
  console.log('detected places : ', detectedPlaces)
  takeParagraphs()


  if(detectedLanguages.length === 1) {

    const data = {
      "language" : detectedLanguages[0],
      "findedPlaces" : detectedPlaces
    }
    return data
  }
  else {
    return {
      "language" : "not detected",
      "findedPlaces" : detectedPlaces
    }
  }

  console.log('detected languages : ', detectedLanguages)
}
