import anime from "animejs";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export function animateTextReveal(targets: string | HTMLElement[]) {
  if (prefersReducedMotion) {
    anime.set(targets, { opacity: 1, translateY: 0 });
    return;
  }
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: "easeOutExpo",
    duration: 700,
    delay: anime.stagger(35),
  });
}

export function animateStaggerIn(targets: string | HTMLElement[]) {
  if (prefersReducedMotion) {
    anime.set(targets, { opacity: 1, translateY: 0 });
    return;
  }
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [24, 0],
    easing: "easeOutCubic",
    duration: 500,
    delay: anime.stagger(40),
  });
}

export function animateFadeUp(targets: string | HTMLElement | HTMLElement[]) {
  if (prefersReducedMotion) {
    anime.set(targets, { opacity: 1, translateY: 0 });
    return;
  }
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [16, 0],
    easing: "easeOutCubic",
    duration: 500,
  });
}

export function animateLetterReveal(target: HTMLElement) {
  if (prefersReducedMotion) {
    target.style.opacity = "1";
    return;
  }

  const text = target.textContent || "";
  target.innerHTML = "";
  target.style.opacity = "1";

  const letters = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.opacity = "0";
    target.appendChild(span);
    return span;
  });

  return anime({
    targets: letters,
    opacity: [0, 1],
    translateY: [12, 0],
    easing: "easeOutExpo",
    duration: 600,
    delay: anime.stagger(30),
  });
}

export function animateLineReveal(targets: string | HTMLElement[]) {
  if (prefersReducedMotion) {
    anime.set(targets, { opacity: 1, translateY: 0 });
    return;
  }
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [8, 0],
    easing: "easeOutCubic",
    duration: 400,
    delay: anime.stagger(100),
  });
}
