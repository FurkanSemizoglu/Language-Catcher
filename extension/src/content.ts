/* chrome.runtime.sendMessage({ message: 'get-website-url' }, (response) => {
  console.log('message sent to background')
  console.log('response from background  : ', response)
}) */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // deneme

  console.log('content received message', request)

  if (request.action === 'ready-to-detect') {
    console.log('ready-to-detect')
    console.log('tab id : ', request.tabID)
    detectHtmlLang()
    parseURL(request.tabUrl)
/*     takeParagraphs()
 */    setTimeout(() => {
      console.log('contetn')
    }, 3000)
  }
})

console.log('content is running for language-catcher-extension')

/*   console.log('content is running')
 document.body.style.backgroundColor = 'orange' */

/* 
document.body.textContent = ''

let header = document.createElement('h1')
header.textContent = 'This page has been eaten'
document.body.appendChild(header) */

const parseURL = (url: string) => {
  // parse Url to find language
  // maybe it can be return a string

  /* const url : string = chrome. */
  console.log('url for parsing :   ', url)

  /*  const parsedUrl: string[] = url.split('/[s,.]+/') */
  /*   const parsedUrl: string[] = url.split('/[s,]+/')

  console.log('parsed urls : ', parsedUrl) */
  /* 
  url = 'https://online.deu.edu.tr/' */
  const parsedUrl: string[] = url.split('/')

  let array: string[] = []
  parsedUrl.forEach((url) => {
    array = array.concat(url.split('.')).filter((word) => word.length < 3 && word.length !== 0)
  })

  console.log(parsedUrl)
  console.log(array)

  console.log('language detected from url : ', array)

  // burdan sonra ya apiye veri göndericez herbir kelime için ya da kendi json dosyamızda aratıcaz
  // 3 harften küçük olan kelimeleri ararsak performans artabilir

  /*     const parsedWords : string[]  = parsedUrl.forEach((word : string) => { word.split('/[\s,.]+/')}) */
}

const detectMetaTag = () => {
  // Finds the meta tag
}

const detectHtmlLang = () => {
  // Finds the html lang attribute

  // parse lang for this usage lang="tr-TR"
  /*  const htmlTag = document.getElementsByTagName('html') */
  const lang = document.documentElement.lang

  if (lang) {
    console.log('language detected from lang attribute: ', lang)
    /*  console.log("language detected : ", lang) */

    /*   alert("language detected : " + lang) */
    chrome.runtime.sendMessage({ message: 'HTML-Tag-Name' }, (response) => {
      console.log('message sent to background')
      console.log('response from background  : ', response)
    })
  } else {
    console.log('lang is not detected')
  }
}

const takeParagraphs = () => {

/* 
  let listOfParagraphTags= document.getElementsByTagName("p");
  console.log("list of p tags : "  , listOfParagraphTags ); */
}

const detectLangFromStorage = () => {
  // Finds the language from storage
}
