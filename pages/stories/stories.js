import { API_URL } from "../../settings.js";
const URL = API_URL+"/story"

import { sanitizeStringWithTableRows, handleHttpErrors } from "../../utils.js";

export async function initStories(){
    getAndRenderStoryData();
}

async function getAndRenderStoryData(){
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storyData = await response.json();
        renderStoryData(storyData);
    } catch (error) {
        console.log("Error when trying to fetch stories: " + error);
    }
}


function renderStoryData(data) {
    const tableRows = data.map(story => `
    <tr>
    <td><a href="/#/story-details/${story.id}" class="btn btn-sm btn-primary">Play</a></td>
    <td><a href="/#/edit-story/${story.id}" class="btn btn-sm btn-primary">Edit</a></td>
    <td>${story.title}</td>
    <td>${story.description}</td>
    </tr>
    `)

    const tableRowsAsString = tableRows.join("")

    document.querySelector("#tbody").innerHTML =
    sanitizeStringWithTableRows(tableRowsAsString)
}