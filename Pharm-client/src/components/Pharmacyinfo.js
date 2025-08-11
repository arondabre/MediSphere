import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper } from "@material-ui/core";

import Spinner from "../util/spinner/spinner";
import SwipeableImages from "./SwipeableImages";

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
    border: "2px solid #000",
    borderRadius: 12,
    padding: theme.spacing(3),
    backgroundColor: "#fff",
    maxWidth: 2800, // limit width so it doesn't stretch full page
    margin: "auto", // centers the Paper in its parent
  },
  pharmacyTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  pharmacyInfo: {
    marginBottom: theme.spacing(1),
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
