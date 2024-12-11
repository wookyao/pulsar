import React, { useEffect, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type PulsarInputProps = {
  allowClear?: boolean;
} & React.ComponentProps<"input">;

const PulsarInput = React.forwardRef<HTMLInputElement, PulsarInputProps>(
  ({ className, allowClear, type, ...props }, ref) => {
    // 创建 ref 用于访问输入框元素
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [showClearButton, setShowClearButton] = useState(false);

    // 将 ref 传递给子组件
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // 清空输入框
    const onClear = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // 清空输入框
      setShowClearButton(false);

      if (props.onChange) {
        props.onChange({
          target: {
            value: "",
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    useEffect(() => {
      setShowClearButton(inputRef.current?.value !== "");
      return () => {
        setShowClearButton(false);
      };
    }, [inputRef.current?.value]);

    return (
      <div className={cn("inline-block relative", className)} ref={ref}>
        <Input ref={inputRef} type={type} className={className} {...props} />
        {allowClear && showClearButton && (
          <div
            className="absolute p-1 right-2 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500 rounded-full hover:text-neutral-950 hover:bg-neutral-200 transition-all"
            onClick={onClear}
          >
            <X size={16} fill="currentColor" />
          </div>
        )}
      </div>
    );
  }
);

PulsarInput.displayName = "PulsarInput";
export default PulsarInput;
