import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { SERVER_BASE_URL } from '../utils/constant';
import { Button } from '@mantine/core';
import { IoMdArrowRoundBack } from 'react-icons/io';

const LocationDetail = () => {
  const { id } = useParams();
  const locations = useSelector(state => state.location);
  const [location, setLocation] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(locations)) {
      const found = locations.find(loc => loc._id === id);
      setLocation(found);

      if (found?.image) {
        const imgs = Array.isArray(found.image) ? found.image : [found.image];
        setMainImage(imgs[0]);
      }
    }
  }, [id, locations]);

  if (!location) return <div className="p-4">Loading...</div>;

  const images = Array.isArray(location.image) ? location.image : [location.image];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <Button
          leftSection={<IoMdArrowRoundBack size={16} />}
          variant="default"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
      <p className="text-gray-600 mb-4">
        {location.district} | {location.category}
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img
            src={`${SERVER_BASE_URL}/uploads/heritage-pic/${mainImage}`}
            alt="Main"
            className="w-full h-96 object-cover rounded shadow"
          />

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`${SERVER_BASE_URL}/uploads/heritage-pic/${img}`}
                alt={`thumb-${idx}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  mainImage === img ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <p className="text-gray-700 whitespace-pre-line">{location.description}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
