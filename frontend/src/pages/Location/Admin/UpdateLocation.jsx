// ✅ FULLY CORRECTED VERSION
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Input, Textarea, Button, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Location_API_END_POINT, SERVER_BASE_URL } from "../../../utils/constant";
import { setLocation } from "../../../store/locationSlice";
import { IoMdArrowRoundBack } from "react-icons/io";

const LocationUpdate = () => {
  const { id } = useParams();
  const locations = useSelector((state) => state.location);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    district: "",
    category: "",
    latitude: "",
    longitude: "",
    images: [], 
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreview, setNewImagePreview] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Array.isArray(locations)) {
      const found = locations.find((loc) => loc._id === id);
      if (found) {
        setFormData({
          name: found.name,
          description: found.description,
          district: found.district,
          category: found.category,
          latitude: found.coordinates?.coordinates[1] || "",
          longitude: found.coordinates?.coordinates[0] || "",
          images: [],
        });

        const imgs = Array.isArray(found.image) ? found.image : [found.image];
        setExistingImages(imgs);
      }
    }
  }, [id, locations]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const filesArray = Array.from(files);
      setFormData((prev) => ({ ...prev, images: filesArray })); // ✅ Update images
      setNewImagePreview(filesArray.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images" && value.length > 0) {
          value.forEach((file) => data.append("images", file)); 
        } else {
          data.append(key, value);
        }
      });

      const res = await axios.post(`${Location_API_END_POINT}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      showNotification({ message: "Location updated successfully", color: "green" });

      dispatch(
        setLocation(
          locations.map((loc) => (loc._id === id ? res.data.location : loc))
        )
      );

      navigate(`/places/${id}`);
    } catch (err) {
      console.error(err);
      showNotification({ message: "Update failed", color: "red" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <div>
        <Button
          leftSection={<IoMdArrowRoundBack size={16} />}
          variant="default"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      <Title order={2} className="text-center">Update Location</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <Input name="district" value={formData.district} onChange={handleChange} placeholder="District" />
        <Input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
        <Input name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
        <Input name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
        <Input
          type="file"
          name="image"
          multiple
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="mt-4"
        minRows={4}
      />

      {existingImages.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-gray-700">Existing Images:</p>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, idx) => (
              <img
                key={idx}
                src={`${SERVER_BASE_URL}/uploads/heritage-pic/${img}`}
                alt={`existing-${idx}`}
                className="w-24 h-24 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>
      )}

      {newImagePreview.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-gray-700">New Images Preview:</p>
          <div className="flex flex-wrap gap-2">
            {newImagePreview.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>
      )}

      <Button fullWidth className="mt-6" onClick={handleSubmit} color="purple-heart.5">
        Update Location
      </Button>
    </div>
  );
};

export default LocationUpdate;
