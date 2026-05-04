import siteConfig from "../config/siteConfig";

function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-700">
        <h3 className="font-bold text-lg mb-2">{siteConfig.siteName}</h3>
        <p>Email: {siteConfig.email}</p>
        <p>Phone: {siteConfig.phone}</p>
        <p>Address: {siteConfig.address}</p>
      </div>
    </footer>
  );
}

export default Footer;