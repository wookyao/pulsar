import { useRef, useState } from "react";
import { ChevronRight, icons } from "lucide-react";
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

export interface IconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

function pageIcons(page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return Object.keys(icons).slice(start, end);
}

const IconSelect = ({ value, onChange }: IconSelectProps) => {
  const [open, setOpen] = useState(false);
  const pageSize = useRef(80);

  const [selectedValue, setSelectedValue] = useState<string>(value || "");
  const [page, setPage] = useState(1);
  const [iconList, setIconList] = useState<string[]>(pageIcons(page, pageSize.current));



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
        <div className="grid grid-cols-10">
          {iconList.map((key) => {
            return (
              <div
                className={`flex items-center justify-center px-2 py-4 cursor-pointer rounded-xl hover:bg-neutral-100 ${selectedValue === key
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

        <AlertDialogFooter>
          <Pagination
            total={Object.keys(icons).length}
            page={page}
            pageSize={pageSize.current}
            onChange={(page) => {
              setPage(page);
              setIconList(pageIcons(page, pageSize.current));
            }}
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
