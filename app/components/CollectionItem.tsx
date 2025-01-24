import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {  Collections } from "../api/collectionsApi";


export function CollectionItem({ item }: { item: Collections }) {
  const router = useRouter();

  const handlePress = () => {
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
