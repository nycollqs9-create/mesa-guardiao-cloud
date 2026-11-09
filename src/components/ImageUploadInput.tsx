import React, { useState, useRef } from 'react';
import { Upload, Camera, Link as LinkIcon, X, Loader2, Image as ImageIcon, Images, FolderOpen } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

/**
 * Image upload with dual support for:
 * 1. Saved photos from device gallery / camera roll (NO capture attribute)
 * 2. Instant photo taking with device camera (capture="environment")
 * 3. Client-side canvas compression (1280px max, JPEG 0.84)
 * 4. Direct web URL input
 */
export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Cole uma URL ou envie uma foto do dispositivo...',
  aspectRatio = 'landscape',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Separate refs for gallery (saved photos) vs camera (take photo on the fly)
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const compressAndUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP, GIF)');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const maxDim = 1280;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(e.target?.result as string);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.84);
            resolve(compressed);
          };
          img.onerror = () => reject(new Error('Falha ao carregar a imagem'));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Falha ao ler o arquivo do aparelho'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });

      if (!res.ok) {
        throw new Error('Falha no upload para o servidor');
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err.message || 'Erro ao processar imagem');
    } finally {
      setIsUploading(false);
      // Reset inputs so selecting the same file again triggers onChange
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      compressAndUpload(file);
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-h-48'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4] max-h-56'
      : 'aspect-[16/9] max-h-48';

  return (
    <div className="space-y-1.5 text-xs">
      {label && (
        <div className="flex items-center justify-between text-zinc-300 font-medium">
          <span className="flex items-center gap-1.5">{label}</span>
          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-0.5 rounded transition ${
                mode === 'upload' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Galeria / Dispositivo
            </button>
            <span className="text-zinc-600">|</span>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-0.5 rounded transition ${
                mode === 'url' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              URL da Web
            </button>
          </div>
        </div>
      )}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 group">
          <img
            src={value}
            alt="Preview"
            className={`w-full ${aspectClass} object-cover`}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-amber-600/90 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded border border-amber-400 flex items-center gap-1.5 shadow"
              title="Escolher outra foto salva na galeria do celular ou computador"
            >
              <Images className="w-3.5 h-3.5" />
              Galeria
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs rounded border border-zinc-600 flex items-center gap-1.5"
              title="Tirar nova foto com a câmera"
            >
              <Camera className="w-3.5 h-3.5" />
              Câmera
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-200 text-xs rounded border border-red-700 flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Remover
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed ${
            isDragging ? 'border-amber-400 bg-amber-950/30' : 'border-zinc-700 hover:border-amber-500/60 bg-zinc-900/60 hover:bg-zinc-900'
          } rounded-lg p-3 sm:p-4 transition flex flex-col items-center justify-center text-center ${aspectClass}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-amber-400 py-4">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-xs font-semibold">Otimizando e enviando foto...</span>
              <span className="text-[11px] text-zinc-400">Comprimindo imagem para a mesa</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full max-w-sm">
              <div className="text-center space-y-0.5">
                <p className="font-semibold text-zinc-200 text-xs sm:text-sm">
                  Escolha uma foto salva ou tire uma nova
                </p>
                <p className="text-[11px] text-zinc-400">
                  Fotos da galeria do celular, arquivos salvos ou câmera
                </p>
              </div>

              {/* Action buttons: Gallery vs Camera */}
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="px-3 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                  title="Abrir fotos salvas na galeria do seu celular ou arquivos do PC"
                >
                  <Images className="w-4 h-4 shrink-0" />
                  <span>Galeria / Fotos</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white font-medium rounded-lg text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  title="Tirar uma foto na hora usando a câmera do seu dispositivo"
                >
                  <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tirar Foto</span>
                </button>
              </div>

              <div className="text-[10px] text-zinc-500 pt-0.5">
                Formatos: JPG, PNG, WEBP, GIF (até 1280px otimizado automaticamente)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg p-2">
          <LinkIcon className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder:text-zinc-600"
          />
        </div>
      )}

      {/* Primary Hidden input for GALLERY / SAVED PHOTOS (NO capture attribute) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Secondary Hidden input for INSTANT CAMERA (with capture="environment") */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-red-400 text-[11px] font-medium">{error}</p>}
    </div>
  );
};
