"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface HeroProps {
  onGetStarted?: () => void
}

export function Hero({ onGetStarted }: HeroProps = {}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const simplifiedRef = useRef<HTMLSpanElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
  if (!titleRef.current || !simplifiedRef.current || !sparkleRef.current)
    return;

  const ctx = gsap.context(() => {
    gsap.set(titleRef.current, {
      y: 50,
      opacity: 0,
    });

    gsap.set(sparkleRef.current, { opacity: 0 });

    const tl = gsap.timeline();

    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    });

    tl.to(
      sparkleRef.current,
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=1"
    );

    gsap.to(simplifiedRef.current, {
      backgroundPosition: "-200% center",
      duration: 6,
      ease: "power2.inOut",
      repeat: -1,
    });
  });

  return () => ctx.revert();
}, []);

  return (
    <section id="home" className="min-h-screen w-full py-10 relative px-4 sm:px-6 lg:px-8 overflow-hidden will-change-transform" > 
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center pt-32 md:pt-32 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl w-full text-center transform translate-y-0 relative z-50 flex flex-col items-center justify-center">
          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0, 
            }}
            className="opacity-0 relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold"
          >
            Your Legal Queries{" "}
            <span
              ref={simplifiedRef}
              className="inline-block relative bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-[length:200%_100%] bg-clip-text text-transparent"
              style={{ backgroundPosition: "200% center" }}
            >
              Simplified
            </span>
          </motion.h1>

          <div className="flex justify-center mb-8 mt-6">
            <TextGenerateEffect
              words="Transform your legal practice with AI-powered solutions. Streamline document analysis, generate contracts, and get instant legal insights."
              className="text-xl text-black dark:text-white md:text-2xl leading-relaxed font-normal"
            />
          </div>
        </div>

        <motion.div
          className="relative w-full max-w-5xl -mt-32 md:-mt-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="relative flex h-40 w-full overflow-hidden md:h-64">
            <img
              src="https://i.postimg.cc/5NwYwdTn/earth.webp"
              alt="Earth"
              className="absolute top-0 left-1/2 -z-10 mx-auto -translate-x-1/2 px-4 opacity-80"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <img
              src="/images/LegalAI.png"
              alt="LegalAI Dashboard"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-lg border border-white/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
