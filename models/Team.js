const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  established: { type: Number, required: true },
});

module.exports = mongoose.model("Team", teamSchema);
