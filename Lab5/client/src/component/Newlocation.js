import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../App.css";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";

export default function Newlocation() {
  const [Name, setName] = useState(null);
  const [Address, setAddress] = useState(null);
  const [Url, setUrl] = useState(null);
  const [preview, setpreview] = useState(false);
  const [Error, setError] = useState(false);

  const [AddLocation, { loading, error, data }] = useMutation(
    queries.uploadLocation
  );

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
  };
  return (
    <div className="Form">
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
  );
}
