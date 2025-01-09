import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { pagination } from "@/helps";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { useImmer } from "use-immer";

export interface PaginationProps {
  total: number;
  pageSize: number;
  page: number;
  limit?: number;
  onChange?: (page: number) => void;
}

const PaginationMemo = (props: PaginationProps) => {
  const [pageInfo, setPageInfo] = useImmer(
    pagination(props.page, props.pageSize, props.total)
  );

  if (pageInfo.totalPage <= 1) {
    return null;
  }
  const [pageList, setPageList] = useImmer<number[]>([]);
  const [totalPageList, setTotalPageList] = useImmer<number[]>([]);



  // 生成总页码列表
  useEffect(() => {
    const list: number[] = Array.from({ length: pageInfo.totalPage }, (_, i) => i + 1);
    setTotalPageList(list);
  }, [pageInfo.totalPage]);

  // 根据当前页码和总页码列表生成页码列表
  useEffect(() => {
    const currentPageIndex = totalPageList.findIndex((item) => item === props.page);

    let start = Math.max(0, currentPageIndex - 2);
    let end = Math.min(totalPageList.length, start + 5);
    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }

    const list: number[] = totalPageList.slice(start, end);
    setPageList(list);
  }, [props.page, totalPageList]);

  return (
    <Pagination>
      <PaginationContent>
        <Button
          aria-label="Previous page"
          variant={"ghost"}
          size={"icon"}
          disabled={props.page === 1}
          onClick={() => {
            if (props.page === 1) return;
            props.onChange?.(props.page - 1);
          }}
        >
          <ChevronsLeft />
        </Button>

        {pageList[0] !== 1 && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => {
                props.onChange?.(1);
              }}
            >
              1 ...
            </PaginationLink>
          </PaginationItem>
        )}

        {pageList.map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => {
                props.onChange?.(item);
              }}
              isActive={item === props.page}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pageList[pageList.length - 1] !== pageInfo.totalPage && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => {
                props.onChange?.(pageInfo.totalPage);
              }}
            >
              ... {pageInfo.totalPage}
            </PaginationLink>
          </PaginationItem>
        )}

        <Button
          aria-label="Next page"
          variant={"ghost"}
          size={"icon"}
          disabled={props.page >= pageInfo.totalPage}
          onClick={() => {
            if (props.page >= pageInfo.totalPage) return;
            props.onChange?.(props.page + 1);
          }}
        >
          <ChevronsRight />
        </Button>
      </PaginationContent>
    </Pagination>
  );
};

PaginationMemo.displayName = "Pagination";

export default memo(PaginationMemo);
