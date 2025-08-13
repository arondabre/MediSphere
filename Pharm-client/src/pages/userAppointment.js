import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import BackgroundImage from "../images/med1.jpg";
import { getDoctorList, addappointment } from "../redux/actions/authActions";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backgroundWrapper: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "55vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
  },
  contentBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: theme.spacing(4),
    borderRadius: 10,
    width: "90%",
    maxWidth: 1000,
  },
  title: {
    fontSize: 36,
    fontWeight: 600,
    color: "#157a21",
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
  searchButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  doctorCard: {
    padding: theme.spacing(2),
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  doctorGrid: {
    marginTop: theme.spacing(3),
  },
}));

// Utility to generate slots from a time range
const generateSlotsFromRange = (range, interval = 15) => {
  if (!range || !range.includes("-")) return [];
  const [startStr, endStr] = range.split("-");

  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
    if (!match) return null;
    let [_, hours, minutes, ampm] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
    return new Date(1970, 0, 1, hours, minutes);
  };

  const startTime = parseTime(startStr);
  const endTime = parseTime(endStr);
  if (!startTime || !endTime) return [];

  const times = [];
  const current = new Date(startTime);

  while (current <= endTime) {
    let hrs = current.getHours();
    let mins = current.getMinutes();
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    const minsStr = mins.toString().padStart(2, "0");
    times.push(`${hrs}:${minsStr}${ampm}`);
    current.setMinutes(current.getMinutes() + interval);
  }

  return times;
};

const HomeStart = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const UserData = useSelector((state) => state.auth);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const doctorList = useSelector((state) => state.data.doctorList || []);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [selectedTime, setSelectedTime] = useState({});

  const handleSearch = (specialist) => {
    if (selectedDoctor) {
      dispatch(getDoctorList(specialist));
      setSearchInitiated(true);
    }
  };

  const handleTimeChange = (doctorId, value) => {
    setSelectedTime((prev) => ({
      ...prev,
      [doctorId]: value,
    }));
  };

  const handleBookDoctor = (doctor) => {
    const timeForDoctor = selectedTime[doctor._id];
    if (!timeForDoctor) {
      alert("Please select a time before booking.");
      return;
    }
    const bookingData = {
      Doctor: doctor,
      user: UserData,
      Time: selectedTime[doctor._id],
      status: "Placed",
    };
    dispatch(addappointment(bookingData))
      .then((res) => {
        if (res?.message === "Appointment booked") {
          alert("Appointment booked successfully!");
          history.push("/");
        } else if (res?.message === "Time slot already booked") {
          alert("Selected time slot is not available");
        } else {
          alert("Failed to book appointment");
        }
      })
      .catch(() => {
        alert("Something went wrong");
      });
  };

  return (
    <div className={classes.backgroundWrapper}>
      <div className={classes.contentBox}>
        <Typography className={classes.title}>Book Your Doctor</Typography>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="specialist-label">Select Specialist</InputLabel>
            <Select
              labelId="specialist-label"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <MenuItem value="Dentist">Dentist</MenuItem>
              <MenuItem value="Cardiologist">Cardiologist</MenuItem>
              <MenuItem value="Neurologist">Neurologist</MenuItem>
              <MenuItem value="Dermatologist">Dermatologist</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className={classes.searchButton}
            onClick={() => handleSearch(selectedDoctor)}
          >
            Search
          </Button>
        </div>

        <Grid container spacing={3} className={classes.doctorGrid}>
          {doctorList.length > 0 ? (
            doctorList.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc._id}>
                <Paper
                  className={classes.doctorCard}
                  elevation={3}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                      Dr. {doc.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      Fees: CAD {doc.Fees || 0}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Speciality: {doc.tags}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Address: {doc.address.street}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Phone: {doc.address.phoneNo}
                    </Typography>
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <div style={{ height: "48px", display: "flex", alignItems: "center" }}>
                      <Select
                        labelId={`specialist-label-${doc._id}`}
                        value={selectedTime[doc._id] || ""}
                        onChange={(e) => handleTimeChange(doc._id, e.target.value)}
                        variant="outlined"
                        style={{
                          minWidth: "100%",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          height: 36,
                        }}
                        MenuProps={{
                          PaperProps: { style: { maxHeight: 200 } },
                        }}
                      >
                        {generateSlotsFromRange(doc.time_app || "9:00AM-5:00PM").map(
                          (time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{
                        marginTop: 16,
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                      onClick={() => handleBookDoctor(doc)}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </Paper>
              </Grid>
            ))
          ) : searchInitiated ? (
            <Grid item xs={12}>
              <Typography>No doctors found for selected specialty.</Typography>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography>Select a specialty to search for doctors.</Typography>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default React.memo(HomeStart);