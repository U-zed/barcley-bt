"use client";

import { useState, useEffect } from "react";

export default function LoadingAvatar({
  src = "/logo.png",
  size = 96,
  delay = 15000, // delay in  s
  onFinish,    // optional callback after delay
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onFinish]);

  if (!show) return null; // hide after delay

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Rotating border */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin" />

        {/* Image */}
        <img
          src={src}
          alt="Loading"
          className="rounded-full object-cover bg-white"
          style={{
            width: size - 10,
            height: size - 10,
          }}
        />
      </div>
    </div>
  );
}
