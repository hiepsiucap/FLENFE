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
    element: (
      <Navigate
        to="/login"
        replace
      />
    ),
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
        path: "/app/dashboard",
        element: <WordBank></WordBank>,
      },
      {
        path: "/app/wordbank",
        element: <WordBank></WordBank>,
      },
      {
        path: "/app/wordbank/:bookId",
        element: <DetailBook></DetailBook>,
      },
      {
        path: "/app/playgame",
        element: <GamePlay></GamePlay>,
      },
      {
        path: "/app/ranking",
        element: <Ranking></Ranking>,
      },
    ],
  },
  {
    path: "/",
    element: <VisitorLayout></VisitorLayout>,
    children: [
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },

      {
        path: "/verify",
        element: <VerifyPage></VerifyPage>,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword></ForgotPassword>,
      },
    ],
  },
]);

export default router;
