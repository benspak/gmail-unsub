// Index Unsubscribe Links
document.getElementById("index-links").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    // Validate if the active tab is Gmail
    if (!activeTab.url || !activeTab.url.includes("mail.google.com")) {
      alert("Please open Gmail and try again.");
      return;
    }

    // Inject the content script dynamically
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["content.js"],
      },
      () => {
        // Send a message to extract unsubscribe links
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "extractUnsubscribeLinks" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              alert("Failed to load the content script. Please refresh Gmail.");
              return;
            }

            if (response?.success) {
              chrome.storage.local.get({ unsubscribeLinks: [] }, (result) => {
                const storedLinks = result.unsubscribeLinks || [];
                const uniqueLinks = Array.from(
                  new Set([...storedLinks, ...response.unsubscribeLinks])
                );

                chrome.storage.local.set({ unsubscribeLinks: uniqueLinks }, () => {
                  alert("Unsubscribe links indexed successfully!");
                });
              });
            } else {
              alert(response?.message || "No unsubscribe links found.");
            }
          }
        );
      }
    );
  });
});

// View Indexed Links
document.getElementById("view-links").addEventListener("click", () => {
  // Open the view.html page in a new tab
  chrome.tabs.create({ url: "view.html" }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error("Error opening view page:", chrome.runtime.lastError.message);
      alert("Failed to open the View Indexed Links page.");
    } else {
      console.log("View Indexed Links page opened successfully:", tab);
    }
  });
});
