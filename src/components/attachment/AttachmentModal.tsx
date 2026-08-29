import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import Cropper, { type Area } from "react-easy-crop";

interface AttachmentModalProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (file: File) => void | Promise<void>;
  aspect?: number;
  title?: string;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

interface CropPosition {
  x: number;
  y: number;
}

const createImage = (
  url: string,
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) =>
      reject(error),
    );

    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  originalFile: File,
): Promise<File> => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  const blob = await new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(
              new Error(
                "Could not create cropped image.",
              ),
            );
          }
        },
        originalFile.type || "image/jpeg",
        0.9,
      );
    },
  );

  const extension =
    originalFile.type === "image/png"
      ? "png"
      : originalFile.type === "image/webp"
        ? "webp"
        : "jpg";

  const fileName = `cropped-${Date.now()}.${extension}`;

  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
};

function AttachmentModal({
  open,
  onClose,
  onComplete,
  aspect = 1,
  title,
  maxFileSize = 5 * 1024 * 1024,
  acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
}: AttachmentModalProps) {
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [imageSrc, setImageSrc] =
    useState<string | null>(null);

  const [crop, setCrop] = useState<CropPosition>({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [error, setError] = useState<string>("");

  const [isProcessing, setIsProcessing] =
    useState<boolean>(false);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError("");
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");

    if (!acceptedTypes.includes(file.type)) {
      setError(t("attachment.invalidType"));
      return;
    }

    if (file.size > maxFileSize) {
      setError(t("attachment.fileTooLarge"));
      return;
    }

    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setImageSrc(previewUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const handleConfirm = async () => {
    if (
      !selectedFile ||
      !imageSrc ||
      !croppedAreaPixels
    ) {
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        selectedFile,
      );

      if (onComplete) {
        await onComplete(croppedFile);
      }

      onClose();
    } catch (err) {
      console.error(
        "Image cropping failed:",
        err,
      );

      setError(t("attachment.cropError"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) {
      return;
    }

    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {title || t("attachment.title")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedFile
                ? t("attachment.adjustImage")
                : t("attachment.selectImage")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t("common.close")}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {!imageSrc ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-sky-400 hover:bg-sky-50/40">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v12m0-12-4 4m4-4 4 4"
                  />
                </svg>
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                {t("attachment.chooseImage")}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {t("attachment.imageHint")}
              </p>

              <label className="mt-6 inline-flex cursor-pointer items-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 active:bg-sky-700">
                {t("attachment.browse")}

                <input
                  type="file"
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Crop area */}
              <div className="relative h-[320px] overflow-hidden rounded-2xl bg-slate-950 sm:h-[400px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                />
              </div>

              {/* Zoom */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="attachment-zoom"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("attachment.zoom")}
                  </label>

                  <span className="text-sm text-slate-500">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                <input
                  id="attachment-zoom"
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(event) =>
                    setZoom(
                      Number(event.target.value),
                    )
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-sky-500"
                />
              </div>

              {/* Replace image */}
              <label className="inline-flex cursor-pointer items-center text-sm font-semibold text-sky-600 transition hover:text-sky-700">
                {t("attachment.changeImage")}

                <input
                  type="file"
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>

          {imageSrc && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={
                isProcessing ||
                !croppedAreaPixels
              }
              className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 active:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing
                ? t("attachment.processing")
                : t("attachment.confirm")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttachmentModal;
