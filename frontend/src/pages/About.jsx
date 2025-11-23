import { Link } from "react-router-dom";
import patan_banner from "../../public/patan_banner.jpg"

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img
          src={patan_banner}
          alt="About Nepal Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white px-4 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">About Nepal Heritage</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Celebrating the rich cultural legacy and timeless traditions of Nepal.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Our Mission</h2>
        <p className="text-lg leading-relaxed text-gray-700 max-w-4xl">
          Nepal Heritage is a digital initiative dedicated to preserving and promoting Nepal’s diverse cultural landmarks,
          ancient architecture, religious monuments, and living traditions. Our mission is to make Nepal’s heritage accessible to everyone — locals, tourists, students, and researchers — while fostering appreciation and protection of these priceless treasures.
        </p>
      </section>

      {/* Cultural Highlights */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-purple-700 mb-10">What Makes Nepal Unique?</h2>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <img
              src="https://imartnepal.com/wp-content/uploads/2019/03/Kal-Bhairav-Statue.jpg"
              alt="Newar Arts"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-3">Living History</h3>
            <p className="text-gray-700 mb-4">
              Nepal is one of the few countries where ancient traditions are still practiced in daily life. From sacred rituals in the temples of Pashupatinath to vibrant festivals like Indra Jatra and Dashain, every corner of the country breathes heritage.
            </p>
            <h3 className="text-2xl font-semibold mb-3">Architectural Marvels</h3>
            <p className="text-gray-700">
              The pagoda-style temples, intricately carved wooden windows, and centuries-old stupas tell stories of faith and craftsmanship that date back to the Licchavi and Malla periods.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-purple-700 py-16 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Join the Journey</h2>
        <p className="text-lg mb-6">Be part of the community that values, explores, and preserves Nepal's vibrant heritage.</p>
        <Link to="/places" className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Discover Cultural Sites
        </Link>
      </section>
    </div>
  );
};

export default About;
