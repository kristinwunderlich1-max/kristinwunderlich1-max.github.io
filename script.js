const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const mobileBreakpoint = 850;

function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= mobileBreakpoint &&
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > mobileBreakpoint) closeMenu();
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

function sendAnalyticsEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const linkText = link.textContent.trim().replace(/\s+/g, " ").slice(0, 100);
  const destination = link.getAttribute("href") || "";

  if (link.closest(".journey-nav")) {
    sendAnalyticsEvent("tplo_journey_click", {
      link_text: linkText,
      link_url: destination
    });
  } else if (link.closest(".article-navigation")) {
    sendAnalyticsEvent("article_sequence_click", {
      link_text: linkText,
      link_url: destination
    });
  } else if (link.closest(".related-guides-section")) {
    sendAnalyticsEvent("related_guide_click", {
      link_text: linkText,
      link_url: destination
    });
  } else if (link.classList.contains("button") || link.closest(".journey-card, .topic-card-link")) {
    sendAnalyticsEvent("resource_selection", {
      link_text: linkText,
      link_url: destination
    });
  }

  if (/\.(pdf|docx?|xlsx?|zip)$/i.test(destination)) {
    sendAnalyticsEvent("file_download", {
      file_name: destination.split("/").pop(),
      link_text: linkText,
      link_url: destination
    });
  }
});
