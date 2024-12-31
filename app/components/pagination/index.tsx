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
  const mounted = useRef(false);
  const [pageInfo, setPageInfo] = useImmer(
    pagination(props.page, props.pageSize, props.total)
  );

  if (pageInfo.totalPage <= 1) {
    mounted.current = true;
    return null;
  }
  const [pageList, setPageList] = useImmer<number[]>([]);

  if (!mounted.current) {
    console.log(props, pageInfo);
    let start = pageInfo.page;
    const limit = Math.min(props.limit || 5, pageInfo.totalPage);

    if (start > pageInfo.totalPage - limit) {
      start = pageInfo.totalPage - limit;
    }

    const list: number[] = [];

    console.log(start, limit);

    for (let i = 0; i < limit; i++) {
      list.push(start + i);
    }

    setPageList(list);
    mounted.current = true;
  }

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

        {JSON.stringify(pageList)}

        {pageList.map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              onClick={() => {
                props.onChange?.(item);
              }}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}

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
