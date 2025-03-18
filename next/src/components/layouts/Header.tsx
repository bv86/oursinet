import Link from "next/link";
import { LinkProps, LogoProps } from "@/lib/types";
import { StrapiImage } from "../ui/StrapiImage";

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
  };
}

const Header = async ({ data }: HeaderProps) => {
  if (!data) return null;

  const { logo, navigation } = data;
  return (
    <nav className="bg-sidebar text-sidebar-foreground sticky top-0 left-0 z-50 w-full flex justify-between items-center px-2 py-2">
      {/* Left Section with 3 Links */}
      <section className="flex space-x-4">
        <Link href="/">
          <StrapiImage
            src={logo.image.url}
            alt={logo.image.alternativeText || "No alternative text provided"}
            width={40}
            height={40}
          />
        </Link>
      </section>

      {/* Right Section with 3 Links */}
      <section className="flex space-x-4">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.id}
            className="hover:underline"
            target={item.isExternal ? "_blank" : "_self"}
          >
            <h5>{item.text}</h5>
          </Link>
        ))}
      </section>
    </nav>
  );
};

export default Header;
