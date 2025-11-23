import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SERVER_BASE_URL } from "../utils/constant";

const Home = () => {
  const locations = useSelector((state) => state.location) || [];
  const locationsArray = Array.isArray(locations) ? locations : [];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{ backgroundImage: "url('/images/nepal-heritage.jpg')" }}
      >
        <div className="absolute inset-0 bg-[url(/public/patan_banner.jpg)] bg-opacity-50 z-0 " />
        <div className="z-10 px-4   ">
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-8 text-center">
  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
    Explore Nepal's Rich Cultural Legacy
  </h1>
  <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto text-white">
    Journey through ancient cities, sacred temples, and timeless traditions that define Nepal’s unique heritage.
  </p>
  <Link
    to="/places"
    className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded text-lg"
  >
    Explore Places
  </Link>
</div>
        </div>
      </section>

      {/* Featured Heritage Sites */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-700">
          Featured Heritage Sites
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locationsArray.slice(0,3).map((location, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={`${SERVER_BASE_URL}/uploads/heritage-pic/${location.image[0]}`}
                alt={location.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-purple-700">
                  {location.title}
                </h3>
                <p className="text-gray-700 line-clamp-3">{location.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to={"/places"}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded text-lg"
          >
            Show More
          </Link>
        </div>
      </section>

      {/* Extra Section */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Cultural Festivals & Traditions</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Nepal is not just a land of temples and mountains — it's a land of celebration. Festivals like Dashain, Tihar, Holi, and Indra Jatra are deeply rooted in tradition and culture. They bring together communities in vibrant displays of devotion, color, and joy.
          </p>
          <Link
            to="/festivals"
            className="text-purple-700 underline hover:text-purple-900"
          >
            Learn more about our festivals
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
