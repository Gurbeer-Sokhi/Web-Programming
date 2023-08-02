import "./App.css";
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
} from "@mui/material";
import { blue } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Event.css";
import ErrorPage from "./ErrorPage";

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

export default function Event() {
  const e = useParams();
  const [dataX, setDataX] = useState(0);
  const [url, setUrl] = useState(0);
  console.log("params", e.id);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const fetchevent = async () => {
    let { data } = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${e.id}?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*`
    );
    setUrl(data.images[0].url);
    setDataX(data);
  };

  useEffect(() => {
    fetchevent();
  }, [dataX]);
  console.log(dataX);
  if (!dataX) {
    return <ErrorPage />;
  } else {
    return (
      <div>
        <h1 className="header">{dataX?.name}</h1>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: blue[500] }}
                  aria-label="recipe"
                  image={dataX?.images[4] ? dataX.images[4].url : ""}
                ></Avatar>
              }
              title={dataX.name}
              subheader={dataX?.dates?.start?.localDate}
            />
            <CardMedia
              component="img"
              height="194"
              image={
                url
                  ? url
                  : "https://media.makeameme.org/created/sorry-not-available-0007491a42.jpg"
              }
              alt="Event"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {dataX?.promoter?.name}
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
                <Typography paragraph>Details:</Typography>
                <List>
                  {dataX?.info ? (
                    <ListItem>{dataX?.info ? dataX.info : ""}</ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?._embedded?.venues ? (
                    <ListItem>
                      <li>
                        Venue: {dataX?._embedded?.venues[0]?.name},
                        {dataX?._embedded?.venues[0]?.city.name},
                        {dataX?._embedded?.venues[0]?.country?.name}
                      </li>
                    </ListItem>
                  ) : (
                    " "
                  )}
                  {dataX?.dates?.start ? (
                    <ListItem>
                      <li>Time:{dataX?.dates?.start?.localTime}</li>
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?.locale ? (
                    <ListItem>locale: {dataX?.locale}</ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?.ageRestrictions?.legalAgeEnforced ? (
                    <ListItem>
                      {dataX?.ageRestrictions?.legalAgeEnforced
                        ? "Age Restricted"
                        : "Open to all Ages"}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?.promoter ? (
                    <ListItem>
                      Promoter Details:
                      {dataX?.promoter ? (
                        <>
                          <ul>
                            <li>name: {dataX?.promoter?.name}</li>
                            <li>description: {dataX?.promoter?.description}</li>
                          </ul>
                        </>
                      ) : (
                        " no info available"
                      )}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?.priceRanges ? (
                    <ListItem>
                      Price:
                      {dataX?.priceRanges ? (
                        <>
                          <ul>
                            <li>max: {dataX?.priceRanges[0]?.max}</li>
                            <li>min: {dataX?.priceRanges[0]?.min}</li>
                            <li>currency: {dataX?.priceRanges[0]?.currency}</li>
                          </ul>
                        </>
                      ) : (
                        " no info available"
                      )}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?.sales?.public?.startDateTime ? (
                    <ListItem>
                      Ticket start sale:{" "}
                      {dataX?.sales ? dataX.sales.public.startDateTime : ""}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {dataX?.ticketLimit?.info ? (
                    <ListItem>
                      {" "}
                      ticket Info: {dataX?.ticketLimit?.info}
                    </ListItem>
                  ) : (
                    " no info available"
                  )}
                  {dataX?.doorsTimes ? (
                    <ListItem>
                      <li>door closing Time: {dataX.doorsTimes.localTime}</li>
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
