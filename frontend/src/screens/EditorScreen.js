import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

export default function EditorScreen() {
  const [video, setVideo] = useState(null);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Buttercut AI - Video Editor</Text>

      {video ? (
        <Video
          source={{ uri: video }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.info}>No video selected yet</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Upload / Select Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.overlayBtn]}>
        <Text style={styles.buttonText}>Add Overlay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#0d1117' },
  title: { color: '#58a6ff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  info: { color: '#aaa', marginBottom: 15 },
  video: { width: '100%', height: 300, borderRadius: 12, marginBottom: 15 },
  button: { backgroundColor: '#238636', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
  overlayBtn: { backgroundColor: '#1f6feb' },
  buttonText: { color: 'white', fontWeight: '600' },
});
