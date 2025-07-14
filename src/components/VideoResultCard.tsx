import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { formatDuration, formatViewCount } from "../utils/formatters";
import { Typography } from "./Typography";
import VideoActionMenu from "./VideoActionMenu";
import type { YouTubeVideo } from "../types/youtube";
import type { StoredVideoData } from "../types/localStorage";

interface VideoResultCardProps {
	video: YouTubeVideo;
}

export default function VideoResultCard({ video }: VideoResultCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();

	// Convert YouTube video to StoredVideoData format for the action menu
	const videoData: StoredVideoData = {
		id: video.id,
		title: video.snippet.title,
		channelTitle: video.snippet.channelTitle,
		thumbnail: video.snippet.thumbnails.medium.url,
		duration: video.contentDetails.duration,
		viewCount: parseInt(video.statistics.viewCount),
		publishedAt: video.snippet.publishedAt,
		addedAt: new Date().toISOString(),
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// Don't navigate if clicking on action menu or links
		if (
			(e.target as HTMLElement).closest("[data-action-menu]") ||
			(e.target as HTMLElement).closest("a")
		) {
			return;
		}
		navigate(`/watch?v=${video.id}`);
	};

	const handleChannelClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigate(`/channel/${video.snippet.channelId}`);
	};

	return (
		<Card
			className="overflow-hidden hover:shadow-lg transition-shadow bg-transparent border-none shadow-none cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				<div className="flex flex-col md:flex-row relative">
					{/* Thumbnail */}
					<div className="md:w-96 md:h-54 relative">
						<img
							src={video.snippet.thumbnails.medium.url}
							alt={video.snippet.title}
							className="w-full h-full object-cover"
						/>
						<div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
							{formatDuration(video.contentDetails.duration)}
						</div>
					</div>

					{/* Video Info */}
					<div className="flex-1 p-4 relative">
						<div
							className="absolute top-4 right-4"
							data-action-menu
						>
							<VideoActionMenu
								videoId={video.id}
								videoData={videoData}
							/>
						</div>

						<Typography
							variant="video-title"
							weight="semibold"
							className="mb-2 line-clamp-2 hover:text-primary transition-colors"
							style={{ fontSize: "18px" }}
						>
							{video.snippet.title}
						</Typography>

						<div className="mb-2">
							<Typography
								variant="base"
								color="muted-foreground"
								style={{ fontSize: "14px" }}
							>
								<span>
									{formatViewCount(
										parseInt(video.statistics.viewCount)
									)}{" "}
									views
								</span>
								<span className="mx-2">•</span>
								<span>
									{formatDistanceToNow(
										new Date(video.snippet.publishedAt)
									)}{" "}
									ago
								</span>
							</Typography>
						</div>

						<div className="mb-3">
							<Typography
								variant="base"
								color="muted-foreground"
								style={{ fontSize: "14px" }}
								className="hover:text-foreground transition-colors cursor-pointer"
								onClick={handleChannelClick}
							>
								{video.snippet.channelTitle}
							</Typography>
						</div>

						<Typography
							variant="base"
							color="muted-foreground"
							className="line-clamp-2"
							style={{ fontSize: "14px" }}
						>
							{video.snippet.description}
						</Typography>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}