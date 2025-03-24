import { API_URL } from "../../settings.js";
const URL = API_URL + "/story";

import { handleHttpErrors, makeOptions } from "../../utils.js";

export async function initStoryDetails(match) {
  const id = match?.data?.id;
  if (!id) {
    setStoryStatus("No story ID provided in URL");
    return;
  }

  try {
    const story = await fetch(URL + "/" + id).then(handleHttpErrors);
    renderStory(story);
  } catch (err) {
    if (err.apiError) {
      setStoryStatus(err.apiError.message);
    } else {
      setStoryStatus("Failed to load story: " + err.message);
    }
  }
}

function renderStory(story) {
  document.getElementById("story-title").innerText = story.title;
  document.getElementById("story-description").innerText = story.description;
}

function setStoryStatus(msg) {
  document.getElementById("story-status").innerText = msg;
}
