import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Home from "./pages/Home/Home";
import Messages from "./pages/Messages/Messages";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settngs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
