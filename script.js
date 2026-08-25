const year = document.getElementById("year");
const backToTop = document.querySelector(".back-to-top");
const navLinks = [...document.querySelectorAll("nav a[data-section]")];
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

year.textContent = new Date().getFullYear();

const setActiveLink = (sectionId) => {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    if (isActive) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveLink(visible.target.id);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

const updateBackToTop = () => {
  backToTop.hidden = window.scrollY < 500;
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});
