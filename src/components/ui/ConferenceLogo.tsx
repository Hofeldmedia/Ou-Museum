import { useEffect, useMemo, useRef, useState } from 'react';
import { getConferenceLogo } from '../../data/conferenceLogos';

type ConferenceLogoSize = 'sm' | 'md' | 'lg' | 'intro';

type ConferenceLogoProps = {
  conferenceId?: string;
  snapshotId?: string;
  alt: string;
  size?: ConferenceLogoSize;
  fallbackLabel: string;
  className?: string;
  imageClassName?: string;
};

const sizeClasses: Record<ConferenceLogoSize, string> = {
  sm: 'h-10 w-10 text-[10px]',
  md: 'h-12 min-w-[7rem] px-2 text-xs',
  lg: 'h-16 min-w-[8.5rem] px-3 text-sm',
  intro: 'h-24 w-28 px-3 text-[11px] sm:h-28 sm:w-32',
};

const warnedMissing = new Set<string>();
const warnedFailed = new Set<string>();

function warnOnce(bucket: Set<string>, key: string, message: string) {
  if (!import.meta.env.DEV || bucket.has(key)) return;
  bucket.add(key);
  console.warn(message);
}

export function ConferenceLogo({
  conferenceId,
  snapshotId,
  alt,
  size = 'md',
  fallbackLabel,
  className = '',
  imageClassName = '',
}: ConferenceLogoProps) {
  const [failed, setFailed] = useState(false);
  const id = snapshotId ?? conferenceId;
  const config = useMemo(() => getConferenceLogo(id), [id]);
  const warnedMissingRef = useRef(false);

  useEffect(() => {
    setFailed(false);
  }, [config?.path]);

  useEffect(() => {
    if (!id || config || warnedMissingRef.current) return;
    warnedMissingRef.current = true;
    warnOnce(warnedMissing, id, `[ConferenceLogo] Missing conference logo mapping for ${id}`);
  }, [config, id]);

  const label = config?.fallbackLabel ?? fallbackLabel;
  const baseClass = `flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-charcoal/10 bg-white text-center font-black uppercase tracking-[0.12em] text-charcoal shadow-sm ${sizeClasses[size]} ${className}`;

  if (!config?.path || failed) {
    return <span className={baseClass}>{label}</span>;
  }

  return (
    <span className={baseClass}>
      <img
        src={config.path}
        alt={alt}
        loading="lazy"
        onError={() => {
          warnOnce(warnedFailed, config.path, `[ConferenceLogo] Failed to load conference logo asset: ${config.path}`);
          setFailed(true);
        }}
        className={`h-full w-full object-contain ${imageClassName}`}
      />
    </span>
  );
}
