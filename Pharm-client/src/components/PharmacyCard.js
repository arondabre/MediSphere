import React from "react";
import { Link } from "react-router-dom";

//M-UI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import SwipeableImages from "./SwipeableImages";

const useStyles = makeStyles((theme) => ({
  card: {
  borderRadius: 20,
  overflow: "hidden",
  border: "1px solid rgba(95, 93, 93, 0.2)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,245,245,0.8))",
  backdropFilter: "blur(8px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
    transform: "translateY(-6px) scale(1.02)",
    borderColor: "rgba(46, 125, 50, 0.4)", // green glow
  },marginBottom:20
},

  cardContent: {
    padding: theme.spacing(3),
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: "1.3rem",
    color: "#2d3436",
    marginBottom: 4,
  },
  cardTags: {
    fontSize: "0.95rem",
    color: "#636e72",
    marginBottom: theme.spacing(1),
  },
  paymentText: {
    fontSize: "0.95rem",
    color: "#2d3436",
    fontWeight: 500,
  },
  cardActions: {
    padding: theme.spacing(2),
    borderTop: "1px solid #eee",
    justifyContent: "flex-end",
  },
  button: {
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "8px 20px",
    borderRadius: 8,
    backgroundColor: "#1976d2",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#125ea3",
      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
    },
  },
}));

export default function PharmacyCard(props) {
  const {
    name,
    tags,
    payment,
    imageUrl,
    _id,
  } = props;

  let restUrl = name.split(" ");
  restUrl = restUrl.join("-").toLowerCase();
  const classes = useStyles();
  let paymentString;

  if (payment.length === 1)
    paymentString = `Accepts ${payment[0].toLowerCase()} payment`;

  if (payment.length === 2)
    paymentString = `Accepts ${payment[0].toLowerCase()} & ${payment[1].toLowerCase()} payments`;

  return (
    <Card variant="outlined" className={classes.card}>
  <SwipeableImages images={imageUrl} type="home" />
  <CardContent className={classes.cardContent}>
    <Typography className={classes.cardTitle} gutterBottom>
      {name}
    </Typography>
    <Typography className={classes.cardTags} noWrap>
      {tags}
    </Typography>
    <Typography className={classes.paymentText}>
      {paymentString}
    </Typography>
  </CardContent>
  <CardActions className={classes.cardActions}>
    <Link
      to={{
        pathname: `order/${restUrl}`,
        state: {
          restId: _id,
        },
      }}
    >
      <Button className={classes.button}>
        Order Online
      </Button>
    </Link>
  </CardActions>
</Card>
  );
}
