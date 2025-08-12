import { useNavigate } from "react-router-dom";

type IconProps = {
  icon: React.ReactNode;
  navigate: string;
  onClick: () => void;
  className: string;
};

const CustomIcon = ({ icon, navigate, onClick, className }: IconProps) => {
  const navigateFc = useNavigate();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigateFc(navigate);
    }
  };
  return (
    <div
      onClick={() => handleClick}
      className={`cursor-pointer select-none ${className ?? ""}`}
      role="button"
      tabIndex={0}
    >
      {icon}
    </div>
  );
};

export default CustomIcon;
