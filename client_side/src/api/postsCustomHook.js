import { useState, useEffect } from "react";
import { api } from "./api";

export function usePostFetching() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("user/getAllPosts");
        console.log(response?.data,'response..........');
        setPosts(response.data.allPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return { posts, loading };
}
