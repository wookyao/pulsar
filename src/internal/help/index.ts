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

/**
 * 获取系统的当前模式
 * @returns 系统的当前模式
 */
export function getSystemMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function changeThemeStyleFile(
  newTheme: string,
  linkId: string = "#theme-link"
) {
  // 获取指定的link标签
  const eLink = document.querySelector(linkId) as HTMLLinkElement;
  // 判断link 标签是否移动到指定位置
  const hasDataMove = eLink.hasAttribute("data-moved");
  const head = document.head;
  if (!hasDataMove) {
    const styleElement = document.querySelector(
      "style[data-primereact-style-id]"
    );
    eLink.setAttribute("data-moved", "");
    head.insertBefore(eLink, styleElement);
  }

  //  获取当前的主题样式文件
  const prevLinkUrl = eLink.href;

  // 创建一个新的link标签
  let newLink = document.querySelector("#theme-link-bak") as HTMLLinkElement;
  if (!newLink) {
    newLink = document.createElement("link");
    newLink.id = "theme-link-bak";
    newLink.rel = "stylesheet";
    head.insertBefore(newLink, eLink);
    newLink.href = prevLinkUrl;
  }

  //  获取新的主题样式文件
  const newLinkUrl = `/themes/${newTheme}/theme.css`;
  newLink.href = newLinkUrl;

  // 修改 link 标签的 href 属性
  setTimeout(() => {
    eLink.href = newLinkUrl;
  }, 300);
}
