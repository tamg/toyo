var email = document.getElementById('email');
var mailTo = document.getElementById('mailto');
var currentEmail = document.getElementById('currentEmail')
var savedEmail

chrome.storage.sync.get("mailTo", function (storage) {
    savedEmail = storage.mailTo || "not set yet"
    currentEmail.innerHTML = `Currently set to: ${savedEmail}`
})


mailTo.addEventListener("click", function(event) {
  chrome.runtime.sendMessage({button: "mailTo", value:email.value },
    function (response) {
      currentEmail.innerHTML = `Currently set to: ${email.value}`
      console.log(response);
    })
})
