import { FC, PropsWithChildren } from "react";
import cn from "_/help/cn";

type FieldErrorProps = {
  error: string;
  className?: string;
  children?: React.ReactNode;
};

const FieldError: FC<PropsWithChildren<FieldErrorProps>> = ({
  error,
  className,
  children,
}: FieldErrorProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      <small
        className={cn(
          "text-red-500 absolute bg-white right-2 pb-1 px-2 bottom-0 translate-y-1/2 ",
          error ? "inline" : "hidden"
        )}
      >
        {error}
      </small>
    </div>
  );
};

export default FieldError;
