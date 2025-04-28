"use client";

import React,{ useEffect, useRef, useState, useTransition } from "react";
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
    const [loading, setLoading] = useState(false);
    const imageRef = useRef(null);
    const handleClick = () => {
      setLoading(true); // Set loading state to true
      setTimeout(() => {
        setLoading(false); // Reset loading state after operation
      }, 1000); // Simulate a delay (you can adjust or remove this)
    };
    useEffect(() => {
      const imageElement = imageRef.current;
  
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 100;
  
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <div className='pb-20 px-4 mt-50'>
        <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-5xl lg:text-[105px] pb-6 gradient-title">
                Manage Your Finances <br/> with Intelligence
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            An AI-powered financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
            </p>
            <div className="flex justify-center space-x-4 mb-4">
                <Link href="/dashboard">
                    <Button  disabled={loading} onClick={handleClick }size="lg" className="px-8"> {loading ? 'Loading...' : 'Get Started'} </Button>
                </Link>
            </div>
        </div>
        <div  className="hero-image-wrapper mt-5 md:mt-0">
            <div ref={imageRef} className="hero-image">
                <Image src="/banner.jpeg"
                width={1180}
                height={620}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl border mx-auto"
                priority></Image>
            </div>
        </div>
    </div>
  )
}

export default Hero