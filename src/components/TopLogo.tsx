const TopLogo = () => {
  return (
    <a href="https://thenewnigeriaproject.com/">
      <img
        src="/logo.png"
        alt="The New Nigeria Project Logo"
        className="w-32"
      />
    </a>
  );
};

type Props = {
  className: string;
};
export const CardLogo = ({ className }: Props) => {
  return (
    <img
      src="/logo.png"
      alt="The New Nigeria Project Logo"
      className={className}
    />
  );
};

export default TopLogo;
