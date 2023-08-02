import List from "./List";
import { useState, UseEffect, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import Button from "@mui/material/Button";

export default function Location() {
  const [likebtn, setlikebtn] = useState(false);
  const [pageNum, setpageNum] = useState(10);
  const { loading, error, data, refetch } = useQuery(
    queries.Locationlist,
    { variables: { pageNum: pageNum } },
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const { loadingL, errorL, dataL } = useQuery(queries.likedLocations, {
    fetchPolicy: "cache-and-network",
  });

  console.log("liked", dataL);
  const getmore = () => {
    setpageNum(pageNum + 10);
  };
  const [dataX, setDataX] = useState(null);
  // useEffect(() => {
  //   setDataX(data);
  // }, [data]);
  const fetchdata = () => {
    refetch(
      { variables: { pageNum: pageNum } },
      {
        fetchPolicy: "cache-and-network",
      }
    );
  };

  if (loading && data == undefined) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="App">
      {console.log("Location", data?.locationPosts, pageNum)}
      <br></br>
      <h1>Locations</h1>
      {data && <List props={data.locationPosts} refetchlist={fetchdata}></List>}
      <br></br>
      {pageNum < 50 ? (
        <Button
          onClick={(e) => {
            getmore();
          }}
          variant="contained"
        >
          Get More
        </Button>
      ) : null}
    </div>
  );
}
