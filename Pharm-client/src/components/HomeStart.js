import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import BackgroundImage from "../images/med1.jpg";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "0 5%",
    color: "#157a21",
    animation: "$fadeIn 2s ease-out",
  },
  content: {
    maxWidth: "600px",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    lineHeight: 1.2,
    marginBottom: theme.spacing(2),
    textShadow: "2px 2px 6px rgba(0, 0, 0,0.1)",
    animation: "$slideUp 1s ease-out",
  },
  subtitle: {
    fontSize: "1.25rem",
    opacity: 0.9,
    marginBottom: theme.spacing(4),
    animation: "$slideUp 1s ease-out",
    animationDelay: "0.2s",
    animationFillMode: "forwards",
  },
  ctaButton: {
    fontSize: "1.1rem",
    backgroundColor: "#157a21",
    padding: "12px 30px",
    borderRadius: "10px",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#0f5e18",
      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
      transform: "scale(1.05)",
    },
  },
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@keyframes slideUp": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

const HomeStart = () => {
  const classes = useStyles();
  return (
    <div className={classes.background}>
      <div className={classes.content}>
        <Typography className={classes.title}>
          Digital Health at Your Fingertips
        </Typography>
        <Typography className={classes.subtitle}style={{color:"#000"}}>
          Book appointments, access experts, and manage your health — anytime, anywhere.
        </Typography>
        <Link to="/appointment">
          <Button className={classes.ctaButton} variant="contained">
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(HomeStart);
