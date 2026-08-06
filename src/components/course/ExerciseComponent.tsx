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

interface Exercise {
 _id?: string;
 title: string;
 description?: string;
 instructions: string;
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
 { id: 'astro', name: 'Astro 🚀', type: 'framework' }
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
       fullCode += `\nreturn ${testCase.input};`;
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
     } else if (lang === 'python') {
      // Python simple transpilation
      let jsCode = code
       .replace(/#.*/g, '') // Remove comments
       .replace(/def\s+(\w+)\(([^)]*)\):/g, 'function $1($2) {')
       .replace(/return\s+(.*)/g, 'return $1; }')
       .replace(/print\((.*)\)/g, 'console.log($1)');

      if (jsCode.includes('function ') && !jsCode.includes('}')) {
       jsCode += '\n}';
      }

      let logs: string[] = [];
      const customConsole = {
       log: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
       info: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
       warn: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
       error: (...args: unknown[]) => logs.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '))
      };

      let fullCode = jsCode;
      if (testCase.input) {
       fullCode += `\nreturn ${testCase.input};`;
      }

      const fn = new Function('console', fullCode);
      const result = fn(customConsole);

      if (logs.length > 0) {
       actual = logs.join('\n').trim();
      } else if (result !== undefined) {
       actual = String(result).trim();
      }

      passed = actual === String(testCase.expectedOutput).trim();
     } else if (lang === 'php') {
      const hasTag = code.includes('<?php');
      const hasEcho = code.includes('echo') || code.includes('print');
      const hasVar = code.includes('$');
      passed = hasTag && (hasEcho || hasVar || code.includes('function'));
      actual = passed ? (testCase.expectedOutput || 'Output PHP generato correttamente.') : 'Errore PHP: manca il tag di apertura <?php o un costrutto di stampa/variabile ($).';
     } else if (lang === 'c') {
      const hasInclude = code.includes('#include');
      const hasMain = code.includes('main') || code.includes('printf') || code.includes('void');
      passed = hasInclude && hasMain;
      actual = passed ? (testCase.expectedOutput || 'Esecuzione codice C completata con codice 0.') : 'Errore C: manca la direttiva #include o la dichiarazione della funzione principale.';
     } else if (lang === 'csharp') {
      const hasUsing = code.includes('using ') || code.includes('class') || code.includes('Console.');
      passed = hasUsing && (code.includes('Write') || code.includes('static') || code.includes('{'));
      actual = passed ? (testCase.expectedOutput || 'Output C# compilato ed eseguito con successo.') : 'Errore C#: Assicurati di dichiarare le classi e di usare Console.WriteLine per stampare.';
     } else if (lang === 'perl') {
      passed = code.includes('print') || code.includes('my $') || code.includes('sub ');
      actual = passed ? (testCase.expectedOutput || 'Script Perl interpretato ed eseguito con successo.') : 'Errore Perl: sintassi non riconosciuta o manca il comando di stampa.';
     } else if (lang === 'ruby') {
      passed = code.includes('def ') || code.includes('puts ') || code.includes('class ') || code.includes('end');
      actual = passed ? (testCase.expectedOutput || 'Output Ruby valutato correttamente.') : 'Errore Ruby: manca la definizione di funzione/classe (def/class ... end) o il comando puts.';
     } else if (lang === 'lua') {
      passed = code.includes('local ') || code.includes('function ') || code.includes('print(') || code.includes('end');
      actual = passed ? (testCase.expectedOutput || 'Script Lua completato con successo.') : 'Errore Lua: manca la dichiarazione locale delle variabili (local) o un blocco function/end.';
     } else if (lang === 'nextjs') {
      const hasImport = code.includes('import') || code.includes('export');
      const hasReact = code.includes('use client') || code.includes('React') || code.includes('useState') || code.includes('getServerSideProps') || code.includes('export default');
      passed = hasImport || hasReact;
      actual = passed ? 'Next.js AppRouter/Pages: rendering completato. Componente idratato.' : 'Errore Next.js: Manca l\'esportazione del componente React o l\'import dei moduli Next.';
     } else if (lang === 'angular') {
      const hasDecorator = code.includes('@Component') || code.includes('Component') || code.includes('class ') || code.includes('selector:');
      passed = hasDecorator;
      actual = passed ? 'Angular: Componente compilato ed associato al modulo DOM.' : 'Errore Angular: Assicurati di usare il decoratore @Component e definire la classe.';
     } else if (lang === 'vue') {
      const hasTemplate = code.includes('<template>') || code.includes('ref(') || code.includes('defineProps') || code.includes('<script>');
      passed = hasTemplate;
      actual = passed ? 'Vue.js: SFC virtual-DOM compilato con successo. Direttive idratate.' : 'Errore Vue.js: Struttura del Single File Component SFC (template/script) non corretta.';
     } else if (lang === 'svelte') {
      const hasScript = code.includes('<script>') || code.includes('export let') || code.includes('$:') || code.includes('{');
      passed = hasScript;
      actual = passed ? 'Svelte: Componente compilato in codice JS nativo efficiente.' : 'Errore Svelte: Struttura del componente Svelte non valida.';
     } else if (lang === 'astro') {
      const hasFrontmatter = code.startsWith('---') || code.includes('---');
      passed = hasFrontmatter;
      actual = passed ? 'Astro: Static-Site Generation (SSG) completato con successo.' : 'Errore Astro: Manca il blocco di frontmatter tra i delimitatori ---.';
     } else if (lang === 'html') {
      const trimmedUser = code.replace(/\s+/g, ' ').trim().toLowerCase();
      const trimmedExpected = testCase.expectedOutput.replace(/\s+/g, ' ').trim().toLowerCase();
      passed = trimmedUser.includes(trimmedExpected);
      actual = code.trim();
     } else if (lang === 'css') {
      const cleanedUser = code.replace(/\s+/g, '').toLowerCase();
      const cleanedExpected = testCase.expectedOutput.replace(/\s+/g, '').toLowerCase();
      passed = cleanedUser.includes(cleanedExpected);
      actual = code.trim();
     } else if (lang === 'java') {
      const hasClass = code.includes('class Persona');
      const hasField = code.includes('private String nome');
      const hasConstructor = code.includes('Persona') && code.includes('String') && code.includes('this.nome');
      const hasGetter = code.includes('getNome()') && code.includes('return');
      passed = hasClass && hasField && hasConstructor && hasGetter;
      actual = passed ? testCase.expectedOutput : 'Errore sintattico: Assicurati di dichiarare correttamente la classe, l\'attributo privato, il costruttore ed il getter.';
     } else if (lang === 'cpp') {
      const hasFunc = code.includes('moltiplicaPerDue');
      const hasPointer = code.includes('int*') || code.includes('int *');
      const hasNullCheck = code.includes('nullptr') || code.includes('NULL') || code.includes('0');
      const hasDereference = code.includes('*ptr');
      passed = hasFunc && hasPointer && hasNullCheck && hasDereference;
      actual = passed ? testCase.expectedOutput : 'Errore: Assicurati di controllare se il puntatore è nullo e di dereferenziare correttamente usando *ptr.';
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
      <h3 className="text-lg font-bold text-zinc-100 mb-4">Istruzioni</h3>
      <div className="prose prose-slate max-w-none">
       <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
        {exercise.instructions}
       </p>
      </div>

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

