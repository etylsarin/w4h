/* Sdílené pomůcky pro skripty komponent. */

export const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => Array.from(ctx.querySelectorAll<T>(sel));

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

/* Všechny efekty závislé na scrollu běží v jednom snímku requestAnimationFrame. */
const frameCallbacks: Array<() => void> = [];
let ticking = false;

function requestFrame() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    frameCallbacks.forEach((cb) => cb());
  });
}

export function onScrollFrame(cb: () => void) {
  if (!frameCallbacks.length) {
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame);
  }
  frameCallbacks.push(cb);
  requestFrame();
}
