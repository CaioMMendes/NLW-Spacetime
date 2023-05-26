
import EmptyMemories from '@/components/EmptyMemories'
import { cookies } from 'next/headers'
import dayjs from "dayjs";
import ptBr from 'dayjs/locale/pt-br'

import { Memories } from '@/components/Memories';
dayjs.locale(ptBr)

export default async function Home() {
  const isAuthenticated = cookies().has('token')
  if (!isAuthenticated) {

    return <EmptyMemories />
  }
  const token = cookies().get('token')?.value



  return (



    <Memories token={token} />

  )
}
