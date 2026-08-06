import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CardProps {
 children: React.ReactNode;
 className?: string;
 type?: string;
 background?: string | null;
 index?: number;
 label?: string | null;
 icon?: React.ComponentType<{ size?: number; strokeWidth?: number }> | null;
}

interface TypeClasses {
 [key: string]: string;
}

const Card = ({ children, className = '', type = '', background = null, index = 0, label = null, icon: Icon = null }: CardProps) => {
  const baseClasses = `
   relative 
   bg-black
   border border-zinc-800 rounded-2xl
   p-8 sm:p-10
   text-zinc-100
   flex flex-col justify-start 
   overflow-hidden 
   h-full group
   shadow-[0_8px_30px_rgb(0,0,0,0.02)]
  `;

 const typeClasses: TypeClasses = {
  hero: "col-span-12 lg:col-span-7",
  medium: "col-span-12 lg:col-span-5 flex flex-col justify-end min-h-[350px]",
  small: "col-span-12 md:col-span-4",
  wide: "col-span-12 lg:col-span-8",
  square: "col-span-12 lg:col-span-4",
 };

 return (
  <motion.div
   initial={{ opacity: 0, y: 30 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true, margin: "-50px" }}
   transition={{ 
    duration: 0.8, 
    delay: index * 0.05, 
    ease: [0.22, 1, 0.36, 1] 
   }}
   whileHover={{ y: -4 }}
   className={`${baseClasses} ${typeClasses[type] || ''} ${className}`}
  >
   <div className="relative z-10 flex justify-between items-start mb-6">
     {label && (
      <span className="inline-block px-4 py-1.5 bg-black text-white font-mono text-[11px] rounded-lg font-black tracking-widest uppercase group-hover:bg-orange-600 transition-colors duration-500">
       {label}
      </span>
     )}
     {Icon && (
       <div className="w-14 h-14 bg-black border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-orange-600 group-hover:border-orange-200 group-hover:bg-zinc-900 transition-all duration-500">
       <Icon size={26} strokeWidth={2.2} />
      </div>
     )}
   </div>

   {background && (
    <>
     <motion.div
      initial={{ scale: 1.05, opacity: 0.1 }}
      className="absolute inset-0 z-0"
     >
      <Image
       src={background}
       alt=""
       fill
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
       className="object-cover"
       priority={false}
      />
     </motion.div>
     <div className="absolute inset-0 bg-gradient-to-t from-black via-white/5 to-transparent z-[1]" />
    </>
   )}

   <div className="relative z-[2] flex flex-col h-full w-full">
    {children}
   </div>
  </motion.div>
 );
};

export default Card;

