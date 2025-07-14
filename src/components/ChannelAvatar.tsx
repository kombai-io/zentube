import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ChannelAvatarProps {
  channelTitle: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ChannelAvatar: React.FC<ChannelAvatarProps> = ({
  channelTitle,
  avatarUrl,
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={`${sizeClasses[size]} flex-shrink-0`}>
      <AvatarImage 
        src={avatarUrl} 
        alt={`${channelTitle} avatar`}
        className="object-cover"
      />
      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
        {getInitials(channelTitle)}
      </AvatarFallback>
    </Avatar>
  );
};