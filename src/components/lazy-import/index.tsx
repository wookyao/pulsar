import { Suspense } from "react";
import type { FC } from "react";
import type { LazyComponent } from "#/router";

type LazyImportProps = {
  lazy?: LazyComponent;
};

const LayImport: FC<LazyImportProps> = ({ lazy }) => {
  const Component = lazy ? lazy : () => null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export default LayImport;
