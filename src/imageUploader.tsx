import React, { useState } from "react";

interface ImageData {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  geolocation?: string; // Geolocation is optional
}

const ImageUploader: React.FC = () => {
    const [images, setImages] = useState<ImageData[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const filePromises = Array.from(files).map((file) => {
            return new Promise<ImageData>((resolve) => {
                const url = URL.createObjectURL(file);

                const geolocation = 'N/A (requires EXIF parsing)';

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
                    <div key={image.id} className="image-card">
                        <img src={image.url} alt={image.name} className="image-preview" />
                        <div className="image-metadata">
                            <p><strong>Name:</strong> {image.name}</p>
                            <p><strong>Size:</strong> {(image.size / 1024).toFixed(2)} KB</p>
                            <p><strong>Type:</strong> {image.type}</p>
                            <p><strong>Geolocation:</strong> {image.geolocation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;