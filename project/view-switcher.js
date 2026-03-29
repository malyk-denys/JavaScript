document.addEventListener("DOMContentLoaded", () => {
  const viewLinks = document.querySelectorAll("[data-view-link]");
  const pageViews = document.querySelectorAll(".page-view");
  const navLinks = document.querySelectorAll(".site-header-menu-link");
  const navCollapse = document.getElementById("mainNav");

  function showView(viewName) {
    pageViews.forEach((view) => {
      view.classList.remove("is-active");
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add("is-active");
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.viewLink === viewName) {
        link.classList.add("active");
      }
    });

    history.replaceState(null, "", `#${viewName}`);

    if (navCollapse && navCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.hide();
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const viewName = link.dataset.viewLink;
      showView(viewName);
    });
  });

  const initialView = window.location.hash
    ? window.location.hash.replace("#", "")
    : "home";

  showView(initialView);
});