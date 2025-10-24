import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const problems = [
{
    id: "hard_1",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    difficulty: "hard",
  },
  {
    id: "hard_2",
    title: "Median of Two Sorted Arrays",
    description: "Find the median of two sorted arrays.",
    sampleInput: "[1,3], [2]",
    sampleOutput: "2",
    difficulty: "hard",
  },
  {
    id: "hard_3",
    title: "Longest Palindromic Substring",
    description: "Return the longest palindromic substring in a string.",
    sampleInput: "babad",
    sampleOutput: "bab",
    difficulty: "hard",
  },
  {
    id: "hard_4",
    title: "Trapping Rain Water",
    description: "Calculate how much water can be trapped between bars.",
    sampleInput: "[0,1,0,2,1,0,1,3,2,1,2,1]",
    sampleOutput: "6",
    difficulty: "hard",
  },
  {
    id: "hard_5",
    title: "Word Ladder",
    description: "Find shortest transformation sequence from start word to end word.",
    sampleInput: '"hit","cog", ["hot","dot","dog","lot","log","cog"]',
    sampleOutput: "5",
    difficulty: "hard",
  },
  {
    id: "hard_6",
    title: "Minimum Window Substring",
    description: "Find the minimum window in a string containing all characters of another string.",
    sampleInput: '"ADOBECODEBANC","ABC"',
    sampleOutput: "BANC",
    difficulty: "hard",
  },
  {
    id: "hard_7",
    title: "Decode String",
    description: "Given an encoded string, return its decoded form.",
    sampleInput: '"3[a]2[bc]"',
    sampleOutput: "aaabcbc",
    difficulty: "hard",
  },
  {
    id: "hard_8",
    title: "Word Search",
    description: "Check if a word exists in a 2D grid.",
    sampleInput: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"',
    sampleOutput: "true",
    difficulty: "hard",
  },
  {
    id: "hard_9",
    title: "Largest Rectangle in Histogram",
    description: "Find the area of the largest rectangle in a histogram.",
    sampleInput: "[2,1,5,6,2,3]",
    sampleOutput: "10",
    difficulty: "hard",
  },
  {
    id: "hard_10",
    title: "Serialize and Deserialize Binary Tree",
    description: "Implement serialization and deserialization of a binary tree.",
    sampleInput: "[1,2,3,null,null,4,5]",
    sampleOutput: "[1,2,3,null,null,4,5]",
    difficulty: "hard",
  },
];

export const seedProblems = async () => {
  for (let p of problems) {
    const docRef = doc(db, "Problems", p.id);
    await setDoc(docRef, p);
    console.log(`✅ Added problem: ${p.title}`);
  }
};
