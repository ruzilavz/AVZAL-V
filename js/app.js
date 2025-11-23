// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const navButtons = document.querySelectorAll(".bottom-nav-btn");

  if (!screens.length || !navButtons.length) {
    console.warn("UI elements for screen switcher not found");
    return;
  }

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

      if (
        (target === "screen-chat" || target === "screen-profile") &&
        !(window.isAuthenticated && window.isAuthenticated())
      ) {
        if (window.requireAuthOverlay) {
          window.requireAuthOverlay(target);
        }
        switchScreen(target);
        return;
      }

      switchScreen(target);
    });
  });

  // делаем функцию глобальной, чтобы profile.js мог её звать
  window.switchScreen = switchScreen;
});

