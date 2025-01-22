import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const FRONTED_BASE_URL = Constants.expoConfig?.extra?.FRONTED_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL); // For debugging

export default {API_BASE_URL, FRONTED_BASE_URL};
