'use client'

import IconShuffle from '@/icons/IconShuffle'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Character {
  name: string
  id: string
  img?: string
}

interface Quote {
  character: Character
  quote: string
}

interface APIResponse {
  [key: string]: Quote | string
}

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([])

  async function fetchRandomQuotes(): Promise<Quote[]> {
    const APIResponse = await fetch(
      'https://supernatural-quotes-api.cyclic.app/quotes/random',
    )
    if (APIResponse.status === 200) {
      const data: APIResponse = await APIResponse.json()
      const quoteList: Quote[] = Object.entries(data)
        .filter(
          ([key, value]) =>
            key.startsWith('line_') && typeof value === 'object',
        )
        .map(([key, value]) => {
          const quote: Quote = value as Quote
          quote.quote = quote.quote.replace(/&#34;/g, '"')
          return quote
        })
      console.log(quoteList)
      return quoteList
    } else {
      console.log('Error!')
      return []
    }
  }

  async function fetchCharacterImage(id: string): Promise<string> {
    const APIResponse = await fetch(
      `https://supernatural-quotes-api.cyclic.app/characters/${id}`,
    )
    if (APIResponse.status === 200) {
      const data = await APIResponse.json()
      return data.img
    } else {
      console.log('Error!')
      return ''
    }
  }

  const handleNewQuotes = async () => {
    const randomQuotes = await fetchRandomQuotes()
    const quotesWithImages = await Promise.all(
      randomQuotes.map(async (quote) => {
        const img = await fetchCharacterImage(quote.character.id)
        if (img) {
          quote.character.img = img.replace('/images/', '/assets/')
        }
        return quote
      }),
    )
    setQuotes(quotesWithImages)
  }

  useEffect(() => {
    const getQuotes = async () => {
      const randomQuotes = await fetchRandomQuotes()
      const quotesWithImages = await Promise.all(
        randomQuotes.map(async (quote) => {
          const img = await fetchCharacterImage(quote.character.id)
          if (img) {
            quote.character.img = img.replace('/images/', '/assets/')
          }
          return quote
        }),
      )
      setQuotes(quotesWithImages)
    }

    getQuotes()
  }, [])

  return (
    <main>
      <section className="flex min-h-screen flex-col items-center md:mx-16 md:flex-row">
        <div className="flex flex-col items-center justify-center text-center md:flex-1">
          <Image
            className="m-8"
            src={'/spn-logo-3.png'}
            alt={'Supernatural Logo'}
            height={200}
            width={200}
          />
          <h1 className="text-2xl font-medium text-white">
            Supernatural Quotes!
          </h1>
          <p className="mb-2 text-white">
            Created by hunters
            <br />
            For hunters fans
          </p>
          <button
            className="flex items-center gap-2 rounded bg-white px-4 py-2 text-black hover:bg-gray-300"
            onClick={handleNewQuotes}
          >
            <p>New Quotes </p>
            <IconShuffle />
          </button>
        </div>
        <div>
          {quotes.length > 0 && (
            <div className="flex max-w-[500px] flex-col">
              {quotes.map((quote, index) => (
                <div
                  className="m-4 flex flex-col gap-2 rounded-md border p-2"
                  key={index}
                >
                  <div className="flex items-center gap-2">
                    {quote.character.img && (
                      <Image
                        className="h-16 w-16 rounded-full border object-cover"
                        src={quote.character.img}
                        // I'm checking with the API developer about the images
                        // https://linktr.ee/lidiacodes
                        // src="/user.png"
                        alt={quote.character.name}
                        height={500}
                        width={500}
                      />
                    )}
                    <h2 className="text-white">{quote.character.name}</h2>
                  </div>
                  <p className="text-white">{quote.quote}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="mx-auto mt-4 flex flex-col items-center justify-start">
        <h2 className="text-white">Talk to the developers:</h2>,
        <Link href={'https://linktr.ee/lidiacodes'}>
          <div className="flex items-center justify-center gap-1">
            <Image
              className="rounded-full"
              src="https://avatars.githubusercontent.com/LidiaKovac"
              alt={'Lidia Kovac Github Picture'}
              height={40}
              width={40}
            />
            <h3 className="text-white">Lidia Kovac - API Developer</h3>
          </div>
        </Link>
        <Link href={'https://portifolio-filipe-bacof.vercel.app'}>
          <div className="flex items-center justify-center gap-1">
            <Image
              className="rounded-full"
              src="https://avatars.githubusercontent.com/Filipe-Bacof"
              alt={'Filipe Bacof Github Picture'}
              height={40}
              width={40}
            />
            <h3 className="text-white">Filipe Bacof - Website Developer</h3>
          </div>
        </Link>
      </footer>
    </main>
  )
}
