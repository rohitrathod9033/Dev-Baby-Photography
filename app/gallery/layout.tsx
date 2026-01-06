import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Photo Gallery",
    description: "View our portfolio of adorable newborn, baby, and maternity photos. See the quality and style of our work.",
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
