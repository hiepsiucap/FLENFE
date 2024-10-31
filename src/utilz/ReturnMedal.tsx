/** @format */
import brozen from "../assets/image/brozen.png";
import gold from "../assets/image/gold.png";
import silver from "../assets/image/silver.png";
import master from "../assets/image/master.png";
export default function ReturnMedal(totalscore: number) {
  switch (true) {
    case totalscore > 50000:
      return (
        <img
          src={master}
          alt="Master Medal"
          className="w-9"
        />
      );
    case totalscore > 30000:
      return (
        <img
          src={gold}
          alt="Gold Medal"
          className="w-9"
        />
      );
    case totalscore > 10000:
      return (
        <img
          src={silver}
          alt="Silver Medal"
          className="w-9"
        />
      );
    default:
      return (
        <img
          src={brozen}
          alt="Brozen Medal"
          className="w-9"
        />
      );
  }
}
