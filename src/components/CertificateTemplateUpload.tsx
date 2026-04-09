import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Image, X } from 'lucide-react';
import { toast } from 'sonner';

const CertificateTemplateUpload = () => {
  const { certificateTemplateUrl, setCertificateTemplateUrl } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `certificate-template/template.${ext}`;

      const { error } = await supabase.storage
        .from('group-photos')
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('group-photos')
        .getPublicUrl(path);

      setCertificateTemplateUrl(urlData.publicUrl);
      toast.success('Certificate template uploaded!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
        <Image className="w-4 h-4 text-primary" />
        Certificate Template
      </h2>
      <p className="text-xs text-muted-foreground font-body">
        Upload a blank certificate image. The winner's name will be placed on the underline below "Presented To".
      </p>

      {certificateTemplateUrl ? (
        <div className="relative rounded-lg border border-border overflow-hidden">
          <img
            src={certificateTemplateUrl}
            alt="Certificate template"
            className="w-full max-h-48 object-contain bg-secondary/50"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-7 px-2"
            onClick={() => setCertificateTemplateUrl(null)}
          >
            <X className="w-3 h-3 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-body">
            Click to upload blank certificate
          </p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {uploading && (
        <p className="text-xs text-primary font-body animate-pulse">Uploading...</p>
      )}
    </div>
  );
};

export default CertificateTemplateUpload;
