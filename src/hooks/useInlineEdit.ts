import { useState, useRef, useCallback, useEffect } from 'react';

interface UseInlineEditOptions<T = string> {
  initialValue: T;
  onCommit?: (value: T) => void;
  onCancel?: () => void;
  autoFocusRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export function useInlineEdit<T = string>({
  initialValue,
  onCommit,
  onCancel,
  autoFocusRef,
}: UseInlineEditOptions<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState<T>(initialValue);
  const [originalValue, setOriginalValue] = useState<T>(initialValue);

  // Begin editing
  const beginEdit = useCallback(() => {
    setOriginalValue(draftValue);
    setIsEditing(true);
    setTimeout(() => {
      if (autoFocusRef?.current) {
        autoFocusRef.current.focus();
        if ('value' in autoFocusRef.current) {
          const len = (autoFocusRef.current as HTMLInputElement).value.length;
          autoFocusRef.current.selectionStart = len;
          autoFocusRef.current.selectionEnd = len;
        }
      }
    }, 0);
  }, [draftValue, autoFocusRef]);

  // Commit edit
  const commitEdit = useCallback(() => {
    setIsEditing(false);
    if (onCommit) onCommit(draftValue);
  }, [draftValue, onCommit]);

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setDraftValue(originalValue);
    setIsEditing(false);
    if (onCancel) onCancel();
  }, [originalValue, onCancel]);

  // Change handler
  const handleChange = useCallback((value: T) => {
    setDraftValue(value);
  }, []);

  // Reset draft value if initialValue changes
  useEffect(() => {
    setDraftValue(initialValue);
    setOriginalValue(initialValue);
  }, [initialValue]);

  return {
    isEditing,
    draftValue,
    beginEdit,
    commitEdit,
    cancelEdit,
    handleChange,
    setDraftValue,
    setIsEditing,
    setOriginalValue,
  };
}
