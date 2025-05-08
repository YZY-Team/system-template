import { Input } from "@/components/ui/input";
import { useRef, FC } from "react";

export interface UploadProps {
  onChange: (file: File) => void;
  accept?: string;
  children: React.ReactNode;
}

export const Upload: FC<UploadProps> = ({
  onChange,
  accept,
  children
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <Input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange(file);
          }
        }}
      />
      {children}
    </div>
  );
};
