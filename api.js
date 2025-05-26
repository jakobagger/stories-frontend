import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions } from "../../utils.js";
const URLstory = API_URL + "/story";
const URLnode = API_URL + "/node";
const URLchoice = API_URL + "/choice";

export function deleteNode(id) {
  return fetch(`${URLnode}/${id}`, makeOptions("DELETE"))
    .then(handleHttpErrors);
}