import { Theme, ThemeConf } from "#/app";

export const THEME: Record<Theme, ThemeConf> = {
  "bootstrap-blue": {
    light: "bootstrap4-light-blue",
    dark: "bootstrap4-dark-blue",
    label: "Blue",
    group: "Bootstrap",
    backgrounds: [
      `linear-gradient(rgb(2, 123, 255) 0%, rgba(2, 123, 255, 0.5) 100%)`,
      `linear-gradient(rgb(2, 123, 255) 0%, rgba(2, 123, 255, 0.5) 100%)`,
    ],
  },
  "bootstrap-purple": {
    light: "bootstrap4-light-purple",
    dark: "bootstrap4-dark-purple",
    label: "Purple",
    group: "Bootstrap",
    backgrounds: [
      `linear-gradient(rgb(137, 60, 174) 0%, rgba(137, 60, 174, 0.5) 100%)`,
      `linear-gradient(rgb(137, 60, 174) 0%, rgba(137, 60, 174, 0.5) 100%)`,
    ],
  },
  "lara-amber": {
    light: "lara-light-amber",
    dark: "lara-dark-amber",
    label: "Amber",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(245, 158, 11) 0%, rgba(245, 158, 11, 0.5) 100%)`,
      `linear-gradient(rgb(245, 158, 11) 0%, rgba(245, 158, 11, 0.5) 100%)`,
    ],
  },
  "lara-blue": {
    light: "lara-light-blue",
    dark: "lara-dark-blue",
    label: "Blue",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(67, 120, 230) 0%, rgba(67, 120, 230, 0.5) 100%)`,
      `linear-gradient(rgb(67, 120, 230) 0%, rgba(67, 120, 230, 0.5) 100%)`,
    ],
  },
  "lara-cyan": {
    light: "lara-light-cyan",
    dark: "lara-dark-cyan",
    label: "Cyan",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(6, 182, 212) 0%, rgba(6, 182, 212, 0.5) 100%)`,
      `linear-gradient(rgb(6, 182, 212) 0%, rgba(6, 182, 212, 0.5) 100%)`,
    ],
  },
  "lara-green": {
    light: "lara-light-green",
    dark: "lara-dark-green",
    label: "Green",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(77, 172, 156) 0%, rgba(77, 172, 156, 0.5) 100%)`,
      `linear-gradient(rgb(77, 172, 156) 0%, rgba(77, 172, 156, 0.5) 100%)`,
    ],
  },
  "lara-indigo": {
    light: "lara-light-indigo",
    dark: "lara-dark-indigo",
    label: "Indigo",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(88, 95, 224) 0%, rgba(88, 95, 224, 0.5) 100%)`,
      `linear-gradient(rgb(88, 95, 224) 0%, rgba(88, 95, 224, 0.5) 100%)`,
    ],
  },
  "lara-pink": {
    light: "lara-light-pink",
    dark: "lara-dark-pink",
    label: "Pink",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(236, 72, 153) 0%, rgba(236, 72, 153, 0.5) 100%)`,
      `linear-gradient(rgb(137, 60, 174) 0%, rgba(137, 60, 174, 0.5) 100%)`,
    ],
  },
  "lara-purple": {
    light: "lara-light-purple",
    dark: "lara-dark-purple",
    label: "Purple",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(119, 88, 228) 0%, rgba(119, 88, 228, 0.5) 100%)`,
      `linear-gradient(rgb(119, 88, 228) 0%, rgba(119, 88, 228, 0.5) 100%)`,
    ],
  },
  "lara-teal": {
    light: "lara-light-teal",
    dark: "lara-dark-teal",
    label: "Teal",
    group: "Lara",
    backgrounds: [
      `linear-gradient(rgb(20, 184, 166) 0%, rgba(20, 184, 166, 0.5) 100%)`,
      `linear-gradient(rgb(20, 184, 166) 0%, rgba(20, 184, 166, 0.5) 100%)`,
    ],
  },
  "md-indigo": {
    light: "md-light-indigo",
    dark: "md-dark-indigo",
    label: "Indigo",
    group: "Material Design",
    backgrounds: [
      `linear-gradient(rgb(5, 101, 242) 0%, rgba(5, 101, 242, 0.5) 100%)`,
      `linear-gradient(rgb(5, 101, 242) 0%, rgba(5, 101, 242, 0.5) 100%)`,
    ],
  },
};

export const THEME_ICONS: Record<
  "Bootstrap" | "Lara" | "Material Design",
  Record<"dark" | "light", string>
> = {
  Bootstrap: {
    dark: "bootstrap4-dark.svg",
    light: "bootstrap4-light.svg",
  },
  Lara: {
    dark: "lara-dark.png",
    light: "lara-light.png",
  },
  "Material Design": {
    dark: "md-dark.svg",
    light: "md-light.svg",
  },
};
