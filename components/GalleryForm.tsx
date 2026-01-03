"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface GalleryFormProps {
    onSuccess: () => void
}

export default function GalleryForm({ onSuccess }: GalleryFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: {
            type: "photo",
            src: "",
            thumbnail: "",
            title: "",
            alt: "",
            category: "",
        },
    })

    const type = watch("type")

    const handleFileUpload = async (file: File, fieldName: "src" | "thumbnail") => {
        const formData = new FormData()
        formData.append("file", file)

        const loadingToast = toast({ title: "Uploading...", description: "Please wait" })

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setValue(fieldName, data.url)
            toast({ title: "Success", description: "File uploaded successfully" })
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Upload failed", variant: "destructive" })
        }
    }

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) throw new Error("Failed to add item")

            toast({ title: "Success", description: "Gallery item added successfully" })
            reset()
            onSuccess()
        } catch (error) {
            toast({ title: "Error", description: "Failed to add item", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={(val) => setValue("type", val)} defaultValue={type}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="reel">Reel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <Input {...register("category")} placeholder="e.g. Newborn, Family" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Source (Image/Video)</Label>
                    <div className="flex gap-2">
                        <Input {...register("src", { required: true })} placeholder="URL or Upload File" />
                        <label className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md inline-flex items-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            Upload
                            <input type="file" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'src');
                            }} />
                        </label>
                    </div>
                </div>

                {type === "reel" && (
                    <div className="space-y-2 md:col-span-2">
                        <Label>Thumbnail</Label>
                        <div className="flex gap-2">
                            <Input {...register("thumbnail")} placeholder="URL or Upload File" />
                            <label className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md inline-flex items-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                Upload
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, 'thumbnail');
                                }} />
                            </label>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...register("title")} placeholder="Image Title" />
                </div>

                <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input {...register("alt")} placeholder="Description for accessibility" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Item
                </Button>
            </div>
        </form>
    )
}
