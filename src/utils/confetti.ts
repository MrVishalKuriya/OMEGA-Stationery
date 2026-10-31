import confetti from 'canvas-confetti';

/**
 * Triggers a luxury golden & copper celebration confetti burst
 */
export const triggerLuxuryConfetti = () => {
  // Burst 1: Golden & Amber stars
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#D4AF37', '#E5B869', '#F59E0B', '#AA771C', '#FFFFFF'],
    shapes: ['star', 'circle'],
    ticks: 200,
    gravity: 1.1,
  });

  // Burst 2: Side champagne streamers
  setTimeout(() => {
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.75 },
      colors: ['#D4AF37', '#6B140B', '#9E3618', '#FCF6BA'],
    });
    confetti({
      particleCount: 25,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.75 },
      colors: ['#D4AF37', '#6B140B', '#9E3618', '#FCF6BA'],
    });
  }, 120);
};

/**
 * Mini celebration for adding to cart
 */
export const triggerCartConfetti = () => {
  confetti({
    particleCount: 20,
    spread: 45,
    origin: { y: 0.8 },
    colors: ['#D4AF37', '#E5B869', '#9E3618', '#26130F'],
    ticks: 120,
    scalar: 0.85,
  });
};
