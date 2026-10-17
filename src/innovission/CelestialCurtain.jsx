import React, { useEffect } from 'react';

export default function CelestialCurtain({ onComplete }) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return null;
}
