'use client'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import ContactUsModal from '../team/contact-us'
import { useGSAP } from '@/hooks/use-gsap'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function FAQsTwo() {

    const [isContactOpen, setIsContactOpen] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const accordionRef = useRef<HTMLDivElement>(null)

    const faqItems = [
        {
            id: 'item-1',
            question: 'What is LegalAI?',
            answer: 'LegalAI is an advanced AI-powered platform designed to assist legal professionals with research, document analysis, contract review, and case preparation.',
        },
        {
            id: 'item-2',
            question: 'How does LegalAI ensure accuracy in legal advice?',
            answer: 'LegalAI uses state-of-the-art machine learning models trained on vast legal databases. However, it is a tool to assist lawyers and should not replace professional legal judgment.',
        },
        {
            id: 'item-3',
            question: 'What types of legal matters can LegalAI handle?',
            answer: 'LegalAI can assist with contract analysis, legal research, document summarization, compliance checks, and predictive analytics for case outcomes.',
        },
        {
            id: 'item-4',
            question: 'Is my data secure with LegalAI?',
            answer: 'Yes, we prioritize data security with end-to-end encryption, compliance with GDPR and other privacy regulations, and secure cloud storage.',
        },
        {
            id: 'item-5',
            question: 'Can LegalAI replace human lawyers?',
            answer: 'No, LegalAI is designed to augment legal professionals by automating routine tasks, allowing lawyers to focus on complex decision-making and client interaction.',
        },
    ]

    useGSAP(() => {
        if (!sectionRef.current || !headerRef.current || !accordionRef.current) return

        gsap.registerPlugin(ScrollTrigger)

        gsap.set(headerRef.current.children, {
            y: 30,
            opacity: 0,
            force3D: true,
        })

        gsap.set(accordionRef.current, {
            y: 40,
            opacity: 0,
            scale: 0.95,
            force3D: true,
        })

        gsap.to(headerRef.current.children, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
            },
        })

        gsap.to(accordionRef.current, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
                trigger: accordionRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
            },
        })
    }, [])

    return (
        <section ref={sectionRef} className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div ref={headerRef} className="mx-auto text-center">
                   <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent">Frequently Asked Questions</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div ref={accordionRef} className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-center text-muted-foreground mt-6 px-8">
                        Need more information?{' '}
                        <Link
                            href="#contact"
                            onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}
                            className="text-primary font-medium hover:underline">
                            contact us
                        </Link>
                    </p>
                    <ContactUsModal open={isContactOpen} onOpenChange={setIsContactOpen} />
                </div>
            </div>
        </section>
    )
}