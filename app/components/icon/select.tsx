import { useRef, useState } from "react";
import { ChevronRight, icons } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import Icon from "./index";
import { useImmer } from "use-immer";

export interface IconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

const IconSelect = ({ value, onChange }: IconSelectProps) => {
  const [open, setOpen] = useState(false);
  const pageSize = useRef(120);

  const [selectedValue, setSelectedValue] = useState<string>(value || "");

  const [page, setPage] = useState(1);

  const handlerConfirm = () => {
    setOpen(false);

    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div className="flex items-center text-xs text-neutral-500 cursor-pointer">
          {value ? (
            <div className="bg-neutral-100 rounded-md p-2">
              <Icon name={value || ""} size={16} />
            </div>
          ) : null}
          <span className="mx-1">{value ? "修改" : "选择"}</span>
          <ChevronRight size={14} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>图标库</AlertDialogTitle>
          <AlertDialogDescription>请选择图标</AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="h-[400px] rounded-md p-4">
          <div className="grid grid-cols-8">
            {Object.keys(icons).map((key) => {
              return (
                <div
                  className={`flex items-center justify-center px-2 py-4 cursor-pointer rounded-xl hover:bg-neutral-100 ${
                    selectedValue === key
                      ? "bg-neutral-300 hover:bg-neutral-300"
                      : ""
                  }`}
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValue(key);
                  }}
                >
                  <Icon name={key} size={26} />
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <AlertDialogFooter>
          <Pagination
            total={Object.keys(icons).length}
            page={page}
            pageSize={pageSize.current}
          />
          <Button variant="secondary" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handlerConfirm}>确定</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IconSelect;
