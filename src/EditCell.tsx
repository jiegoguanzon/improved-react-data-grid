import clsx from "clsx";
import { useCallback, useState } from "react";
import EditorContainer from "./editors/EditorContainer";
import type { CellRendererProps, Omit, SharedEditorProps } from "./types";
import { getCellStyle } from "./utils";

type SharedCellRendererProps<R, SR> = Pick<
  CellRendererProps<R, SR>,
  "rowIdx" | "row" | "column"
>;

interface EditCellProps<R, SR>
  extends SharedCellRendererProps<R, SR>,
    Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "children"> {
  editorProps: SharedEditorProps<R>;
  isFromExternalChange: boolean;
  setIsFromExternalChange: (value: boolean) => void;
}

export default function EditCell<R, SR>({
  className,
  column,
  row,
  rowIdx,
  editorProps,
  isFromExternalChange,
  setIsFromExternalChange,
  ...props
}: EditCellProps<R, SR>) {
  const [dimensions, setDimensions] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const cellRef = useCallback((node) => {
    if (node !== null) {
      const { left, top } = node.getBoundingClientRect();
      setDimensions({ left, top });
    }
  }, []);

  const { cellClass } = column;
  className = clsx(
    "rdg-cell",
    {
      "rdg-cell-frozen": column.frozen,
      "rdg-cell-frozen-last": column.isLastFrozenColumn,
    },
    "rdg-cell-selected",
    "rdg-cell-editing",
    typeof cellClass === "function" ? cellClass(row) : cellClass,
    className
  );

  function getCellContent() {
    if (dimensions === null) return;
    const { scrollTop: docTop, scrollLeft: docLeft } =
      document.scrollingElement ?? document.documentElement;
    const { left, top } = dimensions;
    const gridLeft = left + docLeft;
    const gridTop = top + docTop;

    return (
      <EditorContainer
        {...editorProps}
        rowIdx={rowIdx}
        column={column}
        left={gridLeft}
        top={gridTop}
        isFromExternalChange={isFromExternalChange}
        setIsFromExternalChange={setIsFromExternalChange}
      />
    );
  }

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1} // aria-colindex is 1-based
      aria-selected
      ref={cellRef}
      className={className}
      style={getCellStyle(column)}
      {...props}
    >
      {getCellContent()}
    </div>
  );
}
