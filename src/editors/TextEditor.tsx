import { useCallback, useState } from "react";
import type { EditorProps } from "../types";

export default function TextEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
  isFromExternalChange,
  setIsFromExternalChange,
}: EditorProps<TRow, TSummaryRow>) {
  const [isCellJustFocused, setIsCellJustFocused] = useState<boolean>(false);

  const handleFocusAndSelect = useCallback(
    (input: HTMLInputElement | null) => {
      input?.focus();

      if (isFromExternalChange) {
        setIsCellJustFocused(true);
        setIsFromExternalChange(false);
      } else {
        if (isCellJustFocused) setIsCellJustFocused(false);
        else input?.select();
      }
    },
    [setIsFromExternalChange, isFromExternalChange]
  );

  return (
    <input
      className="rdg-text-editor"
      ref={handleFocusAndSelect}
      value={(row[column.key as keyof TRow] as unknown) as string}
      onChange={(event) =>
        onRowChange({ ...row, [column.key]: event.target.value })
      }
      onBlur={() => onClose(true)}
    />
  );
}
