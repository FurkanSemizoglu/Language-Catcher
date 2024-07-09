console.log('content is running')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log("content received message", request);
  if (request.action === 'ready-to-detect') {
    console.log('ready-to-detect')

    setTimeout(() => {
        console.log("contetn");
    }, 3000)
  }
})

const parseURL = (url: string) => {
  // parse Url to find language
  // maybe it can be return a string

    const parsedUrl : string[] = url.split('/') 

}

const detectMetaTag = () => {
  // Finds the meta tag
}

const detectHtmlLang = () => {
  // Finds the html lang attribute
}

const takeParagraphs = () => {}

const detectLangFromStorage = () => {
  // Finds the language from storage
}
