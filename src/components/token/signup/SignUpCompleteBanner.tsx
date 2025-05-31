import React from "react"
import { CheckCircle } from "lucide-react"

interface SignUpCompleteBannerProps {
    title: string
    description: string
}

export default function SignUpCompleteBanner({
    title,
    description,
}: SignUpCompleteBannerProps) {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle size={64} color="#4B5EED" className="mb-4" />
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 text-center">{description}</p>
        </div>
    )
}