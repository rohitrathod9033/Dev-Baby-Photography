"use client";
import { motion } from "framer-motion";
import { Play, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 9;

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState<"photos" | "reels">("photos");
    const [currentPage, setCurrentPage] = useState(1);
    const [photos, setPhotos] = useState<any[]>([]);
    const [reels, setReels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/gallery")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPhotos(data.filter((i: any) => i.type === 'photo'));
                    setReels(data.filter((i: any) => i.type === 'reel'));
                }
            })
            .catch(err => console.error("Failed to load gallery", err))
            .finally(() => setLoading(false));
    }, []);

    // Reset page when switching tabs
    const handleTabChange = (tab: "photos" | "reels") => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const currentData = activeTab === "photos" ? photos : reels;
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = currentData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-background">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                        Our <span className="text-primary italic">Gallery</span>
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        Explore our collection of precious moments captured in time.
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => handleTabChange("photos")}
                            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === "photos"
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            Photos
                        </button>
                        <button
                            onClick={() => handleTabChange("reels")}
                            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === "reels"
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                        >
                            <Play className="w-4 h-4" />
                            Reels
                        </button>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-muted-foreground animate-pulse">Loading gallery...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Photos Section */}
                        {activeTab === "photos" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {currentItems.map((photo: any, index: number) => (
                                    <motion.div
                                        key={startIndex + index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
                                    >
                                        <img
                                            src={photo.src}
                                            alt={photo.alt}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                                                <span className="text-2xl font-light">+</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Reels Section */}
                        {activeTab === "reels" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {currentItems.map((reel: any, index: number) => (
                                    <motion.div
                                        key={reel.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group relative aspect-[9/16] overflow-hidden rounded-2xl cursor-pointer bg-card shadow-lg"
                                    >
                                        <img
                                            src={reel.thumbnail}
                                            alt={reel.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                                        {/* Play Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                                                <Play className="w-6 h-6 fill-current" />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{reel.title}</h3>
                                            <p className="text-sm text-white/80">{reel.views} views</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === page
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
