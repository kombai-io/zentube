import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Comment, SortOrder } from '../types/video';
import { Typography } from './Typography';
import CommentItem from './CommentItem';
import SortIcon from '../assets/icons/sort.svg';

interface CommentsSectionProps {
  videoId: string;
  comments: Comment[];
  commentsCount: number;
  sortOrder: SortOrder;
  onSortChange: (sortOrder: SortOrder) => void;
  onReplyComment?: (commentId: string) => void;
}

export default function CommentsSection({ 
  videoId,
  comments, 
  commentsCount, 
  sortOrder, 
  onSortChange,
  onReplyComment
}: CommentsSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Comments header with count and sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Typography 
            variant="base" 
            weight="normal" 
            color="foreground"
          >
            {commentsCount}
          </Typography>
          <Typography 
            variant="base" 
            weight="normal" 
            color="foreground" 
            className="capitalize"
          >
            Comments
          </Typography>
        </div>
        
        <Select value={sortOrder} onValueChange={onSortChange}>
          <SelectTrigger className="w-auto bg-transparent border-none text-white hover:bg-secondary/20 gap-2">
            <SortIcon width={18} height={13} color="var(--foreground)" />
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value={SortOrder.NEWEST} className="text-foreground cursor-pointer">
              <Typography variant="base" weight="normal" color="foreground">
                Newest
              </Typography>
            </SelectItem>
            <SelectItem value={SortOrder.OLDEST} className="text-foreground cursor-pointer">
              <Typography variant="base" weight="normal" color="foreground">
                Oldest
              </Typography>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            videoId={videoId}
            onReply={onReplyComment}
          />
        ))}
      </div>
    </div>
  );
}