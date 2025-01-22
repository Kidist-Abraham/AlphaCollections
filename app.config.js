export default ({ config }) => ({
    ...config,
    extra: {
      API_BASE_URL: "http://192.168.109.195:3000",
      FRONTED_BASE_URL: "http://192.168.109.195:8081"
    },
  });
  
  // 192.168.109.195 - mobile data
  // 192.168.0.101 - wifi