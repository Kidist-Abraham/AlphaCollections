import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  PanResponder,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import Canvas from "react-native-canvas";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";

import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function ContributeScreen() {
  const { token } = useAuth();
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();
  const canvasRef = useRef<Canvas | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Function to initialize the canvas
  const handleCanvasRef = (canvas: Canvas | null) => {
    if (canvas) {
      console.log("handleCanvasRef invoked:", canvas);
      canvasRef.current = canvas;

      // Set desired width and height for the canvas
      canvas.width = Dimensions.get("window").width - 40;
      canvas.height = 400;

      const context = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
      setCtx(context);

      // Initialize canvas styles
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height); // Set background color
      context.strokeStyle = "black";
      context.lineWidth = 2;

      setIsCanvasReady(true); // Mark canvas as ready
      console.log("Canvas initialized.");
    }
  };

  // PanResponder for handling drawing
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      if (ctx) {
        const { locationX, locationY } = evt.nativeEvent;
        ctx.lineTo(locationX, locationY); 
        ctx.stroke();
      }
    },
    onPanResponderRelease: () => {
      if (ctx) ctx.beginPath(); // Reset the path for the next stroke
    },
  });

  // Function to handle saving the drawing
  const handleSave = async () => {
    if (!isCanvasReady || !canvasRef.current || !ctx) {
      Alert.alert("Error", "Canvas is not available or not fully initialized.");
      console.error("Canvas is not available or not fully initialized.");
      return;
    }

    try {
      const canvas = canvasRef.current;
      const dataUrl = await canvas.toDataURL("image/png");
      const base64Image = dataUrl.split(",")[1];

      await axios.post(
        `${API_BASE_URL}/contribute/${id}`,
        { image: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Image uploaded successfully");
      router.push(`/contribute/${id}`);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Failed to save or upload the drawing.");
    }
  };

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas reference is still null after rendering.");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contribute Drawing</Text>

      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Canvas ref={handleCanvasRef} style={styles.canvas} />
      </View>

      <TouchableOpacity
        style={[styles.floatingButton, !isCanvasReady && { backgroundColor: "#ccc" }]}
        onPress={handleSave}
        disabled={!isCanvasReady}
      >
        <Text style={styles.buttonText}>{isCanvasReady ? "Save Drawing" : "Loading..."}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  canvasContainer: {
    width: Dimensions.get("window").width - 40,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,

    // Android elevation
    elevation: 2,
  },
  canvas: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#FF9800",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    // Android elevation
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
