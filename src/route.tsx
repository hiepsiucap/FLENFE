/** @format */

import { createBrowserRouter, ScrollRestoration } from "react-router-dom";
import { DefaultLayout, VisitorLayout } from "./component";
import {
  Login,
  Register,
  ForgotPassword,
  WordBank,
  DetailBook,
  GamePlay,
  VerifyPage,
  Ranking,
} from "./page";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <VisitorLayout></VisitorLayout>,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/login"
            replace
          />
        ),
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "verify",
        element: <VerifyPage></VerifyPage>,
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword></ForgotPassword>,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <>
        <DefaultLayout></DefaultLayout>
        <ScrollRestoration />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/app/dashboard"
            replace
          />
        ),
      },
      {
        path: "dashboard",
        element: <WordBank></WordBank>,
      },
      {
        path: "wordbank",
        element: <WordBank></WordBank>,
      },
      {
        path: "wordbank/:bookId",
        element: <DetailBook></DetailBook>,
      },
      {
        path: "playgame",
        element: <GamePlay></GamePlay>,
      },
      {
        path: "ranking",
        element: <Ranking></Ranking>,
      },
    ],
  },
]);

export default router;
