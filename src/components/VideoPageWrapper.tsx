import { useSearchParams } from "react-router-dom";
import VideoPage from "./VideoPage";
import NotFound from "./NotFound";

export default function VideoPageWrapper() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  
  if (!videoId) {
    return <NotFound />;
  }
  
  return <VideoPage videoId={videoId} />;
}