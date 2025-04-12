import React, { useEffect } from 'react'
import { supabase } from '../supabase';

type ImageProps = {
  src: string;
  alt: string;
  fallbackSrc: string;
  bucketName: string;
  className?: string;
  height?: number;
  width?: number;
}
// export default function Image({ src, alt, fallbackSrc, bucketName, className = "", width, height }: ImageProps) {
//   const [imageSrc, setImageSrc] = React.useState(src)
//   useEffect(() => {
//     getImage()
//   }, [src])

//   async function getImage() {

//     const { data, error } = await supabase.storage
//       .from(bucketName)
//       .download(src);

//     if (error) {
//       console.error(error);
//     }
//     const url = URL.createObjectURL(data as Blob);
//     setImageSrc(url);
//   }

//   return (
//     <>
//       <img src={imageSrc} alt={alt} onError={() => setImageSrc(fallbackSrc)} className={`${className}`} width={width} height={height} />
//     </>
//   )
// }



export function CardImage({ src, alt, fallbackSrc, bucketName, className = "", width, height }: ImageProps) {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  useEffect(() => {
    getImage();
  }, [src, bucketName]);

  async function getImage() {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(src);

      if (error) {
        console.error("Error downloading image:", error);
        setImageSrc(fallbackSrc || null);
        return;
      }

      if (data) {
        const url = URL.createObjectURL(data as Blob);
        setImageSrc(url);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setImageSrc(fallbackSrc || null);
    }
  }

  // Using inline style for the background image
  const backgroundStyle = imageSrc
    ? { backgroundImage: `url(${imageSrc})` }
    : { backgroundImage: `url(${fallbackSrc || 'photo.png'})` };


  return (
    <div>
      {/* Option 1: Using img tag (commented out in your code) */}
      {/* {imageSrc && (
        <img 
          src={imageSrc} 
          alt={alt} 
          onError={() => setImageSrc(fallbackSrc)} 
          className={className}
          width={width} 
          height={height}
        />
      )} */}

      {/* Option 2: Using div with background */}
      <div
        className={`bg-cover bg-center w-24 h-36 ${className}`}
        style={backgroundStyle}
      >

      </div>
    </div >
  );
}