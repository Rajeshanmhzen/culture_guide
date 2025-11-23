import { useState } from "react";
import axios from "axios";
import { Input, Textarea, Button, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Location_API_END_POINT } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function AddLocationForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    district: "",
    category: "",
    latitude: "",
    longitude: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      images.forEach((img) => {
        data.append("images", img); 
      });

      await axios.post(`${Location_API_END_POINT}/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      showNotification({ message: "Location created successfully", color: "green" });

      setFormData({
        name: "",
        description: "",
        district: "",
        category: "",
        latitude: "",
        longitude: "",
      });
      setImages([]);
    } catch (error) {
      console.log(error);
      showNotification({ message: "Failed to create location", color: "red" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3 bg-white shadow-md rounded-lg mt-3">
      <Button
                leftSection={<IoMdArrowRoundBack size={16} />}
                variant="default"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
      <div className="text-center mb-2 text-purple-700">
      <Title order={2} >Add New Location</Title>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="name"
          placeholder="Location Name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
        />
        <Input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
        <Input
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
        />
        <Input
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
        />
        <Input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </div>

      <Textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="mt-4"
        autosize
        minRows={3}
      />

      <Button
        fullWidth
        className="mt-6"
        onClick={handleSubmit}
        color="purple-heart.7"
      >
        Create Location
      </Button>
    </div>
  );
}
