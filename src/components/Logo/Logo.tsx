import { useNavigate } from "react-router-dom";

type LogoProps = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
};

const Logo = ({ src, alt = "Logo", width, height }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="cursor-pointer select-none"
      onClick={() => navigate("/")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate("/");
      }}
      draggable={false}
    />
  );
};

export default Logo;
