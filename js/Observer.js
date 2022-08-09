const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting === true) {
        const listItems = document.querySelectorAll(".section-list li");
        listItems.forEach((item) => {
          let sectionName = item.firstElementChild
            .getAttribute("href")
            .slice(1);
          if (entry.target.id === sectionName) {
            item.classList.add("item-active");
          } else {
            item.classList.remove("item-active");
          }
        });
      }
    });
  },
  { threshold: 0.25 }
);

export const observeElem = (element) => {
  observer.observe(element);
};
