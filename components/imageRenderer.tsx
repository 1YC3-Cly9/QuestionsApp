import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
});