import { Link, useLocation } from "@remix-run/react";
import {Key} from "../../../public/icons/Key";

interface NavigationProps {
  openModal: () => void;
}

function Navigation({openModal}: NavigationProps) {
  const location = useLocation();

  return (
    <div className={"flex flex-row w-fit mx-auto bg-black items-center justify-center sticky top-10 gap-3 p-3 px-5 rounded-full border border-gray border-solid"}>
      <Link
        to={"/"}
        className={`hover:text-white transition-3 ${
          location.pathname === "/" ? "font-white" : "text-gray"
        }`}
      >
        Home
      </Link>
      <Link
        to={"/leaderboard"}
        className={`hover:text-white transition-3 ${
          location.pathname === "/leaderboard" ? "font-white" : "text-gray"
        }`}
      >
        Leaderboard
      </Link>
      <Key width={16} height={16} className={"hover:text-white text-gray transition-3 cursor-pointer"} onClick={openModal} />
    </div>
  );
}

export default Navigation