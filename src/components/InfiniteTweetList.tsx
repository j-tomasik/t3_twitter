
type Tweet = {
    id: string
    content: string
    createdAt: Date
    likeCount: number
    likedByMe: boolean
    user: {id: string; image: string | null; name: string | null};
}

type InfiniteTweetListProps = {
    isLoading: boolean
    isError: boolean
    hasMore: boolean
    fetchNewTweets: () => Promise<unknown>
    tweets?: Tweet[]
}
export function InfiniteTweetList ({tweets,  isError, isLoading, fetchNewTweets, hasMore}: InfiniteTweetListProps) {
    return <h1>tweets here</h1>
}