
import { ReactNode } from 'react'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'
import '../globals.css'
import Hero from '@/components/Hero'
import Profile from '@/components/Profile'
import SignIn from '@/components/SignIn'
import Copyright from '@/components/Copyright'
import { cookies } from 'next/headers'
import { ToastContainerClient } from '@/components/ToastContainerClient'
import { i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamJuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-baiJamJuree',
})

export const metadata = {
  title: 'NLW Spacetime',
  description: 'Projeto NLW da rocketseat',
}

export default async function RootLayout({ children,
  params: { lang },
}: { children: ReactNode, params: { lang: string } }) {
  const isAuthenticated = cookies()?.has('token')
  const dictionary = await getDictionary(lang)
  return (
    <html lang={lang}>

      <body
        className={`${roboto.variable} ${baiJamJuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <ToastContainerClient />
        <main className="grid min-h-screen grid-cols-2 ">
          {/* left */}
          <div className="relative flex flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover px-28 py-16">
            {/* Blur */}
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full"></div>
            {/* stripes */}
            <div className="absolute bottom-0 right-2 top-0 w-2  bg-stripes"></div>
            {/* Sigin */}
            {isAuthenticated ? <Profile /> : <SignIn />}
            {/* Hero   */}
            <Hero dictionary={dictionary} />
            {/* copright  */}
            <Copyright />
          </div>

          {/* right */}
          <div className="overflow-y-auto max-h-screen flex flex-col bg-[url(../assets/bg-stars.svg)] bg-cover ">

            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
