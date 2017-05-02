var mailToAddress

var contextMenuItem = {
  "id": "emailMe",
  "title": "Email Me Yo!",
  "contexts": ["all"]
}

chrome.contextMenus.create(contextMenuItem)

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse){
    if( request.button === "mailTo" ){
      mailToAddress = request.value
      chrome.storage.sync.set({'mailTo': mailToAddress}, function() {
        console.log('current email:', mailToAddress)
      })
    }
})

chrome.contextMenus.onClicked.addListener(function(data){
  if(data.menuItemId == "emailMe") {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){

      var emailAddress = mailToAddress
      var title = tabs[0].title
      var url = tabs[0].url
      var body = `Emailed from ${url} \n ${data.selectionText || ''}`

      var gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${emailAddress}&su=${title}&body=${body}`

      chrome.tabs.create({url: gmailUrl, active: false}, function(tab){

        var gmailTab = tab.id

        chrome.tabs.onUpdated.addListener(function(tabId , info) {
          if(tabId === gmailTab) {
            var code = `
            setTimeout(function(){
              var send = document.getElementById(':p0')
              console.log(send);
              send.click()
            },3000)
            `
            chrome.tabs.executeScript(tabId, { code: code })
          }
        })
      })
    })
  }
})
