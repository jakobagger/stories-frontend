import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"

import {
  setActiveLink, renderHtml, loadHtml
} from "./utils.js"

import { initStories } from "./pages/stories/stories.js";
import { initAddStory } from "./pages/addStory/addStory.js";
import { initStoryDetails } from "./pages/storyDetails/storyDetails.js";

window.addEventListener("load", async () => {

  const templateAbout = await loadHtml("./pages/about/about.html")
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")
  const templateStories = await loadHtml("./pages/stories/stories.html")
  const templateAddStory = await loadHtml("./pages/addStory/addStory.html")
  const templateStoryDetails = await loadHtml("./pages/storyDetails/storyDetails.html")
  
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
        document.getElementById("content").innerHTML =
        `<h2>Welcome!</h2>
      <p style='margin-top:2em'>
      Welcome to StoryWeaver, a simple lightweight tool for creating and playing Interactive Fiction-games.
      </p>
     `
      },
      "/about": () => {
        renderHtml(templateAbout, "content")
    },
    "/stories": () => {
      renderHtml(templateStories, "content");
      initStories()
    },
    "/addStory": () => {
      renderHtml(templateAddStory, "content");
      initAddStory()
    },
    "/story-details/:id": (match) => {
      renderHtml(templateStoryDetails, "content");
      initStoryDetails(match)
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