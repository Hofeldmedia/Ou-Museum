import { useState } from 'react';

type BrandLogoProps = {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
  imageClassName?: string;
};

export function BrandLogo({ src, alt, fallback, className = '', imageClassName = '' }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`flex items-center justify-center rounded-md bg-crimson font-black uppercase tracking-[0.08em] text-white ${className}`}>
        {fallback}
      </span>
    );
  }

  return (
    <span className={`flex items-center justify-center overflow-hidden rounded-md bg-white ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-contain ${imageClassName}`}
      />
    </span>
  );
}
