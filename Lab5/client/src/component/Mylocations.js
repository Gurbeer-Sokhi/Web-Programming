import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import queries from "../queries";
import List from "./List";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Mylocation() {
  const [Error, setError] = useState(false);

  const { loading, error, data, refetch } = useQuery(queries.userLocations, {
    fetchPolicy: "cache-and-network",
  });
  const [AddLocation, { loadingL, errorL, dataL }] = useMutation(
    queries.uploadLocation
  );
  const [dataX, setDataX] = useState(null);

  const fetchdata = () => {
    refetch({ fetchPolicy: "cache-and-network" });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let url = document.getElementById("url").value;

    if (name && address && url) {
      AddLocation({
        variables: {
          image: url,
          address,
          name,
        },
      });
      document.getElementById("name").value = "";
      document.getElementById("address").value = "";
      document.getElementById("url").value = "";
      setError(false);
    } else {
      setError(true);
    }
    refetch();
  };

  if (loading) {
    <h1>Loading...</h1>;
  }
  return (
    <div className="App">
      <br></br>
      <h1>My-Locations</h1>
      <List
        props={data?.userPostedLocations}
        refetchlocation={fetchdata}
      ></List>
      <div className="Form-MY">
        <br></br>
        <h1>Add Location</h1>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <form id="NewLocation" className="NewLocation">
              <TextField required id="name" label="Location Name" />
              <br></br>
              <TextField required id="address" label="Address" />
              <br></br>
              <TextField required id="url" label="Image Url" />
              <br></br>
              <Button type="submit" onClick={handlesubmit}>
                Create
              </Button>
              {Error && (
                <p role="alert" style={{ color: "rgb(255,0,0" }}>
                  <em>All fields required</em>
                </p>
              )}
            </form>
          </div>
        </Box>
      </div>
    </div>
  );
}
