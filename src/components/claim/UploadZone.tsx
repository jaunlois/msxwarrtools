import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Check, Trash2, Download, FileIcon } from "lucide-react";

export type FileType = "quote" | "backpage" | "frontpage" | "oasis" | "warranty_history" | "photo" | "other";

export interface UploadedFile {
  file: File;
  type: FileType;
  parsed: boolean;
}

const FILE_TYPE_LABELS: Record<FileType, string> = {
  quote: "Quote",
  backpage: "Back Page",
  frontpage: "Front Page / Jobcard",
  oasis: "OASIS Report",
  warranty_history: "Warranty History",
  photo: "Photo",
  other: "Other",
};

export function detectFileType(name: string): FileType {
  const lower = name.toLowerCase();
  if (lower.includes("quote")) return "quote";
  if (lower.includes("back") || lower.includes("backpage")) return "backpage";
  if (lower.includes("front") || lower.includes("jobcard") || lower.includes("job_card")) return "frontpage";
  if (lower.includes("oasis")) return "oasis";
  if (lower.includes("warranty") || lower.includes("history")) return "warranty_history";
  if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return "photo";
  return "other";
}

interface UploadZoneProps {
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (index: number) => void;
  onFileTypeChanged: (index: number, type: FileType) => void;
  onDownloadRenamed: (file: UploadedFile) => void;
  claimNumber: string;
  loading: boolean;
}

export function UploadZone({ files, onFilesAdded, onFileRemoved, onFileTypeChanged, onDownloadRenamed, claimNumber, loading }: UploadZoneProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onFilesAdded(Array.from(e.dataTransfer.files));
  }, [onFilesAdded]);

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (fileList) onFilesAdded(Array.from(fileList));
    };
    input.click();
  }, [onFilesAdded]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-primary flex items-center gap-2">
          <Upload className="h-4 w-4" /> Upload BSI Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drop or click to upload: <strong>Quote</strong>, <strong>Back Page</strong>, <strong>Front Page</strong>, <strong>OASIS</strong>, <strong>Warranty History</strong>
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">PDF files auto-detected by filename — you can change the type after upload</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-1.5">
            {files.map((uf, i) => (
              <div key={i} className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-md bg-muted/30 border border-border/50">
                <FileIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate text-xs">{uf.file.name}</span>
                <Select
                  value={uf.type}
                  onValueChange={(v) => onFileTypeChanged(i, v as FileType)}
                >
                  <SelectTrigger className="h-6 w-[140px] text-[10px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FILE_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {uf.parsed && <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                {claimNumber && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onDownloadRenamed(uf)}>
                    <Download className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => onFileRemoved(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
