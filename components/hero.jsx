import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
const Hero = () => {
  return (
    <div className='pb-20 px-4'>
        <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
                Manage Your Finances <br/> with Intelligence
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam optio impedit culpa fuga ex, excepturi repudiandae saepe amet temporibus, vero ducimus praesentium dicta facere exercitationem odit distinctio delectus eligendi neque?
            </p>
            <div className="flex justify-center space-x-4">
                <Link href="/dashboard">
                    <Button size="lg" className="px-8">Get Started</Button>
                </Link>
                <Link href="/">
                    <Button size="lg" variant="outline" className="px-8">Watch Demo</Button>
                </Link>
            </div>
        </div>
        <div  className="hero-image-wrapper mt-5 md:mt-0">
            <div className="hero-image">
                <Image src="/banner.jpg"
                width={1280}
                height={720}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl border mx-auto"
                priority></Image>
            </div>
        </div>
    </div>
  )
}

export default Hero