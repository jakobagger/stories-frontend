"use strict";
console.log("playStory.js loaded!"); 


document.addEventListener("DOMContentLoaded", start);
let currentScene;

function start(){
 console.log("JS running");
 registerButtonClicks();
 currentScene = firstScene;
 showScene(firstScene);   
}

const scene1A = {
    title: "endnu en scene",
    text: "Noget mere tekst",
    choices: [
        {name: "Endnu et valg"},
        {node: null}
    ]
}

const scene1B = {
    title: "Tredje scene",
    text: "tekst tekst tekst",
    choices: [
        {
            name: "valg et",
            node: null
        },
        {
            name: "valg to",
            node: null
        }
    ]

}

const firstScene = {
    title: "Første scene",
    text: /*html*/`<p> Historien begynder </p>`,
    choices: [
        {
            name: "Valg et",
            node: scene1A
        },
        {
            name: "Valg to",
            node: scene1B
        }
    ]
}

function registerButtonClicks(){
    document.querySelector("main").addEventListener("click", userClicked);
}

function userClicked(evt){
    console.log(evt.target.tagName);
    if (evt.target.tagName === "BUTTON"){
        buttonClicked(evt.target);
    }
}

function buttonClicked(button){
    button.parentElement.remove();

    const index = Number(button.id.substring(10));
    const choice = currentScene.choices[index];

    currentScene = choice.node;

    showScene(currentScene);
}



function showScene(scene){
    const html = /*html*/`<div class="scene">
    <h2>${scene.title}</h2>
    <div>${scene.text}</div>
    <div class="choices">
        ${scene.choices.map((choice, i) => `<button id="btn-choice${i}">${choice.name}</button>`).join(" ")}
    </div>
    </div>
    `

    document.getElementById("main").insertAdjacentHTML("beforeend", html);
}