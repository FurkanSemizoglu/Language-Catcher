console.log('content is running')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // deneme
  document.body.style.backgroundColor = 'orange'
  console.log('content received message', request)
  detectHtmlLang()
  if (request.action === 'ready-to-detect') {
    console.log('ready-to-detect')
    detectHtmlLang()
    setTimeout(() => {
      console.log('contetn')
    }, 3000)
  }
})

const parseURL = (url: string) => {
  // parse Url to find language
  // maybe it can be return a string

  const parsedUrl: string[] = url.split('/[s,.]+/')

  /*     const parsedWords : string[]  = parsedUrl.forEach((word : string) => { word.split('/[\s,.]+/')}) */
}

const detectMetaTag = () => {
  // Finds the meta tag
}

const detectHtmlLang = () => {
  // Finds the html lang attribute
  const htmlTag = document.getElementsByTagName('html')
  const lang = document.documentElement.lang
  console.log('language detected : ', lang)
  /*  console.log("language detected : ", lang) */

  /*   alert("language detected : " + lang) */
  chrome.runtime.sendMessage({ message: 'HTML-Tag-Name' }, (response) => {
    console.log('message sent to background')
    console.log('response from background  : ', response)
  })
}

const takeParagraphs = () => {}

const detectLangFromStorage = () => {
  // Finds the language from storage
}
