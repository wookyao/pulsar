import type { LazyComponent } from "#/router";
import { Suspense } from "react";
import type { FC } from "react";

type LazyImportProps = {
  lazy?: LazyComponent;
};

const LayImport: FC<LazyImportProps> = ({ lazy }) => {
  const Component = lazy ? lazy : () => null;

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Component />
    </Suspense>
  );
};

export default LayImport;
