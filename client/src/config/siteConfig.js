// Set VITE_API_URL to your Render API URL when the client and server are
// deployed as separate services (for example, https://forum-api.onrender.com).
// With a single Express deployment, leaving it unset keeps requests same-origin.
const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");
const BASE_URL = configuredApiUrl || (import.meta.env.MODE === "development" ? "http://localhost:5001" : "");
const siteConfig = {
  siteName: "AD-Din Professional Forum",
  logo: "/Ad-Din.png",
  email: "rafibstd@gmail.com",
  phone: "+8801303025015",
  address: "Nabinagar, Brahmanbaria, Bangladesh",
  backendUrl: BASE_URL,
};

export default siteConfig;
