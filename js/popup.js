var email = document.getElementById('email');
var submit = document.getElementById('submit');
var currentEmail = document.getElementById('currentEmail')
var savedEmail

chrome.storage.sync.get("mailTo", function (storage) { //retrieve from storage if email is already set
    savedEmail = storage.mailTo || "not set yet"
    currentEmail.innerHTML = `Currently set to: ${savedEmail}`
})

submit.addEventListener("click", function(event) {
  chrome.storage.sync.set({'mailTo': email.value}, function() { //save to storage
    currentEmail.innerHTML = `Currently set to: ${email.value}`
    console.log('current email:', mailToAddress)
  })
})
