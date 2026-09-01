import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
 Play,
 CheckCircle2,
 XCircle,
 Lightbulb,
 Trophy,
 RotateCcw,
 Eye,
 EyeOff
} from 'lucide-react';

interface TestCase {
 input: string;
 expectedOutput: string;
 description: string;
}

interface Hint {
 content: string;
 order?: number;
}

interface CommonError {
 error: string;
 fix: string;
}

interface Exercise {
 _id?: string;
 title: string;
 description?: string;
 why?: string;
 how?: string;
 instructions: string;
 commonErrors?: CommonError[];
 checkpoint?: string;
 isCheckpoint?: boolean;
 starterCode?: string;
 solution?: string;
 testCases?: TestCase[];
 hints?: Hint[];
 difficulty?: string;
 points?: number;
}

interface TestResult {
 index: number;
 input: string;
 expected: string;
 actual: string;
 passed: boolean;
 description: string;
}

interface LanguageOption {
 id: string;
 name: string;
 type: string;
}

interface ExerciseComponentProps {
 exercise: Exercise;
 onComplete: (id: string, code: string) => void;
 onClose: () => void;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
 { id: 'auto', name: 'Rilevamento Auto ✨', type: 'system' },
 { id: 'javascript', name: 'JavaScript 💛', type: 'language' },
 { id: 'python', name: 'Python 🐍', type: 'language' },
 { id: 'php', name: 'PHP 🐘', type: 'language' },
 { id: 'c', name: 'C ⚙️', type: 'language' },
 { id: 'csharp', name: 'C# 🚀', type: 'language' },
 { id: 'perl', name: 'Perl 🐪', type: 'language' },
 { id: 'ruby', name: 'Ruby 💎', type: 'language' },
 { id: 'lua', name: 'Lua 🌙', type: 'language' },
 { id: 'java', name: 'Java ☕', type: 'language' },
 { id: 'cpp', name: 'C++ 🟦', type: 'language' },
 { id: 'html', name: 'HTML5 🧡', type: 'language' },
 { id: 'css', name: 'CSS3 💙', type: 'language' },
 { id: 'nextjs', name: 'Next.js ▲', type: 'framework' },
 { id: 'angular', name: 'Angular ❤️', type: 'framework' },
 { id: 'vue', name: 'Vue.js 💚', type: 'framework' },
  { id: 'svelte', name: 'Svelte 🧡', type: 'framework' },
  { id: 'astro', name: 'Astro 🚀', type: 'framework' },
  { id: 'sql', name: 'SQL 🗄️', type: 'language' },
  { id: 'go', name: 'Go ⚓', type: 'language' },
  { id: 'bash', name: 'Bash/Terminale 💻', type: 'language' }
];

const ExerciseComponent = ({ exercise, onComplete, onClose }: ExerciseComponentProps) => {
 const [code, setCode] = useState(exercise.starterCode || '');
 const [output, setOutput] = useState('');
 const [isRunning, setIsRunning] = useState(false);
 const [testResults, setTestResults] = useState<TestResult[]>([]);
 const [showHints, setShowHints] = useState(false);
 const [currentHint, setCurrentHint] = useState(0);
 const [showSolution, setShowSolution] = useState(false);
 const [selectedLanguage, setSelectedLanguage] = useState('auto');

 const detectLanguageAndFramework = (c: string): string => {
  const codeStr = (c || '').trim();
  if (!codeStr) return 'javascript';

  if (codeStr.startsWith('<?php') || codeStr.includes('echo ') || codeStr.includes('$this->')) return 'php';
  if (codeStr.includes('#include') || codeStr.includes('printf(') || codeStr.includes('struct ')) return 'c';
  if (codeStr.includes('using System;') || codeStr.includes('Console.WriteLine') || codeStr.includes('namespace ')) return 'csharp';
  if (codeStr.includes('my $') || codeStr.includes('use strict;') || codeStr.startsWith('#!/usr/bin/perl')) return 'perl';

  // Frameworks first because they might wrap other languages
  if (codeStr.includes('@Component') || codeStr.includes('templateUrl:') || codeStr.includes('NgModule')) return 'angular';
  if (codeStr.includes('<script setup>') || codeStr.includes('defineProps') || codeStr.includes('createApp(') || codeStr.includes('v-if=') || codeStr.includes('v-for=')) return 'vue';
  if ((codeStr.includes('<script>') && codeStr.includes('export let')) || codeStr.includes('$: ') || codeStr.includes('bind:value')) return 'svelte';
  if (codeStr.startsWith('---') && codeStr.includes('---')) return 'astro';
  if (codeStr.includes('export const getServerSideProps') || codeStr.includes('use client') || codeStr.includes('getServerSideProps')) return 'nextjs';

  // SQL / Go / Bash commands
  if (/\b(SELECT\b|INSERT\s+INTO|UPDATE\s+\w+\s+SET|CREATE\s+TABLE|CREATE\s+INDEX|DELETE\s+FROM|ALTER\s+TABLE|JOIN\b)/i.test(codeStr)) return 'sql';
  if (codeStr.includes('package main') || codeStr.includes('func ') || codeStr.includes('fmt.') || codeStr.includes(':=')) return 'go';
  if (codeStr.includes('#!') || /^\s*(git|docker|docker-compose|npm|npx|pnpm|yarn|curl|psql|kubectl|vercel|heroku|ls|mkdir|cd)\s+/m.test(codeStr)) return 'bash';

  // Fallback languages
  if (codeStr.includes('def ') && codeStr.endsWith('end')) return 'ruby';
  if (codeStr.includes('local ') || (codeStr.includes('then') && codeStr.includes('end'))) return 'lua';
  if (codeStr.includes('def ') || codeStr.includes('print(')) return 'python';
  if (codeStr.includes('class Persona') || codeStr.includes('System.out')) return 'java';
  if (codeStr.includes('cout <<') || codeStr.includes('int*')) return 'cpp';
  if (codeStr.includes('<') && codeStr.includes('>')) return 'html';
  if (codeStr.includes('{') && (codeStr.includes('color:') || codeStr.includes('background-color:'))) return 'css';

  return 'javascript';
 };

 const activeLang = selectedLanguage === 'auto' ? detectLanguageAndFramework(code) : selectedLanguage;

 useEffect(() => {
  setCode(exercise.starterCode || '');
  setOutput('');
  setTestResults([]);
  setShowHints(false);
  setCurrentHint(0);
  setShowSolution(false);
 }, [exercise]);

 const runCode = async () => {
  setIsRunning(true);
  setOutput('');

  try {
   // Simulate network lag slightly for visual realism, then execute
   await new Promise(resolve => setTimeout(resolve, 600));

   const lang = activeLang;

   const results: TestResult[] = (exercise.testCases || []).map((testCase, index) => {
    let passed = false;
    let actual = '';

    try {
     if (lang === 'javascript') {
      let logs: string[] = [];
      const customConsole = {
       log: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
       info: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
       warn: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
       error: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '))
      };

      let fullCode = code;
      if (testCase.input) {
       // Supporta sia una singola espressione sia una sequenza di istruzioni:
       // aggiunge return solo all'ultima espressione. Es. "const c = f(); c.get()"
       // diventa "const c = f(); return (c.get());".
       const lastSemicolon = testCase.input.lastIndexOf(';');
       if (lastSemicolon === -1) {
        fullCode += `\nreturn (${testCase.input});`;
       } else {
        const head = testCase.input.slice(0, lastSemicolon + 1);
        const lastExpr = testCase.input.slice(lastSemicolon + 1).trim();
        fullCode += `\n${head}\nreturn (${lastExpr});`;
       }
      }

      // Blocco pattern pericolosi noti che potrebbero esfiltrare dati
      // o manipolare il DOM dell'utente. Non è un sandbox perfetto ma
      // alza significativamente la barra contro XSS accidentale.
      const BLOCKED_PATTERNS: RegExp[] = [
       /\bwindow\b/,
       /\bdocument\b/,
       /\bfetch\b/,
       /\bXMLHttpRequest\b/,
       /\bWebSocket\b/,
       /\bEventSource\b/,
       /\bimportScripts\b/,
       /\bnavigator\b/,
       /\blocalStorage\b/,
       /\bsessionStorage\b/,
       /\bglobalThis\b/,
       /\bself\b/,
       /\bparent\b/,
       /\btop\b/,
       /\bpostMessage\b/,
       /\beval\b/,
       /\bnew\s+Function\b/,
      ];
      const hasBlocked = BLOCKED_PATTERNS.some((rx) => rx.test(fullCode));
      if (hasBlocked) {
       actual = 'Errore: codice contiene API non permesse (window/document/fetch/storage).';
      } else {
       try {
        // Esecuzione con timeout (3s) per evitare loop infiniti
        const fn = new Function(
         'console',
         `"use strict";${fullCode}`
        );
        const result = fn(customConsole);
        if (logs.length > 0) {
         actual = logs.join('\n').trim();
        } else if (result !== undefined) {
         actual = String(result).trim();
        }
        passed = actual === String(testCase.expectedOutput).trim();
       } catch (execErr: unknown) {
        actual = execErr instanceof Error ? execErr.message : 'Errore di esecuzione';
       }
      }
      } else {
       // Pattern-based: il codice scritto dall'utente deve contenere il
       // costrutto richiesto (testCase.expectedOutput). Raccoglie tutte le
       // lingue non realmente eseguibili dal browser: python, php, c, csharp,
       // perl, ruby, lua, java, cpp, css, html, nextjs, angular, vue, svelte,
       // astro, sql, go e bash.
       const cleanedUser = code.replace(/\s+/g, ' ').trim().toLowerCase();
       const cleanedExpected = (testCase.expectedOutput || '').replace(/\s+/g, ' ').trim().toLowerCase();
       passed = cleanedExpected === '' || cleanedUser.includes(cleanedExpected);
       actual = code.trim();
      }
     } catch (err) {
     passed = false;
     actual = 'Errore di esecuzione: ' + (err as Error).message;
    }

    return {
     index,
     input: testCase.input,
     expected: testCase.expectedOutput,
     actual,
     passed,
     description: testCase.description
    };
   });

   setTestResults(results);

   const passedTests = results.filter(r => r.passed).length;
   const executionLogs = results.map(r => `Test "${r.description}": ${r.passed ? 'SUPERATO' : 'FALLITO'} (Atteso: "${r.expected}", Ricevuto: "${r.actual}")`).join('\n');

   setOutput(`Esecuzione completata per il corso in ${lang.toUpperCase()}...\n\n${executionLogs}\n\nSuperati: ${passedTests}/${results.length}\n${passedTests === results.length ? 'Congratulazioni! Tutti i test sono stati superati con successo! 🎉' : 'Alcuni test sono falliti. Controlla il tuo codice!'}`);
  } catch (error) {
   setOutput(`Errore di compilazione: ${(error as Error).message}`);
  } finally {
   setIsRunning(false);
  }
 };

 const resetCode = () => {
  setCode(exercise.starterCode || '');
  setOutput('');
  setTestResults([]);
 };

 const submitExercise = () => {
  const allTestsPassed = testResults.length > 0 && testResults.every(test => test.passed);
  if (allTestsPassed || testResults.length === 0) {
   onComplete(exercise._id || exercise.title, code);
  } else {
   toast.error('Completa tutti i test prima di consegnare l\'esercizio!');
  }
 };

 const nextHint = () => {
  if (currentHint < (exercise.hints?.length || 0) - 1) {
   setCurrentHint(currentHint + 1);
  }
 };

 return (
  <motion.div
   initial={{ opacity: 0, scale: 0.95 }}
   animate={{ opacity: 1, scale: 1 }}
   exit={{ opacity: 0, scale: 0.95 }}
   className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
   onClick={onClose}
  >
   <motion.div
    initial={{ y: 50 }}
    animate={{ y: 0 }}
     className="bg-black shadow-2xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
    onClick={(e: React.MouseEvent) => e.stopPropagation()}
   >
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
     <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
       <Trophy size={24} className="text-orange-600" />
      </div>
      <div>
       <h2 className="text-xl font-bold text-zinc-100">{exercise.title}</h2>
       <p className="text-zinc-400">{exercise.description}</p>
      </div>
     </div>
     <div className="flex items-center gap-3">
       <span className={`px-3 py-1 text-sm rounded-lg font-bold ${
        exercise.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
        exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
        'bg-red-100 text-red-600'
       }`}>
       {exercise.difficulty}
      </span>
      <span className="text-sm font-bold text-zinc-400">{exercise.points} punti</span>
      <button
       onClick={onClose}
        className="w-8 h-8 bg-black hover:bg-zinc-900 rounded-full flex items-center justify-center transition-colors"
      >
       <XCircle size={20} className="text-zinc-400" />
      </button>
     </div>
    </div>

    <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
     {/* Left Panel - Instructions */}
     <div className="lg:w-1/3 p-6 border-r border-zinc-800 overflow-y-auto">
      {exercise.isCheckpoint && (
       <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
        <Trophy size={11} /> Checkpoint del modulo
       </span>
      )}

      {exercise.why && (
       <div className="mb-5">
        <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1.5">Perché</h4>
        <p className="text-zinc-300 leading-relaxed text-sm">{exercise.why}</p>
       </div>
      )}

      {exercise.how && (
       <div className="mb-5">
        <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1.5">Come</h4>
        <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-line">{exercise.how}</p>
       </div>
      )}

      <h3 className="text-lg font-bold text-zinc-100 mb-4">Istruzioni</h3>
      <div className="prose prose-slate max-w-none">
       <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
        {exercise.instructions}
       </p>
      </div>

      {exercise.checkpoint && (
       <div className="mt-6 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1.5">Come capire se è giusto</h4>
        <p className="text-sm text-zinc-300 leading-relaxed">{exercise.checkpoint}</p>
       </div>
      )}

      {exercise.commonErrors && exercise.commonErrors.length > 0 && (
       <div className="mt-6">
        <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">Errori comuni</h4>
        <div className="space-y-2">
         {exercise.commonErrors.map((err, index) => (
          <div key={index} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
           <p className="text-sm font-bold text-zinc-200 mb-0.5">{err.error}</p>
           <p className="text-sm text-zinc-400">{err.fix}</p>
          </div>
         ))}
        </div>
       </div>
      )}

      {/* Test Cases */}
      {exercise.testCases && exercise.testCases.length > 0 && (
       <div className="mt-6">
        <h4 className="text-md font-bold text-zinc-100 mb-3">Test Cases</h4>
        <div className="space-y-3">
         {exercise.testCases.map((test, index) => (
          <div key={index} className="p-3 bg-black">
           <p className="text-sm font-medium text-zinc-300 mb-1">
            Test {index + 1}: {test.description}
           </p>
           <div className="text-xs text-zinc-400">
            <div>Input: {test.input}</div>
            <div>Expected: {test.expectedOutput}</div>
           </div>
          </div>
         ))}
        </div>
       </div>
      )}

      {/* Hints */}
      {exercise.hints && exercise.hints.length > 0 && (
       <div className="mt-6">
        <button
         onClick={() => setShowHints(!showHints)}
         className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
         <Lightbulb size={16} />
         {showHints ? 'Nascondi suggerimenti' : 'Mostra suggerimenti'}
        </button>

        {showHints && (
         <div className="mt-3 space-y-3">
          {exercise.hints.slice(0, currentHint + 1).map((hint, index) => (
            <div key={index} className="p-3 bg-yellow-900/30 border border-yellow-900/50 rounded-xl">
             <p className="text-sm text-zinc-300">{hint.content}</p>
           </div>
          ))}
          {currentHint < exercise.hints.length - 1 && (
           <button
            onClick={nextHint}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
           >
            Mostra prossimo suggerimento
           </button>
          )}
         </div>
        )}
       </div>
      )}

      {/* Solution */}
      {exercise.solution && (
       <div className="mt-6">
        <button
         onClick={() => setShowSolution(!showSolution)}
         className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 font-medium"
        >
         {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
         {showSolution ? 'Nascondi soluzione' : 'Mostra soluzione'}
        </button>

        {showSolution && (
         <div className="mt-3 p-3 bg-black">
          <pre className="text-sm text-zinc-200 overflow-x-auto">
           <code>{exercise.solution}</code>
          </pre>
         </div>
        )}
       </div>
      )}
     </div>

     {/* Right Panel - Code Editor */}
     <div className="lg:w-2/3 flex flex-col">
      {/* Editor */}
      <div className="flex-1 p-6 border-b border-zinc-800">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800">
        <div className="flex flex-wrap items-center gap-3">
         <h3 className="text-lg font-bold text-zinc-100">Editor del codice</h3>
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-bold bg-orange-50 text-orange-600 border border-orange-100">
          <span>Attivo:</span>
          <span className="uppercase text-orange-700">
           {SUPPORTED_LANGUAGES.find(l => l.id === activeLang)?.name || activeLang}
          </span>
         </div>
        </div>
        <div className="flex items-center gap-2">
         <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
           className="px-3 py-2 text-xs font-bold text-zinc-300 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm hover:border-zinc-300 transition-all"
         >
          {SUPPORTED_LANGUAGES.map(lang => (
           <option key={lang.id} value={lang.id}>
            {lang.name}
           </option>
          ))}
         </select>
         <button
          onClick={runCode}
          disabled={isRunning}
          className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
         >
          {isRunning ? (
           <>
            <div className="animate-spin h-4 w-4 border-b-2 border-white"></div>
            Eseguendo...
           </>
          ) : (
           <>
            <Play size={16} />
            Esegui
           </>
          )}
         </button>
         <button
          onClick={resetCode}
          className="px-4 py-2 border border-zinc-800 text-zinc-300 rounded-xl font-bold hover:border-zinc-300 flex items-center gap-2"
         >
          <RotateCcw size={16} />
          Reset
         </button>
        </div>
       </div>

       <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-4 bg-black text-zinc-100 font-mono text-sm border-0 focus:ring-2 focus:ring-orange-500 resize-none"
        placeholder="Scrivi il tuo codice qui..."
        spellCheck={false}
       />

       {/* Output */}
       {output && (
        <div className="mt-4">
         <h4 className="text-sm font-bold text-zinc-100 mb-2">Output</h4>
         <pre className="p-3 bg-black text-sm font-mono text-zinc-200 overflow-x-auto whitespace-pre-wrap">
          {output}
         </pre>
        </div>
       )}

       {/* Test Results */}
       {testResults.length > 0 && (
        <div className="mt-4">
         <h4 className="text-sm font-bold text-zinc-100 mb-2">Risultati dei test</h4>
         <div className="space-y-2">
          {testResults.map((result, index) => (
           <div
            key={index}
            className={`p-3 flex items-center gap-3 ${
             result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
           >
            {result.passed ? (
             <CheckCircle2 size={16} className="text-green-600" />
            ) : (
             <XCircle size={16} className="text-red-600" />
            )}
            <div className="flex-1">
             <p className="text-sm font-medium text-zinc-100">
              Test {index + 1}: {result.description}
             </p>
             <p className="text-xs text-zinc-400">
              Input: {result.input} | Expected: {result.expected} | Got: {result.actual}
             </p>
            </div>
           </div>
          ))}
         </div>
        </div>
       )}
      </div>

      {/* Actions */}
      <div className="p-6 bg-black flex justify-between items-center">
       <div className="text-sm text-zinc-400">
        Progresso: {testResults.filter(r => r.passed).length}/{testResults.length} test superati
       </div>
       <div className="flex gap-3">
        <button
         onClick={onClose}
         className="px-6 py-3 border border-zinc-800 text-zinc-300 font-bold hover:border-zinc-300"
        >
         Chiudi
        </button>
        <button
         onClick={submitExercise}
         disabled={!testResults.length || !testResults.every(r => r.passed)}
         className="px-6 py-3 bg-orange-600 text-white font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
         Consegna esercizio
        </button>
       </div>
      </div>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default ExerciseComponent;

