const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    time : {
      type: String,
    },
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
      email: {
        type: String,
        required: true,
      },
      address: {
        type: Object,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    doctor: {
      phone: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
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
