// src/components/choicesModal.js
import { createChoice, fetchStoryNodes } from "../api.js";
import { handleHttpErrors } from "../utils.js";

let bootstrapModal, currentNodeId, currentStoryId, currentStartNodeId;

export function initChoicesModal() {
  const modalEl   = document.getElementById("choicesModal");
  bootstrapModal  = new bootstrap.Modal(modalEl);

  document.getElementById("add-choice-toggle")
    .addEventListener("click", () => {
      document.getElementById("add-choice-form").style.display = "block";
    });

  document.getElementById("add-choice-form")
    .addEventListener("submit", async e => {
      e.preventDefault();
      const text     = document.getElementById("choice-text").value;
      const toNodeId = document.getElementById("choice-target").value;
      try {
        await createChoice({ fromNodeId: currentNodeId, toNodeId, text });
        await reloadChoices();
      } catch (err) {
        alert(err.apiError?.message || err.message);
      }
    });
}

async function reloadChoices() {
  // re-fetch nodes so we have up-to-date outgoing & incoming info
  const nodes = await fetchStoryNodes(currentStoryId);
  const me    = nodes.find(n => n.id === currentNodeId);

  // 1) List outgoing
  const list = document.getElementById("choices-list");
  list.innerHTML = "";
  me.outgoingChoices.forEach(c => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = c.text + " → " +
      (nodes.find(n => n.id === c.toNodeId)?.title || "…");
    list.appendChild(li);
  });

  // 2) Repopulate “Leads to” dropdown with nodes that have no incoming
  const select = document.getElementById("choice-target");
  select.innerHTML = "";
  nodes
    .filter(n => !n.hasIncomingChoice && n.id !== currentStartNodeId) 
    .forEach(n => {
      const opt = document.createElement("option");
      opt.value   = n.id;
      opt.text    = n.title;
      select.appendChild(opt);
    });

  // clear form
  document.getElementById("choice-text").value = "";
}

export async function openManageChoices(node, storyId, storyStartNodeId) {
  currentNodeId = node.id;
  currentStoryId = storyId;
  currentStartNodeId = storyStartNodeId;
  document.getElementById("choicesModalLabel").textContent =
    `Choices for “${node.title}”`;
  await reloadChoices();
  bootstrapModal.show();
}
