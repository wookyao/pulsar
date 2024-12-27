import { icons } from 'lucide-react';


type IconProps = {
  name: string;
  color?: string;
  size?: number;
} & React.ComponentProps<"svg">;

const Icon = ({ name, color, size, ...props }: IconProps) => {
  const LucideIcon = icons[name as any as keyof typeof icons];

  return <LucideIcon color={color} size={size} {...props} />;
};

export default Icon;

