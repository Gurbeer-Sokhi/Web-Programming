import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import Location from "./component/Location";
import Mylikes from "./component/Mylikes";
import Mylocation from "./component/Mylocations";
import Newlocation from "./component/Newlocation";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";
import Error from "./component/Error";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router>
          <div>
            <div className="Navigation">
              <nav>
                <Stack direction="row" spacing={2} className="Navstack">
                  <Button variant="contained" className="Nav">
                    <NavLink className="navlink" to="/">
                      Home
                    </NavLink>
                  </Button>
                  <Button variant="contained" className="Nav">
                    <NavLink className="navlink" to="/my-likes">
                      My-Likes
                    </NavLink>
                  </Button>
                  <Button variant="contained" className="Nav">
                    <NavLink className="navlink" to="/my-location">
                      My-Locations
                    </NavLink>
                  </Button>
                  <Button variant="contained" className="Nav">
                    <NavLink className="navlink" to="/new-location">
                      New-Location
                    </NavLink>
                  </Button>
                </Stack>
              </nav>
            </div>
            <Routes>
              <Route path="/" element={<Location />} />
              <Route path="/my-likes" element={<Mylikes />} />
              <Route path="/my-location" element={<Mylocation />} />
              <Route path="/new-location" element={<Newlocation />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
