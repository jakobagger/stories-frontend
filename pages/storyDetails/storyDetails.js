import { API_URL } from "../../settings.js";
const URLstory = API_URL + "/story";
const URLnode = API_URL + "/node";

import { handleHttpErrors, makeOptions } from "../../utils.js";

export async function initStoryDetails(match) {
  const id = match?.data?.id;
  if (!id) {
    setStoryStatus("No story ID provided in URL");
    return;
  }

  fetchAndRenderStoryDetails(URLstory, id);
}

async function fetchAndRenderStoryDetails(URL, id) {

  setStoryStatus("");
  document.getElementById("story-node-text").innerText = "";
  document.getElementById("story-choices").innerHTML = "";

  const story = await fetchStoryDetails(URL, id);
  if (!story) return;

  renderStory(story);

  if (!story.startNodeId) {
    setStoryStatus("Story has no start node.");
    return;
  }

  fetchAndRenderNode(story.startNodeId);
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
  document.getElementById("story-title").innerText = story.title;
  document.getElementById("story-description").innerText = story.description;
}

function setStoryStatus(msg) {
  document.getElementById("story-status").innerText = msg;
}

async function fetchAndRenderNode(nodeId) {
  try {
    const response = await fetch(URLnode +'/' + nodeId);
    const node = await handleHttpErrors(response);
    renderNode(node);
  } catch (err) {
    setStoryStatus("Failed to load node: " + err.message);
  }
}

function renderNode(node) {
  const nodeTextElement = document.getElementById("story-node-text");
  const choicesElement = document.getElementById("story-choices");

  nodeTextElement.innerText = node.text;
  choicesElement.innerHTML = "";

  node.outgoingChoices?.forEach(choice => {
    const button = document.createElement("button");
    button.innerText = choice.text;
    button.classList.add("btn", "btn-primary", "mb-2", "me-2");

    button.addEventListener("click", () => {
      fetchAndRenderNode(choice.toNodeId);
    });

    choicesElement.appendChild(button);
  });
}




