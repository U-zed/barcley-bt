"use client";

export default function LoadingAvatar({
  src = "/logo.png",
  size = 96,
}) {
  return (
    <div className="flex justify-center mt-6">
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
