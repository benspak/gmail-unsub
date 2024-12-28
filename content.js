console.log("Content script loaded on:", window.location.href);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);

  if (request.action === "extractUnsubscribeLinks") {
    const emailBody = document.body;
    if (!emailBody) {
      sendResponse({ success: false, message: "No email content found." });
      return;
    }

    const links = Array.from(emailBody.querySelectorAll("a[href]"));
    const unsubscribeLinks = links
      .filter(
        (link) =>
          link.href.toLowerCase().includes("unsubscribe") ||
          link.textContent.toLowerCase().includes("unsubscribe")
      )
      .map((link) => link.href);

    sendResponse({
      success: true,
      unsubscribeLinks: Array.from(new Set(unsubscribeLinks)),
    });
  }
});
