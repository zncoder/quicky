chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.closeTab) {
      chrome.tabs.remove(sender.tab.id);
    }
  });
