import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MathRenderer } from './mathRenderer';

interface ImageOrSvgRendererProps {
  content: string;
  imageStyle?: any; // Style for the Image component
  minHeight?: number; // Minimum height for the container, especially for SVGs
}

export const ImageOrSvgRenderer: React.FC<ImageOrSvgRendererProps> = ({ content, imageStyle, minHeight = 180 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const isSvg = content.trim().toLowerCase().startsWith('<svg');

  useEffect(() => {
    setIsLoading(true); // Reset loading state when content changes
    // If content is empty, no loading is needed
    if (!content) {
      setIsLoading(false);
    }
  }, [content]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (error: any) => {
    setIsLoading(false);
    console.error("Image failed to load:", error.nativeEvent.error);
  };

  const handleMathRendererLoad = () => {
    // MathRenderer reports height via onMessage, which implies content is loaded
    setIsLoading(false);
  };

  if (!content) return null; // Don't render anything if content is empty

  return (
    <View style={[styles.imageContainer, { minHeight: minHeight }, imageStyle]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
      {isSvg ? (
        <View style={{ flex: 1, opacity: isLoading ? 0 : 1 }}>
          <MathRenderer content={content} onContentLoad={handleMathRendererLoad} />
        </View>
      ) : (
        <Image
          source={{ uri: content }}
          style={[
            imageStyle, 
            { opacity: isLoading ? 0 : 1, filter: 'grayscale(100%) contrast(150%)' }
          ]}
          resizeMode="contain"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa', // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure content doesn't spill
  },
  loadingOverlay: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent white overlay
    zIndex: 1,
  },
});