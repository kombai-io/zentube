import { useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import LogoLight from './icons/LogoLight';
import LogoDark from './icons/LogoDark';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const { resolvedTheme } = useAppSelector((state) => state.theme);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div 
      className={`flex items-center no-underline cursor-pointer hover:opacity-80 transition-opacity ${className || ''}`} 
      style={{ textDecoration: 'none' }}
      onClick={handleLogoClick}
    >
      {resolvedTheme === 'light' ? (
        <LogoDark width={120} height={26} className="flex-shrink-0" />
      ) : (
        <LogoLight width={120} height={26} className="flex-shrink-0" />
      )}
    </div>
  );
}