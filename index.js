import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"

import {
  setActiveLink, renderHtml, loadHtml
} from "./utils.js"

//import { initThing } from "./pages/thing/thing.js";

window.addEventListener("load", async () => {

  const templateAbout = await loadHtml("./pages/about/about.html")
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")
  
  let  router
  if (window.location.hostname === 'localhost' || window.location.hostname ==="127.0.0.1") {
     console.log('Running locally (using hash (/#):'+window.location.hostname);
     router = new Navigo("/", { hash: true })
  } else {
    console.log('Assume we are on Azure, make sure you have added the staticwebapp.config.json file')
    router = new Navigo("/")
  }
 
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router
 
  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => {
        renderHtml(templateQuiz, "content");
        initQuiz()
      },
      "/about": () => {
        renderHtml(templateAbout, "content")
    },
      
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}