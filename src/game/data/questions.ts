export interface Question {
  id: string;
  level: number;
  type: 'mcq' | 'input';
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export const questions: Question[] = [
  // LEVEL 1 - Theory (Easy) - Basic C concepts
  {
    id: 'l1',
    level: 1,
    type: 'mcq',
    question: 'Which of the following is the correct way to declare a constant in C?',
    options: [
      'constant int x = 5;',
      'const int x = 5;',
      'int const x;',
      '#define x = 5',
    ],
    correctAnswer: 'const int x = 5;',
    explanation: 'The "const" keyword before or after the type makes a variable constant in C. "const int x = 5;" is the standard declaration.',
  },

  // LEVEL 2 - Code Snippet (Easy-Medium) - Increment operators
  {
    id: 'l2',
    level: 2,
    type: 'mcq',
    question: 'What will be the output of this C program?',
    code: `#include <stdio.h>
int main() {
    int a = 5;
    int b = a++ + ++a;
    printf("%d", b);
    return 0;
}`,
    options: ['10', '11', '12', 'Undefined Behavior'],
    correctAnswer: 'Undefined Behavior',
    explanation: 'Modifying a variable more than once between sequence points causes undefined behavior in C. The expression "a++ + ++a" modifies "a" twice without a sequence point.',
  },

  // LEVEL 3 - Theory (Medium) - Pointers & memory
  {
    id: 'l3',
    level: 3,
    type: 'mcq',
    question: 'What does the following declaration mean?\n\nint (*ptr)[10];',
    options: [
      'An array of 10 integer pointers',
      'A pointer to an array of 10 integers',
      'A function pointer returning int',
      'A pointer to pointer to int',
    ],
    correctAnswer: 'A pointer to an array of 10 integers',
    explanation: '"int (*ptr)[10]" declares ptr as a pointer to an entire array of 10 integers, not an array of pointers.',
  },

  // LEVEL 4 - Theory (Medium-Hard) - Data types & compiler behavior
  {
    id: 'l4',
    level: 4,
    type: 'mcq',
    question: 'In a 64-bit system with GCC compiler, what is the size of:\n\nstruct { char a; int b; char c; };',
    options: ['6 bytes', '8 bytes', '12 bytes', '9 bytes'],
    correctAnswer: '12 bytes',
    explanation: 'Due to structure padding, char a takes 1 byte + 3 padding, int b takes 4 bytes, char c takes 1 byte + 3 padding = 12 bytes total.',
  },

  // LEVEL 5 - Code Snippet (Hard) - Arrays + Pointers + Arithmetic
  {
    id: 'l5',
    level: 5,
    type: 'input',
    question: 'What will be printed by this program? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;
    p = p + 2;
    printf("%d", *(p + 1) + *(p - 1));
    return 0;
}`,
    correctAnswer: '60',
    explanation: 'p starts at arr[0], then p+2 points to arr[2] (30). *(p+1) is arr[3]=40, *(p-1) is arr[1]=20. So 40+20=60.',
  },
];
