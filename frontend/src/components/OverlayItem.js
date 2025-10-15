// src/components/OverlayItem.js
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, PanResponder, Animated, TouchableOpacity, StyleSheet } from 'react-native';

export default function OverlayItem({ overlay, containerWidth, containerHeight, onChange, onRemove }) {
  const pan = useRef(new Animated.ValueXY({ x: overlay.x || 0, y: overlay.y || 0 })).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    // Sync initial position if overlay changes externally
    pan.setValue({ x: overlay.x || 0, y: overlay.y || 0 });
  }, [overlay.x, overlay.y]);

  useEffect(() => {
    // When pan changes, call onChange to update parent state (throttle/discrete updates)
    const id = pan.addListener((v) => {
      // clamp within container
      let x = Math.max(0, Math.min(v.x, Math.max(0, (containerWidth || 300) - 20)));
      let y = Math.max(0, Math.min(v.y, Math.max(0, (containerHeight || 200) - 20)));
      onChange && onChange({ x, y });
    });
    return () => {
      pan.removeListener(id);
    };
  }, [pan, containerWidth, containerHeight, onChange]);

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setPressed(true);
      pan.setOffset({ x: pan.x._value, y: pan.y._value });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
      setPressed(false);
    },
  });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.wrapper,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.label}>{overlay.type.toUpperCase()}</Text>
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.remove}>✕</Text>
        </TouchableOpacity>
      </View>

      {overlay.type === 'text' ? (
        <View style={styles.textBox}>
          <Text style={{ color: '#fff' }}>{overlay.content}</Text>
        </View>
      ) : overlay.type === 'image' ? (
        <Image source={{ uri: overlay.uri }} style={styles.imageBox} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    padding: 6,
    backgroundColor: 'transparent',
    // small shadow to see overlays
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 11, fontWeight: '700', color: '#fff', backgroundColor: '#00000080', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  remove: { color: '#fff', marginLeft: 8 },
  textBox: { backgroundColor: '#00000080', padding: 8, borderRadius: 4 },
  imageBox: { width: 120, height: 80, borderRadius: 6, borderWidth: 1, borderColor: '#fff' },
});
