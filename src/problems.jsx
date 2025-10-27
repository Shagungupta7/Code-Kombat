import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const problems = [
  {
    "id": "hard_1",
    "title": "Nth Prime Number",
    "description": "Return the nth prime number.",
    "difficulty": "Hard",
    "inputType": "int",
    "outputType": "int",
    "testCases": [
      { "input": "5", "expectedOutput": "11" },
      { "input": "10", "expectedOutput": "29" }
    ]
  },
  {
    "id": "hard_2",
    "title": "GCD of Two Numbers",
    "description": "Return the greatest common divisor of two numbers.",
    "difficulty": "Hard",
    "inputType": "string",
    "outputType": "int",
    "testCases": [
      { "input": "20 8", "expectedOutput": "4" },
      { "input": "18 12", "expectedOutput": "6" }
    ]
  },
  {
    "id": "hard_3",
    "title": "Sum of Digits Until Single",
    "description": "Keep summing digits until a single-digit number is obtained.",
    "difficulty": "Hard",
    "inputType": "int",
    "outputType": "int",
    "testCases": [
      { "input": "9875", "expectedOutput": "2" },
      { "input": "12345", "expectedOutput": "6" }
    ]
  },
  {
    "id": "hard_4",
    "title": "Binary to Decimal",
    "description": "Convert a binary string to decimal number.",
    "difficulty": "Hard",
    "inputType": "string",
    "outputType": "int",
    "testCases": [
      { "input": "1010", "expectedOutput": "10" },
      { "input": "1111", "expectedOutput": "15" }
    ]
  },
  {
    "id": "hard_5",
    "title": "Decimal to Binary",
    "description": "Convert a decimal number to binary string.",
    "difficulty": "Hard",
    "inputType": "int",
    "outputType": "string",
    "testCases": [
      { "input": "10", "expectedOutput": "1010" },
      { "input": "7", "expectedOutput": "111" }
    ]
  },
  {
    "id": "hard_6",
    "title": "Count Words",
    "description": "Return the number of words in a string.",
    "difficulty": "Hard",
    "inputType": "string",
    "outputType": "int",
    "testCases": [
      { "input": "Hello world", "expectedOutput": "2" },
      { "input": "This is a test", "expectedOutput": "4" }
    ]
  },
  {
    "id": "hard_7",
    "title": "Power of Number",
    "description": "Return a^b without using built-in power functions.",
    "difficulty": "Hard",
    "inputType": "string",
    "outputType": "int",
    "testCases": [
      { "input": "2 3", "expectedOutput": "8" },
      { "input": "5 4", "expectedOutput": "625" }
    ]
  },
  {
    "id": "hard_8",
    "title": "Longest Word in String",
    "description": "Return the longest word from a sentence.",
    "difficulty": "Hard",
    "inputType": "string",
    "outputType": "string",
    "testCases": [
      { "input": "I love programming", "expectedOutput": "programming" },
      { "input": "Time and tide wait for none", "expectedOutput": "programming" }
    ]
  },
  {
    "id": "hard_9",
    "title": "Anagram Check",
    "description": "Return 'Yes' if two strings are anagrams, else 'No'.",
    "difficulty": "Hard",
    "inputType": "string",
    "outputType": "string",
    "testCases": [
      { "input": "listen silent", "expectedOutput": "Yes" },
      { "input": "hello world", "expectedOutput": "No" }
    ]
  },
  {
    "id": "hard_10",
    "title": "Sum of Diagonal in Matrix",
    "description": "Return the sum of both diagonals in a square matrix.",
    "difficulty": "Hard",
    "inputType": "array",
    "outputType": "int",
    "testCases": [
      { "input": "[[1,2,3],[4,5,6],[7,8,9]]", "expectedOutput": "30" },
      { "input": "[[2,0,0],[0,2,0],[0,0,2]]", "expectedOutput": "12" }
    ]
  }
];


export const seedProblems = async () => {
  for (let p of problems) {
    const docRef = doc(db, "NewProblems", p.id);
    await setDoc(docRef, p);
    console.log(`✅ Added problem: ${p.title}`);
  }
};