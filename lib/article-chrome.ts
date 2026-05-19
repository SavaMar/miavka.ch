/** Heights for fixed nav + reading progress (article pages). Keep in sync across components. */
export const NAV_HEIGHT_SM_PX = 72;
export const NAV_HEIGHT_MD_PX = 80;
export const READING_PROGRESS_BAR_HEIGHT_PX = 36;

/** Pixel distance from viewport top to first line of article content below fixed chrome. */
export function stickyChromeBottomPx(isMinMd: boolean): number {
  return (isMinMd ? NAV_HEIGHT_MD_PX : NAV_HEIGHT_SM_PX) + READING_PROGRESS_BAR_HEIGHT_PX;
}
