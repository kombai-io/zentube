import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Typography } from './Typography';

interface DangerZoneSectionProps {
  onDeleteAllData: () => void;
}

export default function DangerZoneSection({ onDeleteAllData }: DangerZoneSectionProps) {
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      onDeleteAllData();
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle>
          <Typography 
            weight="semibold" 
            color="destructive" 
            style={{ fontSize: '16px' }}
          >
            Danger Zone
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Typography 
              as="h4" 
              weight="medium" 
              style={{ fontSize: '14px' }} 
              className="mb-2"
            >
              Delete all data
            </Typography>
            <Typography 
              color="muted-foreground" 
              style={{ fontSize: '14px' }} 
              className="mb-4 block"
            >
              This will permanently delete all your watch history, liked videos, watch later list, 
              and reset all settings to defaults. This action cannot be undone.
            </Typography>
            <div className="mt-4">
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <FontAwesomeIcon 
                  icon={faTrashCan} 
                  style={{ width: '16px', height: '16px', marginRight: '8px' }}
                />
                Delete all my data
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}