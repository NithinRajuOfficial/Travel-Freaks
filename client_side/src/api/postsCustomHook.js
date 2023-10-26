import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { api } from "./api";

export function usePostFetching() {
  const postData = useSelector((state) => state.post.data);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedCount, setUpdatedCount] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("user/getAllPosts");
        setPosts(response.data.allPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [postData, updatedCount]);
  return { posts, loading, updatedCount, setUpdatedCount };
}
