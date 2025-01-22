// api/collectionApi.ts
import axios from "axios";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export interface Collections {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

interface CollectionsResponse {
  collections: Collections[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchCollections(
    page = 1,
    limit = 10,
    query = "",
    token: string | null
  ): Promise<CollectionsResponse> {
    console.log("fetchCollections called with:", { page, limit, query, token });
    const response = await axios.get<CollectionsResponse>(`${API_BASE_URL}/collections`, {
      params: { page, limit, query },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }


export async function fetchOwnedCollections(token: string | null): Promise<Collections[]> {
  const response = await axios.get<Collections[]>(`${API_BASE_URL}/collections/owned`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteCollections(collectionId: number, token: string | null): Promise<void> {
  await axios.delete(`${API_BASE_URL}/collections/${collectionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
