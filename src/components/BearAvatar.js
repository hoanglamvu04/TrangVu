import { memo } from 'react';

const BearAvatar = memo(function BearAvatar({ currentImage, size = 130 }) {
  return (
    <img 
      src={currentImage} 
      className="rounded-full transition-all duration-200 ease-in-out"
      width={size}
      height={size}
      style={{ 
        objectFit: 'contain',
        transform: 'translate3d(0,0,0)' // Force GPU acceleration
      }}
      tabIndex={-1}
      alt="Animated bear avatar"
    />
  );
});

export default BearAvatar;
