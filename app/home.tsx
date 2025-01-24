// app/home.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./contexts/AuthContext"; 

export default function HomeScreen() {
  const { token } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Page!</Text>
      <Text style={styles.subTitle}>
        Contribute or Download from Symbol data!
      </Text>

      <Button
        title="Search Collections"
        onPress={() => router.push("/search")}
      />

      <Button
        title="Create Collection"
        onPress={() => router.push({ pathname: "/create-collection", params: { token } })}
        color="#4CAF50"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Tips, announcements, or other content for the user can go here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  subTitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color:  "#fff",
  },
  infoContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color:  "#fff",
  },
});
