"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, Plus, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PHOTO_SLOT_KEYS,
  PHOTO_SLOT_LABELS,
  type PhotoSlotKey,
  type PhotosFormValues,
} from "@/components/seller/list-car/schemas";

type UploadPhotosProps = {
  initial: PhotosFormValues;
  onBack: () => void;
  onContinue: (data: PhotosFormValues) => void;
};

function fileSummary(f: File) {
  return { name: f.name, size: f.size, type: f.type };
}

function UploadSlot({
  label,
  accept,
  previewUrl,
  onFile,
  onClear,
}: {
  label: string;
  accept: string;
  previewUrl: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-navbar text-xs font-medium text-[#1E1E1E] sm:text-sm">{label}</p>
      <div
        className={cn(
          "relative flex min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-neutral-50/80 p-3 text-center"
        )}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="" className="mb-2 max-h-24 w-full rounded-lg object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow hover:bg-white"
              aria-label="Remove"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <>
            <Camera className="size-8 text-[#5E5E5E]" strokeWidth={1.5} aria-hidden />
            <p className="mt-2 font-navbar text-xs text-[#5E5E5E]">
              Drop or{" "}
              <button
                type="button"
                className="font-semibold text-[#FFA51F] hover:underline"
                onClick={() => inputRef.current?.click()}
              >
                Click to upload
              </button>
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export function UploadPhotos({ initial, onBack, onContinue }: UploadPhotosProps) {
  const [slots, setSlots] = useState<Partial<Record<PhotoSlotKey, File>>>(initial.slots);
  const [extras, setExtras] = useState<File[]>(initial.extras);
  const [video, setVideo] = useState<File | null>(initial.video);
  const [previews, setPreviews] = useState<Partial<Record<PhotoSlotKey, string>>>({});
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const revoke = useCallback((url: string | undefined) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const setSlotFile = (key: PhotoSlotKey, file: File | null) => {
    setSlots((prev) => {
      const next = { ...prev };
      if (file) next[key] = file;
      else delete next[key];
      return next;
    });
    setPreviews((prev) => {
      const old = prev[key];
      if (old) revoke(old);
      const next = { ...prev };
      if (file) next[key] = URL.createObjectURL(file);
      else delete next[key];
      return next;
    });
  };

  const totalCount =
    PHOTO_SLOT_KEYS.filter((k) => slots[k]).length + extras.length + (video ? 1 : 0);

  const handleContinue = () => {
    for (const k of PHOTO_SLOT_KEYS) {
      if (!slots[k]) {
        setError(`Please upload: ${PHOTO_SLOT_LABELS[k]}`);
        return;
      }
    }
    // if (!video) {
    //   setError("Please upload the entire car video.");
    //   return;
    // }
    if (totalCount > 15) {
      setError("Maximum 15 files total (including required photos and extras).");
      return;
    }
    setError(null);
    const payload: PhotosFormValues = { slots, extras, video };
    console.log(
      "list-car photos",
      PHOTO_SLOT_KEYS.map((k) => ({ slot: k, file: slots[k] ? fileSummary(slots[k]!) : null })),
      { extras: extras.map(fileSummary), video: video ? fileSummary(video) : null }
    );
    onContinue(payload);
  };

  const addExtra = (file: File) => {
    if (totalCount >= 15) {
      setError("Maximum 15 files.");
      return;
    }
    setExtras((prev) => [...prev, file]);
    setExtraPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    setError(null);
  };

  const removeExtra = (index: number) => {
    setExtraPreviews((prev) => {
      const url = prev[index];
      if (url) revoke(url);
      return prev.filter((_, i) => i !== index);
    });
    setExtras((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Upload Photos</h1>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">
        Minimum 6 photos, 10-12 Recommended for best results (15 MAX).
      </p>

      <div className="mx-auto mt-8 w-full max-w-4xl space-y-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 sm:px-5">
          <p className="font-navbar text-sm font-semibold text-sky-800">Photo tips:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-navbar text-xs text-sky-800 sm:text-sm">
            <li>Take photos in good lighting (daylight works best)</li>
            <li>Clean your car before photographing</li>
            <li>Include all sides and angles</li>
            <li>Show any damage honestly</li>
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHOTO_SLOT_KEYS.map((key) => (
            <UploadSlot
              key={key}
              label={PHOTO_SLOT_LABELS[key]}
              accept="image/jpeg,image/png,image/webp"
              previewUrl={previews[key] ?? null}
              onFile={(f) => {
                setSlotFile(key, f);
                setError(null);
              }}
              onClear={() => setSlotFile(key, null)}
            />
          ))}
        </div>

        <div>
          <h2 className="font-navbar text-sm font-semibold text-[#1E1E1E] sm:text-base">Add More (Max. 15)</h2>
          <div className="mt-3 flex min-h-[100px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-neutral-50/80 p-4">
            <Plus className="size-8 text-[#5E5E5E]" />
            <p className="mt-2 font-navbar text-sm text-[#5E5E5E]">
              Drop or{" "}
              <label className="cursor-pointer font-semibold text-[#FFA51F] hover:underline">
                Click to upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    files.forEach(addExtra);
                    e.target.value = "";
                  }}
                />
              </label>
            </p>
            {extras.length > 0 ? (
              <div className="mt-4 flex w-full flex-wrap gap-2">
                {extras.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="relative size-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={extraPreviews[i]} alt="" className="size-full rounded-lg object-cover" />
                    <button
                      type="button"
                      className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 text-red-600 shadow"
                      onClick={() => removeExtra(i)}
                      aria-label="Remove"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <h2 className="font-navbar text-sm font-semibold text-[#1E1E1E] sm:text-base">Entire Car Video</h2>
          <div className="mt-3 max-w-md">
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-neutral-50/80 p-4">
              {videoPreview ? (
                <div className="relative w-full">
                  <video src={videoPreview} className="max-h-40 w-full rounded-lg" controls />
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600"
                    onClick={() => {
                      if (videoPreview) revoke(videoPreview);
                      setVideoPreview(null);
                      setVideo(null);
                    }}
                    aria-label="Remove video"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Video className="size-8 text-[#5E5E5E]" strokeWidth={1.5} />
                  <p className="mt-2 text-center font-navbar text-xs text-[#5E5E5E] sm:text-sm">
                    Drop or (Max 30 Sec.){" "}
                    <label className="cursor-pointer font-semibold text-[#FFA51F] hover:underline">
                      Click to upload
                      <input
                        type="file"
                        accept="video/mp4"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            if (videoPreview) revoke(videoPreview);
                            setVideo(f);
                            setVideoPreview(URL.createObjectURL(f));
                            setError(null);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {error ? <p className="text-center font-navbar text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "cursor-pointer rounded-xl border-2 border-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-[#FFA51F]",
              "hover:bg-[#FFA51F]/10"
            )}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className={cn(
              "cursor-pointer rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-white sm:min-w-[200px]",
              "hover:opacity-90"
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
