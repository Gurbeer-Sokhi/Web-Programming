import List from "./List";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useState, useEffect } from "react";

export default function Mylikes() {
  const [likedLocations, setlikedLocations] = useState("likedLocations");
  const { loading, error, data, refetch } = useQuery(queries.likedLocations, {
    fetchPolicy: "cache-and-network",
  });
  console.log("likes", data);

  const fetchlike = () => {
    refetch();
  };
  if (loading) {
    <h1>Loading...</h1>;
  }
  return (
    <div className="App">
      <br></br>
      <h1>My-Likes</h1>
      {data && (
        <List props={data?.likedLocations} refetchlist={fetchlike}></List>
      )}
    </div>
  );
}
