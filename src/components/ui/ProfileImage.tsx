import { useState } from 'react';

type ProfileImageProps = {
  src: string;
  alt: string;
  fallbackText: string;
  className?: string;
  imageClassName?: string;
};

export function ProfileImage({
  src,
  alt,
  fallbackText,
  className = '',
  imageClassName = '',
}: ProfileImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-white/10 bg-white/8 shadow-[0_18px_40px_rgba(0,0,0,0.28)] ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : null}
      {failed && (
        <div className="flex h-full w-full items-center justify-center bg-charcoal text-3xl font-black uppercase tracking-[0.12em] text-cream">
          {fallbackText}
        </div>
      )}
    </div>
  );
}
