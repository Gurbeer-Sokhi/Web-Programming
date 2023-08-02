import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Search from "./Search";
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

export default function Attractions() {
  const [data, setdata] = useState(null);
  const { page } = useParams(null);
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  let card = null;

  const fetchsearch = async () => {
    try {
      const data = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/attractions?keyword=${searchTerm}&apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*`
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  const fetchData = async () => {
    let result = null;
    if (typeof page != "number") {
      result = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/attractions?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*&page=${
          Number(page) - 1
        }`
      );
    } else {
      result = await axios.get(
        "https://app.ticketmaster.com/discovery/v2/attractions?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*"
      );
    }
    return result.data;
  };
  useEffect(() => {
    fetchData().then((e) => {
      setdata(e);
    });
  }, [page]);
  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  useEffect(() => {
    fetchsearch().then((e) => {
      setSearchData(e);
    });
    if (searchTerm) {
      fetchsearch();
    }
  }, [searchTerm]);
  console.log(data);
  const buildCard = (e) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={e.id}>
        <Card sx={{ maxWidth: 345 }}>
          <Link to={`../attractions/${e.id}`}>
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
                <Typography variant="body2" color="black"></Typography>
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
      searchData.data?._embedded?.attractions.map((element) => {
        return buildCard(element);
      });
  } else {
    card =
      data?._embedded?.attractions &&
      data?._embedded?.attractions.map((element) => {
        return buildCard(element);
      });
  }

  return (
    <div className="App">
      <Search searchValue={searchValue} />
      <Pagination
        className="Pagination"
        shape="rounded"
        count={50}
        page={Number(page)}
        onChange={(e, value) => {
          navigate(`/attractions/page/${value}`);
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
