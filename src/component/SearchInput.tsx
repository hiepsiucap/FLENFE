/** @format */

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { GetRequestWithCre } from "../utilz/Request/getRequest";
import { useStateUserContext } from "../contexts/UserContextProvider";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
export default function SearchInput({
  placeholder = "Search...",
  changeTotalPage = (page: number) => {
    console.log(page);
  },
  changelistword = (listword: []) => {
    console.log(listword);
  },
  setloadLoading = (state: boolean) => {
    console.log(state);
  },
}) {
  const [query, setQuery] = useState("");
  console.log(query);
  const { bookId } = useParams();
  const { accesstoken, refreshtoken } = useStateUserContext();
  const fetchData = async (q: string) => {
    setloadLoading(true);
    const response = await GetRequestWithCre({
      route: `api/flashcard/bookcard/${bookId}?search=${q}`,
      accesstoken,
      refreshtoken,
    });
    if (response.success) {
      if (response.data.listcard == 0) changelistword([]);
      console.log(response.data.total);
      changelistword(response.data.listcard);

      changeTotalPage(response.data.total);
    }
  };
  const debouncedFetch = useMemo(() => debounce(fetchData, 300), []);
  useEffect(() => {
    setloadLoading(true);
    if (query.trim()) {
      debouncedFetch(query);
    }
    setloadLoading(false);
    return () => {
      debouncedFetch.cancel(); // clean up
    };
  }, [query, debouncedFetch, setloadLoading]);

  return (
    <form className={`relative w-full max-w-md `}>
      <div className="relative ">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          <Search size={18} />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </form>
  );
}
