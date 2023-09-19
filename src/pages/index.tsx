import Link from "next/link";
import {NewTweetForm} from '../components/NewTweetForm'
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import {api} from "~/utils/api";



export default function Home() {
  return <>
    <header className='sticky top-0 z-10 border-b bg-white pt-2'>
      <h1 className='mb-2 px-4 text-lg font-bold'>Home</h1>
      <NewTweetForm />
      <RecentTweets />
    </header>
  </>
};

function RecentTweets () {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({}, 
    {getNextPageParam: (lastPage) => lastPage.nextCursor}
    );

  return <InfiniteTweetList tweets={tweets}/>
}


