import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper } from "@material-ui/core";

import Spinner from "../util/spinner/spinner";
import SwipeableImages from "./SwipeableImages";

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
  borderRadius: 16,
  padding: theme.spacing(4),
  width: "100%", // full horizontal stretch
  maxWidth: "100%",
  margin: "auto",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f9ff 50%, #e8f0ff 100%)",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(8px)", // glassmorphic touch
  transition: "all 0.35s ease",

  "&:hover": {
    transform: "translateY(-6px) scale(1.01)",
    boxShadow: "0 14px 32px rgba(0, 0, 0, 0.18), 0 6px 14px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #fdfdfd 0%, #f5faff 50%, #e4efff 100%)",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
},
  pharmacyTitle: {
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  fontSize: "1.8rem",
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.5px",
  color: "#1f3c88", // deep futuristic blue
  background: "linear-gradient(90deg, #1f3c88, #4a90e2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, text-shadow 0.3s ease",

  "&:hover": {
    transform: "scale(1.03)",
    textShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
},

pharmacyInfo: {
  marginBottom: theme.spacing(1),
  fontSize: "1rem",
  lineHeight: 1.6,
  color: "#4a4a4a",
  fontFamily: "'Segoe UI', sans-serif",
  background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(74,144,226,0.08) 100%)",
  padding: theme.spacing(1.5),
  borderRadius: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "background 0.3s ease, box-shadow 0.3s ease",

  "&:hover": {
    background: "linear-gradient(90deg, rgba(74,144,226,0.15) 0%, rgba(255,255,255,0) 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
},
}));

function Pharmacy(props) {
  const classes = useStyles();
  const { loading } = useSelector((state) => state.data);
  const { name, imageUrl, tags, payment, address } = props;

  let paymentString = "";
  let phoneNo = "";
  let addressString = "";

  if (address) {
    phoneNo = address.phoneNo;
    addressString = `${address.aptName}, ${address.locality}, ${address.street}`;
  }

  if (payment?.length === 1) {
    paymentString = `Accepts ${payment[0].toLowerCase()} payment`;
  } else if (payment?.length === 2) {
    paymentString = `Accepts ${payment[0].toLowerCase()} & ${payment[1].toLowerCase()} payments`;
  }

  return loading ? (
    <Spinner />
  ) : (
    <Grid container justifyContent="center" style={{ padding: 20 }}>
      <Paper className={classes.boxWrapper}>
        <Grid container spacing={4} alignItems="center">
          {/* Left side: info */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" className={classes.pharmacyTitle}>
              {name}
            </Typography>
            <Typography variant="body2" color="textSecondary" className={classes.pharmacyInfo}>
              {tags}
            </Typography>
            <Typography variant="body2" className={classes.pharmacyInfo}>
              {paymentString}
            </Typography>
            <Typography variant="body2" className={classes.pharmacyInfo}>
              Address: {addressString}
            </Typography>
            <Typography variant="body2" className={classes.pharmacyInfo}>
              Call: {phoneNo}
            </Typography>
            <Typography variant="body2">
              
            </Typography>
          </Grid>

          {/* Right side: image */}
          <Grid item xs={12} sm={6}>
            {imageUrl && <SwipeableImages images={imageUrl} type="Pharmacy" />}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default React.memo(Pharmacy);
