import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const problems = [
// -------------------- EASY --------------------
  {
    id: "easy_1",
    title: "Sum of Two Numbers",
    description: "Given two integers, return their sum.",
    difficulty: "easy",
    testCases: [
      { input: "4 7", expectedOutput: "11" },
      { input: "-3 5", expectedOutput: "2" },
      { input: "0 0", expectedOutput: "0" },
    ],
  },
  {
    id: "easy_2",
    title: "Multiply Two Numbers",
    description: "Given two integers, return their product.",
    difficulty: "easy",
    testCases: [
      { input: "3 4", expectedOutput: "12" },
      { input: "-2 6", expectedOutput: "-12" },
      { input: "0 99", expectedOutput: "0" },
    ],
  },
  {
    id: "easy_3",
    title: "Find Maximum",
    description: "Return the maximum of two numbers.",
    difficulty: "easy",
    testCases: [
      { input: "3 9", expectedOutput: "9" },
      { input: "7 2", expectedOutput: "7" },
      { input: "-1 -5", expectedOutput: "-1" },
    ],
  },
  {
    id: "easy_4",
    title: "Even or Odd",
    description: "Return 'Even' if the number is even, else 'Odd'.",
    difficulty: "easy",
    testCases: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
      { input: "0", expectedOutput: "Even" },
    ],
  },
  {
    id: "easy_5",
    title: "Sum of Digits",
    description: "Return the sum of digits of a given number.",
    difficulty: "easy",
    testCases: [
      { input: "123", expectedOutput: "6" },
      { input: "987", expectedOutput: "24" },
      { input: "1001", expectedOutput: "2" },
    ],
  },
  {
    id: "easy_6",
    title: "Reverse String",
    description: "Reverse the given string.",
    difficulty: "easy",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "abc", expectedOutput: "cba" },
      { input: "a", expectedOutput: "a" },
    ],
  },
  {
    id: "easy_7",
    title: "Check Palindrome",
    description: "Return 'Yes' if the string is a palindrome, else 'No'.",
    difficulty: "easy",
    testCases: [
      { input: "madam", expectedOutput: "Yes" },
      { input: "racecar", expectedOutput: "Yes" },
      { input: "hello", expectedOutput: "No" },
    ],
  },
  {
    id: "easy_8",
    title: "Count Vowels",
    description: "Count the number of vowels in a string.",
    difficulty: "easy",
    testCases: [
      { input: "hello", expectedOutput: "2" },
      { input: "xyz", expectedOutput: "0" },
      { input: "aeiou", expectedOutput: "5" },
    ],
  },
  {
    id: "easy_9",
    title: "Square a Number",
    description: "Return the square of a given number.",
    difficulty: "easy",
    testCases: [
      { input: "5", expectedOutput: "25" },
      { input: "-3", expectedOutput: "9" },
      { input: "0", expectedOutput: "0" },
    ],
  },
  {
    id: "easy_10",
    title: "Find Factorial",
    description: "Return the factorial of a given number.",
    difficulty: "easy",
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "3", expectedOutput: "6" },
    ],
  },

  // -------------------- MEDIUM --------------------
  {
    id: "medium_1",
    title: "Fibonacci Number",
    description: "Return the Nth Fibonacci number.",
    difficulty: "medium",
    testCases: [
      { input: "5", expectedOutput: "5" },
      { input: "7", expectedOutput: "13" },
      { input: "1", expectedOutput: "1" },
    ],
  },
  {
    id: "medium_2",
    title: "Sum of Array",
    description: "Return the sum of all elements in the array.",
    difficulty: "medium",
    testCases: [
      { input: "1 2 3 4 5", expectedOutput: "15" },
      { input: "10 10 10", expectedOutput: "30" },
      { input: "-1 -2 -3", expectedOutput: "-6" },
    ],
  },
  {
    id: "medium_3",
    title: "Find Second Largest",
    description: "Return the second largest number in an array.",
    difficulty: "medium",
    testCases: [
      { input: "1 2 3 4", expectedOutput: "3" },
      { input: "10 5 20", expectedOutput: "10" },
      { input: "9 9 9 9", expectedOutput: "9" },
    ],
  },
  {
    id: "medium_4",
    title: "Check Prime",
    description: "Return 'Yes' if the number is prime, else 'No'.",
    difficulty: "medium",
    testCases: [
      { input: "7", expectedOutput: "Yes" },
      { input: "9", expectedOutput: "No" },
      { input: "2", expectedOutput: "Yes" },
    ],
  },
  {
    id: "medium_5",
    title: "Count Words",
    description: "Count the number of words in a sentence.",
    difficulty: "medium",
    testCases: [
      { input: "hello world", expectedOutput: "2" },
      { input: "this is a test", expectedOutput: "4" },
      { input: "one", expectedOutput: "1" },
    ],
  },
  {
    id: "medium_6",
    title: "GCD of Two Numbers",
    description: "Return the greatest common divisor of two numbers.",
    difficulty: "medium",
    testCases: [
      { input: "8 12", expectedOutput: "4" },
      { input: "100 25", expectedOutput: "25" },
      { input: "7 9", expectedOutput: "1" },
    ],
  },
  {
    id: "medium_7",
    title: "Find Missing Number",
    description:
      "Given N-1 integers from 1 to N, find the missing number in the sequence.",
    difficulty: "medium",
    testCases: [
      { input: "1 2 4 5", expectedOutput: "3" },
      { input: "2 3 1 6 5", expectedOutput: "4" },
      { input: "1", expectedOutput: "2" },
    ],
  },
  {
    id: "medium_8",
    title: "Reverse Words",
    description: "Reverse the order of words in a sentence.",
    difficulty: "medium",
    testCases: [
      { input: "hello world", expectedOutput: "world hello" },
      { input: "I love JS", expectedOutput: "JS love I" },
      { input: "a b c", expectedOutput: "c b a" },
    ],
  },
  {
    id: "medium_9",
    title: "Check Anagram",
    description: "Return 'Yes' if two strings are anagrams, else 'No'.",
    difficulty: "medium",
    testCases: [
      { input: "listen silent", expectedOutput: "Yes" },
      { input: "hello world", expectedOutput: "No" },
      { input: "race care", expectedOutput: "Yes" },
    ],
  },
  {
    id: "medium_10",
    title: "Binary to Decimal",
    description: "Convert a binary number to decimal.",
    difficulty: "medium",
    testCases: [
      { input: "1010", expectedOutput: "10" },
      { input: "111", expectedOutput: "7" },
      { input: "0", expectedOutput: "0" },
    ],
  },

  // -------------------- HARD --------------------
  {
    id: "hard_1",
    title: "Longest Common Prefix",
    description:
      "Given N strings, return the longest common prefix among them.",
    difficulty: "hard",
    testCases: [
      { input: "flower flow flight", expectedOutput: "fl" },
      { input: "dog racecar car", expectedOutput: "" },
      { input: "apple app apt", expectedOutput: "ap" },
    ],
  },
  {
    id: "hard_2",
    title: "Nth Prime Number",
    description: "Return the Nth prime number.",
    difficulty: "hard",
    testCases: [
      { input: "1", expectedOutput: "2" },
      { input: "5", expectedOutput: "11" },
      { input: "10", expectedOutput: "29" },
    ],
  },
  {
    id: "hard_3",
    title: "Power of Number",
    description:
      "Given base and exponent, return base raised to the power exponent.",
    difficulty: "hard",
    testCases: [
      { input: "2 10", expectedOutput: "1024" },
      { input: "3 3", expectedOutput: "27" },
      { input: "5 0", expectedOutput: "1" },
    ],
  },
  {
    id: "hard_4",
    title: "Count Inversions",
    description: "Count number of inversions in an array.",
    difficulty: "hard",
    testCases: [
      { input: "1 20 6 4 5", expectedOutput: "5" },
      { input: "2 4 1 3 5", expectedOutput: "3" },
      { input: "1 2 3", expectedOutput: "0" },
    ],
  },
  {
    id: "hard_5",
    title: "Valid Parentheses",
    description:
      "Return 'Yes' if parentheses are valid, otherwise 'No'.",
    difficulty: "hard",
    testCases: [
      { input: "()[]{}", expectedOutput: "Yes" },
      { input: "(]", expectedOutput: "No" },
      { input: "({[]})", expectedOutput: "Yes" },
    ],
  },
  {
    id: "hard_6",
    title: "Maze Paths",
    description:
      "Given N x N grid, count number of paths from top-left to bottom-right (move only right or down).",
    difficulty: "hard",
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" },
    ],
  },
  {
    id: "hard_7",
    title: "Subarray Sum Equals K",
    description:
      "Given an array and integer K, count the number of subarrays whose sum equals K.",
    difficulty: "hard",
    testCases: [
      { input: "1 1 1 2", expectedOutput: "2" },
      { input: "1 2 3", expectedOutput: "2" },
      { input: "3 3 3", expectedOutput: "2" },
    ],
  },
  {
    id: "hard_8",
    title: "Longest Palindromic Substring",
    description: "Return the longest palindromic substring.",
    difficulty: "hard",
    testCases: [
      { input: "babad", expectedOutput: "bab" },
      { input: "cbbd", expectedOutput: "bb" },
      { input: "a", expectedOutput: "a" },
    ],
  },
  {
    id: "hard_9",
    title: "Word Ladder Steps",
    description:
      "Given begin and end words and dictionary, return min transformation steps (each step changes one letter).",
    difficulty: "hard",
    testCases: [
      { input: "hit cog hot dot dog lot log cog", expectedOutput: "5" },
      { input: "a c a b b c", expectedOutput: "2" },
      { input: "abc xyz", expectedOutput: "0" },
    ],
  },
  {
    id: "hard_10",
    title: "Matrix Spiral Print",
    description:
      "Given N x N matrix, print elements in spiral order.",
    difficulty: "hard",
    testCases: [
      { input: "1 2 3 4 5 6 7 8 9", expectedOutput: "1 2 3 6 9 8 7 4 5" },
      { input: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16", expectedOutput: "1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10" },
      { input: "1", expectedOutput: "1" },
    ],
  },
];

export const seedProblems = async () => {
  for (let p of problems) {
    const docRef = doc(db, "NewProblems", p.id);
    await setDoc(docRef, p);
    console.log(`✅ Added problem: ${p.title}`);
  }
};