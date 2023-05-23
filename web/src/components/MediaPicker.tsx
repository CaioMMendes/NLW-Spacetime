'use client'

import { ChangeEvent, useState } from 'react'
interface Props {
    imageUrl?: string
}
export function MediaPicker(props: Props) {
    const [preview, setPreview] = useState<string | null>(props.imageUrl ? props.imageUrl : null)


    function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target
        if (!files) {
            return
        }
        const previewURL = URL.createObjectURL(files[0])
        setPreview(previewURL)
    }
    return (
        <>
            <input
                onChange={onFileSelected}
                accept="image/*"
                type="file"
                name='coverUrl'
                id="media"
                className="invisible h-0 w-0"
            />
            {preview && (
                <img
                    src={preview}
                    alt=""
                    className="aspect-video w-full rounded-lg object-cover"
                />
            )}
        </>
    )
}
