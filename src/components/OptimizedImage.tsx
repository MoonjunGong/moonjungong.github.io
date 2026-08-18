import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  pictureClassName?: string;
}

/**
 * OptimizedImage renders a modern <picture> element that requests the .webp version
 * when available, with an automatic fallback to the original image format (PNG/JPG).
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
  const [webpError, setWebpError] = useState(false);

  if (!src) return null;

  // Check if image is a local static asset (e.g. ./data/avatar.jpg, data/avatar.jpg, or /data/avatar.jpg)
  const isLocalStaticAsset =
    (src.startsWith('./data/') ||
      src.startsWith('data/') ||
      src.startsWith('/data/')) &&
    /\.(png|jpg|jpeg)$/i.test(src);

  if (!isLocalStaticAsset || webpError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        referrerPolicy="no-referrer"
        {...rest}
      />
    );
  }

  // Generate WebP candidate path
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  return (
    <picture className={pictureClassName}>
      <source
        srcSet={webpSrc}
        type="image/webp"
        onError={() => setWebpError(true)}
      />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        referrerPolicy="no-referrer"
        {...rest}
      />
    </picture>
  );
};

export default OptimizedImage;
