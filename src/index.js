import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.js";
import About from "./pages/About.js";   
import Attendance from "./pages/attendance.js";   
import Login from "./pages/login.js";
import SignUp from "./pages/signup.js";
import "./index.css";
import Home from "./pages/Home.js";
import GymForm from "./pages/gymForm.js";
import Members from "./pages/Members.js";
import Trainers from "./pages/Trainers.js";
import Billing from "./pages/Billing.js";
import Settings from "./pages/Settings.js";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",      
        element: <Home />,
      },
      {
        path: "/members",  
        element: <Members />,
      },
      {
        path: "/trainers",  
        element: <Trainers />,
      },
      {
        path: "/billing",  
        element: <Billing />,
      },
      {
        path: "/settings",  
        element: <Settings />,
      },
      {
        path: "/about",  
        element: <About />,
      },
      {
        path: "/attendance",
        element: <Attendance />
      },
      {
        path:"/gymForm",
        element:<GymForm />
      },
      {
        path: "*",
        element: <h1>Page Not Found</h1>,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

export { router };