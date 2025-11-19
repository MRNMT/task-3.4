const accordions = document.querySelectorAll(".accordion");

accordions.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
    console.log(btn.children)
    const panel = this.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});
