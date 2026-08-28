(function () {
  var isAr = location.pathname.indexOf("/ar/") === 0;
  try {
    var q = new URLSearchParams(location.search).get("lang");
    var want = q || localStorage.getItem("lang");
    if (want === "ar" && !isAr) { location.replace("/ar/" + location.hash); return; }
    if (want === "en" && isAr) { location.replace("/" + location.hash); return; }
    localStorage.setItem("lang", isAr ? "ar" : "en");
  } catch (e) {}
  var links = document.querySelectorAll("a[data-lang]");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (ev) {
      try { localStorage.setItem("lang", ev.currentTarget.getAttribute("data-lang")); } catch (e) {}
    });
  }
  var b = document.querySelector(".nav-burger"), m = document.querySelector(".nav-links");
  if (b && m) {
    b.addEventListener("click", function () {
      var open = m.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
    m.addEventListener("click", function (ev) {
      if (ev.target && ev.target.tagName === "A") { m.classList.remove("open"); b.setAttribute("aria-expanded", "false"); }
    });
  }
})();
