import { Typography } from './Typography';

interface VideoMetadataProps {
  title: string;
  viewCount: number;
  publishedAt: Date;
}

export default function VideoMetadata({ title, viewCount, publishedAt }: VideoMetadataProps) {
  return (
    <Typography 
      as="h1" 
      variant="extra-large" 
      weight="normal" 
      color="foreground" 
      className="leading-6"
    >
      {title}
    </Typography>
  );
}