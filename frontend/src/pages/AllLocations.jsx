import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mantine/core";
import { setLocation } from "../store/LocationSlice";
import { Location_API_END_POINT, SERVER_BASE_URL } from "../utils/constant";


const AllLocations = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location) || [];
  const locationsArray = Array.isArray(locations) ? locations : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(6);
  const [query, setQuery] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${Location_API_END_POINT}`);
        const data = res.data;
        if (Array.isArray(data)) {
          dispatch(setLocation(data));
        } else {
          console.error('API returned non-array data:', data);
          dispatch(setLocation([]));
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        dispatch(setLocation([]));
      }
    };
    fetchLocations();
  }, [dispatch]);

  // search Handler
  const handleSearch = async(e)=> {
    e.preventDefault()
    try {
      const url = query.trim()
      ? `${Location_API_END_POINT}/search?q=${encodeURIComponent(query)}` : `${Location_API_END_POINT}`;
      const {data} = await axios.get(url)
      if (Array.isArray(data)) {
        dispatch(setLocation(data))
      } else {
        dispatch(setLocation([]))
      }
    } catch (err) {
      console.error("Search error:", err.message);
      dispatch(setLocation([]))
    }
  }

  const indexOfLast = currentPage * locationsPerPage;
  const indexOfFirst = indexOfLast - locationsPerPage;
  const currentLocations = locationsArray.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Locations</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-center">
  <input 
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)} 
    placeholder="Search by name, district, tag..."
    className="border px-3 py-2 rounded w-full"
  />
<button
  type="submit"
  className="px-4 py-2 bg-purple-heart-500 text-white rounded-sm cursor-pointer"
>
  Search
</button>  
{query && (
    <button
  className="px-4 py-2 rounded-sm  text-red-400 border border-red-400 cursor-pointer"
  onClick={() => {
    setQuery("");
    handleSearch({ preventDefault: () => {} });
  }}
>
  Clear
</button>
  )}
</form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentLocations.map((loc) => (
          <div
            key={loc._id}
            className="shadow-lg p-4 rounded bg-white cursor-pointer hover:shadow-xl"
            onClick={() => navigate(`/places/${loc._id}`)}
          >
            <img
              src={`${SERVER_BASE_URL}/uploads/heritage-pic/${loc.image[0]}`}
              alt={loc.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{loc.name}</h3>
            <p className="text-sm text-gray-500">{loc.district}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(locationsArray.length / locationsPerPage) }).map(
          (_, idx) => (
            <Button
              key={idx + 1}
              onClick={() => paginate(idx + 1)}
              variant={currentPage === idx + 1 ? "filled" : "outline"}
              size="xs"
            >
              {idx + 1}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default AllLocations;
