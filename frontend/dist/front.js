"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
const list = document.getElementById("messageList");
function fetchMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("http://backend:8000");
        ;
        const messages = yield res.json();
        list.innerHTML = "";
        messages.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = msg.content;
            list.appendChild(li);
        });
    });
}
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    yield fetch("http://backend:8000", {
        method: "POST",
        body: JSON.stringify({ content: input.value }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    input.value = "";
    fetchMessages();
}));
fetchMessages();
