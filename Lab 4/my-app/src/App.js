import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Root from "./Root";
import EventPage from "./EventPage";
import ErrorPage from "./ErrorPage";
import Event from "./Event";
import Attractions from "./AttractionsPage";
import Attraction from "./Attraction";
import Venues from "./VenuesPage";
import Venue from "./Venue";
import Events from "./EventPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "events/page/:page",
          element: <Events />,
          errorElement: <ErrorPage />,
        },
        {
          path: "events/:id",
          element: <Event />,
          errorElement: <ErrorPage />,
        },
        {
          path: "attractions/page/:page",
          element: <Attractions />,
          errorElement: <ErrorPage />,
        },
        {
          path: "attractions/:id",
          element: <Attraction />,
          errorElement: <ErrorPage />,
        },
        {
          path: "venues/page/:page",
          element: <Venues />,
          errorElement: <ErrorPage />,
        },
        {
          path: "venues/:id",
          element: <Venue />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    { path: "/error", element: <ErrorPage /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
