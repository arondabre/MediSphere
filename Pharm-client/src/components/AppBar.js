import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { logoutAction } from "../redux/actions/authActions";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "linear-gradient(90deg, #499ceeff, #264cd4ff)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "4px 0",
  },
  title: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  brandButton: {
    fontWeight: 700,
    fontSize: 24,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "4px 12px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.35)",
      transform: "translateY(-1px)",
    },
  },
  buttonStyles: {
    color: "#fff",
    margin: "0 6px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.15)",
    },
  },
  buttons: {
    marginRight: 20,
    display: "flex",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#fff",
    marginRight: 12,
  },
}));

export default function AppBarPrimary() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    account: { role },
    authenticated,
    firstName,
    lastName,
    address,
  } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction(history));
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Link to="/" className={classes.title} style={{ textDecoration: 'none' }}>
          <Typography variant="h6" noWrap>
            <Button className={classes.name} variant="outlined">MEDISPHERE</Button>
          </Typography>
        </Link>
  
        {authenticated ? (
          role === "ROLE_SELLER" ? (
            <div className={classes.buttons}>
              <Typography className={classes.buttonStyles}>
                Seller Dashboard
              </Typography>
              <Link to="/seller/orders">
                <Button className={classes.buttonStyles}>Orders</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className={classes.buttonStyles}
                variant="outlined"
              >
                Logout
              </Button>
            </div>
          ) : role === "ROLE_DOCTOR" ? (
            <div className={classes.buttons}>
              <Typography className={classes.buttonStyles}>
                Doctor Dashboard
              </Typography>
              <Link to="/doctor/appointment">
                <Button className={classes.buttonStyles}>Appointments</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className={classes.buttonStyles}
                variant="outlined"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className={classes.buttons}>
              <Typography className={classes.buttonStyles}>
                WELCOME 👤 {firstName} {lastName}
              </Typography>
              <Link to="/orders">
                <Button className={classes.buttonStyles}>Orders</Button>
              </Link>
              <Link to="/userAppointment">
                <Button className={classes.buttonStyles}>Appointments</Button>
              </Link>
              <Link to={{ pathname: "/cart", state: { address: address } }}>
                <Button className={classes.buttonStyles}>Cart</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className={classes.buttonStyles}
                variant="outlined"
              >
                Logout
              </Button>
            </div>
          )
        ) : (
          <div className={classes.buttons}>
            <Link to="/login">
              <Button className={classes.buttonStyles} variant="outlined">LOGIN</Button>
            </Link>
            <Link to="/register">
              <Button className={classes.buttonStyles} variant="outlined">
                REGISTER
              </Button>
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
