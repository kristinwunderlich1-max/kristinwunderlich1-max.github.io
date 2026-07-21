const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const dropdownButtons = document.querySelectorAll(".nav-dropdown-button");

function closeDropdowns(exceptButton = null) {
  dropdownButtons.forEach((button) => {
    if (button === exceptButton) return;
    button.setAttribute("aria-expanded", "false");
    const menu = document.getElementById(button.getAttribute("aria-controls"));
    if (menu) menu.classList.remove("open");
  });
}

function closeMobileMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  closeDropdowns();
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    if (!open) closeDropdowns();
  });
}

dropdownButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const menu = document.getElementById(button.getAttribute("aria-controls"));
    if (!menu) return;
    const willOpen = !menu.classList.contains("open");
    closeDropdowns(button);
    menu.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-item-dropdown")) closeDropdowns();
  if (window.innerWidth <= 850 && nav?.classList.contains("open") &&
      !event.target.closest(".site-header")) closeMobileMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdowns();
    if (nav?.classList.contains("open")) {
      closeMobileMenu();
      menuButton?.focus();
    }
  }
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 850) closeMobileMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 850) closeMobileMenu();
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

function sendEvent(name, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const text = link.textContent.trim().replace(/\s+/g, " ").slice(0, 100);
  const url = link.getAttribute("href") || "";
  if (link.closest(".dropdown-menu")) sendEvent("navigation_dropdown_click", {link_text: text, link_url: url});
  if (link.closest(".journey-nav")) sendEvent("tplo_journey_click", {link_text: text, link_url: url});
  if (link.closest(".article-navigation")) sendEvent("article_sequence_click", {link_text: text, link_url: url});
  if (link.closest(".download-grid") || /\.(pdf)$/i.test(url)) sendEvent("file_download", {file_name: url.split("/").pop(), link_text: text});
});
