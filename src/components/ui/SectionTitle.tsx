'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
 title?: string;
 maskText?: string[];
}

const SectionTitle = ({ title, maskText = [] }: SectionTitleProps) => {
 return (
  <div className="mb-6 mt-8 md:mb-20 md:mt-12 sm:mb-8 sm:mt-10 relative">
   {/* Decorative Background Elements */}
   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
    <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-200/10 blur-[100px] animate-pulse"></div>
    <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-orange-200/10 blur-[90px]"></div>
   </div>

   <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
    <div className="flex flex-col items-center">
     {maskText.map((text, index) => (
      <motion.h1
       key={index}
       initial={{ opacity: 0, y: 30 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98] 
       }}
       className={`text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-jakarta font-extrabold tracking-tighter text-zinc-100 leading-[0.9] 
         ${index === maskText.length - 1 ? 'mb-8' : 'mb-2'}
         ${(maskText.length > 1 && index === maskText.length - 1) ? 'text-orange-600 italic magenta-glow-text' : ''}
       `}
      >
       {text}
      </motion.h1>
     ))}
    </div>

    {title && (
     <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: maskText.length * 0.15 + 0.2 }}
       className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed"
     >
      {title}
     </motion.p>
    )}

    <motion.div 
     initial={{ scaleX: 0 }}
     whileInView={{ scaleX: 1 }}
     viewport={{ once: true }}
     transition={{ duration: 1, delay: 0.5 }}
     className="w-24 h-1.5 bg-orange-600 mt-10 origin-center"
    />
   </div>
  </div>
 );
};

export default SectionTitle;

