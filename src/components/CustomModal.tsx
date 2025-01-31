import React from 'react';
import {Modal, Pressable} from 'react-native';
import {CustomAppModalProps} from '../types/types';

const CustomAppModal: React.FC<CustomAppModalProps> = ({
  visible,
  setVisible,
  style,
  children,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable
        onPress={() => setVisible(!visible)}
        style={[style, {backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}
      />
      {children}
    </Modal>
  );
};

export default CustomAppModal;
