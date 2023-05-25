import { api } from "@/lib/api"
import dayjs from "dayjs"

import Image from 'next/image';

import ptBr from 'dayjs/locale/pt-br'
import { cookies } from "next/headers"
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
dayjs.locale(ptBr)

interface Memory {
    id: string
    coverUrl: string
    excerpt: string
    createdAt: string
    content: string
}
interface Props {
    token?: string
}

interface PageProps {
    params: {
        id: string
    };
    searchParams: string;
}

export default async function ShareMemory({ params, searchParams }: PageProps) {
    const token = cookies().get('token')?.value

    let memories: Memory | null = null

    try {

        const response = await api.get(`/memories/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        memories = response.data
    } catch (error) {
        console.log(error)
    }






    if (memories === null) {
        return (<div className='flex h-full justify-center items-center'>

            <h1 className='text-xl text-gray-200'>Esta memória não existe 😥</h1>
        </div>)
    }
    return <div className='flex flex-col gap-10 p-8'>
        <Link
            href="/"
            className="flex w-fit items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
        >
            <ChevronLeft className="h-4 w-4" />
            Voltar a timeline
        </Link>
        <div key={memories.id} className='space-y-4 '>
            <div className='flex justify-between items-center'>

                <time className='flex -ml-8 items-center before:h-px before:bg-gray-50 before:w-5 gap-2 text-sm text-gray-100'>
                    {dayjs(memories.createdAt).format("D[ de ]MMMM[, ] YYYY")}

                </time>


            </div>
            <Image className='w-full aspect-video object-cover' src={memories.coverUrl} width={592} height={280} alt='' />
            <p className='text-lg leading-relaxed text-gray-100'>{memories.content}</p>

        </div>

    </div >
}
