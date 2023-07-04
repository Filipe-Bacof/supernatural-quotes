'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Character {
  name: string
  id: string
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
        .map(([key, value]) => value as Quote)
      return quoteList
    } else {
      console.log('Error!')
      return []
    }
  }

  useEffect(() => {
    const getQuotes = async () => {
      const randomQuotes = await fetchRandomQuotes()
      console.log(randomQuotes)
      setQuotes(randomQuotes)
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
      {quotes.length > 0 && (
        <div>
          {quotes.map((quote, index) => (
            <div className="m-4 flex flex-col gap-2 border p-2" key={index}>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full border"
                  src={'/user.png'}
                  alt={'user'}
                  height={40}
                  width={40}
                />
                <h2 className="text-white">{quote.character.name}</h2>
              </div>
              <p className="text-white">{quote.quote}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
