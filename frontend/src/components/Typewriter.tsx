import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let timer: number;

    if (isDeleting) {
      // Deleting text character by character
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      // Typing text character by character
      timer = setTimeout(() => {
        setCurrentText((prev) => word.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    // Handle switching between typing, pausing, and deleting
    if (!isDeleting && currentText === word) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="relative font-bold text-cyber-cyan glow-text-cyan tracking-wide">
      {currentText}
      <span className="animate-pulse ml-0.5 border-r-2 border-cyber-cyan">&nbsp;</span>
    </span>
  );
};

export default Typewriter;
