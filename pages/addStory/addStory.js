import { API_URL } from "../../settings.js";
const URL = API_URL + "/story";

import { handleHttpErrors, makeOptions } from "../../utils.js";
let handlersInitialized = false;

export async function initAddStory() {
    if (!handlersInitialized) {
        document.getElementById('add-story-btn').addEventListener("click", addStory);
        handlersInitialized = true;
    }

    document.getElementById("info-space").innerText = "";
}

async function addStory(event) {
    event.preventDefault();

    const storyData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
    };

    try {
        const options = makeOptions("POST", storyData);
        await fetch(URL, options).then(handleHttpErrors);

        setStatus("Story successfully created");

        clearInputFields();
    } catch (error) {
        if (error.apiError) {
            setStatus(error.apiError.message);
        } else {
            setStatus("Failed to add story: " + error.message);
        }
    }
}

function clearInputFields() {
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
}

function setStatus(msg) {
    document.getElementById("info-space").innerText = msg;
}
