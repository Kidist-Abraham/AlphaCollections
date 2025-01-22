import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button,TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useAuth } from "./contexts/AuthContext"; // adjust path
import { useRouter } from "expo-router";
import { Collections, fetchOwnedCollections, deleteCollections } from "./api/collectionsApi";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function OwneCcollectionsScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [collections, setCollections] = useState<Collections[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOwnedCollections = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchOwnedCollections(token);
      console.log("hereeeee", data)
      setCollections(data);
    } catch (error) {
      console.error("Error loading owned collections:", error);
      Alert.alert("Error", "Failed to load your collections.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (collectionId: number) => {
    if (!token) return;
    try {
      // 1) Construct the download URL
      const url = `${API_BASE_URL}/contribute/${collectionId}/zip`;
      
      // 2) We might pick a local path to save
      const localUri = FileSystem.documentDirectory + `collection_${collectionId}_contributions.zip`;
      
      // 3) Download the file
      const result = await FileSystem.downloadAsync(url, localUri, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (result.status !== 200) {
        Alert.alert("Download failed", "Error downloading zip");
        return;
      }
  
      Alert.alert("Download complete", `File saved to ${result.uri}`);
      // You could open or share it, e.g. with expo-sharing
    } catch (error) {
      console.error("Download collection zip error:", error);
      Alert.alert("Error", "Failed to download contributions");
    }
  };

  const handleDelete = async (collectionId: number) => {
    if (!token) return;
    try {
      await deleteCollections(collectionId, token);
      Alert.alert("Success", "Collection deleted");
      // reload the collections
      loadOwnedCollections();
    } catch (error) {
      console.error("Delete collection error:", error);
      Alert.alert("Error", "Failed to delete collection.");
    }
  };

  useEffect(() => {
    loadOwnedCollections();
  }, []);

  const renderCollection = ({ item }: { item: Collections}) => {
    return (
      <View style={styles.collectionItem}>
      <TouchableOpacity
        style={styles.collectionItem}
        onPress={() => router.push(`/collection/${item.id}`)} // Navigate to detail
      >
        <Text style={styles.collectionName}>{item.name}</Text>
        <Text style={styles.collectionDescription}>{item.description}</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
      <Button
        title="Delete"
        color="#f44336"
        onPress={() => handleDelete(item.id)}
      />
      <Button
          title="Download"
          color="#4CAF50"
          onPress={() => handleDownload(item.id)}
        />
    </View>
    </View>
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Owned Collections</Text>
      {loading && <Text>Loading...</Text>}
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCollection}
        ListEmptyComponent={!loading ? <Text>No owned collections found.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent", // let the root gradient show
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    color: "#fff", // if you have a dark gradient behind
  },
  collectionItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,

    // shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    elevation: 2,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  collectionDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});






