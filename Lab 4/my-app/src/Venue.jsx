import "./App.css";
import axios from "axios";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import ErrorPage from "./ErrorPage";
import { blue } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Event.css";

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

export default function Venue() {
  const e = useParams();
  const [data, setdata] = useState(0);
  const [url, seturl] = useState(0);
  console.log("params", e.id);
  //   console.log("In");
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const fetchevent = async () => {
    let { data } = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/venues/${e.id}?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT`
    );

    setdata(data);
    seturl(data.images[0].url);
    return data;
  };
  useEffect(() => {
    fetchevent();
  }, [data]);
  if (!data) {
    return <ErrorPage />;
  } else {
    return (
      <div>
        <h1 className="header">{data.name}</h1>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Card sx={{ maxWidth: 1000 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                  TM
                </Avatar>
              }
              title={data.name}
              subheader={data?.city?.name}
            />
            <CardMedia
              component="img"
              height="194"
              image={
                url
                  ? url
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"
              }
            />
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
                <Typography paragraph>Details:</Typography>
                <List>
                  {data.country ? (
                    <ListItem>
                      Country:{" "}
                      {data?.country ? data?.country.name : "no info available"}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data ? (
                    <ListItem>
                      Address:{" "}
                      {data?.address
                        ? data?.address?.line1
                        : "no info available"}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data.parkingDetail ? (
                    <ListItem>Parking : {data.parkingDetail}</ListItem>
                  ) : (
                    ""
                  )}
                  {data.accessibleSeatingDetail ? (
                    <ListItem>
                      Seating info : {data.accessibleSeatingDetail}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data?.generalInfo ? (
                    <ListItem>
                      General Info:{" "}
                      <ul>
                        General Rules :-
                        <li>
                          <p>
                            {data?.generalInfo
                              ? data?.generalInfo?.childRule
                              : "no info available"}
                          </p>
                        </li>
                        <li>
                          <p>
                            {data?.generalInfo
                              ? data?.generalInfo?.generalRule
                              : "no info available"}
                          </p>
                        </li>
                      </ul>
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data?.boxOfficeInfo ? (
                    <ListItem>
                      Box Office Open hours:
                      <ul>
                        Box office details
                        <li>
                          {data?.boxOfficeInfo
                            ? data?.boxOfficeInfo.openHoursDetail
                            : "no info available"}
                        </li>
                        <br></br>
                        <li>
                          {data?.boxOfficeInfo
                            ? data?.boxOfficeInfo.phoneNumberDetail
                            : "no info available"}
                        </li>
                      </ul>
                    </ListItem>
                  ) : (
                    ""
                  )}

                  {data.social ? (
                    <ListItem>Social : {data.social.twitter.handle}</ListItem>
                  ) : (
                    ""
                  )}

                  {data ? (
                    <ListItem>
                      Type: {data?.type ? data?.type : "no info available"}
                    </ListItem>
                  ) : (
                    ""
                  )}

                  {data?.doorsTimes ? (
                    <ListItem>
                      <li>door closing Time: {data?.doorsTimes?.localTime}</li>
                    </ListItem>
                  ) : (
                    " "
                  )}
                  {data?.doorsTimes ? (
                    <ListItem>
                      <li>door closing Time: {data?.doorsTimes?.localTime}</li>
                    </ListItem>
                  ) : (
                    " "
                  )}
                  {data?.ada ? (
                    <ListItem>
                      Venue Contact Details: {data.ada.adaHours}
                    </ListItem>
                  ) : (
                    ""
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
