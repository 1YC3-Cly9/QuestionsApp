import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { imageRendererStyles as styles } from '../styles/featureStyles';

interface ImageRendererProps {
  images?: string[];
  imageScales?: number[];
  questionId: string;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ images, imageScales, questionId }) => {
  if (!images || images.length === 0) return null;

  return (
    <View style={styles.imageContainer}>
      {images.map((imgUri, index) => (
        <Image 
          key={`img-${questionId}-${index}`}
          source={{ uri: imgUri }}
          style={[
            styles.questionImage,
            { 
              transform: [{ scale: imageScales?.[index] || 1 }],
              // Applied B&W Filter Layer: Grayscale + High Contrast
              filter: 'grayscale(100%) contrast(150%) brightness(110%)'
            }
          ]}
          resizeMode="contain"
        />
      ))}
    </View>
  );
};

