const TopLogo = () => {
  return (
    <a href="https://thepeoplesopposition.org/">
      {/* Light mode logo */}
      <img
        src="/logo-black.png"
        alt="The People's Opposition Logo"
        className="w-32 block dark:hidden"
      />

      {/* Dark mode logo */}
      <img
        src="/logo.png"
        alt="The People's Opposition Logo"
        className="w-32 hidden dark:block"
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
      src="/logo-black.png"
      alt="The People's Opposition Logo"
      className={className}
    />
  );
};

export default TopLogo;
