function init() {
  if (!isBlacklisted()) {
		document.addEventListener('keyup', onKeyUp)
	}
}

// borrowed from https://github.com/jeresig/jquery.hotkeys/blob/master/jquery.hotkeys.js

let textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"]
let textInputTypes = /textarea|input|select/i

function inText(el) {
  if (textInputTypes.test(el.nodeName) ||
      textAcceptingInputTypes.indexOf(el.type) >= 0) {
    return true
  }
  while (el) {
    if (el.attributes && el.attributes["contenteditable"]) {
      return true
    }
    el = el.parentNode
  }
  return false
}

// hotkeys:

// TODO: make this option
let hotkeyBlacklist = new Set(['mail.google.com', 'www.typingclub.com'])

function isBlacklisted() {
  return hotkeyBlacklist.has(window.location.hostname)
}

function onKeyUp(ev) {
	if (ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey || inText(ev.target)) {
		return
	}

  switch (ev.keyCode) {
  case 188: // ,
    window.history.back()
    break
    
  case 190: // .
    window.history.forward()
    break

  case 82: // r
    window.location.reload(true)
    break

  case 90: // z
    chrome.runtime.sendMessage({closeTab: true})
    break
  }
}
