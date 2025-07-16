import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library'; // <-- EKLE

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<'back' | 'front'>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
  if (!permission) {
    requestPermission();
  }
}, [permission]);

useEffect(() => {
  (async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Media library permission is required!');
    }
  })();
}, []);

const takePhoto = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync();
    //
    const asset = await MediaLibrary.createAssetAsync(photo.uri);
    setPhotoUri(asset.uri);
    console.log('Galeriye kaydedilen photoUri:', asset.uri);
    router.push({
      pathname: '/metadata',
      params: { photoUri: asset.uri },
    });
  }
};

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Camera is not supported on web.</Text>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={type} />
      <View style={styles.controls}>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        {photoUri && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Image source={{ uri: photoUri }} style={styles.preview} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001d3d',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewLabel: {
    color: '#fff',
    marginBottom: 4,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
});