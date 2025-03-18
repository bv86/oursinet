import { LinkProps } from "@/lib/types";
import Link from "next/link";

interface FooterProps {
  data: {
    socials: LinkProps[];
    copyright: string;
  };
}

const Footer = async ({ data }: FooterProps) => {
  if (!data) return null;
  const { socials, copyright } = data;

  return (
    <footer className="bg-sidebar text-sidebar-foreground w-full">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center p-2">
        {/* Social Media Section */}
        <div className="flex space-x-4">
          {socials.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className="hover:underline"
              target={item.isExternal ? "_blank" : "_self"}
            >
              <h5>{item.text}</h5>
            </Link>
          ))}
        </div>
        {/* Copyright Section */}
        <div className="text-sm self-center">
          &copy; {new Date().getFullYear()} {copyright}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
