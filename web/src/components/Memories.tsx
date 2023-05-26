'use client'

import { api } from "@/lib/api"
import dayjs from "dayjs"
import { Link, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { DeleteButton } from "./DeleteButton"
import EmptyMemories from "./EmptyMemories"
import Image from 'next/image';
import ptBr from 'dayjs/locale/pt-br'

import { toastSucess } from "./ToastMessage"

dayjs.locale(ptBr)

interface Memory {
    id: string
    coverUrl: string
    excerpt: string
    createdAt: string
}
interface Props {
    token?: string
}

export function Memories(props: Props) {
    const token = props.token
    const [isLoading, setIsLoading] = useState(true)
    const [memories, setMemories] = useState<Memory[]>([])
    // let memories: Memory[] = []
    async function handleGetMemories() {

        const response = await api.get('/memories', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setMemories(response.data)
        setIsLoading(false)
    }
    useEffect(() => {
        handleGetMemories()
    }, [])


    if (isLoading) {
        return (
            <div className="flex h-screen justify-center items-center">
                <h1 className="text-xl text-gray-200">Loading...</h1></div>
        )
    }
    if (memories.length === 0) {
        return <EmptyMemories />
    }
    return <div className='flex flex-col gap-10 p-8'>


        {memories.map((memory) => {
            return (
                <div key={memory.id} className='space-y-4 '>
                    <div className='flex justify-between items-center'>

                        <time className='flex -ml-8 items-center before:h-px before:bg-gray-50 before:w-5 gap-2 text-sm text-gray-100'>
                            {dayjs(memory.createdAt).format("D[ de ]MMMM[, ] YYYY")}

                        </time>
                        <div className="flex gap-4">

                            <a className="hover:text-gray-100 text-gray-200" href={`/memories/edit/${memory.id}`}>Editar</a>
                            <DeleteButton memoryId={memory.id} token={token} memories={memories} setMemories={setMemories} />
                        </div>

                    </div>
                    <Image className='w-full aspect-video object-cover' src={memory.coverUrl} width={592} height={280} alt='' />
                    <p className='text-lg leading-relaxed text-gray-100'>{memory.excerpt}</p>
                    <a href={`/memories/share/${memory.id}`} className='flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100'>Ler Mais
                        <ArrowRight className='w-4 h-4' />
                    </a>
                </div>
            )
        })}</div >
}
