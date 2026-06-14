document.addEventListener("DOMContentLoaded", function () {
  const toggleButtons = document.querySelectorAll(".toggle-details");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const detailsId = button.getAttribute("aria-controls");
      const detailsElement = document.getElementById(detailsId);

      if (!detailsElement) {
        return;
      }

      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));

      if (isExpanded) {
        detailsElement.hidden = true;
        button.textContent = "See more details";
      } else {
        detailsElement.hidden = false;
        button.textContent = "Hide details";
      }
    });
  });
});