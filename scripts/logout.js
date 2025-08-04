window.logout = function () {
  const logScriptURL = "https://script.google.com/macros/s/AKfycbyxdjN9rSxdQIx1POoqfVV75wvPqCDoXJ-jpSeFuzeSpctBkyQFMgUDovhxDqJyGcWiAg/exec";
  const username = localStorage.getItem("username") || "Unknown";
  const email = localStorage.getItem("email") || "Unknown";

  fetch(logScriptURL, {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      action: 'logout'
    })
  }).finally(() => {
    localStorage.clear();
    location.reload();
  });
};
