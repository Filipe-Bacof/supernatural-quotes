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
        return { ...quote, character: { ...quote.character, img } }
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
          return { ...quote, character: { ...quote.character, img } }
        }),
      )
      setQuotes(quotesWithImages)
    }

    getQuotes()
  }, [])

  return (
    <section className="flex min-h-screen flex-col items-center">
      <Image
        className="m-8"
        src={'/spn-logo-3.png'}
        alt={'Supernatural Logo'}
        height={200}
        width={200}
      />
      <button
        className="flex items-center gap-2 rounded bg-white px-4 py-2 text-black hover:bg-gray-300"
        onClick={handleNewQuotes}
      >
        <p>New Quotes </p>
        <IconShuffle />
      </button>
      {quotes.length > 0 && (
        <div>
          {quotes.map((quote, index) => (
            <div
              className="m-4 flex flex-col gap-2 rounded-md border p-2"
              key={index}
            >
              <div className="flex items-center gap-2">
                {quote.character.img && (
                  <Image
                    className="rounded-full border"
                    // src={quote.character.img}
                    // I'm checking with the API developer about the images
                    // https://linktr.ee/lidiacodes
                    src="/user.png"
                    alt={quote.character.name}
                    height={40}
                    width={40}
                  />
                )}
                <h2 className="text-white">{quote.character.name}</h2>
              </div>
              <p className="text-white">{quote.quote}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-12">
        <h2 className="text-white">Talk to the API Developer:</h2>,
        <Link href={'https://linktr.ee/lidiacodes'}>
          <div className="flex items-center justify-center gap-2">
            <Image
              className="rounded-full"
              src="https://avatars.githubusercontent.com/LidiaKovac"
              alt={'Lidia Kovac Github Picture'}
              height={40}
              width={40}
            />
            <h3 className="text-white">Lidia Kovac</h3>
          </div>
        </Link>
      </div>
    </section>
  )
}
