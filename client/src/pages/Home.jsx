import { Link } from "react-router-dom";
import siteConfig from "../config/siteConfig";

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to {siteConfig.siteName}</h1>
        <p className="text-gray-600 mb-6">
          A modern community platform for discussions, ideas, categories, and member interaction.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/forum" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
            Explore Forum
          </Link>
          <Link to="/register" className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300">
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;