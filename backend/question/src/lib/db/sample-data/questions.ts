export const questionDetails = [
  {
    id: 1,
    title: 'Reverse a String',
    description:
      'Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.\n\n**Example 1:**\n\nInput: `s = ["h","e","l","l","o"]`\n\nOutput: `["o","l","l","e","h"]`\n\n**Example 2:**\n\nInput: `s = ["H","a","n","n","a","h"]`\n\nOutput: `["h","a","n","n","a","H"]`\n\n**Constraints:**\n\n* `1 <= s.length <= 105`\n\n* `s[i]` is a printable ASCII character.',
    topics: ['Strings', 'Algorithms'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/reverse-string/',
  },
  {
    id: 2,
    title: 'Linked List Cycle Detection',
    description: 'Implement a function to detect if a linked list contains a cycle.',
    topics: ['Data Structures', 'Algorithms'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/linked-list-cycle/',
  },
  {
    id: 3,
    title: 'Roman to Integer',
    description: 'Given a Roman numeral, convert it to an integer.',
    topics: ['Algorithms'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/roman-to-integer/',
  },
  {
    id: 4,
    title: 'Add Binary',
    description: 'Given two binary strings `a` and `b`, return their sum as a binary string.',
    topics: ['Bit Manipulation', 'Algorithms'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/add-binary/',
  },
  {
    id: 5,
    title: 'Fibonacci Number',
    description:
      'The Fibonacci numbers, commonly denoted `F(n)`, form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. That is:\n\n* `F(0) = 0`, `F(1) = 1`\n\n* `F(n) = F(n - 1) + F(n - 2)`, for `n > 1`\n\nGiven `n`, calculate `F(n)`.',
    topics: ['Recursion', 'Algorithms'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/fibonacci-number/',
  },
  {
    id: 6,
    title: 'Implement Stack using Queues',
    description:
      'Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).',
    topics: ['Data Structures'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/implement-stack-using-queues/',
  },
  {
    id: 7,
    title: 'Combine Two Tables',
    description:
      'Given table `Person` with columns `personId`, `lastName`, and `firstName`, and table `Address` with columns `addressId`, `personId`, `city`, and `state`, write a solution to report the first name, last name, city, and state of each person in the `Person` table. If the address of a `personId` is not present in the `Address` table, report `null` instead.',
    topics: ['Databases'],
    difficulty: 'Easy',
    leetcode: 'https://leetcode.com/problems/combine-two-tables/',
  },
  {
    id: 8,
    title: 'Repeated DNA Sequences',
    description:
      'Given a string `s` that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in any order.',
    topics: ['Algorithms', 'Bit Manipulation'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/repeated-dna-sequences/',
  },
  {
    id: 9,
    title: 'Course Schedule',
    description:
      'There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return true if you can finish all courses. Otherwise, return false.',
    topics: ['Data Structures', 'Algorithms'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/course-schedule/',
  },
  {
    id: 10,
    title: 'LRU Cache Design',
    description: 'Design and implement an LRU (Least Recently Used) cache.',
    topics: ['Data Structures'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/lru-cache/',
  },
  {
    id: 11,
    title: 'Longest Common Subsequence',
    description:
      'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\nFor example, "ace" is a subsequence of "abcde". A common subsequence of two strings is a subsequence that is common to both strings.',
    topics: ['Strings', 'Algorithms'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/longest-common-subsequence/',
  },
  {
    id: 12,
    title: 'Rotate Image',
    description:
      'You are given an `n x n` 2D matrix representing an image, rotate the image by 90 degrees (clockwise).',
    topics: ['Arrays', 'Algorithms'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/rotate-image/',
  },
  {
    id: 13,
    title: 'Airplane Seat Assignment Probability',
    description:
      'n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. After that, the rest of the passengers will:\n\n- Take their own seat if it is still available\n- Pick other seats randomly when they find their seat occupied\n\nReturn the probability that the nth person gets their own seat.',
    topics: ['Brainteaser'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/airplane-seat-assignment-probability/',
  },
  {
    id: 14,
    title: 'Validate Binary Search Tree',
    description:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    topics: ['Data Structures', 'Algorithms'],
    difficulty: 'Medium',
    leetcode: 'https://leetcode.com/problems/validate-binary-search-tree/',
  },
  {
    id: 15,
    title: 'Sliding Window Maximum',
    description:
      'You are given an array of integers `nums`. There is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.',
    topics: ['Arrays', 'Algorithms'],
    difficulty: 'Hard',
    leetcode: 'https://leetcode.com/problems/sliding-window-maximum/',
  },
  {
    id: 16,
    title: 'N-Queen Problem',
    description:
      "The n-queens puzzle is the problem of placing n queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
    topics: ['Algorithms'],
    difficulty: 'Hard',
    leetcode: 'https://leetcode.com/problems/n-queens/',
  },
  {
    id: 17,
    title: 'Serialize and Deserialize a Binary Tree',
    description:
      'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.',
    topics: ['Data Structures', 'Algorithms'],
    difficulty: 'Hard',
    leetcode: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
  },
  {
    id: 18,
    title: 'Wildcard Matching',
    description:
      "Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for '?' and '*' where:\n\n- '?' Matches any single character\n- '*' Matches any sequence of characters (including the empty sequence)\n\nThe matching should cover the entire input string (not partial).",
    topics: ['Strings', 'Algorithms'],
    difficulty: 'Hard',
    leetcode: 'https://leetcode.com/problems/wildcard-matching/',
  },
  {
    id: 19,
    title: 'Chalkboard XOR Game',
    description:
      'You are given an array of integers `nums` representing the numbers written on a chalkboard. Alice and Bob take turns erasing exactly one number from the chalkboard, with Alice starting first. If erasing a number causes the bitwise XOR of all the elements of the chalkboard to become 0, then that player loses. The bitwise XOR of one element is that element itself, and the bitwise XOR of no elements is 0.\n\nAlso, if any player starts their turn with the bitwise XOR of all the elements of the chalkboard equal to 0, then that player wins.\n\nReturn `true` if and only if Alice wins the game, assuming both players play optimally.',
    topics: ['Brainteaser'],
    difficulty: 'Hard',
    leetcode: 'https://leetcode.com/problems/chalkboard-xor-game/',
  },
  {
    id: 20,
    title: 'Trips and Users',
    description:
      "Given table `Trips` with columns `id`, `client_id`, `driver_id`, `city_id`, `status`, and `request_at`, where `id` is the primary key. The table holds all taxi trips. Each trip has a unique `id`, while `client_id` and `driver_id` are foreign keys to the `users_id` in the `Users` table.\n\nStatus is an `ENUM` (category) type of (`'completed'`, `'cancelled_by_driver'`, `'cancelled_by_client'`).\n\nGiven table `Users` with columns `users_id`, `banned`, and `role`, `users_id` is the primary key (column with unique values) for this table. The table holds all users. Each user has a unique `users_id` and `role` is an `ENUM` type of (`'client'`, `'driver'`, `'partner'`). `banned` is an `ENUM` category of type (`'Yes'`, `'No'`). The cancellation rate is computed by dividing the number of canceled (by client or driver) requests with unbanned users by the total number of requests with unbanned users on that day.\n\nWrite a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between `\"2013-10-01\"` and `\"2013-10-03\"`. Round the cancellation rate to two decimal points.",
    topics: ['Databases'],
    difficulty: 'Hard',
    leetcode: 'https://leetcode.com/problems/trips-and-users/',
  },
];

interface Question {
  title: string;
  difficulty: string;
  topic: string[];
  description: string;
}

export const questionData: Question[] = questionDetails.map((question) => ({
  title: question.title,
  description: question.description,
  difficulty: question.difficulty as 'Easy' | 'Medium' | 'Hard',
  topic: question.topics,
}));
