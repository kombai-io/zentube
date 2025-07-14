import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Typography } from './Typography';
import { formatLastActiveTime } from '../utils/formatters';

interface UserProfileHeaderProps {
  username: string;
  lastActiveAt: Date;
  onUsernameChange: (username: string) => void;
}

export default function UserProfileHeader({ 
  username, 
  lastActiveAt, 
  onUsernameChange 
}: UserProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(username);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(username);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUsernameChange(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(username);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full"
                style={{ fontSize: '16px', fontWeight: '600' }}
                autoFocus
              />
            ) : (
              <Typography 
                as="h1" 
                weight="semibold" 
                style={{ fontSize: '16px' }}
              >
                {username}
              </Typography>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <FontAwesomeIcon 
                    icon={faCheck} 
                    style={{ width: '16px', height: '16px' }}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    style={{ width: '16px', height: '16px' }}
                  />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-muted-foreground hover:text-foreground"
              >
                <FontAwesomeIcon 
                  icon={faPen} 
                  style={{ width: '16px', height: '16px' }}
                />
              </Button>
            )}
          </div>
        </div>
        
        <Typography 
          color="muted-foreground" 
          style={{ fontSize: '14px' }}
        >
          Last active: {formatLastActiveTime(lastActiveAt)}
        </Typography>
      </CardContent>
    </Card>
  );
}