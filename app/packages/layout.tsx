import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography Packages",
  description: "Explore our newborn, maternity, and baby photography packages. Transparent pricing and custom options available.",
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
