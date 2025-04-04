import { API_URL } from "../../settings.js";
const URLstory = API_URL + "/story";
const URLnode = API_URL + "/node";
const URLchoice = API_URL + "/choice";

import { handleHttpErrors, makeOptions } from "../../utils.js";

let handlersInitialized = false;
let storyId = null;

export async function initEditStory(match) {
  const id = match?.data?.id;
  if (!id) {
    setStoryStatus("No story ID provided in URL");
    return;
  }

  if (!handlersInitialized) {
    document
      .getElementById("edit-story-btn")
      .addEventListener("click", editStory);
    document.getElementById("add-node-btn").addEventListener("click", addNode);
    handlersInitialized = true;
  }

  storyId = id;
  fetchAndRenderStory(URLstory, id);
  fetchAndRenderStoryNodes(id);
}

//#region Edit Story
async function fetchAndRenderStory(URL, id) {
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

async function editStory(evt) {
  evt.preventDefault();
  const storyData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
  };

  try {
    const options = makeOptions("PUT", storyData);
    await fetch(URLstory + "/" + storyId, options).then(handleHttpErrors);

    setStoryStatus("Story successfully updated");
  } catch (error) {
    if (error.apiError) {
      setStoryStatus(error.apiError.message);
    } else {
      setStoryStatus("Failed to update story: " + error.message);
    }
  }
}

//#endregion Edit Story

//#region  Edit Story Nodes
async function fetchAndRenderStoryNodes(id) {
  const nodes = await fetchStoryNodes(id);
  renderStoryNodes(nodes);
}

async function fetchStoryNodes(id) {
  try {
    const response = await fetch(URLstory + "/" + id + "/nodes").then(
      handleHttpErrors
    );
    return response;
  } catch (err) {
    setStoryStatus("Failed to load nodes: " + err.message);
  }
}

function renderStoryNodes(nodes) {
  const container = document.getElementById("story-nodes-area");
  container.innerHTML = ""; // Clear previous content

  nodes.forEach((node) => {
    const card = document.createElement("div");
    card.className = "card mb-3";

    card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${node.title || "Untitled Node"}</h5>
          <p class="card-text">${node.text || "No content"}</p>
          <button class="btn btn-sm btn-primary edit-node-btn" data-node-id="${
            node.id
          }">Edit</button>
        </div>
      `;

    container.appendChild(card);
  });
}
//#endregion Edit Story Nodes

//#region Add Node
async function addNode(evt) {
  evt.preventDefault();
  const nodeData = {
    text: document.getElementById("node-text").value,
    title: document.getElementById("node-title").value,
    storyId: storyId,
  };

  try {
    const options = makeOptions("POST", nodeData);
    await fetch(URLnode, options).then(handleHttpErrors);

    setStoryStatus("Node successfully created");
    fetchAndRenderStoryNodes(storyId); // Refresh the nodes after adding a new one
  } catch (error) {
    if (error.apiError) {
      setStoryStatus(error.apiError.message);
    } else {
      setStoryStatus("Failed to create node: " + error.message);
    }
  }
}
//#endregion Add Node
//#region Helper functions
function setStoryStatus(msg) {
  document.getElementById("info-space").innerText = msg;
}
//#endregion Helper functions