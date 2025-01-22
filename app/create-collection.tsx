// app/create-collection.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function CreateCollectionScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  const handleCreateCollection = async () => {
    if (!name) {
      Alert.alert("Validation", "Collection name is required");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/collections`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const collection = response.data;
      // Navigate to the collection screen
      router.push(`/collection/${collection.id}`);
    } catch (error: any) {
      console.error("Error creating collection:", error);
      Alert.alert("Error", "Failed to create collection");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Collection Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Collection Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Create collection" onPress={handleCreateCollection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent", // let any gradient show through
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});
