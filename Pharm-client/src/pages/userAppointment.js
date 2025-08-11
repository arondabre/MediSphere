import React from "react";
import { useEffect,useState } from 'react';
//material-ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
//import cover from "../images/med.jpg";
// import cover from "../images/caduceus.png";
import BackgroundImage from '../images/med1.jpg'

import { getDoctorList,addappointment } from "../redux/actions/authActions";

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


const HomeStart = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();  
  const UserData = useSelector((state) => state.auth);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const doctorList = useSelector((state) => state.data.doctorList || []);
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');

    const handleSearch = (specialist) => {
      if (selectedDoctor) {
          dispatch(getDoctorList(specialist));

        }
      };
    
    const handleTimeChange = (doctorId, value) => {
      setSelectedTime((prev) => ({
        ...prev,
        [doctorId]: value
      }));
    };

    const handleBookDoctor = (doctor) =>{
      const timeForDoctor = selectedTime[doctor._id]; 

      if (!timeForDoctor) {
        alert("Please select a time before booking.");
        return;
      }
      
      const bookingData = {
        Doctor: doctor,
        user :UserData,
        Time :selectedTime[doctor._id],
        status:"Placed"
      };
      dispatch(addappointment(bookingData))
        .then((res) => {
          if (res?.message === "Appointment booked") {
            alert("Appointment booked successfully!");
            history.push("/"); // redirect to home
          } else if (res?.message === "Time slot already booked"){
            alert("Selected time slot is not available");
          }else{
            console.log(res);
            alert ("Failed to book appointment")
          }
        })
        .catch((err) => {
          console.error(err);
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
                <Paper className={classes.doctorCard}>
                  <Typography variant="h6">Dr. {doc.name}</Typography>
                  <Typography variant="body2">Fees: ₹{doc.Fees || 0}</Typography>
                  <Typography variant="body2">Speciality: {doc.tags}</Typography>
                  <Typography variant="body2">Address: {doc.address.street}</Typography>
                  <Typography variant="body2">Phone: {doc.address.phoneNo}</Typography>

                  <Select
                    labelId={`specialist-label-${doc._id}`}
                    value={selectedTime[doc._id] || ""}
                    onChange={(e) => handleTimeChange(doc._id, e.target.value)}
                  >
                    <MenuItem value="9:00AM">9:00AM</MenuItem>
                    <MenuItem value="9:15AM">9:15AM</MenuItem>
                    <MenuItem value="9:30AM">9:30AM</MenuItem>
                    <MenuItem value="9:45AM">9:45AM</MenuItem>
                  </Select>

                  {/* <Typography variant="body2">Tags: {doc.tags}</Typography> */}
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => handleBookDoctor(doc)}
                  >
                    Book
                  </Button>
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
