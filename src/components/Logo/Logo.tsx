import { useNavigate } from "react-router-dom";

type LogoProps = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
};

const CustomLogo = ({ src, alt = "Logo", width, height }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="cursor-pointer select-none h-10 mx-auto object-cover rounded-full w-10"
      onClick={() => navigate("/")}
      role="button"
      tabIndex={0}
      draggable={false}
    />
  );
};

export default CustomLogo;
