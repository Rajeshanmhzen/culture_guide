import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  district: String,
  category: String,
  image: [String],
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  tags: [String],
  activities: [String],
  visiting_hours: Object,
  entry_fee: Object,
  heritage_info: Object,
  type: { type: String, default: 'heritage_site' },
  search_keywords: [String]
});

locationSchema.index({ coordinates: '2dsphere' });

const Location = mongoose.model('Location', locationSchema);
export default Location;