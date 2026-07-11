// const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || "http://localhost:5001";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/" : "";
const siteConfig = {
  siteName: "AD-Din Professional Forum",
  logo: "/Ad-Din.png",
  email: "rafibstd@gmail.com",
  phone: "+8801303025015",
  address: "Nabinagar, Brahmanbaria, Bangladesh",
  backendUrl: BASE_URL,
};

export default siteConfig;
