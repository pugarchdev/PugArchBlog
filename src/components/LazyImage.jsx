// src/components/LazyImage.jsx
"use client";
import { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%" }}>
      {isVisible && (
        <img src={src} alt={alt} className={className} loading="lazy" />
      )}
    </div>
  );
};

export default LazyImage;
