import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import Draggable from 'react-native-draggable';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = "http://127.0.0.1:8000"; // Change if backend runs elsewhere

const EditorScreen = () => {
  const [video, setVideo] = useState(null);
  const [overlays, setOverlays] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [jobStatus, setJobStatus] = useState(null);
  const [jobId, setJobId] = useState(null);

  // Pick a video from device
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) setVideo(result.assets[0]);
  };

  // Pick image overlay
  const pickImageOverlay = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const overlay = {
        id: Date.now(),
        type: 'image',
        uri: result.assets[0].uri,
        position: { x: 50, y: 50 },
        start_time: 0,
        end_time: 5,
      };
      setOverlays([...overlays, overlay]);
    }
  };

  // Add text overlay
  const addTextOverlay = () => {
    if (!currentText) return;
    const overlay = {
      id: Date.now(),
      type: 'text',
      content: currentText,
      position: { x: 100, y: 100 },
      start_time: 0,
      end_time: 5,
    };
    setOverlays([...overlays, overlay]);
    setCurrentText('');
  };

  // Handle dragging overlay
  const handleDrag = (id, x, y) => {
    setOverlays(prev =>
      prev.map(o => (o.id === id ? { ...o, position: { x, y } } : o))
    );
  };

  // Submit video + overlays to backend
  const handleSubmit = async () => {
    if (!video) {
      Alert.alert("Error", "Please select a video first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", {
        uri: video.uri,
        name: video.fileName || "uploaded_video.mp4",
        type: "video/mp4",
      });
      formData.append("overlays", JSON.stringify(overlays));

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { job_id } = response.data;
      setJobId(job_id);
      setJobStatus("processing");
      Alert.alert("Upload Success!", `Job ID: ${job_id}`);

      // Start polling status
      pollStatus(job_id);
    } catch (error) {
      console.error(
        "Upload failed:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Upload Failed",
        error.response ? JSON.stringify(error.response.data) : error.message
      );
    }
  };

  // Poll backend for job status
  const pollStatus = (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/status/${id}`);
        setJobStatus(res.data.status);

        if (res.data.status === "completed") {
          clearInterval(interval);
          Alert.alert(
            "Rendering Complete",
            `Download video from: ${API_BASE_URL}/result/${id}`
          );
        }
      } catch (err) {
        console.error("Status check failed:", err.message);
      }
    }, 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🎬 Buttercut AI - Video Editor</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>📹 Upload Video</Text>
      </TouchableOpacity>

      {video && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: video.uri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={styles.video}
          />
          {overlays.map(overlay => (
            <Draggable
              key={overlay.id}
              x={overlay.position.x}
              y={overlay.position.y}
              onDragRelease={(e, gestureState, bounds) =>
                handleDrag(overlay.id, bounds.left, bounds.top)
              }
            >
              {overlay.type === "text" ? (
                <Text style={styles.overlayText}>{overlay.content}</Text>
              ) : (
                <Image
                  source={{ uri: overlay.uri }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
              )}
            </Draggable>
          ))}
        </View>
      )}

      <View style={styles.overlayTools}>
        <TextInput
          placeholder="Enter overlay text"
          style={styles.input}
          value={currentText}
          onChangeText={setCurrentText}
        />
        <TouchableOpacity style={styles.smallButton} onPress={addTextOverlay}>
          <Text style={styles.smallButtonText}>Add Text</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={pickImageOverlay}>
          <Text style={styles.smallButtonText}>Add Image</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>🚀 Submit</Text>
      </TouchableOpacity>

      {jobStatus && (
        <Text style={styles.statusText}>Job Status: {jobStatus}</Text>
      )}
    </ScrollView>
  );
};

export default EditorScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
    alignItems: 'center',
  },
  header: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 20 },
  button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  videoContainer: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: '#000',
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: { width: '100%', height: '100%' },
  overlayText: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  overlayTools: { marginTop: 20, width: '100%', alignItems: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 5, width: '80%', padding: 10, marginBottom: 10 },
  smallButton: { backgroundColor: '#ff9800', padding: 10, borderRadius: 6, marginVertical: 5, width: '50%', alignItems: 'center' },
  smallButtonText: { color: '#fff', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#4caf50', padding: 15, borderRadius: 10, width: '60%', alignItems: 'center', marginTop: 25 },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  statusText: { marginTop: 15, color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
