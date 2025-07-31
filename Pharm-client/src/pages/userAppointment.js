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

    const handleSearch = (specialist) => {
      if (selectedDoctor) {
          dispatch(getDoctorList(specialist));

        }
      };
      

    const handleBookDoctor = (doctor) =>{
      const bookingData = {
        doctorId: doctor._id,
        user :UserData._id,
        status:"Placed"
      };
      dispatch(addappointment(bookingData))
        .then((res) => {
          if (res?.message === "Appointment booked") {
            alert("Appointment booked successfully!");
            history.push("/"); // redirect to home
          } else {
            alert("Failed to book appointment");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Something went wrong");
        });
    };

//    return (
//     <div className={classes.background}>
//       <section className={classes.presentation}>
//         <div className={classes.introduction}>
//           <Typography className={classes.safeFood} noWrap>MEDICINE</Typography>
//           <Typography className={classes.delivery} noWrap>DELIVERY</Typography>

//           {/* Search form */}
//           <div className={classes.searchContainer}>
//             <FormControl className={classes.selectControl}>
//               <InputLabel id="doctor-label">Select Specialist</InputLabel>
//               <Select
//                 labelId="doctor-label"
//                 value={selectedDoctor}
//                 onChange={(e) => setSelectedDoctor(e.target.value)}
//               >
//                 <MenuItem value="Bakery">Bakery</MenuItem>
//                 <MenuItem value="dentist">Dentist</MenuItem>
//                 <MenuItem value="cardio">Cardiologist</MenuItem>
//                 <MenuItem value="neuro">Neurologist</MenuItem>
//                 <MenuItem value="derma">Dermatologist</MenuItem>
//               </Select>
//             </FormControl>

//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleSearch(selectedDoctor)}
//               className={classes.searchButton}
//             >
//               Search
//             </Button>
//           </div>

//           {/* Doctor List */}
//           <div className={classes.doctorList}>
//             {doctorList.length > 0 ? (
//               doctorList.map((doc) => (
//                 <div key={doc._id} className={classes.doctorCard}>
//                   <Typography variant="h6">Dr. {doc.name}</Typography>
//                   <Typography variant="body2">Min Order: ₹{doc.minOrderAmount}</Typography>
//                   <Typography variant="body2">Tags: {doc.tags}</Typography>
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => handleBookDoctor(doc)}
//                   >
//                     Book
//                   </Button>
//                 </div>
//               ))
//             ) : (
//               <Typography>No doctors found for the selected specialty.</Typography>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };
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
                  <Typography variant="body2">Min Order: ₹{doc.minOrderAmount || 0}</Typography>
                  <Typography variant="body2">Speciality: {doc.tags}</Typography>

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
