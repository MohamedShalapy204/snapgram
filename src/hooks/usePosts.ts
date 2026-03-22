import { useQuery } from "@tanstack/react-query"
import { type Post } from "../types/index.ts"
import { QUERY_KEYS } from "../keys/queryKeys"

const POSTS_DATA: Post[] = [
  {
    id: 1,
    author: "John snap",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user_123",
    content: "Check out my latest snap!",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: 2,
    author: "Jane snap",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user_456",
    content: "Feeling good today!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1964&auto=format&fit=crop",
  },
]

export const usePosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: async () => {
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return POSTS_DATA
    },
  })
}
