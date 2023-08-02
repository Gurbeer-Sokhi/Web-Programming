import "./App.css";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
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
import "./Attraction.css";
import ErrorPage from "./ErrorPage";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Stack } from "@mui/system";

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

export default function Attraction() {
  console.log("in attraction");
  const e = useParams();
  const [data, setdata] = useState(0);
  const [url, seturl] = useState(0);
  console.log("params", e.id);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const fetchevent = async () => {
    try {
      let { data } = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/attractions/${e.id}?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*`
      );
      setdata(data);
      seturl(data.images[0].url);

      return data;
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchevent();
  }, []);

  if (!data) {
    return <ErrorPage />;
  } else {
    return (
      <div>
        <h1 className="header">{data?.name}</h1>

        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          {data?.externalLinks ? (
            <Stack direction="row">
              {data?.externalLinks?.instagram ? (
                <Link to={data.externalLinks.instagram[0].url}>
                  <InstagramIcon className="Icon"></InstagramIcon>
                </Link>
              ) : (
                ""
              )}
              {data?.externalLinks?.facebook ? (
                <Link to={data.externalLinks.facebook[0].url}>
                  <FacebookIcon className="Icon"></FacebookIcon>
                </Link>
              ) : (
                ""
              )}
              {data?.externalLinks?.youtube ? (
                <Link to={data.externalLinks.youtube[0].url}>
                  <YouTubeIcon className="Icon"></YouTubeIcon>
                </Link>
              ) : (
                ""
              )}
              {data?.externalLinks?.twitter ? (
                <Link to={data.externalLinks.twitter[0].url}>
                  <TwitterIcon className="Icon"></TwitterIcon>
                </Link>
              ) : (
                ""
              )}
            </Stack>
          ) : (
            ""
          )}
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                  TM
                </Avatar>
              }
              title={data?.name}
              subheader={data?.dates?.start?.localDate}
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
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {data?.promoter?.name}
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
                <List className="attraction">
                  {data ? (
                    <ListItem>
                      Genre:{" "}
                      {data?.classifications[0]?.genre?.name
                        ? data?.classifications[0]?.genre?.name
                        : "no info available"}
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {data ? (
                    <ListItem>
                      Segment:{" "}
                      {data?.classifications[0]?.segment?.name
                        ? data?.classifications[0]?.segment?.name
                        : "no info available"}
                    </ListItem>
                  ) : (
                    ""
                  )}

                  {data ? (
                    <ListItem>
                      Sub-Genre:{" "}
                      {data?.classifications[0]?.subGenre?.name
                        ? data?.classifications[0]?.subGenre?.name
                        : "no info available"}
                    </ListItem>
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
                </List>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </div>
    );
  }
}
