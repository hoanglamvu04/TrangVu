import { useState, useEffect, useRef } from 'react';

export function useBearAnimation({
  watchBearImages,
  hideBearImages,
  peakBearImages,
  emailLength,
  showPassword,
}) {
  const [currentFocus, setCurrentFocus] = useState('EMAIL');
  const [currentBearImage, setCurrentBearImage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevFocus = useRef(currentFocus);
  const prevShowPassword = useRef(showPassword);
  const prevImageIndex = useRef(-1);
  const timeouts = useRef([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    const animateImages = (images, interval, reverse = false, onComplete) => {
      if (!images.length) {
        onComplete?.();
        return;
      }

      setIsAnimating(true);
      const sequence = reverse ? [...images].reverse() : images;

      sequence.forEach((img, i) => {
        const timeoutId = setTimeout(() => {
          setCurrentBearImage(img);
          if (i === sequence.length - 1) {
            setIsAnimating(false);
            onComplete?.();
          }
        }, i * interval);
        timeouts.current.push(timeoutId);
      });
    };

    const animateWatchingBearImages = () => {
      const maxImages = 20;
      const step = 2;
      const cappedLength = Math.min(emailLength, maxImages * step);
      const index = Math.floor(cappedLength / step);
      const clampedIndex = Math.min(index, watchBearImages.length - 1);

      if (prevImageIndex.current !== clampedIndex) {
        setCurrentBearImage(watchBearImages[clampedIndex]);
        prevImageIndex.current = clampedIndex;
      }

      setIsAnimating(false);
    };

    if (currentFocus === 'EMAIL') {
      if (prevFocus.current === 'PASSWORD') {
        animateImages(hideBearImages, 60, true, animateWatchingBearImages);
      } else {
        animateWatchingBearImages();
      }
    } else if (currentFocus === 'PASSWORD') {
      if (prevFocus.current !== 'PASSWORD') {
        animateImages(hideBearImages, 40, false, () => {
          if (showPassword) {
            animateImages(peakBearImages, 50);
          }
        });
      } else if (showPassword && !prevShowPassword.current) {
        animateImages(peakBearImages, 50);
      } else if (!showPassword && prevShowPassword.current) {
        animateImages(peakBearImages, 50, true);
      }
    }

    prevFocus.current = currentFocus;
    prevShowPassword.current = showPassword;
  }, [
    currentFocus,
    showPassword,
    emailLength,
    watchBearImages,
    hideBearImages,
    peakBearImages,
  ]);

  return {
    currentFocus,
    setCurrentFocus,
    currentBearImage:
      currentBearImage ?? (watchBearImages.length > 0 ? watchBearImages[0] : null),
    isAnimating,
  };
}
