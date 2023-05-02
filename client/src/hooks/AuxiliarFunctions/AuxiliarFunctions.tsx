import { useEffect, useState } from 'react';

export const firstWord = ({ text }: { text: string }) => {
  const firstWord = text.split(" ")[0];

  return firstWord;
}

export const wordsToAcronym = ({ text }: { text: string }) => {
  const words = text.split(' ');
  const firstTwoWords = words.slice(0, 2);
  const upperCaseLetters = firstTwoWords
    .map((word) => word.charAt(0).toUpperCase());

  return upperCaseLetters;
}

export const wordsToCapitalLetter = ({ text }: { text: string }) => {
  const words = text.split(' ');
  const wordsWithCapital = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const textWithCapital = wordsWithCapital.join(' ');

  return textWithCapital;
}

const GetWindowDimensions = () => {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  };
  return {
    width: 0,
    height: 0
  };
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    GetWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      if (typeof window !== 'undefined') {
        setWindowDimensions(GetWindowDimensions());
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}