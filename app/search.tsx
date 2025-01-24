import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { fetchCollections, Collections } from "./api/collectionsApi";
import { CollectionItem } from "./components/CollectionItem"; 
import { useAuth } from "./contexts/AuthContext";

export default function SearchCollectionsScreen() {
  console.log("Rendering SearchCollectionsScreen");

  const { token } = useAuth();
  const [collections, setCollections] = useState<Collections[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalPages = Math.ceil(total / limit);

  const loadCollections = async (pageNumber: number, newQuery: string, replace = false) => {
    console.log("loadCollections called with:", { pageNumber, newQuery, replace, token });
    setLoading(true);
    try {
      const data = await fetchCollections(pageNumber, limit, newQuery, token);
      console.log("fetchCollections returned:", data);

      if (replace || pageNumber === 1) {
        setCollections(data.collections);
      } else {
        setCollections((prev) => [...prev, ...data.collections]);
      }
      setPage(data.page);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("useEffect => calling loadCollections(1, '', true)");
    loadCollections(1, "", true);
  }, []);

  const handleSearch = () => {
    console.log("handleSearch => resetting to page 1 with query:", query);
    setPage(1);
    loadCollections(1, query, true);
  };

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      console.log("handleLoadMore => next page:", page + 1);
      loadCollections(page + 1, query, false);
    }
  };

  const onRefresh = async () => {
    console.log("Pull to refresh => reset page to 1");
    setRefreshing(true);
    setPage(1);
    await loadCollections(1, query, true);
  };

  const renderCollection = ({ item }: { item: Collections }) => <CollectionItem item={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search collections..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <FlatList
        data={collections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCollection}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={
          loading && page < totalPages ? (
            <ActivityIndicator size="large" color="#0000ff" style={{ margin: 16 }} />
          ) : null
        }
      />

      {loading && page === 1 && (
        <ActivityIndicator size="large" color="blue" style={styles.spinnerOverlay} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    searchContainer: {
      marginTop: 50,
      flexDirection: "row",
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ccc",
      marginRight: 8,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    collectionItem: {
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    collectionName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    collectionDescription: {
      fontSize: 14,
      color: "#666",
    },
    spinnerOverlay: {
      position: "absolute",
      top: "50%",
      left: "45%",
    },
  });