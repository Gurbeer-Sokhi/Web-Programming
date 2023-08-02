import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
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
  Button,
} from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import Search from "./Search";
import Error from "./Error";
import queries from "../queries";
import { useDispatch, useSelector } from "react-redux";
import { DECREMENT, INCREMENT } from "../reducers/collector";

export default function AllCharacters() {
  const collector = useSelector((state) => state.collector);
  const dispatch = useDispatch();
  const { pagenum } = useParams();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [togPage, settogPage] = useState(true);
  const { loading, error, data, refetch } = useQuery(
    queries.AllCharacters,
    { variables: { pageNum: Number(pagenum), searchTerm: searchTerm } },
    {
      fetchPolicy: "cache-and-network",
    }
  );

  let card = null;
  let SelectedCollector = null;
  let Collectorid = null;
  for (let i = 0; i < collector.length; i++) {
    if (collector[i].isSelected) {
      SelectedCollector = collector[i];
      Collectorid = collector[i].id;
    }
  }

  const handleCollect = (e) => {
    let element = 0;
    for (let i = 0; i < SelectedCollector.collection.length; i++) {
      if (e.id === SelectedCollector.collection[i].id) {
        element = e.id;
      }
    }
    if (SelectedCollector?.collection?.length == 10) {
      window.alert("collection full");
    } else if (element != 0) {
      window.alert("character already in collection");
    } else {
      dispatch(INCREMENT({ id: Collectorid, hero: e }));
    }
  };

  const handlegiveup = (e) => {
    if (
      SelectedCollector.collection.map((k) => {
        if (k.name === e.name) return true;
      }) &&
      SelectedCollector.character > 0
    ) {
      dispatch(DECREMENT({ id: Collectorid, hero: e }));
    }
  };

  useEffect(() => {
    refetch();
  }, [searchTerm]);

  const handlenext = () => {
    navigate(`/marvel-characters/page/${Number(pagenum) + 1}`);
  };
  const handleprev = () => {
    navigate(`/marvel-characters/page/${pagenum - 1}`);
  };
  const searchValue = async (value) => {
    setSearchTerm(value);
    if (value) {
      settogPage(false);
    } else {
      settogPage(true);
    }
  };

  const buildCard = (e) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={e.id}>
        <Card sx={{ maxWidth: 345 }}>
          <Link to={`/marvel-characters/${e.id}`}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={
                  e?.thumbnail
                    ? e.thumbnail
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"
                }
                alt="Marvel Character Photo"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {e?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Button
                    className="button"
                    onClick={(c) => {
                      c.preventDefault();
                      handleCollect(e);
                    }}
                  >
                    collect
                  </Button>
                  <br></br>
                  <Button
                    className="button"
                    onClick={(c) => {
                      c.preventDefault();
                      handlegiveup(e);
                    }}
                  >
                    giveup
                  </Button>
                </Typography>
                <Typography variant="body2" color="black"></Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
    );
  };

  card =
    data?.marvelCharactersList &&
    data?.marvelCharactersList.map((element) => {
      return buildCard(element);
    });

  if (loading && !searchTerm) {
    return (
      <h1 style={{ fontSize: 100, fontWeight: "bold", textAlign: "center" }}>
        Loading...
      </h1>
    );
  } else if (isNaN(pagenum) || Number(pagenum) <= 0 || Number(pagenum) > 79) {
    return <Error />;
  } else {
    return (
      <div className="App">
        <div className="search">
          <Search searchValue={searchValue} />
          Collected Characters:{SelectedCollector.character}
        </div>
        {togPage == true ? (
          <div className="Pagination">
            {pagenum < 79 ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handlenext();
                }}
              >
                Next Page
              </Button>
            ) : (
              ""
            )}
            <br></br>
            {pagenum > 1 ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleprev();
                }}
              >
                Prev Page
              </Button>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
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

{
  /* <Pagination
className="Pagination"
shape="rounded"
count={79}
pagenum={Number(pagenum)}
onChange={(e, value) => {
  navigate(`/marvel-characters/page/${value}`);
}}
/> */
}
