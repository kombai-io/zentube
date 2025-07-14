import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatSubscriberCount } from '../utils/videoFormatters';
import { Typography } from './Typography';
import ExpandableText from './ExpandableText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useSubscribedChannels } from '../hooks/useLocalStorage';
import { toast } from 'sonner';

interface ChannelInfoProps {
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  subscriberCount: number;
  description: string;
}

export default function ChannelInfo({ 
  channelId,
  channelTitle, 
  channelThumbnail, 
  subscriberCount, 
  description
}: ChannelInfoProps) {
  const { isSubscribed, toggleSubscription } = useSubscribedChannels();
  
  const isChannelSubscribed = isSubscribed(channelId);

  const handleSubscribe = () => {
    const channelData = {
      id: channelId,
      title: channelTitle,
      thumbnail: channelThumbnail,
      subscribedAt: new Date()
    };
    
    const result = toggleSubscription(channelData);
    if (result.success) {
      if (isChannelSubscribed) {
        toast.success('Unsubscribed from channel');
      } else {
        toast.success('Subscribed to channel');
      }
    } else {
      toast.error('Failed to update subscription');
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={channelThumbnail} 
              alt={channelTitle}
              className="object-cover"
            />
            <AvatarFallback>{channelTitle.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <Typography 
              as="h3" 
              variant="video-title" 
              weight="normal" 
              color="foreground"
            >
              {channelTitle}
            </Typography>
            <Typography 
              variant="base" 
              weight="normal" 
              color="muted-foreground"
            >
              {formatSubscriberCount(subscriberCount)}
            </Typography>
          </div>
        </div>
        
        <Button
          onClick={handleSubscribe}
          className={`font-bold uppercase px-6 py-2 cursor-pointer flex items-center gap-2 ${
            isChannelSubscribed 
              ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {isChannelSubscribed && (
            <FontAwesomeIcon 
              icon={faCheck} 
              style={{ width: '16px', height: '16px' }}
            />
          )}
          <Typography 
            variant="base" 
            weight="bold" 
            color="primary" 
            className="uppercase"
            style={{ color: 'inherit' }}
          >
            {isChannelSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
          </Typography>
        </Button>
      </div>
      
      <ExpandableText
        text={description}
        maxLength={200}
        variant="base"
        weight="normal"
        color="foreground"
        as="p"
      />
    </div>
  );
}