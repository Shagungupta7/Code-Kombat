import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const problems = [
  // EASY PROBLEMS
  {
    id: "easy_1",
    title: "Even or Odd",
    description: "Return 'Even' if the number is even, else 'Odd'.",
    inputType: "int",
    outputType: "string",
    difficulty: "Easy",
    testCases: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" }
    ]
  },
  {
    id: "easy_2",
    title: "Sum of Two Numbers",
    description: "Return the sum of two integers.",
    inputType: "int int",
    outputType: "int",
    difficulty: "Easy",
    testCases: [
      { input: "3 5", expectedOutput: "8" },
      { input: "10 -2", expectedOutput: "8" }
    ]
  },
  {
    id: "easy_3",
    title: "Find Maximum",
    description: "Return the maximum of two numbers.",
    inputType: "int int",
    outputType: "int",
    difficulty: "Easy",
    testCases: [
      { input: "7 12", expectedOutput: "12" },
      { input: "-3 -9", expectedOutput: "-3" }
    ]
  },
  {
    id: "easy_4",
    title: "Check Positive",
    description: "Return 'Positive' if number > 0, else 'Non-Positive'.",
    inputType: "int",
    outputType: "string",
    difficulty: "Easy",
    testCases: [
      { input: "5", expectedOutput: "Positive" },
      { input: "-2", expectedOutput: "Non-Positive" }
    ]
  },
  {
    id: "easy_5",
    title: "Square a Number",
    description: "Return the square of the input number.",
    inputType: "int",
    outputType: "int",
    difficulty: "Easy",
    testCases: [
      { input: "4", expectedOutput: "16" },
      { input: "-3", expectedOutput: "9" }
    ]
  },
  {
    id: "easy_6",
    title: "Check Divisible by 3",
    description: "Return 'Yes' if number is divisible by 3, else 'No'.",
    inputType: "int",
    outputType: "string",
    difficulty: "Easy",
    testCases: [
      { input: "9", expectedOutput: "Yes" },
      { input: "10", expectedOutput: "No" }
    ]
  },
  {
    id: "easy_7",
    title: "Length of String",
    description: "Return the length of the input string.",
    inputType: "string",
    outputType: "int",
    difficulty: "Easy",
    testCases: [
      { input: "hello", expectedOutput: "5" },
      { input: "", expectedOutput: "0" }
    ]
  },
  {
    id: "easy_8",
    title: "Reverse String",
    description: "Return the reverse of the input string.",
    inputType: "string",
    outputType: "string",
    difficulty: "Easy",
    testCases: [
      { input: "abc", expectedOutput: "cba" },
      { input: "race", expectedOutput: "ecar" }
    ]
  },
  {
    id: "easy_9",
    title: "Check Vowel",
    description: "Return 'Yes' if the input character is a vowel, else 'No'.",
    inputType: "char",
    outputType: "string",
    difficulty: "Easy",
    testCases: [
      { input: "a", expectedOutput: "Yes" },
      { input: "b", expectedOutput: "No" }
    ]
  },
  {
    id: "easy_10",
    title: "Absolute Value",
    description: "Return the absolute value of a number.",
    inputType: "int",
    outputType: "int",
    difficulty: "Easy",
    testCases: [
      { input: "-7", expectedOutput: "7" },
      { input: "5", expectedOutput: "5" }
    ]
  },

  // MEDIUM PROBLEMS
  {
    id: "medium_1",
    title: "Palindrome Number",
    description: "Return 'Yes' if the number is a palindrome, else 'No'.",
    inputType: "int",
    outputType: "string",
    difficulty: "Medium",
    testCases: [
      { input: "121", expectedOutput: "Yes" },
      { input: "123", expectedOutput: "No" }
    ]
  },
  {
    id: "medium_2",
    title: "Factorial",
    description: "Return the factorial of a number.",
    inputType: "int",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" }
    ]
  },
  {
    id: "medium_3",
    title: "Fibonacci Nth",
    description: "Return the Nth Fibonacci number (0-indexed).",
    inputType: "int",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "5", expectedOutput: "5" },
      { input: "0", expectedOutput: "0" }
    ]
  },
  {
    id: "medium_4",
    title: "GCD of Two Numbers",
    description: "Return the greatest common divisor of two numbers.",
    inputType: "int int",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "12 18", expectedOutput: "6" },
      { input: "7 3", expectedOutput: "1" }
    ]
  },
  {
    id: "medium_5",
    title: "LCM of Two Numbers",
    description: "Return the least common multiple of two numbers.",
    inputType: "int int",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "4 6", expectedOutput: "12" },
      { input: "5 7", expectedOutput: "35" }
    ]
  },
  {
    id: "medium_6",
    title: "Check Prime",
    description: "Return 'Yes' if number is prime, else 'No'.",
    inputType: "int",
    outputType: "string",
    difficulty: "Medium",
    testCases: [
      { input: "11", expectedOutput: "Yes" },
      { input: "12", expectedOutput: "No" }
    ]
  },
  {
    id: "medium_7",
    title: "Sum of Array",
    description: "Return the sum of integers in an array (space-separated).",
    inputType: "int[]",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "1 2 3", expectedOutput: "6" },
      { input: "5 5 5", expectedOutput: "15" }
    ]
  },
  {
    id: "medium_8",
    title: "Reverse Array",
    description: "Return the array reversed as space-separated integers.",
    inputType: "int[]",
    outputType: "string",
    difficulty: "Medium",
    testCases: [
      { input: "1 2 3", expectedOutput: "3 2 1" },
      { input: "4 5 6", expectedOutput: "6 5 4" }
    ]
  },
  {
    id: "medium_9",
    title: "Count Vowels in String",
    description: "Return the number of vowels in the input string.",
    inputType: "string",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "hello", expectedOutput: "2" },
      { input: "xyz", expectedOutput: "0" }
    ]
  },
  {
    id: "medium_10",
    title: "Sum of Digits",
    description: "Return the sum of digits of the number.",
    inputType: "int",
    outputType: "int",
    difficulty: "Medium",
    testCases: [
      { input: "123", expectedOutput: "6" },
      { input: "456", expectedOutput: "15" }
    ]
  },

  // HARD PROBLEMS
  {
    id: "hard_1",
    title: "Power of Number",
    description: "Return x raised to the power y.",
    inputType: "int int",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "2 3", expectedOutput: "8" },
      { input: "5 0", expectedOutput: "1" }
    ]
  },
  {
    id: "hard_2",
    title: "Count Primes in Range",
    description: "Return the number of primes between a and b (inclusive).",
    inputType: "int int",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "1 10", expectedOutput: "4" },
      { input: "10 20", expectedOutput: "4" }
    ]
  },
  {
    id: "hard_3",
    title: "Longest Palindrome Substring",
    description: "Return the length of the longest palindrome substring.",
    inputType: "string",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "babad", expectedOutput: "3" },
      { input: "cbbd", expectedOutput: "2" }
    ]
  },
  {
    id: "hard_4",
    title: "Matrix Diagonal Sum",
    description: "Return the sum of the main diagonal of a square matrix (space-separated rows).",
    inputType: "int[][]",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "1 2 3\n4 5 6\n7 8 9", expectedOutput: "15" },
      { input: "1 0 0\n0 1 0\n0 0 1", expectedOutput: "3" }
    ]
  },
  {
    id: "hard_5",
    title: "Merge Sorted Arrays",
    description: "Return the merged sorted array (space-separated).",
    inputType: "int[] int[]",
    outputType: "string",
    difficulty: "Hard",
    testCases: [
      { input: "1 3 5 2 4 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "10 20 5 15", expectedOutput: "5 10 15 20" }
    ]
  },
  {
    id: "hard_6",
    title: "Find Missing Number",
    description: "Return the missing number from 1 to n in array.",
    inputType: "int[]",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "1 2 4 5", expectedOutput: "3" },
      { input: "2 3 4 5", expectedOutput: "1" }
    ]
  },
  {
    id: "hard_7",
    title: "Stock Buy & Sell",
    description: "Return max profit from one buy/sell of prices array.",
    inputType: "int[]",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "7 1 5 3 6 4", expectedOutput: "5" },
      { input: "7 6 4 3 1", expectedOutput: "0" }
    ]
  },
  {
    id: "hard_8",
    title: "String Compression",
    description: "Return the run-length encoded string.",
    inputType: "string",
    outputType: "string",
    difficulty: "Hard",
    testCases: [
      { input: "aaabbc", expectedOutput: "a3b2c1" },
      { input: "abcd", expectedOutput: "a1b1c1d1" }
    ]
  },
  {
    id: "hard_9",
    title: "Max Subarray Sum",
    description: "Return maximum sum of contiguous subarray.",
    inputType: "int[]",
    outputType: "int",
    difficulty: "Hard",
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1 2 3 4", expectedOutput: "10" }
    ]
  }
];

export const seedProblems = async () => {
  for (let p of problems) {
    const docRef = doc(db, "Problems", p.id);
    await setDoc(docRef, p);
    console.log(`✅ Added problem: ${p.title}`);
  }
};