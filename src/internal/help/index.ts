/**
 * 检测用户的系统是否被开启了动画减弱功能
 * @link https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-reduced-motion
 */
export function isReducedMotion() {
  return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
}

/**
 * 检测用户的系统是否是暗黑模式
 * @returns true 表示当前系统是暗黑模式，false 表示当前系统是亮色模式
 */
export function isDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
/**
 * 检测用户的系统是否是亮色模式
 * @returns true 表示当前系统是亮色模式，false 表示当前系统是暗黑模式
 */
export function isLightMode() {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}
