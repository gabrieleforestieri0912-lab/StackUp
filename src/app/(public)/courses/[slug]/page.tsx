'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useState, useEffect } from'react';
import Image from'next/image';
import { useParams, useSearchParams } from'next/navigation';
import SectionTitle from'@/components/ui/SectionTitle';
import Card from'@/components/ui/Card';
import ExerciseComponent from'@/components/course/ExerciseComponent';
import { motion } from'framer-motion';
import { useAuth } from'@/context/AuthContext';
import toast from'react-hot-toast';
import {
 Play,
 CheckCircle2,
 Clock,
 Code,
 BookOpen,
 ChevronRight,
 ChevronDown,
 Trophy,
 Users,
 Lock
} from'lucide-react';

interface Instructor {
 name: string;
 bio: string;
 avatar: string;
}

interface TestCase {
 input: string;
 expectedOutput: string;
 description: string;
}

interface Hint {
 content: string;
 order: number;
}

interface Exercise {
 title: string;
 type: string;
 difficulty: string;
 points: number;
 description: string;
 instructions: string;
 starterCode: string;
 solution: string;
 testCases: TestCase[];
 hints: Hint[];
 completed: boolean;
}

interface Section {
 title: string;
 description: string;
 content: string;
 duration: number;
 exercises: Exercise[];
}

interface MockCourse {
 _id: string;
 title: string;
 description: string;
 longDescription: string;
 price: number;
 level: string;
 duration: number;
 imageUrl: string;
 instructor: Instructor;
  reviewCount: number;
 enrollmentCount: number;
 sections: Section[];
}

const CourseDetailPage = () => {
 const params = useParams();
 const searchParams = useSearchParams();
 const slug = params?.slug as string;
 const success = searchParams?.get('success');
 const canceled = searchParams?.get('canceled');
 const { user, refreshUser } = useAuth();
 const [course, setCourse] = useState<MockCourse | null>(null);
 const [activeSection, setActiveSection] = useState(0);
 const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
 const [loading, setLoading] = useState(true);
 const [purchaseLoading, setPurchaseLoading] = useState(false);
 const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
 const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

 const isEnrolled = course?._id ? user?.enrolledCourses?.includes(course._id) : false;

 useEffect(() => {
 if (slug) {
 fetchCourse();
 }
 }, [slug]);

 useEffect(() => {
 if (success ==='true') {
 refreshUser();
 toast.success('Pagamento completato! Benvenuto nel corso.', {
 duration: 5000,
 icon:'🎉'
 });
 }
 if (canceled ==='true') {
 toast.error('Pagamento annullato.');
 }
 }, [success, canceled, refreshUser]);



 const handlePurchase = async () => {
 if (!user) {
 toast.error('Devi effettuare il login per acquistare un corso');
 return;
 }

 setPurchaseLoading(true);
 try {
 const response = await fetch('/api/payments/create-checkout', {
 method:'POST',
 headers: {'Content-Type':'application/json','Authorization':`Bearer ${localStorage.getItem('token')}`
 },
 body: JSON.stringify({ courseId: course!._id }),
 });

 const data = await response.json();
 if (!response.ok) throw new Error(data.message);

 if (data.url) {
 window.location.href = data.url;
 }
 } catch (error) {
 toast.error(error instanceof Error ? error.message :'Errore');
 } finally {
 setPurchaseLoading(false);
 }
 };

 const fetchCourse = async () => {
 try {
 const response = await fetch(`/api/courses/${slug}`);
 if (!response.ok) {
 throw new Error('Course not found');
 }
 const data = await response.json();
 if (data.success && data.data) {
 setCourse(data.data);
 } else {
 throw new Error('Course not found');
 }
 } catch (error) {
 console.error('Failed to fetch course:', error);
 } finally {
 setLoading(false);
 }
 };


 const toggleSection = (index: number) => {
 const newExpanded = new Set(expandedSections);
 if (newExpanded.has(index)) {
 newExpanded.delete(index);
 } else {
 newExpanded.add(index);
 }
 setExpandedSections(newExpanded);
 };

 const openExercise = (exercise: Exercise) => {
 setSelectedExercise(exercise);
 };

 const closeExercise = () => {
 setSelectedExercise(null);
 };

 const completeExercise = (exerciseId: string, code: string) => {
 setCompletedExercises(prev => new Set([...prev, exerciseId]));
 setSelectedExercise(null);
 // In a real app, you would save the solution to the backend
 console.log('Exercise completed:', exerciseId,'Code:', code);
 };

  if (loading) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
    <section className="mb-6">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
    <div className="flex items-center gap-4">
    <div className="h-8 w-24 skeleton" />
    <div className="h-6 w-40 skeleton" />
    </div>
    <div className="h-12 w-3/4 skeleton" />
    <div className="h-6 w-full skeleton" />
    <div className="h-6 w-5/6 skeleton" />
    <div className="h-6 w-4/5 skeleton" />
    <div className="h-12 w-56 skeleton" />
    </div>
    <div className="aspect-video skeleton-card" />
    </div>
    </section>
    <div className="text-center text-zinc-500 mt-4">
    <p className="text-sm font-medium">Caricamento corso...</p>
    </div>
    </div>
   );
   }

  if (!course) {
  return (
  <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 text-center">
  <h2 className="text-2xl font-bold text-zinc-300">Corso non trovato</h2>
  <p className="text-zinc-400 mt-2">Il corso che cerchi non esiste o non è disponibile.</p>
  </div>
  );
  }

  return (
  <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">

 {/* Course Header */}
 <section className="mb-6">
 <div className="grid lg:grid-cols-2 gap-12 items-center">
 <div>
  <div className="flex items-center gap-4 mb-6">
   <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-bold uppercase tracking-wider">
   {course.level}
   </span>
   </div>

  <h1 className="max-w-5xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl mb-6">
  {course.title}
  </h1>

  <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-8">
  {course.longDescription}
  </p>

  <div className="flex flex-wrap gap-6 mb-8 text-base">
  <div className="flex items-center gap-2">
  <Clock size={22} className="text-zinc-400" />
  <span className="font-bold text-zinc-300">{course.duration} ore</span>
  </div>
  <div className="flex items-center gap-2">
  <Users size={22} className="text-zinc-400" />
  <span className="font-bold text-zinc-300">{course.enrollmentCount.toLocaleString()} studenti</span>
  </div>
  <div className="flex items-center gap-2">
  <Trophy size={22} className="text-zinc-400" />
  <span className="font-bold text-zinc-300">Certificato incluso</span>
  </div>
  </div>

  <div className="flex items-center gap-4 mb-8">
  <Image
  src={course.instructor.avatar ||'/avatar-default.jpg'}
  alt={course.instructor.name}
  width={56}
  height={56}
  className="w-14 h-14 object-cover"
  />
  <div>
  <p className="font-bold text-zinc-100 text-lg">{course.instructor.name}</p>
  <p className="text-base text-zinc-400">{course.instructor.bio}</p>
  </div>
  </div>

  <div className="flex gap-4">
  {isEnrolled ? (
  <button 
  onClick={() => setExpandedSections(new Set([...Array(course.sections.length).keys()]))}
  className="px-8 py-4 bg-orange-600 text-white font-bold text-base hover:bg-orange-700 transition-colors flex items-center gap-2"
  >
  <Play size={20} />
  <span>Continua il corso</span>
  </button>
  ) : (
  <button 
  onClick={handlePurchase}
  disabled={purchaseLoading}
  className="px-8 py-4 bg-black text-white font-bold text-base hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
  >
  <Lock size={20} />
  <span>{purchaseLoading ?'Elaborazione...' :`Acquista ora a €${course.price}`}</span>
  </button>
  )}
  {!isEnrolled && (
  <button className="px-8 py-4 border-2 border-zinc-800 text-zinc-300 font-bold text-base hover:border-orange-300 hover:text-orange-600 transition-colors">
  Anteprima gratuita
  </button>
  )}
 </div>
 </div>

 <div className="relative">
 <div className="aspect-video bg-black overflow-hidden shadow-xl relative">
 <Image
 src={course.imageUrl ||'/course-placeholder.jpg'}
 alt={course.title}
 fill
 className="object-cover"
 />
 <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
 <button className="w-20 h-20 bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/30 transition-colors">
 <Play size={32} className="text-white ml-1" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Course Content */}
 <div className="grid lg:grid-cols-3 gap-12">
 {/* Sections Sidebar */}
 <div className="lg:col-span-1">
 <Card className="p-6">
 <h3 className="text-xl font-bold text-zinc-100 mb-6">Contenuto del corso</h3>
 <div className="space-y-2">
 {course.sections.map((section, index) => (
 <div key={index} className="border border-zinc-800">
 <button
 onClick={() => toggleSection(index)}
 className="w-full flex items-center justify-between p-4 text-left hover:bg-black transition-colors"
 >
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-black flex items-center justify-center text-sm font-bold text-zinc-400">
 {index + 1}
 </div>
 <div>
 <h4 className="font-bold text-zinc-100">{section.title}</h4>
 <p className="text-sm text-zinc-400">{section.duration} min</p>
 </div>
 </div>
 {expandedSections.has(index) ? (
 <ChevronDown size={20} className="text-zinc-400" />
 ) : (
 <ChevronRight size={20} className="text-zinc-400" />
 )}
 </button>

 {expandedSections.has(index) && (
 <div className="px-4 pb-4 space-y-2">
 {section.exercises.map((exercise, exIndex) => (
 <div
 key={exIndex}
 onClick={() => openExercise(exercise)}
 className="flex items-center gap-3 p-2 rounded hover:bg-black cursor-pointer"
 >
 <Code size={16} className="text-zinc-400" />
 <span className="text-sm font-medium text-zinc-300">{exercise.title}</span>
 {completedExercises.has(exercise.title) && (
 <CheckCircle2 size={16} className="text-green-500 ml-auto" />
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 </Card>
 </div>

 {/* Main Content */}
 <div className="lg:col-span-2">
 <Card className="p-8">
 {course.sections[activeSection] && (
 <div>
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 bg-orange-100 flex items-center justify-center">
 <BookOpen size={20} className="text-orange-600" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-zinc-100">
 {course.sections[activeSection].title}
 </h2>
 <p className="text-zinc-400">{course.sections[activeSection].description}</p>
 </div>
 </div>

 <div className="prose prose-slate max-w-none mb-8">
 <p className="text-zinc-300 leading-relaxed">
 {course.sections[activeSection].content}
 </p>
 </div>

 {/* Exercises */}
 {course.sections[activeSection].exercises.length > 0 && (
 <div className="space-y-6">
 <h3 className="text-xl font-bold text-zinc-100">Esercizi</h3>
 {course.sections[activeSection].exercises.map((exercise, index) => (
 <Card key={index} className="p-6 border-l-4 border-l-orange-500">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h4 className="text-lg font-bold text-zinc-100 mb-2">{exercise.title}</h4>
 <p className="text-zinc-400 mb-3">{exercise.description}</p>
 </div>
 <div className="flex items-center gap-2">
 <span className={`px-2 py-1 text-xs font-bold ${
 exercise.difficulty ==='easy' ?'bg-green-100 text-green-600' :
 exercise.difficulty ==='medium' ?'bg-yellow-100 text-yellow-600' :'bg-red-100 text-red-600'
 }`}>
 {exercise.difficulty}
 </span>
 <span className="text-sm font-bold text-zinc-400">{exercise.points} pts</span>
 </div>
 </div>

 <div className="bg-black p-4 mb-4">
 <p className="text-sm text-zinc-300 whitespace-pre-line">{exercise.instructions}</p>
 </div>

 <button
 onClick={() => openExercise(exercise)}
 className="px-6 py-3 bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors"
 >
 Risolvi esercizio
 </button>
 </Card>
 ))}
 </div>
 )}
 </div>
 )}
 </Card>
 </div>
 </div>

 {/* Exercise Modal */}
 {selectedExercise && (
 <ExerciseComponent
 exercise={selectedExercise}
 onComplete={completeExercise}
 onClose={closeExercise}
 />
 )}
 </div>
 );
};

const CourseDetail: React.FC = () => (
  <Suspense fallback={
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
      <div className="text-center text-zinc-500 mt-4">
        <p className="text-sm font-medium">Caricamento corso...</p>
      </div>
    </div>
  }>
    <CourseDetailPage />
  </Suspense>
);

export default CourseDetail;

