import Image from 'next/image'

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src={'/spn-logo-3.png'}
        alt={'Supernatural Logo'}
        height={300}
        width={300}
      />
    </section>
  )
}
