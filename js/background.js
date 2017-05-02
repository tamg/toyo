var mailToAddress

var contextMenuItem = {
  "id": "emailMe",
  "title": "Email Me Yo!",
  "contexts": ["selection", "page"]
}

chrome.contextMenus.create(contextMenuItem) //right click menu

chrome.storage.sync.get("mailTo", function (storage) {
    mailToAddress = storage.mailTo || "not set yet"
})

chrome.contextMenus.onClicked.addListener(function(data){
  if(data.menuItemId == "emailMe") {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){

      var emailAddress = mailToAddress //from storage
      var title = tabs[0].title
      var url = tabs[0].url
      var body = `Emailed from ${url} ${data.selectionText || ''}`
      console.log(body);

      var gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${emailAddress}&su=${title}&body=${body}`

      chrome.tabs.create({url: gmailUrl, active: false}, function(tab){ //create new tab

        var gmailTab = tab.id

        chrome.tabs.onUpdated.addListener(function(tabId , info) {
          if(tabId === gmailTab) {
            //Todo: find a better way to access DOM
            var code = `
            setTimeout(function(){
              var send = document.getElementById(':p0')
              console.log(send);
              send.click()
            },5000)
            `
            chrome.tabs.executeScript(tabId, { code: code })
          }
        })
      })
    })
  }
})
