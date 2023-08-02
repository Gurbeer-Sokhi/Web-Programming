import "./App.css";
import React from "react";
import Error from "./components/Error";
import Allcharacters from "./components/Allcharacters";
import Characters from "./components/Characters";
import Home from "./components/Home";
// import store from "./store";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Collectors from "./components/Collectors";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "http://localhost:4000" }),
});
function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title" align="left">
                Marvel Characters
              </h1>
              <br></br>
              <Link className="showlink" to="/">
                HOME
              </Link>
              <Link className="showlink" to="/marvel-characters/page/1">
                All characters
              </Link>
              <Link className="showlink" to="/collectors">
                collectors
              </Link>
            </header>
            <br />
            <br />
            <div className="App-body">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/marvel-characters/page/:pagenum"
                  element={<Allcharacters />}
                />
                <Route path="/marvel-characters/:id" element={<Characters />} />
                <Route path="/collectors" element={<Collectors />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
