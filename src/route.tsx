/** @format */

import { createBrowserRouter, ScrollRestoration } from "react-router-dom";
import { DefaultLayout, VisitorLayout } from "./component";
import {
  Login,
  Register,
  ForgotPassword,
  DashBoard,
  WordBank,
  DetailBook,
  GamePlay,
  VerifyPage,
  Ranking,
} from "./page";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <DefaultLayout></DefaultLayout>
        <ScrollRestoration />
      </>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashBoard></DashBoard>,
      },
      {
        path: "/wordbank",
        element: <WordBank></WordBank>,
      },
      {
        path: "/wordbank/:bookId",
        element: <DetailBook></DetailBook>,
      },
      {
        path: "/playgame",
        element: <GamePlay></GamePlay>,
      },
      {
        path: "/ranking",
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
