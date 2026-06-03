import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

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
            { transform: [{ scale: imageScales?.[index] || 1 }] }
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
  },
});