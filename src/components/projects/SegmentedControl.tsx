import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { VelocityTracker, nearestIndex, project, rubberband, springs } from '@/lib/motion';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

interface DragState {
  pointerId: number;
  startX: number;
  thumbStart: number;
  onThumb: boolean;
  moved: boolean;
  hoverIndex: number;
  tracker: VelocityTracker;
}

const DRAG_SLOP = 10;
const FLICK_VELOCITY = 300;

/**
 * iOS-style segmented control. The selected thumb can be dragged 1:1, rubber-bands at the
 * ends, and on release lands where the flick was heading, carrying the finger's velocity.
 * Taps highlight on press and commit on release; keyboard follows radiogroup semantics.
 */
export default function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragRef = useRef<DragState | null>(null);
  const pendingVelocity = useRef<number | undefined>(undefined);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const width = useMotionValue(0);
  const scale = useMotionValue(1);

  const [ready, setReady] = useState(false);
  const [pressed, setPressed] = useState<number | null>(null);

  const selected = Math.max(0, options.findIndex((o) => o.value === value));

  const geometry = useCallback((i: number) => {
    const b = buttonRefs.current[i];
    return b ? { x: b.offsetLeft, w: b.offsetWidth, c: b.offsetLeft + b.offsetWidth / 2 } : { x: 0, w: 0, c: 0 };
  }, []);

  const centers = () => options.map((_, i) => geometry(i).c);

  const moveThumb = useCallback(
    (i: number, velocity?: number) => {
      const g = geometry(i);
      if (reduceMotion) {
        x.jump(g.x);
        width.jump(g.w);
        return;
      }
      const flick = velocity !== undefined && Math.abs(velocity) > FLICK_VELOCITY;
      animate(x, g.x, { ...(flick ? springs.flick : springs.default), velocity });
      animate(width, g.w, springs.default);
    },
    [geometry, reduceMotion, x, width],
  );

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  // Place instantly on mount, after fonts load, and on resize.
  useLayoutEffect(() => {
    const place = () => {
      const g = geometry(selectedRef.current);
      x.jump(g.x);
      width.jump(g.w);
    };
    place();
    setReady(true);
    document.fonts?.ready.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [geometry, x, width]);

  // Animate whenever the selection changes, handing off any velocity from a flick.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    moveThumb(selected, pendingVelocity.current);
    pendingVelocity.current = undefined;
  }, [selected, moveThumb]);

  const commit = (i: number, velocity?: number) => {
    if (i === selected) {
      moveThumb(i, velocity); // snap back home
      return;
    }
    pendingVelocity.current = velocity;
    onChange(options[i]!.value);
  };

  const indexFromPoint = (clientX: number, clientY: number): number => {
    const el = document.elementFromPoint(clientX, clientY);
    const b = el?.closest('button[data-index]');
    return b && containerRef.current?.contains(b) ? Number(b.getAttribute('data-index')) : -1;
  };

  const localX = (clientX: number) => {
    const c = containerRef.current!;
    return clientX - c.getBoundingClientRect().left;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const b = (e.target as Element).closest('button[data-index]');
    if (!b) return;
    const i = Number(b.getAttribute('data-index'));
    e.currentTarget.setPointerCapture(e.pointerId);
    const onThumb = i === selected;
    const tracker = new VelocityTracker();
    tracker.add(e.clientX, e.timeStamp);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: localX(e.clientX),
      thumbStart: x.get(),
      onThumb,
      moved: false,
      hoverIndex: i,
      tracker,
    };
    if (onThumb) {
      if (!reduceMotion) animate(scale, 0.95, springs.press); // the thumb "picks up"
    } else {
      setPressed(i); // instant feedback on press
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    d.tracker.add(e.clientX, e.timeStamp);
    const dx = localX(e.clientX) - d.startX;
    if (!d.moved && Math.abs(dx) > DRAG_SLOP) d.moved = true;

    if (d.onThumb && d.moved) {
      // 1:1 tracking from where it was grabbed, rubber-banding past the ends.
      const last = geometry(options.length - 1);
      const min = geometry(0).x;
      const max = last.x + last.w - width.get();
      const span = containerRef.current?.clientWidth ?? 300;
      let next = d.thumbStart + dx;
      if (next < min) next = min + rubberband(next - min, span);
      if (next > max) next = max + rubberband(next - max, span);
      x.set(next);

      const hover = nearestIndex(centers(), next + width.get() / 2);
      if (hover !== d.hoverIndex) {
        d.hoverIndex = hover;
        animate(width, geometry(hover).w, springs.default);
      }
    } else if (!d.onThumb) {
      // Drag away to cancel, back to re-arm.
      const over = indexFromPoint(e.clientX, e.clientY);
      setPressed(over >= 0 && over !== selected ? over : null);
    }
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    dragRef.current = null;
    setPressed(null);
    animate(scale, 1, springs.press);
    if (cancelled) {
      moveThumb(selected);
      return;
    }
    if (d.onThumb && d.moved) {
      const v = d.tracker.velocity();
      const projected = x.get() + width.get() / 2 + project(v, 0.99);
      commit(nearestIndex(centers(), projected), v);
    } else {
      const i = indexFromPoint(e.clientX, e.clientY);
      if (i >= 0) commit(i);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = options.length;
    let i: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        i = (selected + 1) % n;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        i = (selected - 1 + n) % n;
        break;
      case 'Home':
        i = 0;
        break;
      case 'End':
        i = n - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    commit(i);
    buttonRefs.current[i]?.focus();
  };

  // Pointer input is handled above; this only covers keyboard activation (Enter/Space).
  const onClick = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    if (e.detail === 0) commit(i);
  };

  return (
    <div
      ref={containerRef}
      className={`segmented${ready ? ' is-ready' : ''}`}
      role="radiogroup"
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endDrag(e, false)}
      onPointerCancel={(e) => endDrag(e, true)}
      onKeyDown={onKeyDown}
    >
      <motion.span className="segmented-thumb" aria-hidden="true" style={{ x, width, scale }} />
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          type="button"
          role="radio"
          data-index={i}
          aria-checked={i === selected}
          tabIndex={i === selected ? 0 : -1}
          className={pressed === i ? 'is-pressed' : undefined}
          onClick={(e) => onClick(e, i)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
