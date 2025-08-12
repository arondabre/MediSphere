import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//redux
import { useDispatch, useSelector } from "react-redux";

//material-ui
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Spinner from "../util/spinner/spinner";
import PharmacyInfo from "../components/Pharmacyinfo";
import PharmacyItems from "../components/Pharmacyitems";
import SearchBar from "../components/SearchBar";


import { fetchPharmacy } from "../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  container: {
  backgroundColor: "#d5d7d8ff",
  marginTop: theme.spacing(6),
  padding: theme.spacing(3),
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
},
pharmacyCard: {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  maxWidth: "900px",
  margin: "0 auto",
},

pharmacyImage: {
  width: 200,
  height: 200,
  borderRadius: 20,
  objectFit: "cover",
  marginRight: theme.spacing(3),
},
  typography: {
    fontSize: 18,
    fontFamily: "'Segoe UI', sans-serif",
    color: "#000000ff",
  },
  typographys: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
    color: "#2e7d32",
  },
  innerCont: {
    padding: theme.spacing(3),
    
  },
  resources: {
    margin: "60px 40px 10px 40px",
    fontSize: "1.2rem",
  },
  buttonStyleOne: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
  buttonStyleTwo: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginTop: 40,
    borderRadius: 8,
    padding: "15px 25px",
    fontSize: 16,
    fontWeight: "bold",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
  headingSection: {
    textAlign: "center",
    padding: theme.spacing(3),
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
    marginBottom: theme.spacing(3),
  },
  itemsContainer: {
  marginBottom: theme.spacing(8), // spacing before footer

}
}));




export default function Pharmacy(props) {
  const classes = useStyles();
  const restId = props.location.state.restId;
  console.log(props,'pharmacy');
  const { loading } = useSelector((state) => state.data);
  const Pharmacy = useSelector((state) => state.data.Pharmacy);
  const { items } = useSelector((state) => state.data.Pharmacy);
  const dispatch = useDispatch();

  useEffect(() => {
    if (items) {
      setItemsState(items);
      setFilteredItemsState(items);
    }
  }, [items]);

  const [itemsState, setItemsState] = useState(items ? [] : null);
  const [filteredItemsState, setFilteredItemsState] = useState(
    items ? [] : null
  );

  const handleSearch = (value) => {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (value !== "") {
      // Assign the original list to currentList
      currentList = itemsState;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter((item) => {
        // change current item to lowercase
        const lc = item.title.toLowerCase();
        // change search term to lowercase
        const filter = value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
    } else {
      // If the search bar is empty, set newList to original task list
      newList = itemsState;
    }
    // Set the filtered state based on what our rules added to newList
    setFilteredItemsState(newList);
  };

  useEffect(() => {
  
    console.log("in useEffect Pharmacy");
    dispatch(fetchPharmacy(restId));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <PharmacyInfo {...Pharmacy} />

          <Grid container className={classes.container}>
  <Typography variant="h6" className={classes.typographys}>
    Ask Your Pharmacist, Not the Internet
  </Typography>
  <Typography variant="body2" className={classes.typography}style={{marginLeft:20}}>
    Take a picture of your prescription and place your order.
  </Typography>
  <Link to="/photo">
    <Button className={classes.buttonStyleTwo} style={{marginLeft:40, marginTop:5}}>Upload Prescription</Button>
  </Link>
</Grid>
          <Grid container direction="row" style={{ marginTop: 40 }}>
            <Grid
              item
              xs={12}
              sm={8}
              style={{
                paddingLeft: "520px",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                noWrap
                style={{ textAlign: "center" }}
              >
                Have Your Medicine At Your Door Steps&nbsp;&nbsp;
                <span role="img" aria-label="fries" style={{ fontSize: 40 }}>
                  🏥
                </span>
              </Typography>
              <Typography
                variant="body1"
                noWrap
                style={{ textAlign: "center" }}
              >
                Order from wide varieties of different available Items below
              </Typography>
              <br />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              style={{ marginTop: 20, paddingLeft: 40 ,marginBottom:30}}
            >
              
              <SearchBar page="items" handleSearch={handleSearch} />
            </Grid>
            <PharmacyItems items={filteredItemsState} />
          </Grid>
        </>
      )}
    </>
  );
}
