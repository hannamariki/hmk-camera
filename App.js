import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';

export default function App() {
  const [photoName, setPhotoName] = useState(''); //haetaan kuvan nimellä kuva
  const [photoBase64, setPhotoBase64] = useState(''); //Base64 koodaus koodaa tekstiksi binäärin eli haetaan sisällötiedolla kuva
  const [permission, requestPermission] = useCameraPermissions(); // tähän odotetaan käyttöoikeustietoa

  const camera = useRef(null);

  const snap = async () => {
    if (camera) {
      const photo = await camera.current.takePictureAsync({base64: true});
      setPhotoName(photo.uri);
      setPhotoBase64(photo.base64); 
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return(
      <View style={styles.container}>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
      <Button title="Take Photo" onPress={snap} />
      <View style={{ flex: 1 }}>
        {photoName && photoBase64 ? (
          <>
            <Image style={{ flex: 1 }} source={{ uri: photoName }} />
            <Image style={{ flex: 1 }} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
          </>
        ) : (
          <Text>No photo taken yet.</Text>
        )}      
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
