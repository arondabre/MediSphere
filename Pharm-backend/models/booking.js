const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        "Placed",
        "Cancelled",
        "Accepted",
        "Completed",
        "Out For Delivery",
      ],
    },
    user: {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    doctor: {
      doctorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "doctor",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", bookingSchema);
