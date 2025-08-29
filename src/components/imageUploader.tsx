import React, { useState } from "react";
import type { ImageData } from "../types";
import ImageCard from './ImageCard';
import './ImageUploader.css';

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filePromises = Array.from(files).map((file) => {
      return new Promise<ImageData>((resolve) => {
        const url = URL.createObjectURL(file);

        const geolocation = "N/A (requires EXIF parsing)";

        const newImage: ImageData = {
          id: `${file.name}-${file.size}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: url,
          geolocation: geolocation,
        };
        resolve(newImage);
      });
    });

    Promise.all(filePromises).then((newImages) => {
      setImages((prevImages) => [...prevImages, ...newImages]);
    });
  };

  return (
    <div className="image-uploader-container">
      <h1>Picture Uploader</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <div className="image-list">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
