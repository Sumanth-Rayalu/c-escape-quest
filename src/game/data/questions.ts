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
  // ========== LEVEL 1 — Basic C Concepts (Easy) ==========
  {
    id: 'l1q1',
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
    explanation: 'The "const" keyword makes a variable constant. "const int x = 5;" is the standard declaration.',
  },
  {
    id: 'l1q2',
    level: 1,
    type: 'mcq',
    question: 'Which format specifier is used to print a float in C?',
    options: ['%d', '%f', '%c', '%s'],
    correctAnswer: '%f',
    explanation: '%f is used for float/double values. %d is for integers, %c for characters, %s for strings.',
  },
  {
    id: 'l1q3',
    level: 1,
    type: 'mcq',
    question: 'Which of the following is NOT a valid variable name in C?',
    options: ['_count', 'my_var', '2ndValue', 'total'],
    correctAnswer: '2ndValue',
    explanation: 'Variable names in C cannot start with a digit. "2ndValue" is invalid.',
  },
  {
    id: 'l1q4',
    level: 1,
    type: 'mcq',
    question: 'What does "return 0;" signify in the main() function?',
    options: [
      'Program ended with error',
      'Program executed successfully',
      'Program returns nothing',
      'Program restarts',
    ],
    correctAnswer: 'Program executed successfully',
    explanation: 'Returning 0 from main() indicates successful execution to the operating system.',
  },
  {
    id: 'l1q5',
    level: 1,
    type: 'mcq',
    question: 'Which header file is required for using printf() in C?',
    options: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'],
    correctAnswer: '<stdio.h>',
    explanation: 'printf() is declared in <stdio.h> (standard input/output header).',
  },
  {
    id: 'l1q6',
    level: 1,
    type: 'mcq',
    question: 'What is the size of "char" in C?',
    options: ['1 byte', '2 bytes', '4 bytes', 'Depends on compiler'],
    correctAnswer: '1 byte',
    explanation: 'The C standard guarantees char is exactly 1 byte.',
  },

  // ========== LEVEL 2 — Increment/Output Prediction (Easy–Medium) ==========
  {
    id: 'l2q1',
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
    explanation: 'Modifying a variable more than once between sequence points causes undefined behavior.',
  },
  {
    id: 'l2q2',
    level: 2,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int sum = 0;
    for (int i = 1; i <= 4; i++)
        sum += i;
    printf("%d", sum);
    return 0;
}`,
    correctAnswer: '10',
    explanation: 'The loop sums 1+2+3+4 = 10.',
  },
  {
    id: 'l2q3',
    level: 2,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int x = 10;
    while (x > 6) x--;
    printf("%d", x);
    return 0;
}`,
    correctAnswer: '6',
    explanation: 'x decrements from 10 until x > 6 is false. When x = 6, the loop exits.',
  },
  {
    id: 'l2q4',
    level: 2,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int a = 3, b = 4;
    int c = a * b + a;
    printf("%d", c);
    return 0;
}`,
    correctAnswer: '15',
    explanation: 'c = 3 * 4 + 3 = 12 + 3 = 15.',
  },
  {
    id: 'l2q5',
    level: 2,
    type: 'mcq',
    question: 'What will be the output?',
    code: `#include <stdio.h>
int main() {
    int x = 5;
    printf("%d %d", x++, ++x);
    return 0;
}`,
    options: ['5 7', '5 6', '6 7', 'Undefined Behavior'],
    correctAnswer: 'Undefined Behavior',
    explanation: 'The order of evaluation of function arguments is unspecified in C.',
  },
  {
    id: 'l2q6',
    level: 2,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int i = 0, count = 0;
    while (i < 5) {
        if (i % 2 == 0) count++;
        i++;
    }
    printf("%d", count);
    return 0;
}`,
    correctAnswer: '3',
    explanation: 'Even values of i in range [0,4]: 0, 2, 4 → count = 3.',
  },

  // ========== LEVEL 3 — Pointers & Memory (Medium) ==========
  {
    id: 'l3q1',
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
    explanation: '"int (*ptr)[10]" declares ptr as a pointer to an entire array of 10 integers.',
  },
  {
    id: 'l3q2',
    level: 3,
    type: 'mcq',
    question: 'What happens when you dereference a NULL pointer in C?',
    options: [
      'Returns 0',
      'Returns NULL',
      'Undefined behavior',
      'Compiler error',
    ],
    correctAnswer: 'Undefined behavior',
    explanation: 'Dereferencing NULL is undefined behavior — it typically causes a segfault.',
  },
  {
    id: 'l3q3',
    level: 3,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40};
    int *p = arr;
    p += 2;
    printf("%d", *p);
    return 0;
}`,
    correctAnswer: '30',
    explanation: 'p starts at arr[0]. After p += 2, p points to arr[2] which is 30.',
  },
  {
    id: 'l3q4',
    level: 3,
    type: 'mcq',
    question: 'Which function is used to dynamically allocate memory in C?',
    options: ['alloc()', 'malloc()', 'new()', 'create()'],
    correctAnswer: 'malloc()',
    explanation: 'malloc() allocates a block of memory from the heap and returns a void pointer.',
  },
  {
    id: 'l3q5',
    level: 3,
    type: 'mcq',
    question: 'What is the output of sizeof(ptr) on a 64-bit system where ptr is an int*?',
    options: ['2', '4', '8', 'Depends on array size'],
    correctAnswer: '8',
    explanation: 'On a 64-bit system, all pointers are 8 bytes regardless of the type they point to.',
  },
  {
    id: 'l3q6',
    level: 3,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}
int main() {
    int x = 3, y = 7;
    swap(&x, &y);
    printf("%d", x);
    return 0;
}`,
    correctAnswer: '7',
    explanation: 'After swap, x holds y\'s original value (7).',
  },

  // ========== LEVEL 4 — Data Types & Compiler (Medium–Hard) ==========
  {
    id: 'l4q1',
    level: 4,
    type: 'mcq',
    question: 'In a 64-bit system with GCC, what is the size of:\n\nstruct { char a; int b; char c; };',
    options: ['6 bytes', '8 bytes', '12 bytes', '9 bytes'],
    correctAnswer: '12 bytes',
    explanation: 'Due to struct padding: char(1) + pad(3) + int(4) + char(1) + pad(3) = 12 bytes.',
  },
  {
    id: 'l4q2',
    level: 4,
    type: 'mcq',
    question: 'What is the size of a union that contains an int, a double, and a char?',
    options: ['13 bytes', '8 bytes', '4 bytes', '1 byte'],
    correctAnswer: '8 bytes',
    explanation: 'A union\'s size equals its largest member. double is 8 bytes.',
  },
  {
    id: 'l4q3',
    level: 4,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    enum color { RED, GREEN = 5, BLUE };
    printf("%d", BLUE);
    return 0;
}`,
    correctAnswer: '6',
    explanation: 'GREEN = 5, so BLUE = GREEN + 1 = 6.',
  },
  {
    id: 'l4q4',
    level: 4,
    type: 'mcq',
    question: 'What does typedef do in C?',
    options: [
      'Creates a new data type',
      'Creates an alias for an existing type',
      'Defines a macro',
      'Declares a variable',
    ],
    correctAnswer: 'Creates an alias for an existing type',
    explanation: 'typedef creates a new name (alias) for an existing data type.',
  },
  {
    id: 'l4q5',
    level: 4,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    unsigned int x = 0;
    x = x - 1;
    printf("%u", x);
    return 0;
}`,
    correctAnswer: '4294967295',
    explanation: 'Unsigned int wraps around. 0 - 1 = UINT_MAX = 4294967295 on 32-bit unsigned.',
  },
  {
    id: 'l4q6',
    level: 4,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int a = 12;
    printf("%d", a & 7);
    return 0;
}`,
    correctAnswer: '4',
    explanation: '12 in binary is 1100, 7 is 0111. AND gives 0100 = 4.',
  },

  // ========== LEVEL 5 — Arrays + Pointers + Arithmetic (Hard) ==========
  {
    id: 'l5q1',
    level: 5,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;
    p = p + 2;
    printf("%d", *(p + 1) + *(p - 1));
    return 0;
}`,
    correctAnswer: '60',
    explanation: 'p points to arr[2]=30. *(p+1)=arr[3]=40, *(p-1)=arr[1]=20. 40+20=60.',
  },
  {
    id: 'l5q2',
    level: 5,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
#include <string.h>
int main() {
    char str[] = "Hello";
    printf("%d", (int)strlen(str));
    return 0;
}`,
    correctAnswer: '5',
    explanation: 'strlen counts characters excluding the null terminator. "Hello" has 5 characters.',
  },
  {
    id: 'l5q3',
    level: 5,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int a[2][3] = {{1,2,3},{4,5,6}};
    printf("%d", *(*(a+1)+2));
    return 0;
}`,
    correctAnswer: '6',
    explanation: '*(a+1) points to second row {4,5,6}. *(*(a+1)+2) = a[1][2] = 6.',
  },
  {
    id: 'l5q4',
    level: 5,
    type: 'mcq',
    question: 'Which declaration correctly defines a function pointer to a function taking two ints and returning int?',
    options: [
      'int *fptr(int, int);',
      'int (*fptr)(int, int);',
      'int *(fptr)(int, int);',
      '(int*) fptr(int, int);',
    ],
    correctAnswer: 'int (*fptr)(int, int);',
    explanation: 'Parentheses around (*fptr) distinguish it from a function returning int*.',
  },
  {
    id: 'l5q5',
    level: 5,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int f(int n) {
    if (n <= 1) return n;
    return f(n-1) + f(n-2);
}
int main() {
    printf("%d", f(6));
    return 0;
}`,
    correctAnswer: '8',
    explanation: 'This is the Fibonacci sequence. f(6) = f(5)+f(4) = 5+3 = 8.',
  },
  {
    id: 'l5q6',
    level: 5,
    type: 'input',
    question: 'What will be printed? Enter only the number.',
    code: `#include <stdio.h>
int main() {
    int x = 42;
    int *p = &x;
    int **pp = &p;
    printf("%d", **pp);
    return 0;
}`,
    correctAnswer: '42',
    explanation: 'pp points to p, which points to x. **pp dereferences twice to get x = 42.',
  },
];
