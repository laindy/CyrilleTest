import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet, Text } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={name} size={size} color={color} />
      <Text style={{ fontSize: 10 }}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});