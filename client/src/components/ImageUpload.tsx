import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      try {
        // Convert images to base64 for now (in production, upload to S3)
        const newImages: string[] = [];
        
        for (const file of acceptedFiles) {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} is too large. Max 5MB per image.`);
            continue;
          }

          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          
          newImages.push(base64);
        }

        onImagesChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Failed to upload images");
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: maxImages - images.length,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop images here...</p>
          ) : (
            <div>
              <p className="font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, JPEG, WEBP up to 5MB ({images.length}/{maxImages} images)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-border group"
            >
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}

