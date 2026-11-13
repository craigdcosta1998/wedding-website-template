// ABOUTME: Reusable editorial photograph with a clearly labelled missing-photo state
import Image from 'next/image';
import type { EditorialPhotoSource } from '@/types/editorial';
import styles from './editorial-photo.module.css';

interface EditorialPhotoProps {
  photo: EditorialPhotoSource | null;
  placeholderLabel?: string;
  caption?: string | null;
  index?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
  tone?: 'clay' | 'olive' | 'paper';
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function EditorialPhoto({ photo, placeholderLabel = 'Photograph to follow', caption, index,
  aspect = 'landscape', tone = 'olive', className = '', priority = false,
  sizes = '(max-width: 700px) 90vw, (max-width: 1100px) 55vw, 700px',
}: EditorialPhotoProps) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <div className={`${styles.frame} ${styles[aspect]} ${styles[tone]}`}>
        {photo ? (
          <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority}
            className={styles.image} style={{ objectPosition: photo.objectPosition ?? 'center' }} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={placeholderLabel}>
            {index && <span className={styles.index} aria-hidden="true">{index}</span>}
            <span className={styles.placeholderLabel}>{placeholderLabel}</span>
          </div>
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
