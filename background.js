let blacklist = new Set()

async function toggleSite() {
  // get host, toggle, save
  let tab = await new Promise(resolve => {
    chrome.tabs.query({active: true, currentWindow: true}, ts => resolve(ts[0]))
  })
  let h = hostName(tab.url)
  if (blacklist.has(h)) {
    blacklist.delete(h)
  } else {
    blacklist.add(h)
  }
  
  await save()

  await new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, {enabled: !blacklist.has(h)}, resp => resolve(resp))
  })
}

function hostName(u) {
	let a = document.createElement("a")
	a.href = u
	return a.hostname
}

function handleMessage(req, sender, sendResponse) {
  switch (req.op) {
  case "closeTab":
    chrome.tabs.remove(sender.tab.id)
    break
  case "enabled":
    sendResponse({enabled: !blacklist.has(req.arg)})
    break
  }
}

const blacklistDefault = ["mail.google.com"]

async function load() {
  let x = await new Promise(resolve => chrome.storage.sync.get(["blacklist"], items => resolve(items)))
  blacklist = new Set(x.blacklist || blacklistDefault)
}

async function save() {
  let ar = Array.from(blacklist)
  await new Promise(resolve => chrome.storage.sync.set({"blacklist": ar}, () => resolve()))
}

async function init() {
  await load()
  
  chrome.runtime.onMessage.addListener(handleMessage)
  chrome.browserAction.onClicked.addListener(toggleSite)
}

init()
