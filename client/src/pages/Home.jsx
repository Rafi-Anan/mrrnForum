import { Link } from "react-router-dom";
import siteConfig from "../config/siteConfig";

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow p-6 md:p-10 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Welcome to {siteConfig.siteName}</h1>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          A modern community platform for discussions, ideas, categories, and member interaction.
        </p>
        <div className="flex gap-3 md:gap-4 justify-center flex-col sm:flex-row">
          <Link to="/forum" className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-blue-700 transition text-sm md:text-base">
            Explore Forum
          </Link>
          <Link to="/register" className="bg-gray-200 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-gray-300 transition text-sm md:text-base">
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;