import { createPortal } from "react-dom";
import { useClickOutside } from "../hooks";
import type { EditorProps } from "../types";

export default function EditorContainer<R, SR>({
  row,
  column,
  onRowChange,
  isFromExternalChange,
  setIsFromExternalChange,
  ...props
}: EditorProps<R, SR>) {
  const onClickCapture = useClickOutside(() => onRowChange(row, true));
  if (column.editor === undefined) return null;

  const editor = (
    <div className="rdg-editor-container" onClickCapture={onClickCapture}>
      <column.editor
        row={row}
        column={column}
        onRowChange={onRowChange}
        isFromExternalChange={isFromExternalChange}
        setIsFromExternalChange={setIsFromExternalChange}
        {...props}
      />
    </div>
  );

  if (column.editorOptions?.createPortal) {
    return createPortal(editor, props.editorPortalTarget);
  }

  return editor;
}
