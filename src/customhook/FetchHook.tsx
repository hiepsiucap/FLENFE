/** @format */
import { useState } from "react";

const useFetch = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return { isLoading, setLoading, error, setError };
};

export default useFetch;
