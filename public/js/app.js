// js/app.js

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".bottom-nav-btn");

function switchScreen(id) {
  screens.forEach((s) =>
    s.id === id
      ? s.classList.add("screen--active")
      : s.classList.remove("screen--active")
  );
  navButtons.forEach((btn) => {
    btn.classList.toggle(
      "bottom-nav-btn--active",
      btn.dataset.screen === id
    );
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.screen;
    switchScreen(target);
  });
});

// делаем функцию глобальной, чтобы profile.js мог её звать
window.switchScreen = switchScreen;
