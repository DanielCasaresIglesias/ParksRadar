import { useEffect, useRef, useState } from 'react';

type Options = {
  maxFontSizeRem: number;
  minFontSizeRem: number;
  maxWidthPx: number;
};

export default function useFitText(options: Options) {
  const { maxFontSizeRem, minFontSizeRem, maxWidthPx } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [fontSizeRem, setFontSizeRem] = useState(maxFontSizeRem);

  useEffect(() => {
    if (!ref.current) return;

    const resize = () => {
      let currentSize = maxFontSizeRem;
      ref.current!.style.fontSize = `${currentSize}rem`;

      while (
        ref.current!.scrollWidth > maxWidthPx &&
        currentSize > minFontSizeRem
      ) {
        currentSize -= 0.05;
        ref.current!.style.fontSize = `${currentSize}rem`;
      }

      setFontSizeRem(currentSize);
    };

    resize();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [maxFontSizeRem, minFontSizeRem, maxWidthPx]);

  return { ref, fontSizeRem };
}
