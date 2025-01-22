// Example: CollectionList.tsx (or your HomeScreen / SearchScreen)
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {  Collections } from "../api/collectionsApi";


// This is the item in the FlatList's renderItem
export function CollectionItem({ item }: { item: Collections }) {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to collection detail, passing the collectionId
    // We'll create a route: /collection/[id].tsx
    router.push(`/collection/${item.id}`);
  };

  return (
    <Pressable onPress={handlePress} style={styles.collectionContainer}>
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.collectionDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  collectionContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  collectionDescription: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
});
