export default ({ config }) => ({
    ...config,
    extra: {
      API_BASE_URL: "http://192.168.0.100:3000",
      FRONTED_BASE_URL: "http://192.168.0.100:8081"
    },
  });

  // Run ipconfig getifaddr en0 to get the ip address of your machine if you are testing locally