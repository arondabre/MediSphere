import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PreFinal } from "../redux/actions/authActions";
import useForm from "../hooks/forms";
import { useHistory } from "react-router-dom"; // <-- add this
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};
const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 40,
    background: "#f5f8ff",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  paper: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
    width: "100%",
    maxWidth: 1200,
    padding: 20,
    borderRadius: 20,
    background: "#eef3ff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  left: {
    flex: 1,
    maxWidth: 500,
    display: "flex",
    flexDirection: "column",
    padding: 30,
    borderRadius: 20,
    background: "linear-gradient(135deg, #ffffff 0%, #eef3ff 100%)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
  },
  right: {
    flex: 1,
    maxWidth: 650,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontWeight: 700,
    fontSize: "1.8rem",
    marginBottom: 20,
    color: "#1f3c88",
    textAlign: "center",
  },
  inputFile: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ccc",
    background: "#f8faff",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#1f3c88",
      background: "#eef3ff",
    },
  },
  textField: {
    marginTop: 16,
    marginBottom: 16,
    "& .MuiInputBase-root": {
      borderRadius: 12,
      background: "#fff",
    },
    "& .MuiInputBase-input": {
      padding: "12px 16px",
    },
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    fontWeight: 600,
    color: "#fff",
    background: "linear-gradient(90deg, #1f3c88, #4a90e2)",
    boxShadow: "0 4px 12px rgba(31,60,136,0.4)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(31,60,136,0.45)",
      background: "linear-gradient(90deg, #2a4ca3, #5b9cff)",
    },
  },
  previewImage: {
    width: "100%",
    maxWidth: 600,
    borderRadius: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
}));

const Pre = () => {
const classes = useStyles();
  const Pharmacy = useSelector((state) => state.data.Pharmacy);
  const dispatch = useDispatch();

  const [image, setImage ] = useState("");
  const [ url, setUrl ] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const history = useHistory();
  const handleImage=(e)=>{
    const file=e.target.files[0];
    setUrl(URL.createObjectURL(e.target.files[0]));
    setFilesToBase(file);
    //console.log(file);

  }
  const setFilesToBase = (file)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      setImage(reader.result);

    }
  }

  //submit

  const submitForm = async (e) =>{

    const newUserData = {
      Doc: inputs.Doc,
      seller_email:Pharmacy.email,
      img:image,
      Yname:inputs.Yname,
      Email:inputs.Email,
      Aptname:inputs.Aptname,
      Local:inputs.Local,
      street:inputs.Street,
      Zip:inputs.Zip,
      Phone:inputs.Phone,
    };
    dispatch(PreFinal(newUserData,history));
    setOpenSnackbar(true);

  }


  const { inputs, handleInputChange , handleSubmit } = useForm(
    {
      Doc:"",
      Yname:"",
      Email:"",
      Aptname:"",
      Local:"",
      street:"",
      Zip:"",
      Phone:"",

    },
    submitForm
  );


const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  
  return (
    <main className={classes.main}>
  <div className={classes.paper}>
    {/* Left Side Form */}
    <section className={classes.left}>
      <form noValidate onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleImage}
          className={classes.inputFile}
        />

        <TextField
          name="Doc"
          placeholder="Name of Doctor"
          onChange={handleInputChange}
          value={inputs.Doc}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="Yname"
          placeholder="Your Name"
          onChange={handleInputChange}
          value={inputs.Yname}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="Email"
          placeholder="Your Email"
          onChange={handleInputChange}
          value={inputs.Email}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="Aptname"
          placeholder="Apt Name"
          onChange={handleInputChange}
          value={inputs.Aptname}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="Local"
          placeholder="Locality"
          onChange={handleInputChange}
          value={inputs.Local}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="street"
          placeholder="Street"
          onChange={handleInputChange}
          value={inputs.street}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="Zip"
          placeholder="Zip_code"
          onChange={handleInputChange}
          value={inputs.Zip}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <TextField
          name="Phone"
          placeholder="Phone_no"
          onChange={handleInputChange}
          value={inputs.Phone}
          fullWidth
          variant="outlined"
          className={classes.textField}
          required
        />

        <Button
          type="submit"
          className={classes.button}
        >
          Submit
        </Button>
      </form>
    </section>

    {/* Right Side Preview */}
    <section className={classes.right}>
      <p>YOUR PRESCRIPTION WILL BE DISPLAYED HERE</p>
      {url && (
        <img
          src={url}
          alt="Preview"
          className={classes.previewImage}
        />
      )}
    </section>
    {/* Snackbar popup */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Prescription submitted successfully!
        </Alert>
      </Snackbar>
  </div>
</main>
  
  )
  }
  export default Pre;





