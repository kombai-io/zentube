import { useSubscribedChannels } from '../hooks/useLocalStorage';
import ChannelItem from './ChannelItem';
import { Typography } from './Typography';

interface SubscriptionsListProps {
  isCollapsed: boolean;
}

export default function SubscriptionsList({ isCollapsed }: SubscriptionsListProps) {
  const { subscribedChannels } = useSubscribedChannels();

  // Don't render if no subscriptions
  if (subscribedChannels.length === 0) {
    return null;
  }

  const handleChannelClick = (channelId: string) => {
    // TODO: Navigate to channel page when implemented
    console.log('Navigate to channel:', channelId);
  };

  return (
    <div className="mt-6">
      {!isCollapsed && (
        <div className="px-4 mb-3">
          <Typography 
            variant="base" 
            weight="semibold" 
            color="foreground"
            className="uppercase tracking-wide"
            as="h3"
            style={{ fontSize: '14px' }}
          >
            Subscriptions
          </Typography>
        </div>
      )}
      <div className="space-y-1">
        {subscribedChannels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isCollapsed={isCollapsed}
            onClick={() => handleChannelClick(channel.id)}
          />
        ))}
      </div>
    </div>
  );
}