import { ChannelData } from '../types/localStorage';
import { Typography } from './Typography';

interface ChannelItemProps {
  channel: ChannelData;
  isCollapsed: boolean;
  onClick?: () => void;
}

export default function ChannelItem({ channel, isCollapsed, onClick }: ChannelItemProps) {
  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors duration-200
        hover:bg-secondary/50 rounded-lg mx-2
        ${isCollapsed ? 'justify-center px-2' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <img 
          src={channel.thumbnail} 
          alt={`${channel.title} thumbnail`}
          className="w-6 h-6 rounded-full object-cover"
          onError={(e) => {
            // Fallback to a default avatar if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://i.pravatar.cc/24?img=${Math.floor(Math.random() * 70) + 1}`;
          }}
        />
      </div>
      {!isCollapsed && (
        <Typography 
          variant="base" 
          weight="medium" 
          color="foreground"
          className="truncate"
        >
          {channel.title}
        </Typography>
      )}
    </div>
  );
}