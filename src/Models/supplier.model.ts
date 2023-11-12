import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  cuil: { type: String, required: true },
  domain: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true },
  brandingColors: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  logo: { type: String, required: true },
  password: { type: String, required: true },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
