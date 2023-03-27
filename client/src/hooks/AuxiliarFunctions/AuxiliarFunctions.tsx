export const ToAcronym = ({ username }: { username: string }) => {
  const words = username.split(' ');
  const firstTwoWords = words.slice(0, 2);
  const upperCaseLetters = firstTwoWords
    .map((word) => word.charAt(0).toUpperCase());

  return upperCaseLetters;
}

export const ToCapitalLetter = ({ username }: { username: string }) => {
  const words = username.split(' ');
  const wordsWithCapital = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const textWithCapital = wordsWithCapital.join(' ');

  return textWithCapital;
}

const AuxiliarFunctions = {
  ToAcronym,
  ToCapitalLetter
};

export default AuxiliarFunctions;