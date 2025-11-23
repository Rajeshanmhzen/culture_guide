import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
        {/* Left Section */}
        <div className="md:w-1/3">
          <h2 className="font-semibold mb-3 text-2xl text-primary">CultureNepal</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Discover the richness of Nepal’s cultural heritage. From ancient temples to timeless festivals, let CultureNepal guide you.
          </p>
        </div>

        {/* Center Navigation */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold mb-2 text-2xl text-primary">Easy Guide</h2>
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/explore" className="hover:underline">Explore</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </div>

        {/* Right Section (e.g., Contact Info or Newsletter) */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold mb-2 text-2xl text-primary">Connect</h2>
          <p className="text-sm">Kathmandu, Nepal</p>
          <p className="text-sm">Email: info@culturenepal.org</p>
          <p className="text-sm">Phone: +977 1 5555555</p>
        </div>
      </div>

      <hr className="border-gray-300" />
      <div className="text-center text-sm text-gray-500 py-4">
        © 2025 NepalHeritage • All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
