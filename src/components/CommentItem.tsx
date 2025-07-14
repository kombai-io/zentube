import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '../utils/videoFormatters';
import { Comment } from '../types/video';
import { Typography } from './Typography';
import ThumbsUpSmallIcon from '../assets/icons/thumbs-up-small.svg';
import ThumbsDownSmallIcon from '../assets/icons/thumbs-down-small.svg';
import { useCommentInteractions } from '../hooks/useLocalStorage';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: Comment;
  videoId: string;
  onReply?: (commentId: string) => void;
}

export default function CommentItem({ comment, videoId, onReply }: CommentItemProps) {
  const { getInteractionType, toggleInteraction } = useCommentInteractions(videoId);
  
  const interactionType = getInteractionType(comment.id);
  const isLiked = interactionType === 'like';
  const isDisliked = interactionType === 'dislike';

  const handleLike = () => {
    const result = toggleInteraction(comment.id, 'like');
    if (result.success) {
      if (isLiked) {
        toast.success('Removed like from comment');
      } else {
        toast.success('Liked comment');
      }
    } else {
      toast.error('Failed to update comment like');
    }
  };

  const handleDislike = () => {
    const result = toggleInteraction(comment.id, 'dislike');
    if (result.success) {
      if (isDisliked) {
        toast.success('Removed dislike from comment');
      } else {
        toast.success('Disliked comment');
      }
    } else {
      toast.error('Failed to update comment dislike');
    }
  };
  return (
    <div className="flex gap-3">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage 
          src={comment.authorProfileImageUrl} 
          alt={comment.authorDisplayName}
          className="object-cover"
        />
        <AvatarFallback>{comment.authorDisplayName.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Typography 
            variant="base" 
            weight="bold" 
            color="foreground"
          >
            {comment.authorDisplayName}
          </Typography>
          <Typography 
            variant="base" 
            weight="normal" 
            color="muted-foreground"
          >
            {formatTimeAgo(comment.publishedAt)}
          </Typography>
        </div>
        
        <Typography 
          as="p" 
          variant="base" 
          weight="normal" 
          color="foreground" 
          className="leading-5 whitespace-pre-line"
        >
          {comment.textDisplay}
        </Typography>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 text-white hover:bg-secondary/20 p-1 h-auto cursor-pointer ${
              isLiked ? 'bg-secondary/30' : ''
            }`}
          >
            <ThumbsUpSmallIcon 
              width={12} 
              height={11} 
              color={isLiked ? "#3b82f6" : "var(--foreground)"} 
            />
            <Typography 
              variant="base" 
              weight="normal" 
              color="muted-foreground"
            >
              {comment.likeCount}
            </Typography>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            className={`flex items-center gap-2 text-white hover:bg-secondary/20 p-1 h-auto cursor-pointer ${
              isDisliked ? 'bg-secondary/30' : ''
            }`}
          >
            <ThumbsDownSmallIcon 
              width={12} 
              height={11} 
              color={isDisliked ? "#ef4444" : "var(--foreground)"} 
            />
          </Button>
          
          {onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
              className="hover:bg-secondary/20 p-1 h-auto cursor-pointer"
            >
              <Typography 
                variant="base" 
                weight="normal" 
                color="muted-foreground" 
                className="hover:text-white"
              >
                Reply
              </Typography>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}