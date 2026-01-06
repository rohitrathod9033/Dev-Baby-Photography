import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Dev Baby Photography, our passion for capturing precious moments, and our experienced team.",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
