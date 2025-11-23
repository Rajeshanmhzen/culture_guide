import { useNavigate } from "react-router-dom";
import { SERVER_BASE_URL } from "../utils/constant";
import { Button } from "@mantine/core";
import {  FaCheckCircle, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { notifications } from "@mantine/notifications";

const LocationList = ({ locations = [], loading, onDelete }) => {
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`${SERVER_BASE_URL}/api/v1/place/${id}`, {
        withCredentials: true,
      });
      notifications.show({
        title: "Deleted Successfully",
        message: "The location has been removed.",
        icon: <FaCheckCircle />,
        color: "teal",
        withBorder: true,
        className: "!border-green-500",
      });
      onDelete(id);
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-heart-500 mb-6 text-center">
        Registered Heritage Locations
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full text-left text-sm table-auto bg-white">
          <thead className="bg-purple-heart-600 text-white uppercase text-sm font-medium">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No locations found.
                </td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img
                      src={`${SERVER_BASE_URL}/uploads/heritage-pic/${location.image[0]}`}
                      alt="Location"
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{location.name}</td>
                  <td className="px-6 py-4">{location.district}</td>
                  <td className="px-6 py-4">{location.category}</td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() =>
                        navigate(`/admin/location/update/${location._id}`)
                      }
                      me={10}
                      color="purple-heart.5"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      color="red"
                      onClick={() => handleDelete(location._id)}
                    >
                      <MdDelete />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationList;
