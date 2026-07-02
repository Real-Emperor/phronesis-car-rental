'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
  onRemove?: () => void;
  token: string;
  label?: string;
}

/**
 * ImageUploader — file-based image upload from the user's device.
 * - Click dropzone or drag a file in → uploads to /api/upload → returns URL
 * - Shows preview of uploaded image
 * - Includes optional caption field
 * - No URL input — uploads from device only
 */
export function ImageUploader({
  value, onChange, caption, onCaptionChange, onRemove, token, label,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP, GIF)');
      return;
    }
    // Validate size
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image too large. Maximum 8MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload failed (HTTP ${res.status})`);
      }
      const data = await res.json();
      onChange(data.url);
      toast.success('Image uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex gap-3 items-start border border-border rounded-lg p-3 bg-card">
      {/* Preview / Dropzone */}
      <div className="w-24 h-20 flex-shrink-0">
        {value ? (
          <div className="relative w-full h-full overflow-hidden rounded-md border border-border group">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            disabled={uploading}
            className={`w-full h-full border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-1 transition-colors ${
              dragOver
                ? 'border-brand bg-brand/5'
                : 'border-border hover:border-brand/50 hover:bg-muted'
            } ${uploading ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
            title="Click to upload or drag an image"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 text-brand animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 text-brand" />
                <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wide">Upload</span>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onInputChange}
          className="hidden"
        />
      </div>

      {/* Caption + remove */}
      <div className="flex-1 space-y-2 min-w-0">
        {label && <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>}
        <Input
          value={caption || ''}
          onChange={e => onCaptionChange?.(e.target.value)}
          placeholder="Caption (optional)"
          className="bg-background border-border text-foreground rounded-md text-xs h-8"
        />
        {value && (
          <div className="text-[0.65rem] text-muted-foreground truncate" title={value}>
            ✓ Uploaded: {value}
          </div>
        )}
      </div>

      {/* Remove row */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          title="Remove this image"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Tiny inline Input to avoid extra imports
function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`px-3 py-1.5 w-full ${className}`} {...props} />;
}
