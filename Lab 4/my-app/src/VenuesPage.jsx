import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as React from "react";
import Search from "./Search";
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

export default function Venues() {
  const [data, setdata] = useState(null);
  const { page } = useParams(null);
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [url, seturl] = useState();
  const navigate = useNavigate();
  let card = null;

  const fetchData = async () => {
    let result = null;

    if (typeof page != "number") {
      result = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/venues?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*&page=${
          Number(page) - 1
        }`
      );
    } else {
      result = await axios.get(
        "https://app.ticketmaster.com/discovery/v2/venues?apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*"
      );
    }
    return result.data;
  };
  const fetchsearch = async () => {
    try {
      const data = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/venues?keyword=${searchTerm}&apikey=AZAG8m4u5gq5HgkyYk0sdE9eAG32vGPT&locale=*`
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
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
  useEffect(() => {
    fetchData().then((e) => {
      setdata(e);
    });
  }, [page]);
  const buildCard = (e) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={e.id}>
        <Card sx={{ maxWidth: 345 }}>
          <Link to={`../venues/${e.id}`}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={
                  e?.images
                    ? e.images[0].url
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019"
                }
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {e?.name}
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
      searchData.data?._embedded?.venues.map((element) => {
        return buildCard(element);
      });
  } else {
    card =
      data?._embedded?.venues &&
      data?._embedded?.venues.map((element) => {
        return buildCard(element);
      });
  }

  return (
    <div className="App">
      <Stack spacing={2}>
        <Search searchValue={searchValue} />
        <Pagination
          className="Pagination"
          shape="rounded"
          count={50}
          page={Number(page)}
          onChange={(e, value) => {
            navigate(`/venues/page/${value}`);
          }}
        />
      </Stack>
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

  //   return (
  //     <div className="App">
  //       <Stack spacing={2}>
  //         <Pagination
  //           shape="rounded"
  //           count={49}
  //           page={PageNo}
  //           showFirstButton
  //           showLastButton
  //           onChange={(e, value) => setPageNo(value)}
  //         />
  //       </Stack>
  //       <br></br>
  //       <Grid ontainer rowSpacing={200} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  //         {data &&
  //           data?._embedded?.attractions?.map((e) => (
  //             <Grid xs={2} sm={4} md={4} key={e.id}>
  //               <item>
  //                 <Card sx={{ maxWidth: 345 }}>
  //                   <Link to={`../events/${e.id}`}>
  //                     <CardActionArea>
  //                       <CardMedia
  //                         component="img"
  //                         height="140"
  //                         image={e.images[0].url}
  //                         alt="Image unavailable"
  //                       />
  //                       <CardContent>
  //                         <Typography gutterBottom variant="h5" component="div">
  //                           {e.name}
  //                         </Typography>
  //                         <Typography
  //                           variant="body2"
  //                           color="text.secondary"
  //                           alt={e?.pleaseNote}
  //                         >
  //                           {e.info}
  //                         </Typography>
  //                         <Typography variant="body2" color="black">
  //                           Date: {e?.dates?.start?.localDate}, Time:{" "}
  //                           {e?.dates?.start?.localTime}
  //                         </Typography>
  //                       </CardContent>
  //                     </CardActionArea>
  //                   </Link>
  //                 </Card>
  //               </item>
  //             </Grid>
  //           ))}
  //       </Grid>
  //     </div>
  //   );
}
