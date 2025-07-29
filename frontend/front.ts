const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const responseText = document.getElementById("response") as HTMLParagraphElement;
const registerBtn = document.getElementById("registerBtn")!;
const loginBtn = document.getElementById("loginBtn")!;

async function envoyerRequest(username: string, password: string, action: "register" | "login") {
  const res = await fetch("http://localhost:8000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, action }),
  });
  const data = await res.json();
  responseText.textContent = data.status + (data.error ? " : " + data.error : "");
  responseText.className = data.status === "Accepte" ? "success" : "error";
}

registerBtn.addEventListener("click", () => {
  envoyerRequest(usernameInput.value, passwordInput.value, "register");
});

loginBtn.addEventListener("click", () => {
  envoyerRequest(usernameInput.value, passwordInput.value, "login");
});