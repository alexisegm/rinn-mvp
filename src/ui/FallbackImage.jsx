// src/ui/FallbackImage.jsx
import { useState } from 'react';

export default function FallbackImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center overflow-hidden">
      {src && !hasError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={() => setHasError(true)} // Si falla, activa el error
        />
      ) : (
        // El Fallback (Plan B)
        <span className="text-5xl opacity-50">🔧</span>
      )}
    </div>
  );
}