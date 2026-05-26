import confetti from "canvas-confetti";

export function firePublishConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const duration = 2800;
  const end = Date.now() + duration;

  const frame = () => {
    void confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#D4AF37", "#FFFFF0", "#B76E79", "#f2ca50"],
    });
    void confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#D4AF37", "#FFFFF0", "#B76E79", "#f2ca50"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  void confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#D4AF37", "#FFFFF0", "#B76E79", "#f2ca50"],
  });

  frame();
}
