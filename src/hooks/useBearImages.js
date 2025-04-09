// src/hooks/useBearImages.js
import { useState, useEffect } from 'react';

export function useBearImages() {
  const [watchBearImages, setWatchBearImages] = useState([]);
  const [hideBearImages, setHideBearImages] = useState([]);
  const [peakBearImages, setPeakBearImages] = useState([]);

  useEffect(() => {
    const importAll = (r) => r.keys().map(r);

    const watch = importAll(require.context('../assets/images/bear', false, /watch_bear_\d+\.png$/));
    const hide = importAll(require.context('../assets/images/bear', false, /hide_bear_\d+\.png$/));
    const peak = importAll(require.context('../assets/images/bear', false, /peak_bear_\d+\.png$/));

    const sortImages = (images) => {
      return images.sort((a, b) => {
        const getNum = (path) => parseInt(path.match(/_(\d+)\.png$/)?.[1] || '0', 10);
        return getNum(a) - getNum(b);
      });
    };

    setWatchBearImages(sortImages(watch));
    setHideBearImages(sortImages(hide));
    setPeakBearImages(sortImages(peak));
  }, []);

  return { watchBearImages, hideBearImages, peakBearImages };
}
