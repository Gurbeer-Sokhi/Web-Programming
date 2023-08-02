import "../App.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  Grid,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  IconButtonProps,
  Typography,
  ListItem,
  List,
  Button,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Error from "./Error";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useDispatch, useSelector } from "react-redux";
import { DECREMENT, INCREMENT } from "../reducers/collector";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Character() {
  const collector = useSelector((state) => state.collector);
  const dispatch = useDispatch();
  const e = useParams();
  const { loading, error, data } = useQuery(
    queries.CHARACTER,
    { variables: { id: Number(e.id) } },
    { fetchPolicy: "cache-and-network" }
  );

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
    console.log("ee", e, "data", data);

    for (let i = 0; i < SelectedCollector.collection.length; i++) {
      console.log("id", SelectedCollector.collection[i].id, e.id);
      if (e.id == SelectedCollector.collection[i].id) {
        console.log("found");
        element = e;
      }
    }
    if (SelectedCollector?.collection?.length == 10) {
      window.alert("collection full");
    } else if (element != 0) {
      window.alert("character already in collection");
    } else {
      dispatch(INCREMENT({ id: Collectorid, hero: data.characterDetails }));
    }
  };

  const handlegiveup = (e) => {
    if (
      SelectedCollector.collection.map((k) => {
        if (k.id === e) return true;
      }) &&
      SelectedCollector.character > 0
    ) {
      dispatch(DECREMENT({ id: Collectorid, hero: data.characterDetails }));
    }
  };
  if (loading) {
    return (
      <h1 style={{ fontSize: 100, fontWeight: "bold", textAlign: "center" }}>
        Loading...
      </h1>
    );
  } else if (!data) {
    return <Error />;
  } else {
    return (
      <div>
        <h1 className="header">{data?.characterDetails.name}</h1>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Card
            sx={{
              maxWidth: 345,
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: blue[500] }}
                  aria-label="recipe"
                  src="https://www.thetruecolors.org/wp-content/uploads/2021/02/marvel-logo-header-1-768x400.jpg"
                  alt="Marvel Character Photo"
                ></Avatar>
              }
              title={data?.characterDetails.name}
              subheader={data?.dates?.start?.localDate}
            />
            <CardMedia
              component="img"
              height="350"
              image={
                data?.characterDetails.thumbnail
                  ? data?.characterDetails.thumbnail
                  : "https://media.makeameme.org/created/sorry-not-available-0007491a42.jpg"
              }
              alt="Event"
              sx={{ padding: "4em 4em 10 4em" }}
            />
            <CardContent>
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
            </CardContent>
            <CardActions disableSpacing>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                More:
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>Description:</Typography>
                <List>
                  {data?.characterDetails.description ? (
                    <ListItem className="Content">
                      {data?.characterDetails?.description
                        ? data?.characterDetails?.description
                        : ""}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  Comics:
                  {data?.characterDetails?.comics
                    ? data.characterDetails?.comics?.map((e) => {
                        return (
                          <ListItem className="Content">
                            <li>{e}</li>
                          </ListItem>
                        );
                      })
                    : "No comics"}
                  Series:
                  {data?.characterDetails.series
                    ? data?.characterDetails.series.map((e) => {
                        return (
                          <ListItem className="Content">
                            <li>{e}</li>
                          </ListItem>
                        );
                      })
                    : "No series"}
                  Stories:
                  {data?.characterDetails.stories
                    ? data?.characterDetails.stories.map((e) => {
                        return <ListItem>{e}</ListItem>;
                      })
                    : ""}{" "}
                  {data?.characterDetails ? (
                    <ListItem>
                      Type:{data?.characterDetails.__typename}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data?.promoter ? (
                    <ListItem>
                      Promoter Details:
                      {data?.promoter ? (
                        <>
                          <ul>
                            <li>name: {data?.promoter?.name}</li>
                            <li>description: {data?.promoter?.description}</li>
                          </ul>
                        </>
                      ) : (
                        " no info availa"
                      )}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data?.priceRanges ? (
                    <ListItem>
                      Price:
                      {data?.priceRanges ? (
                        <>
                          <ul>
                            <li>max: {data?.priceRanges[0]?.max}</li>
                            <li>min: {data?.priceRanges[0]?.min}</li>
                            <li>currency: {data?.priceRanges[0]?.currency}</li>
                          </ul>
                        </>
                      ) : (
                        " no i available"
                      )}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data?.sales?.public?.startDateTime ? (
                    <ListItem>
                      Ticket start sale:{" "}
                      {data?.sales ? data.sales.public.startDateTime : ""}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data?.doorsTimes ? (
                    <ListItem>
                      <li>door closing Time: {data.doorsTimes.localTime}</li>
                    </ListItem>
                  ) : (
                    " "
                  )}
                </List>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </div>
    );
  }
}
