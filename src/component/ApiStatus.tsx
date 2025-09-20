/** @format */

import { useState, useEffect } from "react";
import { getApiUrl } from "../config/env";

export const ApiStatus = () => {
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${getApiUrl()}/health`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsApiConnected(response.ok);
      } catch (error) {
        console.warn("API not available:", error);
        setIsApiConnected(false);
      }
    };

    checkApiConnection();
  }, []);

  if (isApiConnected === null) {
    return null; // Still checking
  }

  if (!isApiConnected) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm">
              ⚠️ API server is not available. Some features may not work
              properly.
              <br />
              <span className="text-xs text-gray-600">
                Trying to connect to: {getApiUrl()}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
