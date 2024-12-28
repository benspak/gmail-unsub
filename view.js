console.log("view.js loaded");

// Retrieve and display unsubscribe links
chrome.storage.local.get({ unsubscribeLinks: [] }, (result) => {
  const links = result.unsubscribeLinks || [];
  console.log("Retrieved unsubscribe links:", links);

  const linksList = document.getElementById("links-list");

  if (links.length === 0) {
    const noDataMessage = document.createElement("li");
    noDataMessage.textContent = "No unsubscribe links found.";
    linksList.appendChild(noDataMessage);
    return;
  }

  // Populate the list with retrieved links
  links.forEach((link, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${link}`;
    linksList.appendChild(listItem);
  });
});

// Handle CSV export
document.getElementById("export-csv").addEventListener("click", () => {
  chrome.storage.local.get({ unsubscribeLinks: [] }, (result) => {
    const links = result.unsubscribeLinks || [];
    console.log("Preparing to export links:", links);

    if (links.length === 0) {
      alert("No unsubscribe links to export.");
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + links.join("\n");
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "unsubscribe_links.csv");
    document.body.appendChild(link);

    link.click();
    link.remove();
  });
});
