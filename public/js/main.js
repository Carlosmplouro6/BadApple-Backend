const loginButton = document.getElementsByClassName("login");
const createButton = document.getElementsByClassName("create");
const loginSection = document.getElementsByClassName("loginSection");
const createSection = document.getElementsByClassName("createSection");
const buttonsSection = document.getElementsByClassName("buttons");

for (const button of loginButton) {
  button.addEventListener("click", () => {
    showLogin();
  });
}

for (const button of createButton) {
  button.addEventListener("click", () => {
    showCreate();
  });
}

function showLogin() {
  loginSection[0].classList.toggle("hidden");
  buttonsSection[0].classList.toggle("hidden");
}

function showCreate() {
  createSection[0].classList.toggle("hidden");
  buttonsSection[0].classList.toggle("hidden");
}
