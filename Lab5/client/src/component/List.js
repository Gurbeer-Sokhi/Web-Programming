import "../App";
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
  Pagination,
  IconButton,
  linkClasses,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function List(props) {
  const { loadingL, errorL, dataL, refetch } = useQuery(
    queries.likedLocations,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [Addtolike, { data, loading, error }] = useMutation(
    queries.updateLocation
  );

  const [DeleteU, { dataD, loadingD, errorD }] = useMutation(
    queries.deleteLocation
  );

  console.log("props", props);
  let card = null;

  const buildCard = (e) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={e?.id}>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <img
              height="140"
              src={e?.image}
              onError={(e) => {
                e.target.src =
                  "https://s3.amazonaws.com/images.seroundtable.com/invalid-url-1354629517.png";
              }}
            ></img>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Name: {e?.name}
              </Typography>
              {window.location.pathname == "/my-location" ? (
                <Typography variant="body2" color="text.secondary">
                  <DeleteIcon
                    onClick={async (event) => {
                      event.preventDefault();
                      await DeleteU({
                        variables: {
                          id: e.id,
                          name: e.name,
                          image: e.image,
                          address: e.address,
                        },
                      });

                      props.refetchlocation();
                    }}
                  />
                </Typography>
              ) : (
                ""
              )}
              <Typography variant="body2" color="black">
                Address: {e?.address ? e.address : ""}
              </Typography>
            </CardContent>
            <IconButton aria-label="add to favorites">
              {!e.liked ? (
                <ThumbUpIcon
                  onClick={async (event) => {
                    event.preventDefault();
                    console.log("e", e);
                    await Addtolike({
                      variables: {
                        id: e.id,
                        image: e.image,
                        name: e.name,
                        address: e.address,
                        userPosted: e.userPosted,
                        liked: true,
                      },
                    });
                    props.refetchlist();
                  }}
                >
                  Like
                </ThumbUpIcon>
              ) : (
                <ThumbDownIcon
                  onClick={async (event) => {
                    event.preventDefault();
                    console.log("e", e);
                    await Addtolike({
                      variables: {
                        id: e.id,
                        image: e.image,
                        name: e.name,
                        address: e.address,
                        userPosted: e.userPosted,
                        liked: false,
                      },
                    });
                    props.refetchlist();
                  }}
                >
                  Dislike
                </ThumbDownIcon>
              )}
            </IconButton>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (props) {
    card = props?.props?.map((e) => {
      return buildCard(e);
    });
  }

  return (
    <div className="App">
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
