import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface UndoButtonProps {
  onPress: () => void;
  isDirty: boolean;
  disabled?: boolean;
  activeColor?: string;
}

export const UndoButton: React.FC<UndoButtonProps> = ({ onPress, isDirty, disabled, activeColor = "#f39c12" }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || !isDirty}
      style={{ opacity: isDirty ? 1 : 0.5 }}
    >
      <Ionicons 
        name="arrow-undo-outline" 
        size={22} 
        color={isDirty ? activeColor : "#bdc3c7"} 
      />
    </TouchableOpacity>
  );
};