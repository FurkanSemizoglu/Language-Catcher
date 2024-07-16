import DetectLanguage from 'detectlanguage'
import languages from './types'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('content received message', request)
  if (request.action === 'ready-to-detect') {
    console.log('ready-to-detect')
    console.log('tab id : ', request.tabID)
    languageDetectPrediction().then((data) => {
      console.log('data from content.ts for new tab url : ', data)
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

const handleData = async (): Promise<LanguageData> => {
  return await languageDetectPrediction()
}

console.log('content is running for language-catcher-extension')

const parseURL = (/* url: string */): string => {
  const url: string = window.location.pathname

  // if we use lacotion.hostname there is no need to parse with slash

  if(url.startsWith("/en")){
    return "en"
  }
  else if(url.startsWith("/tr")){
    return "tr"
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

const takeParagraphs = async (): Promise<string> => {
  let listOfParagraphTags = document.getElementsByTagName('p')
  const newArray = Array.from(listOfParagraphTags)
  let searchDivText: boolean = false
  let pTagTextsArray: string[] = []

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

  if (pTagTextsArray.length < 2) {
    searchDivText = true
  }

  console.log('pTagsArray', pTagTextsArray)
  pTagTextsArray.forEach((text) => {
    console.log(text.length)
  })


  if(searchDivText){
    document.querySelectorAll('div').forEach((div) => {
      if (
        div.innerText.trim().length > 50 &&
        div.innerText !== ' ' &&
        !div.innerText.includes('Copyright')
      ) {
        pTagTextsArray.push(div.innerText)
      }
    })
  }

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

const detectLangFromStorage = () => {
  // Finds the language from storage
}

interface LanguageData {
  language: string
  findedPlaces: string[]
  paragraphLang?: boolean
}

const languageDetect = () => {
  let detectedLanguages: string[] | any[] = []
  let detectedPlaces: string[] = []

  const url = findUrl()
  const htmlLang = findHtmlLang()
  
  if(url != '' && htmlLang != ''){
    if(url === htmlLang){
      detectedLanguages.push(url)
      detectedPlaces.push('url')
    }
    else{
      detectedLanguages.push(url)
      detectedLanguages.push(htmlLang)
      detectedPlaces.push('url')
      detectedPlaces.push('lang etiketi')
    }
   
  }

}

const findUrl = ( )  : string => {
  // Checks if the url exists in the storage
  const returnedUrl = parseURL()
  if (returnedUrl !== '') {
/*     detectedLanguages.push(returnedUrl)
    console.log('detected html lang : ', returnedUrl)
    detectedPlaces.push('lang etiketi') */
    return returnedUrl
  }

  return ''

}

const findHtmlLang = ( )  : string => {

  const detectedLangFromHTML = detectHtmlLang()
  if (detectedLangFromHTML !== '') {
/*     detectedLanguages.push(detectedLangFromHTML)
    console.log('detected html lang : ', detectedLangFromHTML)
    detectedPlaces.push('lang etiketi') */
    return detectedLangFromHTML
  }

  return ''

}

const languageDetectPrediction = async (): Promise<LanguageData> => {
  let detectedLanguages: string[] | any[] = []

  let detectedPlaces: string[] = []

  const returnedUrl = parseURL()
  if (returnedUrl !== '') {
    //  Buraları düzenle kod tekrarı var
    detectedLanguages.push(returnedUrl)
    console.log('detected url : ', returnedUrl)
    detectedPlaces.push('url')
   
    console.log('detected languages from url : ', returnedUrl)
  }
  const detectedLangFromHTML = detectHtmlLang()
  if (detectedLangFromHTML !== '') {
    if (detectedLanguages.length > 0  && detectedLanguages[0] === detectedLangFromHTML) {
      detectedPlaces.push('lang etiketi')     
    }
    else if(detectedLanguages.length === 0){
      detectedLanguages.push(detectedLangFromHTML)
      detectedPlaces.push('lang etiketi') 
    }
    else {
      console.log('url lang etiketinden farklı')
/*       detectedPlaces.push('url')
      detectedLanguages.push(detectedLangFromHTML) */
    }
  }
  const detectedMetaTag = detectMetaTag()
  if (detectedMetaTag !== '') {
    detectedLanguages.push(detectedMetaTag)
    detectedPlaces.push('meta tag')
    console.log('detected meta tag : ', detectedMetaTag)
  }

  const paragraphLang = await takeParagraphs()

  let paragraphCorrect: boolean = false
  console.log('paragraph lang : ', paragraphLang)

  if (paragraphLang !== '') {
    console.log('noluoyr')
    if (paragraphLang === detectedLanguages[0]) {
      paragraphCorrect = true
      console.log('paragraph correct')
    } else {
      paragraphCorrect = false
    }
  }
  console.log('detected places : ', detectedPlaces)
  console.log("detected languages : ", detectedLanguages);
  if (detectedLanguages.length === 1) {
    const data = {
      language: detectedLanguages[0],
      findedPlaces: detectedPlaces,
      paragraphLang: paragraphCorrect
    }
    console.log('returned data from content.ts  to send background : ', data)
    return data
  } else {
    return {
      language: 'not detected',
      findedPlaces: detectedPlaces
    }
  }
}



const languageDetectPrediction2 = async () : Promise<LanguageData>  => {
  let detectedLanguages: string[] | any[] = []

  let detectedPlaces: string[] = []

  const detectedLangFromHTML = detectHtmlLang()
  const returnedUrl = parseURL()
  const detectedMetaTag = detectMetaTag()
  const paragraphLang = await takeParagraphs()

  detectedLanguages.push(detectedLangFromHTML)
  detectedLanguages.push(returnedUrl)
  detectedLanguages.push(detectedMetaTag)
  detectedLanguages.push(paragraphLang)

  let paragraphCorrect: boolean = false

  let value = detectedLanguages[0] 
  let count = 0
  let a = 0
  console.log("detected languages : ", detectedLanguages);
  for (let i = 0; i < detectedLanguages.length; i++) {
    if (detectedLanguages[i] === value) {
      count += 1
    }

    if (count >= detectedLanguages.length / 2) {
      break;
    }
    else{
      a += 1
      value = detectedLanguages[a]
      i = 0
    }
  }

  console.log(value);

  if(value === detectedLangFromHTML){
    detectedPlaces.push('lang etiketi')
  }

  if(value === returnedUrl){
    detectedPlaces.push('url')
  }

  if(value === detectedMetaTag){
    detectedPlaces.push('meta tag')
  }

  if(value === paragraphLang){
    paragraphCorrect = true
  }

  console.log("value : " , value);
  if(value ){
    return {
    language: value,
    findedPlaces: detectedPlaces,
    paragraphLang: paragraphCorrect
    }
  }
  else{
    return {
      language: 'not detected',
      findedPlaces: detectedPlaces,
      paragraphLang: paragraphCorrect
    }}

}