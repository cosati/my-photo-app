import React from 'react';
import './ImageCard.css';
import type { ImageData } from '../types';

interface ImageCardProps {
  image: ImageData;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <div className="image-card">
      <img src={image.url} alt={image.name} className="image-preview" />
      <div className="image-metadata">
        <p><strong>Name:</strong> {image.name}</p>
        <p><strong>Size:</strong> {(image.size / 1024).toFixed(2)} KB</p>
        <p><strong>Type:</strong> {image.type}</p>
        <p><strong>Geolocation:</strong> {image.geolocation}</p>
      </div>
    </div>
  );
};

export default ImageCard;