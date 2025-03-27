import { API_URL } from "../../settings.js";
const URLstory = API_URL + "/story";
const URLnode = API_URL + "/node";
const URLchoice = API_URL + "/choice";

import { handleHttpErrors, makeOptions } from "../../utils.js";

export async function initEditStory(match) {
  const id = match?.data?.id;
  if (!id) {
    setStoryStatus("No story ID provided in URL");
    return;
  }

  fetchAndRenderEditDetails(URLstory, id);
}

async function fetchAndRenderEditDetails(URL, id) {
  const story = await fetchStoryDetails(URL, id);
  if (!story) return;

  renderStory(story);

}

async function fetchStoryDetails(URL, id) {
  let story = null;
  try {
    const response = await fetch(URL + "/" + id);
    story = await handleHttpErrors(response);
  } catch (err) {
    setStoryStatus("Failed to load story: " + err.message);
  }
  return story;
}

function renderStory(story) {
  document.getElementById("title").value = story.title;
  document.getElementById("description").value = story.description;
}

