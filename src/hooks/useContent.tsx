import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../pages/config";
import axios from "axios";

//creating this custom hook----------------------------
export const useContent = (filterType = "") => {
  //@ts-ignore
  const [allContents, setAllContents] = useState<ContentType[]>([]); //it have all the content fetched from server
  //@ts-ignore
  const [contents, setContents] = useState<ContentType[]>([]); //it has only filtered content like "", "Youtube", "Twitter"  etc.
  const [loading, setLoading] = useState(false);
  const fetchcontents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });

      setAllContents(response.data.contents || []);
    } catch (e) {
      console.error("Error fetching content:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  //runs when page loads.
  useEffect(() => {
    fetchcontents();
  }, []);

  useEffect(() => {
    const filtered = filterType
      ? allContents.filter((item) => item.type === filterType)
      : allContents;
    setContents(filtered);
  }, [filterType, allContents]);

  return {
    contents,
    loading,
    setContents,
    fetchcontents,
    setLoading,
    setAllContents,
  };
};
