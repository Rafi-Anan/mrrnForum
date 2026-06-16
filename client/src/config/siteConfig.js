const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || "https://addin.h2r.online";

const siteConfig = {
  siteName: "AD-Din Professional Forum",
  logo: "/Ad-Din.png",
  email: "rafibstd@gmail.com",
  phone: "+8801303025015",
  address: "Nabinagar, Brahmanbaria, Bangladesh",
  backendUrl
};

export default siteConfig;