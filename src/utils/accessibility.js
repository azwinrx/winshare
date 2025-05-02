export const setupAccessibility = () => {
  // Add ARIA labels to interactive elements
  document.querySelectorAll("button:not([aria-label])").forEach((button) => {
    if (button.textContent) {
      button.setAttribute("aria-label", button.textContent.trim());
    }
  });

  // Make sure all images have alt text
  document.querySelectorAll("img:not([alt])").forEach((img) => {
    img.setAttribute("alt", "");
  });

  // Add keyboard navigation for dropdown menus
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger");
    const content = dropdown.querySelector(".dropdown-content");

    if (trigger && content) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-haspopup", "true");
      content.setAttribute("role", "menu");

      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger.click();
        }
      });
    }
  });
};

export const setupMapAccessibility = (mapElement) => {
  if (!mapElement) return;

  // Add ARIA role and label
  mapElement.setAttribute("role", "application");
  mapElement.setAttribute(
    "aria-label",
    "Interactive map showing story location"
  );

  // Add keyboard navigation instructions
  const instructions = document.createElement("p");
  instructions.className = "sr-only";
  instructions.textContent =
    "Use arrow keys to pan map, plus and minus keys to zoom";
  mapElement.parentNode.insertBefore(instructions, mapElement);

  // Make map element focusable
  mapElement.setAttribute("tabindex", "0");
};
