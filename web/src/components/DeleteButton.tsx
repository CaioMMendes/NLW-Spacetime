'use client'

import { api } from "@/lib/api"
import { Dispatch, SetStateAction } from "react"

interface Memory {
    id: string
    coverUrl: string
    excerpt: string
    createdAt: string
}
interface Props {
    memoryId: string
    token?: string
    memories: Memory[]
    setMemories: Dispatch<SetStateAction<Memory[]>>
}
import { toastSucess, toastError } from "./ToastMessage"
export function DeleteButton(props: Props) {
    async function handleDeleteMemory(id: string) {
        try {
            await api.delete(`/memories/${id}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            const filteredMemories = props.memories.filter((memory) => memory.id !== id)
            props.setMemories(filteredMemories)
            return toastSucess("Deletado com sucesso!")
        } catch (error) {
            return toastError("Ocorreu um erro!")
        }

    }
    return (

        <>

            <button className="hover:text-gray-100 text-gray-200" onClick={() => { handleDeleteMemory(props.memoryId) }}>
                Deletar
            </button>

        </>
    )
}