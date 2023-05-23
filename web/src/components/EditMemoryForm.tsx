'use client'
import { Camera } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
import { FormEvent } from "react";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface Props {
    memory: {
        id: string
        coverUrl: string
        excerpt: string
        createdAt: string
        isPublic: boolean
    }
}

export function EditMemoryForm(props: Props) {
    const memory = props.memory
    console.log(memory)
    const router = useRouter()
    const [isChecked, setIsChecked] = useState(memory.isPublic)
    const [inputDate, setInputDate] = useState(memory.createdAt)

    async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const date = formData.get('date')

        let dateTime = new Date(Date.now())
        if (!date === null || !date === false) {




            dateTime = new Date(`${date}`)

        }

        const fileToUpload = formData.get('coverUrl')
        let coverUrl = ''
        if (fileToUpload instanceof File) {

            if (!fileToUpload?.size === false && !fileToUpload === null) {
                const uploadFormData = new FormData()
                uploadFormData.set('file', fileToUpload)
                const uploadResponse = await api.post('/upload', uploadFormData)
                coverUrl = uploadResponse.data.fileUrl
            }
        }

        const token = Cookies.get('token')
        await api.post('/memories', {
            coverUrl,
            content: formData.get('content'),
            isPublic: formData.get('isPublic'),
            date: dateTime
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        router.push('/')



    }
    function handleCheckbox() {
        setIsChecked(!isChecked)
    }
    function handleInputDate() {

    }

    return (

        <form onSubmit={handleEditMemory} className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
                <label
                    htmlFor="media"
                    className="flex cursor-pointer  items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                    <Camera className="h-4 w-4" />
                    Anexar mídia
                </label>
                <label
                    htmlFor="isPublic"
                    className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                    <input
                        className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500  focus:ring-0 active:ring-0"
                        type="checkbox"
                        name="isPublic"
                        id="isPublic"
                        value="true"
                        checked={isChecked}
                        onChange={handleCheckbox}
                    />
                    Tornar memória pública
                </label>

                <input type="date" name="date" placeholder={inputDate} id="date" className="inputDateIcon w-32 text-sm text-gray-200 h-7 p-1 bg-transparent" />
            </div>

            <MediaPicker imageUrl={memory.coverUrl} />
            <textarea
                placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
                name="content"
                spellCheck={false}
                className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
            />
            <button type="submit" className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
            >
                Salvar
            </button>
        </form>
    )
}