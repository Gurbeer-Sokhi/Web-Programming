import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
  Pagination,
} from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import Search from "./Search";
import ErrorPage from "./ErrorPage";
export default function Events() {
  const [data, setdata] = useState(null);
  const { page } = useParams();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  let card = null;

  const fetchData = async () => {
    let result = null;
    if (!isNaN(page)) {
      result = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*&page=${
          Number(page) - 1
        }`
      );
    } else {
      console.log("in else");
      result = await axios.get(
        "https://app.ticketmaster.com/discovery/v2/events?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*"
      );
    }
    return result.data;
  };
  useEffect(() => {
    fetchData().then((e) => {
      setdata(e);
      console.log(e);
    });
  }, [page]);

  const fetchsearch = async () => {
    try {
      console.log(`in fetch searchTerm: ${searchTerm}`);
      const data = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events?keyword=${searchTerm}&apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*`
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("search useEffect fired");
    fetchsearch().then((e) => {
      setSearchData(e);
    });
    if (searchTerm) {
      fetchsearch();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (e) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={e.id}>
        <Card sx={{ maxWidth: 345 }}>
          <Link to={`../events/${e.id}`}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={
                  e.images[0].url
                    ? e.images[0].url
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"
                }
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {e.name}
                </Typography>
                <Typography variant="body2" color="text.secondary"></Typography>
                <Typography variant="body2" color="black">
                  Date: {e.dates.start.localDate}, Time:{" "}
                  {e.dates.start.localTime}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
    );
  };
  if (searchTerm) {
    card =
      searchData &&
      searchData.data?._embedded?.events.map((element) => {
        return buildCard(element);
      });
  } else {
    card =
      data?._embedded?.events &&
      data?._embedded?.events.map((element) => {
        return buildCard(element);
      });
  }
  if (isNaN(page) || Number(page) <= 0) {
    return <ErrorPage />;
  } else {
    return (
      <div className="App">
        <Search searchValue={searchValue} />
        <Pagination
          className="Pagination"
          shape="rounded"
          count={50}
          page={Number(page)}
          onChange={(e, value) => {
            navigate(`/events/page/${value}`);
          }}
        />
        <br></br>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
}
