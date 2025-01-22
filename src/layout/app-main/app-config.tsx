import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { FC, PropsWithChildren } from "react";
import { THEME } from "_/config/theme";
import { useToggleTheme } from "_/hooks/use-theme";
import { Theme, ThemeConf } from "#/app";
import cn from "_/help/cn";

type AppConfigProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const _ThemeList = fmtTheme();

/**
 * 主题配置
 * @param  AppConfigProps
 * @returns JSX.Element
 */
const AppConfig: FC<PropsWithChildren<AppConfigProps>> = ({
  visible,
  setVisible,
}) => {
  return (
    <Sidebar
      className="w-full md:w-[26rem] "
      position="right"
      header={
        <div className="text-xl font-semibold tracking-widest">
          系统主题配置
        </div>
      }
      visible={visible}
      onHide={() => setVisible(false)}
    >
      <Divider className=" my-0" />
      <div className="text-xl font-semibold mt-6 mb-3">Themes</div>
      <ThemeItem />
    </Sidebar>
  );
};

const ThemeItem = () => {
  const { theme, setTheme } = useToggleTheme();

  return (
    <div className="flex flex-col gap-2">
      {_ThemeList.map((group) => (
        <div className="mt-3" key={group.label}>
          <div className="font-medium ">{group.label}</div>
          <div className="grid grid-cols-6 md:grid-cols-4 gap-2 mt-2">
            {group.items.map((item) => (
              <div
                data-theme={item.group + "-" + item.label}
                key={item.label}
                className={cn(
                  "p-1 cursor-pointer h-6 rounded-full border border-solid border-neutral-300 dark:border-neutral-200",
                  theme === item.theme && "border-blue-600 dark:border-blue-400"
                )}
                onClick={setTheme.bind(null, item.theme)}
              >
                <div
                  className="size-full rounded-full"
                  style={{ background: item?.backgrounds[0] ?? "" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

function fmtTheme() {
  const map: {
    [key: string]: { label: string; items: (ThemeConf & { theme: Theme })[] };
  } = {};

  for (const key in THEME) {
    const theme = THEME[key as Theme];
    if (!map[theme.group]) {
      map[theme.group] = {
        label: theme.group,
        items: [],
      };
    }
    map[theme.group].items.push({
      ...theme,
      theme: key as Theme,
    });
  }

  return Object.values(map);
}

export default AppConfig;
