import { EditMemoryForm } from '@/components/EditMemoryForm';
import { api } from '@/lib/api';
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import EmptyMemories from '@/components/EmptyMemories';

interface PageProps {
    params: {
        id: string
    };
    searchParams: string;
}
interface Memory {
    id: string
    coverUrl: string
    excerpt: string
    createdAt: string
    isPublic: boolean
}
export default async function Page({ params, searchParams }: PageProps) {

    const token = cookies().get('token')?.value
    let memory: Memory | null = (null)
    try {

        const response = await api.get(`/memories/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        memory = response?.data
    } catch (error) {

    }
    return (




        <div className="flex flex-1 flex-col gap-4 p-16">
            <Link
                href="/"
                className="flex w-fit items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
            >
                <ChevronLeft className="h-4 w-4" />
                Voltar a timeline
            </Link>
            {memory ?

                <EditMemoryForm memory={memory} />

                :
                <div className='flex h-full justify-center items-center'>

                    <h1 className='text-xl text-gray-200'>Esta memória não existe</h1>
                </div>

            }

        </div>
    )
}