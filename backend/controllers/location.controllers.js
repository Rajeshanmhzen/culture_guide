import Location from "../models/location.model.js"
import { generateTags, tokenize, semanticSearchScore } from "../utlils/searchUtils.js";

// Helper to calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Create a new location
export const createLocation = async (req, res) => {
  try {
    const { name, description, district, category, latitude, longitude } = req.body;
    if (!name || !latitude || !longitude) {
      return res.status(400).json({ message: "Name, latitude, and longitude are required." });
    }

    const tags = generateTags(name,description);
    const images = req.files?.map(file => file.filename) || [];

    const newLocation = new Location({
      name,
      description,
      district,
      category,
      image:images,
      coordinates: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      tags,
      search_keywords: tokenize(name + " " + description)
    });

    await newLocation.save();
    res.status(201).json({ message: "Location created", location: newLocation });
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error: error.message });
  }
};


// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching locations", error: err.message });
  }
};

// Get location by ID
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: "Error fetching location", error: err.message });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    const existingImages = await Location.findById(req.params.id)

    const updatedData = {
      ...req.body,
      ...(name && description && { tags: generateTags(name, description), search_keywords: tokenize(name + " " + description) }),
      ...(latitude && longitude && {
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      }),
    };

    if (req.files?.length) {
      updatedData.image = req.files.map(file => file.filename);
    }

    const updated = await Location.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updated) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location updated", location: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error: error.message });
  }
};


// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting location", error: err.message });
  }
};

// Search places with query param ?q=searchTerm
export const searchPlaces = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      const allLocations = await Location.find();
      return res.json(allLocations);
    }

    // Get all locations for semantic search
    const allLocations = await Location.find();
    const lowerQuery = query.toLowerCase();

    // Set threshold based on query type
    let threshold = 0.05;
    if (lowerQuery.includes('durbar square')) {
      threshold = 0.15; // Higher threshold for durbar square to avoid unwanted results
    } else if (lowerQuery === 'peace' || lowerQuery.includes('peace') || lowerQuery.includes('peaceful')) {
      threshold = 0.08; // Lower threshold for peace to include more Buddhist sites
    } else if (lowerQuery.includes('religious')) {
      threshold = 0.1; // Moderate threshold for religious sites
    }

    const results = allLocations
      .map((loc) => {
        const content = `${loc.name} ${loc.description} ${loc.district} ${loc.category} ${loc.tags?.join(" ")}`;
        const score = semanticSearchScore(query, content);
        return { location: loc, score };
      })
      .filter((item) => {
        // Special handling for durbar square - only show actual durbar squares
        if (lowerQuery.includes('durbar square')) {
          return item.score > threshold && 
                 (item.location.name.toLowerCase().includes('durbar') || 
                  item.location.tags?.some(tag => tag.includes('durbar')));
        }
        
        // Special handling for heritage site - focus on architectural heritage
        if (lowerQuery.includes('heritage site')) {
          return item.score > 0.15 && // Higher threshold for heritage
                 (item.location.category === 'Heritage' || 
                  item.location.category === 'Museum' ||
                  item.location.name.toLowerCase().includes('durbar'));
        }
        
        return item.score > threshold;
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.location);

    // If no semantic matches found, fall back to regex search
    if (results.length === 0) {
      const mongoQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { district: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
        ],
      };
      const fallbackResults = await Location.find(mongoQuery);
      return res.json(fallbackResults);
    }

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Error searching locations", error: err.message });
  }
};

// Get nearby places with query params ?lat=xx&lon=yy&radius=km (default radius=5km)
export const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const locations = await Location.find({
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000 // meters
        }
      }
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error getting nearby places", error: error.message });
  }
};

// Seed example data (called by POST /seed)
export const seedPlaces = async (req, res) => {
  try {
    const seedData = [
  {
    name: "Bhaktapur Durbar Square",
    description: "Ancient palace complex with traditional Newari architecture.",
    district: "Bhaktapur",
    category: "Heritage",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.4297, 27.6715],
    },
    tags: ["bhaktapur", "durbar", "square", "heritage", "palace"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Patan Durbar Square",
    description: "Historical plaza known for its artistic courtyards and temples.",
    district: "Lalitpur",
    category: "Heritage",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.3169, 27.6722],
    },
    tags: ["patan", "durbar", "square", "heritage", "temple"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Swayambhunath Stupa",
    description: "Famous Buddhist stupa atop a hill offering panoramic views and peaceful meditation environment.",
    district: "Kathmandu",
    category: "Religious",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.2900, 27.7149],
    },
    tags: ["swayambhunath", "stupa", "buddhist", "religious", "kathmandu", "peaceful"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Pashupatinath Temple",
    description: "Important Hindu temple complex on the banks of the Bagmati River.",
    district: "Kathmandu",
    category: "Religious",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.3483, 27.7105],
    },
    tags: ["pashupatinath", "temple", "hindu", "religious", "kathmandu"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Changu Narayan Temple",
    description: "Ancient Hindu temple located on a hilltop near Bhaktapur.",
    district: "Bhaktapur",
    category: "Heritage",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.4335, 27.7006],
    },
    tags: ["changu", "narayan", "temple", "heritage", "bhaktapur"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Thamel",
    description: "Popular tourist neighborhood full of shops, restaurants, and nightlife.",
    district: "Kathmandu",
    category: "Tourist",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.3090, 27.7155],
    },
    tags: ["thamel", "tourist", "shops", "restaurants", "nightlife"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Garden of Dreams",
    description: "Peaceful historic garden in the heart of Kathmandu.",
    district: "Kathmandu",
    category: "Tourist",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.3152, 27.7103],
    },
    tags: ["garden", "dreams", "historic", "garden", "kathmandu"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Patan Museum",
    description: "Museum showcasing traditional arts and crafts of the Kathmandu valley.",
    district: "Lalitpur",
    category: "Museum",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.3175, 27.6721],
    },
    tags: ["patan", "museum", "arts", "crafts", "heritage"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Boudhanath Stupa",
    description: "One of the largest spherical stupas in Nepal and an important peaceful pilgrimage site for meditation and prayer.",
    district: "Kathmandu",
    category: "Religious",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.3620, 27.7215],
    },
    tags: ["boudhanath", "stupa", "buddhist", "religious", "kathmandu", "peaceful", "meditation"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  },
  {
    name: "Nagarkot",
    description: "Hill station famous for sunrise views over the Himalayas.",
    district: "Nagarkot",
    category: "Nature",
    image: "",
    coordinates: {
      type: "Point",
      coordinates: [85.5176, 27.7052],
    },
    tags: ["nagarkot", "hill", "nature", "himalayas", "sunrise"],
    activities: [],
    visiting_hours: {},
    entry_fee: {},
    heritage_info: {},
    type: "heritage_site",
    search_keywords: []
  }
];
    await Location.deleteMany({});
    await Location.insertMany(seedData);

    res.json({ message: "Seed data inserted successfully", count: seedData.length });
  } catch (err) {
    res.status(500).json({ message: "Error seeding data", error: err.message });
  }
};
