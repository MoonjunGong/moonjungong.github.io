import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  pictureClassName?: string;
}

/**
 * OptimizedImage standardizes local image asset path resolution and automatically serves
 * the generated .webp version with an automatic, resilient fallback to the original (PNG/JPG)
 * if the .webp is unavailable or fails to load.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  pictureClassName,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) => {
  if (!src) return null;

  // Normalize path format (e.g. ./data/file.png -> data/file.png)
  const normalizedSrc = src.startsWith('./') ? src.slice(2) : src;

  // Determine if this is a local PNG/JPG asset that has an automated .webp sibling
  const isConvertible = /\.(png|jpe?g)$/i.test(normalizedSrc);
  const webpSrc = isConvertible
    ? normalizedSrc.replace(/\.(png|jpe?g)$/i, '.webp')
    : normalizedSrc;

  // State to track if WebP source failed so we switch back cleanly to normalized original
  const [currentSrc, setCurrentSrc] = useState<string>(webpSrc);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      referrerPolicy="no-referrer"
      onError={() => {
        // If webp fails to load, gracefully fall back to original PNG/JPG source
        if (currentSrc !== normalizedSrc) {
          setCurrentSrc(normalizedSrc);
        }
      }}
      {...rest}
    />
  );
};

export default OptimizedImage;
