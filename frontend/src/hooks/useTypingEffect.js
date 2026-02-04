import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useTypingEffect = (sentences = [], speed = 0.06) => {
  const elementRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current || sentences.length === 0) return;

    // Kill previous animation if exists
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const element = elementRef.current;
    timelineRef.current = gsap.timeline({ repeat: -1 });

    // Loop through each sentence
    sentences.forEach((sentence, sentenceIndex) => {
      const chars = sentence.split('');

      // Typing animation
      chars.forEach((char, charIndex) => {
        timelineRef.current.to(
          element,
          {
            duration: speed,
            onComplete: () => {
              element.textContent = sentence.substring(0, charIndex + 1) + ' |';
            },
          },
          `+=${charIndex === 0 ? 0 : speed}`
        );
      });

      // Pause at end of sentence
      timelineRef.current.to({}, { duration: 1.5 }, `+=${speed}`);

      // Deleting animation (backspace)
      for (let i = chars.length; i > 0; i--) {
        timelineRef.current.to(
          element,
          {
            duration: speed * 0.7,
            onComplete: () => {
              element.textContent = sentence.substring(0, i - 1) + ' |';
            },
          },
          `+=${speed * 0.7}`
        );
      }

      // Pause between sentences
      timelineRef.current.to({}, { duration: 0.5 }, `+=${speed * 0.7}`);
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [sentences, speed]);

  return elementRef;
};
