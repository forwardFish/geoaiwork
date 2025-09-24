import Image from 'next/image';
import { cn } from '@/lib/utils';

type SEOImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  title?: string;
  caption?: string;
  schema?: boolean;
};

export function SEOImage({
  src,
  alt,
  width = 800,
  height = 450,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 90,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  title,
  caption,
  schema = true,
}: SEOImageProps) {
  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={sizes}
      title={title || alt}
      className={cn(
        'rounded-lg object-cover transition-all duration-300 hover:shadow-lg',
        className,
      )}
    />
  );

  // Wrap with figure if caption is provided for better semantics
  if (caption) {
    return (
      <figure
        className="my-6"
        {...(schema && {
          itemScope: true,
          itemType: 'https://schema.org/ImageObject',
        })}
      >
        <div className="overflow-hidden rounded-lg">
          {imageElement}
        </div>
        <figcaption
          className="mt-2 text-center text-sm text-gray-600"
          {...(schema && { itemProp: 'caption' })}
        >
          {caption}
        </figcaption>
        {schema && (
          <>
            <meta itemProp="url" content={src} />
            <meta itemProp="width" content={width.toString()} />
            <meta itemProp="height" content={height.toString()} />
            <meta itemProp="description" content={alt} />
          </>
        )}
      </figure>
    );
  }

  // Simple image without caption
  return (
    <div
      className="my-6 overflow-hidden rounded-lg"
      {...(schema && {
        itemScope: true,
        itemType: 'https://schema.org/ImageObject',
      })}
    >
      {imageElement}
      {schema && (
        <>
          <meta itemProp="url" content={src} />
          <meta itemProp="width" content={width.toString()} />
          <meta itemProp="height" content={height.toString()} />
          <meta itemProp="description" content={alt} />
        </>
      )}
    </div>
  );
}

// Hero image variant for blog posts
type HeroImageProps = {
  className?: string;
} & Omit<SEOImageProps, 'className' | 'width' | 'height'>;

export function HeroImage({
  className,
  priority = true,
  sizes = '100vw',
  ...props
}: HeroImageProps) {
  return (
    <SEOImage
      {...props}
      width={1200}
      height={630}
      priority={priority}
      sizes={sizes}
      className={cn(
        'aspect-[1200/630] w-full object-cover',
        className,
      )}
    />
  );
}

// Thumbnail image variant
type ThumbnailImageProps = {
} & Omit<SEOImageProps, 'width' | 'height' | 'sizes'>;

export function ThumbnailImage({
  className,
  ...props
}: ThumbnailImageProps) {
  return (
    <SEOImage
      {...props}
      width={400}
      height={225}
      sizes="(max-width: 768px) 50vw, 25vw"
      className={cn(
        'aspect-[16/9] object-cover',
        className,
      )}
    />
  );
}
