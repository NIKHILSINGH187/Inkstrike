import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomWords } from '../data/words';
import { getRandomQuote } from '../data/quotes';
import { getRandomSnippet } from '../data/codeSnippets';
import { getLearningLevel } from '../data/learningLevels';
import { soundEngine } from '../audio/soundEngine';

export function useTypingEngine({
  mode = 'time',
  timeLimit = 30,
  wordLimit = 25,
  quoteLength = 'all',
  codeLang = 'all',
  learnLevel = 1,
  punctuation = false,
  numbers = false,
  soundEnabled = true,
  screenShakeEnabled = true,
  onStreakMilestone = null
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'finished'
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedHistory, setTypedHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Real-time metrics
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [shake, setShake] = useState(false);

  // Analytics data collected during test
  const [timeline, setTimeline] = useState([]); // [{ second, wpm, raw, errors }]
  const [weakKeys, setWeakKeys] = useState({}); // { [key]: errorCount }
  const [quoteMeta, setQuoteMeta] = useState(null);
  const [codeMeta, setCodeMeta] = useState(null);

  // Counters tracked via refs for synchronous accuracy inside timers
  const statsRef = useRef({
    totalCharsTyped: 0,
    correctCharsTyped: 0,
    errorCharsTyped: 0,
    startTime: null,
    wpmHistory: [],
    recentErrors: 0
  });

  const timerRef = useRef(null);

  // Initialize or Reset Test
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setStatus('idle');
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedHistory([]);
    setTimeLeft(timeLimit);
    setElapsedSeconds(0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setStreak(0);
    setHighestStreak(0);
    setTimeline([]);
    setWeakKeys({});
    setShake(false);

    statsRef.current = {
      totalCharsTyped: 0,
      correctCharsTyped: 0,
      errorCharsTyped: 0,
      startTime: null,
      wpmHistory: [],
      recentErrors: 0
    };

    if (mode === 'quote') {
      const q = getRandomQuote(quoteLength);
      setQuoteMeta(q);
      setWords(q.text.split(' '));
    } else if (mode === 'code') {
      const s = getRandomSnippet(codeLang);
      setCodeMeta(s);
      setWords(s.code.split(' '));
    } else if (mode === 'words') {
      setWords(getRandomWords(wordLimit, { punctuation, numbers }));
      setQuoteMeta(null);
      setCodeMeta(null);
    } else if (mode === 'learn') {
      const level = getLearningLevel(learnLevel);
      setWords(level.words);
      setQuoteMeta(null);
      setCodeMeta(null);
    } else {
      // time, zen, or sudden_death
      setWords(getRandomWords(80, { punctuation, numbers }));
      setQuoteMeta(null);
      setCodeMeta(null);
    }
  }, [mode, timeLimit, wordLimit, quoteLength, codeLang, learnLevel, punctuation, numbers]);

  // Initial load
  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Finish test
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('finished');
    soundEngine.playBell();
  }, []);

  // Timer Tick (every second)
  useEffect(() => {
    if (status !== 'running') return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prevElapsed => {
        const nextElapsed = prevElapsed + 1;
        const minutes = nextElapsed / 60;
        const { totalCharsTyped, correctCharsTyped, recentErrors } = statsRef.current;

        const currentRaw = minutes > 0 ? Math.round((totalCharsTyped / 5) / minutes) : 0;
        const currentNet = minutes > 0 ? Math.round((correctCharsTyped / 5) / minutes) : 0;
        const currentAcc = totalCharsTyped > 0 ? Math.round((correctCharsTyped / totalCharsTyped) * 100) : 100;

        setRawWpm(currentRaw);
        setWpm(currentNet);
        setAccuracy(currentAcc);

        // Record timeline point
        setTimeline(prev => [
          ...prev,
          {
            second: nextElapsed,
            wpm: currentNet,
            raw: currentRaw,
            errors: recentErrors
          }
        ]);
        statsRef.current.recentErrors = 0;
        statsRef.current.wpmHistory.push(currentNet);

        // Mode time checks
        if (mode === 'time' || mode === 'sudden_death') {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              finishTest();
              return 0;
            }
            return prevTime - 1;
          });
        }

        return nextElapsed;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, mode, finishTest]);

  // Start running when first character is pressed
  const startRunning = useCallback(() => {
    if (status === 'idle') {
      setStatus('running');
      statsRef.current.startTime = Date.now();
    }
  }, [status]);

  // Handle Keystrokes
  const handleInput = useCallback((val) => {
    if (status === 'finished') return;

    if (status === 'idle' && val.length > 0) {
      startRunning();
    }

    const currentWord = words[currentWordIndex] || '';

    // Handle space: submit word and advance
    if (val.endsWith(' ')) {
      const trimmed = val.trim();
      if (trimmed.length > 0 || currentWordIndex > 0) {
        const isWordCorrect = trimmed === currentWord;
        setTypedHistory(prev => [
          ...prev,
          { original: currentWord, typed: trimmed, isCorrect: isWordCorrect }
        ]);

        // Check if more words need to be appended in time/zen mode
        if (currentWordIndex >= words.length - 10 && (mode === 'time' || mode === 'zen')) {
          setWords(prev => [...prev, ...getRandomWords(40, { punctuation, numbers })]);
        }

        // Check test completion conditions
        if (
          (mode === 'words' && currentWordIndex + 1 >= wordLimit) ||
          ((mode === 'quote' || mode === 'code' || mode === 'learn') && currentWordIndex + 1 >= words.length)
        ) {
          setCurrentInput('');
          finishTest();
          return;
        }

        setCurrentWordIndex(prev => prev + 1);
        setCurrentInput('');
        soundEngine.playKey(false);
        return;
      }
    }

    // Detecting backspace vs key typing
    const isBackspace = val.length < currentInput.length;
    if (isBackspace) {
      setCurrentInput(val);
      soundEngine.playKey(false);
      return;
    }

    // A new character was typed
    const charIndex = val.length - 1;
    const typedChar = val[charIndex];
    const expectedChar = currentWord[charIndex];
    const isCorrect = typedChar === expectedChar;

    statsRef.current.totalCharsTyped += 1;

    if (isCorrect) {
      statsRef.current.correctCharsTyped += 1;
      setStreak(prev => {
        const next = prev + 1;
        setHighestStreak(h => Math.max(h, next));
        if (next % 25 === 0 && onStreakMilestone) {
          onStreakMilestone(next);
        }
        return next;
      });
      soundEngine.playKey(false);
    } else {
      statsRef.current.errorCharsTyped += 1;
      statsRef.current.recentErrors += 1;
      setStreak(0);

      // Track weak key in heatmap
      if (expectedChar) {
        setWeakKeys(prev => ({
          ...prev,
          [expectedChar.toLowerCase()]: (prev[expectedChar.toLowerCase()] || 0) + 1
        }));
      }

      // Play error sound and trigger screen shake
      soundEngine.playKey(true);
      if (screenShakeEnabled) {
        setShake(true);
        setTimeout(() => setShake(false), 200);
      }

      // Sudden death check
      if (mode === 'sudden_death') {
        finishTest();
        return;
      }
    }

    setCurrentInput(val);
  }, [
    status,
    words,
    currentWordIndex,
    currentInput,
    mode,
    wordLimit,
    punctuation,
    numbers,
    screenShakeEnabled,
    onStreakMilestone,
    startRunning,
    finishTest
  ]);

  // Calculate consistency (% variance)
  const calculateConsistency = useCallback(() => {
    const history = statsRef.current.wpmHistory;
    if (history.length < 2) return 100;
    const mean = history.reduce((a, b) => a + b, 0) / history.length;
    if (mean === 0) return 100;
    const variance = history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    return Math.max(0, Math.min(100, Math.round(100 - cv)));
  }, []);

  return {
    status,
    words,
    currentWordIndex,
    currentInput,
    typedHistory,
    timeLeft,
    elapsedSeconds,
    wpm,
    rawWpm,
    accuracy,
    streak,
    highestStreak,
    timeline,
    weakKeys,
    quoteMeta,
    codeMeta,
    shake,
    totalCharsTyped: statsRef.current.totalCharsTyped,
    correctCharsTyped: statsRef.current.correctCharsTyped,
    errorCharsTyped: statsRef.current.errorCharsTyped,
    consistency: calculateConsistency(),
    handleInput,
    resetTest
  };
}
