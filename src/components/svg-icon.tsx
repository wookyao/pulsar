import React, { useMemo } from "react";

interface BaseSvgIconProps {
  iconName?: string;
  className?: string;
  size?: number;
}

const style: React.CSSProperties = {
  verticalAlign: "-0.15em",
  fill: "currentColor",
  overflow: "hidden",
};

const BaseSvgIcon: React.FC<BaseSvgIconProps> = ({
  iconName,
  className,
  size,
}) => {
  const computedIconName = useMemo(() => {
    return iconName ? `#icon-${iconName}` : "#icon";
  }, [iconName]);

  const svgClass = useMemo(() => {
    return className ? "svg-icon " + className : "svg-icon";
  }, [className]);

  return (
    <svg
      style={style}
      className={svgClass}
      aria-hidden="true"
      width={size}
      height={size}
    >
      <use xlinkHref={computedIconName}></use>
    </svg>
  );
};

export default BaseSvgIcon;
