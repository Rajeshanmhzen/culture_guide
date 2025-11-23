import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IoMap, IoReload } from "react-icons/io5";
import axios from "axios";
import {
  Location_API_END_POINT,
  SERVER_BASE_URL,
} from "../../../utils/constant";
import LocationList from "../../../components/LocationList";
import SearchBar from "../../../components/SearchBar";
import { IoMdArrowRoundBack } from "react-icons/io";

const AdminLocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLocations = async (query = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append("q", query);

      const url = params
        ? `${Location_API_END_POINT}/search?${params.toString()}`
        : `${SERVER_BASE_URL}/api/v1/place`;

      const res = await axios.get(url, { withCredentials: true });
      setLocations(res.data);
    } catch (err) {
      console.log("Error fetching locations:", err);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 rounded-xl shadow-sm shadow-purple-500/30">
      <Button
        leftSection={<IoMdArrowRoundBack size={16} />}
        variant="default"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1 mt-4">
        <SearchBar
          placeholder="Search places, district or category"
          onSearch={(query) => fetchLocations(query)}
        />
        <Button
          leftSection={<IoMap size={16} />}
          variant="default"
          onClick={() => navigate("/add-location")}
        >
          New Location
        </Button>
      </div>

      <LocationList
        locations={locations}
        loading={loading}
        onDelete={(id) =>
          setLocations((prev) => prev.filter((loc) => loc._id !== id))
        }
      />
    </div>
  );
};

export default AdminLocationPage;
