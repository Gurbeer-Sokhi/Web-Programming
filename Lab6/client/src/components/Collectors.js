import collector, {
  ADD_COLLECTOR,
  DELETE_COLLECTOR,
  SELECT_COLLECTOR,
  DESELECT_COLLECTOR,
  DECREMENT,
} from "../reducers/collector";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

export default function Collectors() {
  const list = useSelector((state) => state.collector);
  const dispatch = useDispatch();
  let SelectedCollector = null;
  let Collectorid = null;
  for (let i = 0; i < list.length; i++) {
    if (list[i].isSelected) {
      SelectedCollector = list[i];
      Collectorid = list[i].id;
    }
  }

  const handlesubmit = (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    if (!name) {
      window.alert("name must be provided");
      document.getElementById("name").value = "";
    } else {
      dispatch(ADD_COLLECTOR({ Collectorname: name }));
      document.getElementById("name").value = "";
    }
  };

  const handlegiveup = (e) => {
    console.log(e);
    if (
      SelectedCollector.collection.map((k) => {
        if (k.id === e.id) return true;
      }) &&
      SelectedCollector.character > 0
    ) {
      dispatch(DECREMENT({ id: Collectorid, hero: e }));
    }
  };

  return (
    <div>
      <h1>Collectors</h1>
      <div className="Form">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <form id="NewLocation" className="NewLocation">
              <label>Add New Collector</label>
              <br></br>
              <TextField required id="name" />
              <br></br>
              <Button type="submit" onClick={handlesubmit}>
                Add
              </Button>
              {Error && (
                <p role="alert" style={{ color: "#ee0000" }}>
                  <em>All fields required</em>
                </p>
              )}
            </form>
          </div>
        </Box>
      </div>
      {list.map((collector) => {
        return (
          <div key={collector.id}>
            <p
              style={{
                font: "caption",
                fontPalette: "dark",
                fontWeight: "bold",
              }}
            >
              {collector.Collectorname}
            </p>
            {!collector.isSelected ? (
              <Button
                sx={{ color: "rgb(0,0,0)", fontWeight: "bold", fontSize: 12 }}
                onClick={() => dispatch(SELECT_COLLECTOR({ id: collector.id }))}
              >
                SELECT COLLECTOR
              </Button>
            ) : (
              ""
            )}
            {!collector.isSelected ? (
              <Button
                sx={{ color: "rgb(0,0,0)", fontWeight: "bold", fontSize: 12 }}
                onClick={() => dispatch(DELETE_COLLECTOR({ id: collector.id }))}
              >
                DELETE COLLECTOR
              </Button>
            ) : (
              ""
            )}
            <p>
              {collector.isSelected &&
                collector.collection.map((e) => {
                  return (
                    <Grid
                      container
                      sx={{ flexGrow: 1, flexDirection: "row" }}
                      spacing={5}
                    >
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={e.id}>
                        <Card
                          sx={{
                            maxWidth: 250,
                            height: "auto",
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: 5,
                            border: "1px solid #1e8678",
                            boxShadow:
                              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
                          }}
                          variant="outlined"
                        >
                          <CardActionArea>
                            <Link to={`/marvel-characters/${e.id}`}>
                              <CardMedia
                                sx={{ height: "100%", width: "100%" }}
                                component="img"
                                image={e.thumbnail}
                                alt="Marvel Character Photo"
                                title="show image"
                              />

                              <CardContent>
                                <Typography
                                  sx={{
                                    borderBottom: "1px solid #1e8678",
                                    fontWeight: "bold",
                                  }}
                                  gutterBottom
                                  variant="h6"
                                  component="h1"
                                >
                                  {e.name}
                                </Typography>
                                <Typography>
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
                            </Link>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  );
                })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
