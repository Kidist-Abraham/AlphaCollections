// app/collection/[id].tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const FRONTED_BASE_URL = Constants.expoConfig?.extra?.FRONTED_BASE_URL
interface Collection {
  id: number;
  name: string;
  description: string;
  contributionCount: number;
}

export default function CollectionScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const { token } = useAuth();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load the collection details
  const loadCollection = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollection(response.data);
    } catch (error) {
      console.error("Error loading collection:", error);
      Alert.alert("Error", "Failed to load collection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();
  }, [id]);

  const handleCopyLink = async () => {
    const shareLink = `${FRONTED_BASE_URL}/contribute/${id}`;
    await Clipboard.setStringAsync(shareLink);
    Alert.alert("Copied", `Link: ${shareLink}`);
  };

  const handleContribute = () => {
    router.push(`/contribute/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading collection...</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.container}>
        <Text>Collection not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{collection.name}</Text>
      <Text style={styles.description}>{collection.description}</Text>
      <Text style={styles.contributions}>Contributions: {collection.contributionCount}</Text>

      <View style={styles.buttonRow}>
        <Button title="Contribute" onPress={handleContribute} color="#FF9800" />
        <Button title="Copy Link" onPress={handleCopyLink} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#fff",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#ddd",
  },
  contributions: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
