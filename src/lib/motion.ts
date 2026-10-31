import type { Transition } from 'motion/react';

/**
 * Springs expressed the Apple way: `visualDuration` ≈ response, `bounce` ≈ 1 − damping ratio.
 * Default is critically damped; bounce is reserved for motion the user threw.
 */
export const springs = {
  default: { type: 'spring', visualDuration: 0.35, bounce: 0 },
  layout: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  flick: { type: 'spring', visualDuration: 0.35, bounce: 0.2 },
  press: { type: 'spring', visualDuration: 0.2, bounce: 0 },
} satisfies Record<string, Transition>;

/** Where a release at `velocity` (px/s) would come to rest — exponential deceleration. */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Index of the point in `points` nearest to `value`. */
export function nearestIndex(points: readonly number[], value: number): number {
  let best = 0;
  let bestDistance = Infinity;
  points.forEach((p, i) => {
    const d = Math.abs(p - value);
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return best;
}

/** Progressive resistance past a boundary — the further out, the less it follows. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Keeps ~100 ms of pointer samples and reports release velocity in px/s. */
export class VelocityTracker {
  private samples: { x: number; t: number }[] = [];

  add(x: number, t: number): void {
    this.samples.push({ x, t });
    while (this.samples.length > 2 && t - this.samples[0]!.t > 100) this.samples.shift();
  }

  velocity(): number {
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    if (!first || !last || first === last) return 0;
    const dt = (last.t - first.t) / 1000;
    return dt > 0 ? (last.x - first.x) / dt : 0;
  }
}
