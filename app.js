// app.js - small shared helpers

// safe image fallback for img elements (set onerror attribute to call this)
//function imgFallback(imgEl) {
  //imgEl.onerror = null;
//  imgEl.src = "https://via.placeholder.com/300x200?text=No+Image";
//}

// safe ID for canvas/dom
function safeId(val) {
  return String(val).replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}