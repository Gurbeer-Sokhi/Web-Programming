import "./App.css";
import "./Root.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";
import { Stack } from "@mui/system";

export default function Root() {
  const [flag, setflag] = useState(false);
  console.log("In");
  const queryParameters = new URLSearchParams(window.location.search);
  const Page = queryParameters.get("page");
  const navigate = useNavigate();
  console.log(Page);
  return (
    <div>
      <h1 className="Ticket">Ticket Master Web Application</h1>
      <Stack direction="row" spacing={2} className="Navstack">
        <Button variant="contained" className="Nav">
          <Link
            to="/"
            onClick={(event) => {
              event.preventDefault();
              setflag(false);
              navigate("/");
            }}
          >
            Home
          </Link>
        </Button>
        <Button variant="contained" className="Nav">
          <Link
            to="events/page/1"
            onClick={(event) => {
              event.preventDefault();
              setflag(true);
              navigate("events/page/1");
            }}
          >
            Events Page
          </Link>
        </Button>
        <Button variant="contained" className="Nav">
          <Link
            to="attractions/page/1"
            onClick={(event) => {
              event.preventDefault();
              setflag(true);
              navigate("attractions/page/1");
            }}
          >
            Attractions Page
          </Link>
        </Button>
        <Button variant="contained" className="Nav">
          <Link
            to="venues/page/1"
            onClick={(event) => {
              event.preventDefault();
              setflag(true);
              navigate("venues/page/1");
            }}
          >
            Venues Page
          </Link>
        </Button>
      </Stack>
      <div id="detail">
        <Outlet />
      </div>
      <p hidden={flag}>
        This is a web application which fetches data from an API called
        ticketmaster and renders data about events,attractions and venues. My
        first concert which I ever attended was by Arijit Singh and it was
        probably my favorite concert which I would love to attend again.
      </p>
    </div>
  );
}
