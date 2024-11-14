type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <a href='/' className={`font-mono ${className}`}>
      PeerPrep
    </a>
  );
};
