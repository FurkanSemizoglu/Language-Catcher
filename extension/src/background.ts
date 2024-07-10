console.log('background is running')



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background received message', request)
  console.log('URL : ', request.url)

  if (request.message === 'URL-sended') {
    console.log('URL-sended')
    const newURL: string = request.url
  
    try {
      console.log('trying new tab creation')
      chrome.tabs.create({ url: newURL })
      console.log('tab created successfully')

      setTimeout(() => {
        console.log("message from background to content");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs : any) => {
          chrome.tabs.sendMessage(tabs[0].id, { action : 'ready-to-detect' }, (response : any) =>  {})
        })
      }, 1000)
    } catch (error) {
      console.log('error while creating new tab', error)
    }
  }
  else if (request.message === 'HTML-Tag-Name') {


    alert('HTML-Tag-Name')
    console.log('HTML-Tag-Name')
    sendResponse({ message: 'HTML-Tag-Name', response: 'html' })
  }
  sendResponse('background received message')
  return true
})
