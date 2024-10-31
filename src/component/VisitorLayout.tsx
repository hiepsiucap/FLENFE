/** @format */
import { Outlet } from "react-router-dom";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { Navigate } from "react-router-dom";
export default function VisitorLayout() {
  const { user } = useStateUserContext();
  console.log(user);
  if (user) {
    return <Navigate to="dashboard"></Navigate>;
  }
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
}
