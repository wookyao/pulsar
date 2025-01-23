import { Suspense } from "react";
import type { FC } from "react";
import type { LazyComponent } from "#/router";

type LazyImportProps = {
  lazy?: LazyComponent;
};

const LayImport: FC<LazyImportProps> = ({ lazy }) => {
  const Component = lazy ? lazy : () => null;

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md">
          <div className="loading font-bold text-2xl" data-text="PULSAR OA">
            PULSAR OA
          </div>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default LayImport;
