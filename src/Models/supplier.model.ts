import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  cuit: { type: String, required: true },
  domain: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true },
  primaryColor: { type: String, required: true },
  secondaryColor: { type: String, required: true },
  coverPhoto: { type: String, required: false },
  logo: { type: String, required: false },
  password: { type: String, required: true },
  isProvider: { type: Boolean, default: true },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
