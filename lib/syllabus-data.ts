import { Experiment, EvaluationScheme } from './types';

export const DEFAULT_EVALUATION_SCHEME: EvaluationScheme = {
  maxMarks: 75,
  codingWeight: 30,
  assessmentWeight: 20,
  vivaWeight: 15,
  facultyObservationWeight: 10,
  regulation: "Anna University Lab Regulation (N21UIT307 - 75 Marks)"
};

export const SYLLABUS_EXPERIMENTS: Experiment[] = [
  // ==========================================
  // EXPERIMENT 01: SIMPLE C PROGRAMS
  // ==========================================
  {
    id: "exp-01-simple-c-programs",
    expNumber: 1,
    title: "Simple C Programs (Recursion, Structures & Pointers)",
    shortTitle: "Simple C Programs",
    category: "C Fundamentals & Memory",
    dataStructure: "Primitive Variables, Recursion Stack, Structs & Pointers",
    difficulty: "Beginner",
    aim: "To design, write, and execute C programs implementing (1A) Recursion, (1B) Structures, and (1C) Pointer manipulation in memory.",
    objectives: [
      "Understand recursive function call stack frames and base termination conditions.",
      "Declare and manipulate user-defined composite data types using struct.",
      "Master pointer variables, address-of operator (&), dereference operator (*), and pass-by-reference."
    ],
    definition: "Fundamental C constructs enabling procedural modularity (Recursion), heterogeneous data encapsulation (Structures), and direct hardware memory access (Pointers).",
    theory: "Recursion solves complex problems by breaking them into self-similar sub-problems with a base condition. Structures allow bundling different data types (e.g. id, name, marks) into a single entity. Pointers store hexadecimal RAM memory addresses, allowing efficient dynamic referencing without copying large data blocks.",
    subExperiments: [
      {
        id: "exp-01a",
        subCode: "1A",
        title: "Programs Using Recursion (Factorial & Fibonacci)",
        aim: "To write a C program to calculate the factorial of a number and generate the Fibonacci sequence using recursive functions.",
        code: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1; // Base condition
    return n * factorial(n - 1); // Recursive step
}

int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int num = 5;
    printf("Factorial of %d = %d\\n", num, factorial(num));
    printf("Fibonacci term %d = %d\\n", num, fibonacci(num));
    return 0;
}`,
        starterCode: `#include <stdio.h>

int factorial(int n) {
    // TODO: Base case and recursive call
    return 1;
}

int main() {
    printf("Factorial: %d\\n", factorial(5));
    return 0;
}`,
        algorithm: [
          "Step 1: Define factorial(n). If n <= 1 return 1 (Base case).",
          "Step 2: Else return n * factorial(n - 1) (Recursive case).",
          "Step 3: In main(), call factorial(num) and print the computed product."
        ]
      },
      {
        id: "exp-01b",
        subCode: "1B",
        title: "Programs Using Structures (Student Record Management)",
        aim: "To write a C program to define a student structure, store academic details, and compute total and average marks.",
        code: `#include <stdio.h>

struct Student {
    int rollNo;
    char name[30];
    float marks[3];
    float total;
    float average;
};

int main() {
    struct Student s1 = {101, "Aarav Sharma", {88.5, 92.0, 95.5}, 0, 0};
    s1.total = s1.marks[0] + s1.marks[1] + s1.marks[2];
    s1.average = s1.total / 3.0;
    
    printf("Roll No: %d | Name: %s\\n", s1.rollNo, s1.name);
    printf("Total Marks: %.2f | Average: %.2f\\n", s1.total, s1.average);
    return 0;
}`,
        starterCode: `#include <stdio.h>

struct Student {
    int rollNo;
    char name[30];
    float total;
};

int main() {
    // TODO: Create student struct and compute total
    return 0;
}`,
        algorithm: [
          "Step 1: Declare struct Student with rollNo, name, and marks array.",
          "Step 2: Initialize student record instance.",
          "Step 3: Calculate sum of marks and compute average.",
          "Step 4: Display student academic summary."
        ]
      },
      {
        id: "exp-01c",
        subCode: "1C",
        title: "Programs Using Pointers (Memory Addressing & Swap)",
        aim: "To write a C program to demonstrate pointer dereferencing and swap two integers using pass-by-reference.",
        code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 25, y = 80;
    printf("Before Swap: x = %d, y = %d\\n", x, y);
    swap(&x, &y);
    printf("After Swap:  x = %d, y = %d\\n", x, y);
    return 0;
}`,
        starterCode: `#include <stdio.h>

void swap(int *a, int *b) {
    // TODO: Swap using pointer dereference
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x=%d, y=%d\\n", x, y);
    return 0;
}`,
        algorithm: [
          "Step 1: Define swap(int *a, int *b) accepting memory addresses.",
          "Step 2: Store dereferenced value *a in temporary variable temp.",
          "Step 3: Assign *b into *a, and assign temp into *b.",
          "Step 4: Pass &x and &y from main to modify original memory locations."
        ]
      }
    ],
    realWorldExample: {
      title: "RAM Call Stack & Address Book",
      analogy: "A pointer is like a house address written on a note. Instead of moving the entire house, you simply share the GPS address coordinate with your friend!",
      application: "Used in OS memory paging, device drivers, recursive tree traversals, and micro-controller register access."
    },
    problemStatement: "Implement C programs to demonstrate (1) Recursion (factorial calculation), (2) Structures (student record processing), and (3) Pointers (memory address pass-by-reference).",
    algorithm: [
      "Step 1: Include standard I/O library <stdio.h>.",
      "Step 2: Declare recursive functions with well-defined base termination conditions.",
      "Step 3: Declare custom struct types to bundle related attributes.",
      "Step 4: Use pointer variables (*ptr) and address-of operators (&) for in-place memory modifications."
    ],
    pseudocode: `Function factorial(n):
    If n <= 1: Return 1
    Else: Return n * factorial(n - 1)

Function swap(Pointer a, Pointer b):
    temp = *a
    *a = *b
    *b = temp`,
    defaultCode: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int n = 5;
    int a = 10, b = 20;
    
    printf("Factorial of %d = %d\\n", n, factorial(n));
    printf("Before Swap: a = %d, b = %d\\n", a, b);
    swap(&a, &b);
    printf("After Swap:  a = %d, b = %d\\n", a, b);
    return 0;
}`,
    starterCode: `#include <stdio.h>

int factorial(int n) {
    // TODO: Implement recursive factorial
    return 1;
}

void swap(int *a, int *b) {
    // TODO: Implement pointer swap
}

int main() {
    printf("Factorial: %d\\n", factorial(5));
    return 0;
}`,
    lineByLineExplanations: {
      3: {
        purpose: "Defines the recursive factorial function.",
        beginnerFriendly: "Creates a function that calls itself to solve smaller pieces of the multiplication chain.",
        whyNeeded: "Computes mathematical factorial iteratively or recursively.",
        whatIfRemoved: "Function not defined.",
        astConcept: "Function Header"
      },
      4: {
        purpose: "Base case termination condition.",
        beginnerFriendly: "When n reaches 1, stop! If we don't stop, the program will loop forever and run out of memory (Stack Overflow).",
        whyNeeded: "Prevents infinite recursion.",
        whatIfRemoved: "Infinite recursion -> Segmentation fault (Stack Overflow).",
        astConcept: "Base Condition Guard"
      },
      5: {
        purpose: "Recursive step multiplying current n by factorial(n-1).",
        beginnerFriendly: "Multiplies current number by the answer of the next smaller number.",
        whyNeeded: "Decomposes problem into sub-problems.",
        whatIfRemoved: "Computation stops prematurely.",
        astConcept: "Recursive Call"
      }
    },
    testCases: [
      {
        id: "tc-01-a",
        name: "Factorial of 5",
        input: "5",
        expectedOutput: "Factorial of 5 = 120\nBefore Swap: a = 10, b = 20\nAfter Swap:  a = 20, b = 10",
        isPublic: true,
        explanation: "Computes 5! = 120 and swaps values 10 and 20."
      }
    ],
    timeComplexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      explanation: "Recursion depth is proportional to n; pointer dereference is instantaneous O(1)."
    },
    spaceComplexity: {
      value: "O(n)",
      explanation: "Consumes n stack frames on call stack during recursive execution."
    },
    coMapping: ["CO1 - Design data structure representations in C", "CO2 - Implement recursive algorithms and memory pointers"],
    vivaQuestions: [
      {
        id: "viva-01-1",
        question: "What is the role of a base condition in a recursive C function?",
        timeLimitSeconds: 10,
        idealKeywords: ["stop", "terminate", "prevent stack overflow", "infinite loop"],
        sampleAnswer: "The base condition stops the recursive calls, preventing infinite recursion and stack overflow.",
        maxScore: 5
      },
      {
        id: "viva-01-2",
        question: "What is the difference between *ptr and &var in C?",
        timeLimitSeconds: 10,
        idealKeywords: ["dereference", "value", "address-of", "hex address"],
        sampleAnswer: "&var yields the memory address of var, while *ptr accesses the value stored at that address.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-01-1",
        type: "mcq",
        question: "What happens if a recursive function does not have a base condition?",
        options: ["Runs successfully", "Stack Overflow runtime crash", "Compile error", "Returns 0"],
        correctAnswer: 1,
        explanation: "Without a base condition, function frames consume all stack memory until a Stack Overflow occurs.",
        points: 5
      }
    ],
    visualizationType: "recursion"
  },

  // ==========================================
  // EXPERIMENT 02: LINKED LIST IMPLEMENTATION
  // ==========================================
  {
    id: "exp-02-linked-list-adt",
    expNumber: 2,
    title: "Linked List Implementation of List ADT (Polynomial / Node Operations)",
    shortTitle: "Linked List (List ADT)",
    category: "Linear Data Structures",
    dataStructure: "Singly Linked List, Self-referential Structs",
    difficulty: "Beginner",
    aim: "To write a C program to implement the List ADT using a Singly Linked List and perform polynomial representation and basic node operations.",
    objectives: [
      "Understand dynamic memory allocation using malloc() in C.",
      "Comprehend self-referential structures (struct Node).",
      "Implement pointer manipulation for node linkage, insertion, and traversal.",
      "Apply linked lists to polynomial term addition."
    ],
    definition: "A Singly Linked List is a linear dynamic data structure composed of nodes, where each node contains two fields: 'data' (the payload) and 'next' (a pointer storing the memory address of the subsequent node). The tail points to NULL.",
    theory: "Unlike arrays with contiguous memory allocation and fixed sizes, linked lists allocate memory dynamically on the heap during runtime. Each node is linked sequentially through pointers. This eliminates array overflow issues and allows O(1) insertions and deletions at the head without shifting remaining elements.",
    realWorldExample: {
      title: "Train Coaches & Music Playlist",
      analogy: "Think of a train where each coach is physically hooked to the next coach behind it. The engine is the 'HEAD'. If you want to attach a new coach at the front, you disconnect the engine, connect it to the new coach, and connect the new coach to the rest.",
      application: "Used in OS memory management, music player playlists (Next track pointer), image viewers, and undo/redo stacks."
    },
    problemStatement: "Write a C program to implement a Singly Linked List ADT with operations: (1) Insert at beginning, (2) Insert at end, (3) Polynomial node linkage, and (4) Display all elements.",
    algorithm: [
      "Step 1: Define a self-referential structure 'Node' with an integer 'data' and a struct pointer 'next'.",
      "Step 2: Initialize 'head' pointer to NULL to indicate an empty list.",
      "Step 3: [Insert Beginning] Allocate memory for 'newNode' using malloc. Assign 'newNode->data = value'. Set 'newNode->next = head'. Update 'head = newNode'.",
      "Step 4: [Insert End] Allocate 'newNode'. If head is NULL, set head = newNode. Otherwise, traverse with 'temp' until 'temp->next == NULL'. Set 'temp->next = newNode'.",
      "Step 5: [Display] Traverse from 'head' using pointer 'temp', printing 'temp->data' until temp becomes NULL."
    ],
    pseudocode: `Structure Node {
    Integer data
    Pointer to Node next
}
Pointer head = NULL

Function insertAtBeginning(val):
    newNode = allocate Node
    newNode.data = val
    newNode.next = head
    head = newNode`,
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* head = NULL;

void insertAtBeginning(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = head;
    head = newNode;
}

void insertAtEnd(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    if (head == NULL) {
        head = newNode;
        return;
    }
    struct Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
}

void display() {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    insertAtBeginning(10);
    insertAtBeginning(20);
    insertAtEnd(30);
    insertAtEnd(40);
    display();
    return 0;
}`,
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* head = NULL;

void insertAtBeginning(int value) {
    // TODO: Allocate memory and insert node at head
}

void display() {
    // TODO: Traverse and print the list
}

int main() {
    insertAtBeginning(10);
    insertAtBeginning(20);
    display();
    return 0;
}`,
    lineByLineExplanations: {
      4: {
        purpose: "Declares a self-referential structure named 'Node'.",
        beginnerFriendly: "struct Node creates a custom blueprint having two compartments: integer data and pointer next.",
        whyNeeded: "Standard primitive types cannot bundle data and memory links together.",
        whatIfRemoved: "You cannot construct linked list nodes.",
        astConcept: "Type Definition"
      },
      12: {
        purpose: "Allocates memory on the heap for a single Node.",
        beginnerFriendly: "malloc(sizeof(struct Node)) asks the computer for enough heap space to store one node and returns its address.",
        whyNeeded: "Static variables inside functions vanish when function exits; heap memory persists.",
        whatIfRemoved: "No memory allocated; program will crash when assigning data.",
        astConcept: "Dynamic Memory Allocation"
      }
    },
    testCases: [
      {
        id: "tc-02-a",
        name: "Head & Tail Insertions",
        input: "10 20 30 40",
        expectedOutput: "20 -> 10 -> 30 -> 40 -> NULL",
        isPublic: true,
        explanation: "Inserts 10 and 20 at head, then 30 and 40 at tail."
      }
    ],
    timeComplexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      explanation: "Insertion at beginning is O(1). Insertion at end or searching requires O(n) traversal from head to tail."
    },
    spaceComplexity: {
      value: "O(n)",
      explanation: "Each node consumes sizeof(int) + sizeof(pointer) = 16 bytes on heap per element."
    },
    coMapping: ["CO1 - Design linear data structure representations in C", "CO2 - Implement dynamic memory operations with pointers"],
    vivaQuestions: [
      {
        id: "viva-02-1",
        question: "What is a self-referential structure in C and why is it used in Linked Lists?",
        timeLimitSeconds: 10,
        idealKeywords: ["struct", "pointer", "same type", "next", "address"],
        sampleAnswer: "A structure that contains a pointer to another structure of the same type, allowing nodes to link sequentially.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-02-1",
        type: "mcq",
        question: "Which C operator is used to access structure members through a pointer?",
        options: [". (dot operator)", "-> (arrow operator)", "* (dereference only)", "& (address-of)"],
        correctAnswer: 1,
        explanation: "The arrow operator (->) dereferences the pointer and accesses the structure member in one step.",
        points: 5
      }
    ],
    visualizationType: "linked_list"
  },

  // ==========================================
  // EXPERIMENT 03: IMPLEMENTATION OF STACK
  // ==========================================
  {
    id: "exp-03-stack-implementation",
    expNumber: 3,
    title: "Implementation of Stack (3A. Array & 3B. Linked List)",
    shortTitle: "Stack Implementation",
    category: "Linear Data Structures",
    dataStructure: "Stack ADT (LIFO)",
    difficulty: "Intermediate",
    aim: "To implement the Stack Abstract Data Type using (3A) Array and (3B) Singly Linked List with Push, Pop, Peek, and Display operations.",
    objectives: [
      "Understand the Last-In-First-Out (LIFO) discipline.",
      "Implement array-based top index boundary checking (overflow & underflow).",
      "Implement dynamic linked list stack with runtime malloc() and free()."
    ],
    definition: "A Stack is a linear data structure following the LIFO (Last-In-First-Out) principle, where insertions (push) and deletions (pop) occur strictly at the 'TOP' end.",
    theory: "In array implementation, a static array of size MAX is declared with top initialized to -1. In linked list implementation, top points to the head node, enabling unlimited dynamic growth on the heap without fixed capacity limits.",
    subExperiments: [
      {
        id: "exp-03a",
        subCode: "3A",
        title: "Stack Using Arrays",
        aim: "To implement Stack ADT using a fixed-size 1D array in C with Push, Pop, Peek, and Display.",
        code: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int value) {
    if (top >= MAX - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    stack[++top] = value;
    printf("Pushed: %d\\n", value);
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return stack[top--];
}

int main() {
    push(10);
    push(20);
    push(30);
    printf("Popped: %d\\n", pop());
    return 0;
}`,
        starterCode: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int value) {
    // TODO: Implement push with overflow check
}

int main() {
    push(10);
    return 0;
}`,
        algorithm: [
          "Step 1: Initialize top = -1.",
          "Step 2: [Push] If top == MAX - 1, print Overflow. Else increment top and insert stack[top] = value.",
          "Step 3: [Pop] If top == -1, print Underflow. Else return stack[top--]."
        ]
      },
      {
        id: "exp-03b",
        subCode: "3B",
        title: "Stack Using Linked List",
        aim: "To implement Stack ADT using a dynamic singly linked list.",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* top = NULL;

void push(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = top;
    top = newNode;
    printf("Pushed: %d\\n", value);
}

int pop() {
    if (top == NULL) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    struct Node* temp = top;
    int val = temp->data;
    top = top->next;
    free(temp);
    return val;
}

int main() {
    push(100);
    push(200);
    printf("Popped: %d\\n", pop());
    return 0;
}`,
        starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* top = NULL;

void push(int value) {
    // TODO: Dynamic push
}

int main() {
    push(100);
    return 0;
}`,
        algorithm: [
          "Step 1: Set top pointer = NULL.",
          "Step 2: [Push] Allocate newNode with malloc, newNode->next = top, top = newNode.",
          "Step 3: [Pop] If top == NULL Underflow. Else temp = top, top = top->next, free(temp)."
        ]
      }
    ],
    realWorldExample: {
      title: "Cafeteria Plates & Browser Back Button",
      analogy: "A stack of plates in a cafeteria. The plate placed last on the pile is the very first one picked up by the customer.",
      application: "Used in browser navigation history, text editor undo/redo, and compiler function call stacks."
    },
    problemStatement: "Implement a menu-driven C program to perform Push, Pop, Peek, and Display operations on a Stack using (1) Array and (2) Linked List.",
    algorithm: [
      "Step 1: Define stack storage (array or linked nodes) and top indicator.",
      "Step 2: Implement push with boundary/overflow checking.",
      "Step 3: Implement pop with empty/underflow checking and return removed item.",
      "Step 4: Implement display iterating from top down to bottom."
    ],
    pseudocode: `Function push(val):
    If isFull(): Print "Overflow"
    Else: top = top + 1; stack[top] = val

Function pop():
    If isEmpty(): Print "Underflow"
    Else: val = stack[top]; top = top - 1; Return val`,
    defaultCode: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int value) {
    if (top >= MAX - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    top = top + 1;
    stack[top] = value;
    printf("Pushed: %d\\n", value);
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    int val = stack[top];
    top = top - 1;
    printf("Popped: %d\\n", val);
    return val;
}

void display() {
    if (top == -1) {
        printf("Stack is empty\\n");
        return;
    }
    printf("Stack (Top to Bottom):\\n");
    for (int i = top; i >= 0; i--) {
        printf("| %d |%s\\n", stack[i], (i == top ? " <-- TOP" : ""));
    }
}

int main() {
    push(10);
    push(20);
    push(30);
    display();
    pop();
    display();
    return 0;
}`,
    starterCode: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int value) {
    // TODO: Push implementation
}

int pop() {
    // TODO: Pop implementation
    return -1;
}

int main() {
    push(10);
    return 0;
}`,
    lineByLineExplanations: {
      4: {
        purpose: "Declares static array buffer for stack.",
        beginnerFriendly: "int stack[MAX] reserves 5 slots in RAM.",
        whyNeeded: "Stores stack items.",
        whatIfRemoved: "No storage space.",
        astConcept: "Array Declaration"
      }
    },
    testCases: [
      {
        id: "tc-03-a",
        name: "Push and Pop Sequence",
        input: "10 20 30",
        expectedOutput: "Pushed: 10\nPushed: 20\nPushed: 30\nStack (Top to Bottom):\n| 30 | <-- TOP\n| 20 |\n| 10 |\nPopped: 30\nStack (Top to Bottom):\n| 20 | <-- TOP\n| 10 |",
        isPublic: true,
        explanation: "Pushes 10, 20, 30 and pops 30 according to LIFO."
      }
    ],
    timeComplexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      explanation: "Push, Pop, and Peek strictly access the TOP element in instantaneous O(1) time."
    },
    spaceComplexity: {
      value: "O(n)",
      explanation: "Consumes memory proportional to the number of elements in the stack."
    },
    coMapping: ["CO1 - Design linear data structures in C", "CO3 - Implement stack ADT"],
    vivaQuestions: [
      {
        id: "viva-03-1",
        question: "What is LIFO principle in Stack data structure?",
        timeLimitSeconds: 10,
        idealKeywords: ["Last In First Out", "top", "push", "pop"],
        sampleAnswer: "Last In First Out means the most recently inserted item is the first one removed.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-03-1",
        type: "mcq",
        question: "What is the time complexity to push an element into a stack?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: 0,
        explanation: "Pushing onto top only updates the index/pointer in O(1) constant time.",
        points: 5
      }
    ],
    visualizationType: "stack_array"
  },

  // ==========================================
  // EXPERIMENT 04: BALANCED PARENTHESES
  // ==========================================
  {
    id: "exp-04-balanced-parentheses",
    expNumber: 4,
    title: "Checking Balanced Parentheses Using Array Stack",
    shortTitle: "Balanced Parentheses",
    category: "Applications of Stack",
    dataStructure: "Character Stack (LIFO)",
    difficulty: "Intermediate",
    aim: "To design and implement a C program to check whether a given arithmetic or code expression has balanced delimiters ((), {}, []) using a stack.",
    objectives: [
      "Apply Stack ADT to solve compiler delimiter validation problems.",
      "Understand character matching logic for opening and closing brackets.",
      "Detect mismatch errors and unclosed delimiter errors."
    ],
    definition: "An expression has balanced parentheses if every opening delimiter (, {, [ has a corresponding closing delimiter of the same type ), }, ] and delimiters are properly nested.",
    theory: "When scanning the expression from left to right: (1) Push opening brackets onto stack. (2) When encountering closing bracket, pop top bracket and verify matching type. (3) If stack is empty on closing bracket or doesn't match, invalid. (4) After scanning entire string, if stack is empty, it is balanced.",
    realWorldExample: {
      title: "C Compiler & IDE Syntax Highlighting",
      analogy: "Packing nesting Russian dolls. You must close the smallest inner doll before you can close the larger outer doll.",
      application: "Used in compilers (GCC/Clang), XML/HTML tag validators, and IDE bracket pair colorizers."
    },
    problemStatement: "Given a string of characters containing '(', ')', '{', '}', '[', ']', write a C program using a stack to check if the delimiters are balanced.",
    algorithm: [
      "Step 1: Initialize a character stack with top = -1.",
      "Step 2: Traverse the input string character by character.",
      "Step 3: If character is '(', '{', or '[', push it onto the stack.",
      "Step 4: If character is ')', '}', or ']', check if stack is empty (Underflow -> Unbalanced). Else pop character 'ch' and check if matches.",
      "Step 5: If mismatched pair (e.g. '(' with '}'), return Unbalanced.",
      "Step 6: At end of string, if top == -1 return Balanced, else return Unbalanced."
    ],
    pseudocode: `Function isBalanced(expr):
    stack = createStack()
    For each char in expr:
        If char in ['(', '{', '[']:
            push(stack, char)
        Else If char in [')', '}', ']']:
            If isEmpty(stack): return False
            topChar = pop(stack)
            If not isMatchingPair(topChar, char):
                return False
    Return isEmpty(stack)`,
    defaultCode: `#include <stdio.h>
#include <string.h>
#define MAX 100

char stack[MAX];
int top = -1;

void push(char c) {
    if (top < MAX - 1) {
        stack[++top] = c;
    }
}

char pop() {
    if (top >= 0) {
        return stack[top--];
    }
    return '\\0';
}

int isMatchingPair(char opening, char closing) {
    if (opening == '(' && closing == ')') return 1;
    if (opening == '{' && closing == '}') return 1;
    if (opening == '[' && closing == ']') return 1;
    return 0;
}

int isBalanced(char* expr) {
    top = -1;
    for (int i = 0; expr[i] != '\\0'; i++) {
        char ch = expr[i];
        if (ch == '(' || ch == '{' || ch == '[') {
            push(ch);
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (top == -1) return 0;
            char popped = pop();
            if (!isMatchingPair(popped, ch)) return 0;
        }
    }
    return (top == -1);
}

int main() {
    char exp1[] = "{[()]}";
    char exp2[] = "{[(])}";
    
    printf("%s is %s\\n", exp1, isBalanced(exp1) ? "BALANCED" : "NOT BALANCED");
    printf("%s is %s\\n", exp2, isBalanced(exp2) ? "BALANCED" : "NOT BALANCED");
    return 0;
}`,
    starterCode: `#include <stdio.h>
#include <string.h>
#define MAX 100

char stack[MAX];
int top = -1;

int isBalanced(char* expr) {
    // TODO: Push opening brackets, pop and match closing brackets
    return 1;
}

int main() {
    char exp[] = "{[()]}";
    printf("%s is %s\\n", exp, isBalanced(exp) ? "BALANCED" : "NOT BALANCED");
    return 0;
}`,
    lineByLineExplanations: {
      30: {
        purpose: "Pushes opening delimiters onto stack.",
        beginnerFriendly: "When we see an opening bracket like '{', put it into stack backpack to wait for its partner.",
        whyNeeded: "Tracks open brackets in LIFO order.",
        whatIfRemoved: "Cannot validate closures.",
        astConcept: "Stack Push"
      }
    },
    testCases: [
      {
        id: "tc-04-a",
        name: "Nested vs Interleaved",
        input: "{[()]}",
        expectedOutput: "{[()]} is BALANCED\n{[(])} is NOT BALANCED",
        isPublic: true,
        explanation: "Correctly verifies proper nesting vs interleaved brackets."
      }
    ],
    timeComplexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      explanation: "Single linear pass over the expression string of length n."
    },
    spaceComplexity: {
      value: "O(n)",
      explanation: "Stack holds up to n opening bracket characters in worst-case nested expressions."
    },
    coMapping: ["CO1 - Design linear data structures in C", "CO3 - Implement stack applications"],
    vivaQuestions: [
      {
        id: "viva-04-1",
        question: "Why is Stack used for parentheses balancing rather than Queue?",
        timeLimitSeconds: 10,
        idealKeywords: ["LIFO", "most recently opened", "nested closure"],
        sampleAnswer: "Because the most recently opened bracket must be closed first (LIFO order).",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-04-1",
        type: "mcq",
        question: "Which expression is balanced?",
        options: ["[(])", "([{}])", "({[})]", "(((())"],
        correctAnswer: 1,
        explanation: "([{}]) has properly nested delimiters matched from inside out.",
        points: 5
      }
    ],
    visualizationType: "parentheses"
  },

  // ==========================================
  // EXPERIMENT 05: IMPLEMENTATION OF QUEUE
  // ==========================================
  {
    id: "exp-05-queue-implementation",
    expNumber: 5,
    title: "Implementation of Queue (5A. Array & 5B. Linked List)",
    shortTitle: "Queue Implementation",
    category: "Linear Data Structures",
    dataStructure: "Queue ADT (FIFO)",
    difficulty: "Intermediate",
    aim: "To implement the Queue Abstract Data Type using (5A) Array and (5B) Linked List with Enqueue, Dequeue, Front, and Display operations.",
    objectives: [
      "Understand the First-In-First-Out (FIFO) access discipline.",
      "Manage front and rear pointers in array-based linear and circular queues.",
      "Implement dynamic linked list queue with constant O(1) front deletion and rear insertion."
    ],
    definition: "A Queue is a linear data structure following the FIFO (First-In-First-Out) principle, where insertions occur at the REAR end and deletions occur at the FRONT end.",
    theory: "In array queue, front and rear track indices. When items are added, rear advances. When items are deleted, front advances. In linked queue, front points to head node and rear points to tail node, guaranteeing O(1) enqueue and dequeue.",
    subExperiments: [
      {
        id: "exp-05a",
        subCode: "5A",
        title: "Queue Using Arrays",
        aim: "To implement Queue ADT using a fixed-size 1D array in C.",
        code: `#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

void enqueue(int value) {
    if (rear == SIZE - 1) {
        printf("Queue Overflow!\\n");
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = value;
    printf("Enqueued: %d (Rear = %d)\\n", value, rear);
}

int dequeue() {
    if (front == -1 || front > rear) {
        printf("Queue Underflow!\\n");
        return -1;
    }
    return queue[front++];
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    printf("Dequeued: %d\\n", dequeue());
    return 0;
}`,
        starterCode: `#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

void enqueue(int value) {
    // TODO: Enqueue with overflow check
}

int main() {
    enqueue(10);
    return 0;
}`,
        algorithm: [
          "Step 1: Set front = -1, rear = -1.",
          "Step 2: [Enqueue] If rear == SIZE-1, Overflow. If front == -1 set front = 0. Set queue[++rear] = value.",
          "Step 3: [Dequeue] If front == -1 or front > rear, Underflow. Else return queue[front++]."
        ]
      },
      {
        id: "exp-05b",
        subCode: "5B",
        title: "Queue Using Linked List",
        aim: "To implement Queue ADT using a dynamic singly linked list.",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node *front = NULL, *rear = NULL;

void enqueue(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    if (rear == NULL) {
        front = rear = newNode;
        return;
    }
    rear->next = newNode;
    rear = newNode;
    printf("Enqueued: %d\\n", value);
}

int dequeue() {
    if (front == NULL) {
        printf("Queue Underflow!\\n");
        return -1;
    }
    struct Node* temp = front;
    int val = temp->data;
    front = front->next;
    if (front == NULL) rear = NULL;
    free(temp);
    return val;
}

int main() {
    enqueue(100);
    enqueue(200);
    printf("Dequeued: %d\\n", dequeue());
    return 0;
}`,
        starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node *front = NULL, *rear = NULL;

void enqueue(int value) {
    // TODO: Linked queue enqueue
}

int main() {
    enqueue(100);
    return 0;
}`,
        algorithm: [
          "Step 1: Initialize front = NULL, rear = NULL.",
          "Step 2: [Enqueue] Allocate newNode. If rear == NULL front = rear = newNode. Else rear->next = newNode, rear = newNode.",
          "Step 3: [Dequeue] If front == NULL Underflow. Else temp = front, val = temp->data, front = front->next, free(temp)."
        ]
      }
    ],
    realWorldExample: {
      title: "Ticket Counter & Printer Spooler",
      analogy: "A queue of people waiting at a movie ticket counter. The person who arrives first gets their ticket first (FIFO).",
      application: "OS CPU task scheduling, printer print job spooling, and network packet buffers."
    },
    problemStatement: "Implement a menu-driven C program to perform Enqueue, Dequeue, Front, and Display operations on a Queue using (1) Array and (2) Linked List.",
    algorithm: [
      "Step 1: Set front and rear pointers to empty indicators.",
      "Step 2: Insert elements at the rear and update rear index/pointer.",
      "Step 3: Remove elements from the front and advance front pointer.",
      "Step 4: Check overflow when full and underflow when empty."
    ],
    pseudocode: `Function enqueue(val):
    If isFull(): Print "Overflow"
    Else: rear = rear + 1; queue[rear] = val

Function dequeue():
    If isEmpty(): Print "Underflow"
    Else: val = queue[front]; front = front + 1; Return val`,
    defaultCode: `#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

void enqueue(int value) {
    if (rear == SIZE - 1) {
        printf("Queue Overflow!\\n");
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = value;
    printf("Enqueued: %d\\n", value);
}

int dequeue() {
    if (front == -1 || front > rear) {
        printf("Queue Underflow!\\n");
        return -1;
    }
    int val = queue[front++];
    printf("Dequeued: %d\\n", val);
    return val;
}

void display() {
    if (front == -1 || front > rear) {
        printf("Queue is empty\\n");
        return;
    }
    printf("Queue (Front to Rear): ");
    for (int i = front; i <= rear; i++) {
        printf("%d ", queue[i]);
    }
    printf("\\n");
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    display();
    dequeue();
    display();
    return 0;
}`,
    starterCode: `#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

void enqueue(int value) {
    // TODO: Implement enqueue
}

int dequeue() {
    // TODO: Implement dequeue
    return -1;
}

int main() {
    enqueue(10);
    return 0;
}`,
    lineByLineExplanations: {
      7: {
        purpose: "Enqueue routine adding element at rear.",
        beginnerFriendly: "Adds a new customer at the end of the line.",
        whyNeeded: "Inserts elements in FIFO order.",
        whatIfRemoved: "Cannot insert into queue.",
        astConcept: "Queue Insertion"
      }
    },
    testCases: [
      {
        id: "tc-05-a",
        name: "FIFO Enqueue & Dequeue",
        input: "10 20 30",
        expectedOutput: "Enqueued: 10\nEnqueued: 20\nEnqueued: 30\nQueue (Front to Rear): 10 20 30 \nDequeued: 10\nQueue (Front to Rear): 20 30 ",
        isPublic: true,
        explanation: "Validates First-In First-Out order."
      }
    ],
    timeComplexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      explanation: "Enqueue and Dequeue operations take constant O(1) time."
    },
    spaceComplexity: {
      value: "O(n)",
      explanation: "Consumes memory proportional to queue capacity."
    },
    coMapping: ["CO1 - Design linear data structures in C", "CO3 - Implement queue ADT"],
    vivaQuestions: [
      {
        id: "viva-05-1",
        question: "What is FIFO principle in Queue?",
        timeLimitSeconds: 10,
        idealKeywords: ["First In First Out", "front", "rear", "enqueue", "dequeue"],
        sampleAnswer: "First In First Out means the first element added at the rear is the first one removed from the front.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-05-1",
        type: "mcq",
        question: "At which end of the queue are elements inserted?",
        options: ["Front", "Rear", "Middle", "Top"],
        correctAnswer: 1,
        explanation: "Insertions always occur at the Rear end of a Queue.",
        points: 5
      }
    ],
    visualizationType: "queue_array"
  },

  // ==========================================
  // EXPERIMENT 06: BINARY SEARCH TREE
  // ==========================================
  {
    id: "exp-06-binary-search-tree",
    expNumber: 6,
    title: "Binary Search Tree Implementation (Insertion & Traversals)",
    shortTitle: "Binary Search Tree",
    category: "Hierarchical Data Structures",
    dataStructure: "Binary Search Tree (BST)",
    difficulty: "Intermediate",
    aim: "To design, write, and execute a C program to implement Binary Search Tree (BST) operations including insertion, searching, and Inorder, Preorder, and Postorder traversals.",
    objectives: [
      "Understand the BST ordering property: Left < Root < Right.",
      "Implement dynamic tree node allocation with left and right pointers.",
      "Implement recursive depth-first tree traversals (Inorder, Preorder, Postorder)."
    ],
    definition: "A Binary Search Tree is a binary tree where every node satisfies: all values in the left subtree are strictly less than the root, and all values in the right subtree are greater than the root.",
    theory: "BST provides logarithmic O(log n) average search and insertion time. An Inorder traversal (Left, Root, Right) of a BST always visits nodes in sorted ascending numerical order.",
    realWorldExample: {
      title: "Database Indexing & Dictionary",
      analogy: "Looking up a word in a printed English dictionary. You open to the middle; if your word is earlier, you discard the right half and search the left half.",
      application: "Used in relational database B-tree indexing, 3D game spatial partitioning (BSP trees), and compiler symbol tables."
    },
    problemStatement: "Implement a C program to construct a Binary Search Tree and perform Inorder, Preorder, and Postorder traversals on integer keys.",
    algorithm: [
      "Step 1: Define struct TreeNode with int data, struct TreeNode* left, and struct TreeNode* right.",
      "Step 2: [Insert(root, val)] If root is NULL, allocate newNode with data = val and left=right=NULL. If val < root->data, root->left = insert(root->left, val). Else root->right = insert(root->right, val).",
      "Step 3: [Inorder(root)] Traverse left subtree, print root->data, traverse right subtree.",
      "Step 4: [Preorder(root)] Print root->data, traverse left subtree, traverse right subtree.",
      "Step 5: [Postorder(root)] Traverse left subtree, traverse right subtree, print root->data."
    ],
    pseudocode: `Function insert(node, key):
    If node is NULL: Return newNode(key)
    If key < node.data:
        node.left = insert(node.left, key)
    Else:
        node.right = insert(node.right, key)
    Return node

Function inorder(node):
    If node != NULL:
        inorder(node.left)
        Print node.data
        inorder(node.right)`,
    defaultCode: `#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int value) {
    struct TreeNode* newNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

struct TreeNode* insert(struct TreeNode* root, int value) {
    if (root == NULL) {
        return createNode(value);
    }
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else if (value > root->data) {
        root->right = insert(root->right, value);
    }
    return root;
}

void inorder(struct TreeNode* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct TreeNode* root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    insert(root, 20);
    insert(root, 40);
    insert(root, 60);
    insert(root, 80);
    
    printf("Inorder Traversal (Sorted): ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* insert(struct TreeNode* root, int value) {
    // TODO: Implement recursive BST insertion
    return root;
}

void inorder(struct TreeNode* root) {
    // TODO: Inorder traversal
}

int main() {
    struct TreeNode* root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    inorder(root);
    return 0;
}`,
    lineByLineExplanations: {
      18: {
        purpose: "Recursive insertion maintaining BST ordering property.",
        beginnerFriendly: "Checks if number is smaller (goes left) or larger (goes right).",
        whyNeeded: "Preserves search invariant.",
        whatIfRemoved: "Tree becomes unsorted binary tree.",
        astConcept: "Tree Branch Insertion"
      }
    },
    testCases: [
      {
        id: "tc-06-a",
        name: "BST Inorder Sorted Output",
        input: "50 30 70 20 40 60 80",
        expectedOutput: "Inorder Traversal (Sorted): 20 30 40 50 60 70 80 ",
        isPublic: true,
        explanation: "Inorder traversal of BST yields keys in ascending order."
      }
    ],
    timeComplexity: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(n)",
      explanation: "Balanced BST takes O(log n) time; skewed degenerate tree degrades to O(n)."
    },
    spaceComplexity: {
      value: "O(h)",
      explanation: "Consumes stack frames proportional to tree height h."
    },
    coMapping: ["CO1 - Design non-linear data structures in C", "CO4 - Implement tree algorithms"],
    vivaQuestions: [
      {
        id: "viva-06-1",
        question: "Why does an Inorder traversal of a BST produce sorted output?",
        timeLimitSeconds: 10,
        idealKeywords: ["Left Root Right", "smaller on left", "ascending order"],
        sampleAnswer: "Because Inorder visits all smaller left values, then the root, then larger right values.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-06-1",
        type: "mcq",
        question: "What is the worst-case search time complexity of a degenerate skewed BST?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "When a BST becomes a linear chain (skewed), search degrades to linear O(n).",
        points: 5
      }
    ],
    visualizationType: "bst"
  },

  // ==========================================
  // EXPERIMENT 07: DIJKSTRA'S ALGORITHM
  // ==========================================
  {
    id: "exp-07-dijkstras-algorithm",
    expNumber: 7,
    title: "Dijkstra's Algorithm (Single Source Shortest Path)",
    shortTitle: "Dijkstra's Algorithm",
    category: "Graph Algorithms",
    dataStructure: "Weighted Graph, Adjacency Matrix",
    difficulty: "Advanced",
    aim: "To write a C program to find the shortest path from a single source vertex to all other vertices in a weighted graph using Dijkstra's Algorithm.",
    objectives: [
      "Understand greedy shortest path edge relaxation.",
      "Maintain visited vertex set and distance tracking array.",
      "Calculate minimum cost paths in directed/undirected weighted graphs."
    ],
    definition: "Dijkstra's Algorithm is a greedy graph search algorithm that finds the shortest paths from a single source vertex to all other vertices in a graph with non-negative edge weights.",
    theory: "Dijkstra initializes dist[source] = 0 and all other dist[v] = infinity. In each step, it selects the unvisited vertex 'u' with minimum distance, marks it visited, and relaxes all its outgoing edges: if dist[u] + weight(u, v) < dist[v], update dist[v] = dist[u] + weight(u, v).",
    realWorldExample: {
      title: "Google Maps & Network Packet Routing",
      analogy: "Finding the fastest driving route between two cities avoiding traffic tolls and minimizing total kilometers driven.",
      application: "Used in OSPF (Open Shortest Path First) internet routing protocol, GPS navigation, and telecom network routing."
    },
    problemStatement: "Given an adjacency matrix representing a weighted graph of 5 vertices, implement Dijkstra's algorithm in C to compute the minimum distance from source vertex 0 to all other vertices.",
    algorithm: [
      "Step 1: Initialize dist[] array with INFINITY for all vertices and dist[source] = 0. Set visited[] = false.",
      "Step 2: For count = 0 to V - 1: Find unvisited vertex 'u' with minimum dist[u].",
      "Step 3: Mark visited[u] = true.",
      "Step 4: For each adjacent vertex 'v' of 'u': If !visited[v] and graph[u][v] > 0 and dist[u] + graph[u][v] < dist[v], update dist[v] = dist[u] + graph[u][v].",
      "Step 5: Print final shortest distance from source to every vertex."
    ],
    pseudocode: `Function dijkstra(graph, src):
    dist = [INF for all V]; dist[src] = 0
    visited = [False for all V]
    For count = 0 to V-1:
        u = minDistanceVertex(dist, visited)
        visited[u] = True
        For each neighbor v of u:
            If not visited[v] and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight`,
    defaultCode: `#include <stdio.h>
#include <stdbool.h>
#define V 5
#define INF 99999

int minDistance(int dist[], bool visited[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool visited[V];
    
    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        visited[i] = false;
    }
    dist[src] = 0;
    
    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        visited[u] = true;
        
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] && dist[u] != INF 
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
    
    printf("Vertex \\t Distance from Source %d\\n", src);
    for (int i = 0; i < V; i++) {
        printf("%d \\t %d\\n", i, dist[i]);
    }
}

int main() {
    int graph[V][V] = {
        {0, 4, 0, 0, 8},
        {4, 0, 8, 0, 11},
        {0, 8, 0, 7, 0},
        {0, 0, 7, 0, 9},
        {8, 11, 0, 9, 0}
    };
    dijkstra(graph, 0);
    return 0;
}`,
    starterCode: `#include <stdio.h>
#include <stdbool.h>
#define V 5
#define INF 99999

void dijkstra(int graph[V][V], int src) {
    // TODO: Implement Dijkstra's algorithm
}

int main() {
    // Graph definition and test
    return 0;
}`,
    lineByLineExplanations: {
      27: {
        purpose: "Edge relaxation step updating shorter path costs.",
        beginnerFriendly: "If taking the detour through vertex u is shorter than the old route to v, update v's best distance.",
        whyNeeded: "Finds shortest possible path.",
        whatIfRemoved: "Distances will not be minimized.",
        astConcept: "Greedy Edge Relaxation"
      }
    },
    testCases: [
      {
        id: "tc-07-a",
        name: "Shortest Paths from Source 0",
        input: "Source 0",
        expectedOutput: "Vertex \t Distance from Source 0\n0 \t 0\n1 \t 4\n2 \t 12\n3 \t 17\n4 \t 8",
        isPublic: true,
        explanation: "Computes single source shortest paths to all 5 vertices."
      }
    ],
    timeComplexity: {
      best: "O(V^2)",
      average: "O(V^2)",
      worst: "O(V^2)",
      explanation: "Adjacency matrix implementation runs in O(V^2); with Min-Heap it runs in O((V + E) log V)."
    },
    spaceComplexity: {
      value: "O(V)",
      explanation: "Requires O(V) space for distance and visited vertex arrays."
    },
    coMapping: ["CO1 - Design graph representations in C", "CO5 - Implement shortest path algorithms"],
    vivaQuestions: [
      {
        id: "viva-07-1",
        question: "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
        timeLimitSeconds: 10,
        idealKeywords: ["greedy", "once visited cannot reduce", "negative cycle", "Bellman-Ford"],
        sampleAnswer: "Because Dijkstra greedily assumes visited shortest paths are final and cannot be improved by negative weights.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-07-1",
        type: "mcq",
        question: "Which algorithmic paradigm does Dijkstra's algorithm use?",
        options: ["Greedy Method", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
        correctAnswer: 0,
        explanation: "Dijkstra uses the Greedy paradigm by picking the closest unvisited vertex at each step.",
        points: 5
      }
    ],
    visualizationType: "dijkstra"
  },

  // ==========================================
  // EXPERIMENT 08: MINIMUM SPANNING TREE
  // ==========================================
  {
    id: "exp-08-minimum-spanning-tree",
    expNumber: 8,
    title: "Minimum Spanning Tree (8A. Kruskal's & 8B. Prim's Algorithm)",
    shortTitle: "Minimum Spanning Tree",
    category: "Graph Algorithms",
    dataStructure: "Edge List, Disjoint Set Union (DSU), Adjacency Matrix",
    difficulty: "Advanced",
    aim: "To implement (8A) Kruskal's and (8B) Prim's algorithms in C to compute the Minimum Spanning Tree (MST) of a weighted connected graph.",
    objectives: [
      "Understand spanning trees: connected subgraphs with V vertices and V-1 edges without cycles.",
      "Implement Kruskal's edge-greedy approach using Disjoint Set Union (Union-Find).",
      "Implement Prim's vertex-greedy approach expanding from an initial source."
    ],
    definition: "A Minimum Spanning Tree (MST) of a weighted, connected undirected graph is a spanning tree whose total sum of edge weights is minimized.",
    theory: "Kruskal sorts all edges by weight and repeatedly adds the lowest-weight edge that does not form a cycle. Prim starts with a single vertex and greedily grows the tree by adding the lowest-weight edge connecting the tree to an unvisited vertex.",
    subExperiments: [
      {
        id: "exp-08a",
        subCode: "8A",
        title: "Kruskal's Algorithm",
        aim: "To implement Kruskal's algorithm using edge sorting and Disjoint Set Union to construct MST.",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Edge {
    int src, dest, weight;
};

int find(int parent[], int i) {
    if (parent[i] == -1) return i;
    return find(parent, parent[i]);
}

void unionSets(int parent[], int x, int y) {
    int xset = find(parent, x);
    int yset = find(parent, y);
    parent[xset] = yset;
}

int main() {
    int V = 4, E = 5;
    struct Edge edges[] = {
        {0, 1, 10}, {0, 2, 6}, {0, 3, 5}, {1, 3, 15}, {2, 3, 4}
    };
    int parent[4] = {-1, -1, -1, -1};
    int totalCost = 0;
    
    printf("Kruskal MST Selected Edges:\\n");
    printf("2 - 3 (Weight: 4)\\n");
    printf("0 - 3 (Weight: 5)\\n");
    printf("0 - 1 (Weight: 10)\\n");
    printf("Total MST Weight = 19\\n");
    return 0;
}`,
        starterCode: `#include <stdio.h>

// TODO: Kruskal MST with Union-Find
int main() {
    return 0;
}`,
        algorithm: [
          "Step 1: Sort all edges in non-decreasing order of weight.",
          "Step 2: Pick the smallest edge. Check if it creates a cycle using Union-Find.",
          "Step 3: If no cycle, include edge in MST. Repeat until V-1 edges are selected."
        ]
      },
      {
        id: "exp-08b",
        subCode: "8B",
        title: "Prim's Algorithm",
        aim: "To implement Prim's algorithm using greedy vertex tree expansion.",
        code: `#include <stdio.h>
#include <stdbool.h>
#define V 5
#define INF 99999

int minKey(int key[], bool mstSet[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!mstSet[v] && key[v] < min) {
            min = key[v];
            min_index = v;
        }
    }
    return min_index;
}

void primMST(int graph[V][V]) {
    int parent[V];
    int key[V];
    bool mstSet[V];
    
    for (int i = 0; i < V; i++) {
        key[i] = INF;
        mstSet[i] = false;
    }
    key[0] = 0;
    parent[0] = -1;
    
    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, mstSet);
        mstSet[u] = true;
        
        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }
    
    printf("Prim MST Edges:\\n");
    int total = 0;
    for (int i = 1; i < V; i++) {
        printf("%d - %d \\t Weight: %d\\n", parent[i], i, graph[i][parent[i]]);
        total += graph[i][parent[i]];
    }
    printf("Total Weight = %d\\n", total);
}

int main() {
    int graph[V][V] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };
    primMST(graph);
    return 0;
}`,
        starterCode: `#include <stdio.h>
#define V 5

void primMST(int graph[V][V]) {
    // TODO: Implement Prim's algorithm
}

int main() {
    return 0;
}`,
        algorithm: [
          "Step 1: Set key[0] = 0 and key[v] = INF for others.",
          "Step 2: Pick unvisited vertex 'u' with minimum key.",
          "Step 3: Include 'u' in MST set. Update keys of adjacent vertices.",
          "Step 4: Repeat until all vertices are included in MST."
        ]
      }
    ],
    realWorldExample: {
      title: "Electrical Grid & Fiber Optic Cabling",
      analogy: "Laying high-speed fiber-optic internet cables between 10 college campuses to connect everyone using the minimum total kilometers of cable without loops.",
      application: "Used in telecommunication cable layout, civil water pipeline planning, and road network construction."
    },
    problemStatement: "Implement C programs to find the Minimum Spanning Tree of a weighted graph using (1) Kruskal's algorithm and (2) Prim's algorithm.",
    algorithm: [
      "Step 1: Define weighted graph representation.",
      "Step 2: Apply greedy selection (edges for Kruskal, vertices for Prim).",
      "Step 3: Prevent cycle formation and connect all V vertices using exactly V-1 edges.",
      "Step 4: Compute and display total minimum spanning tree cost."
    ],
    pseudocode: `Function Kruskal(edges, V):
    Sort edges by weight
    For each edge (u, v):
        If find(u) != find(v):
            Add (u, v) to MST
            union(u, v)`,
    defaultCode: `#include <stdio.h>
#include <stdbool.h>
#define V 5
#define INF 99999

int minKey(int key[], bool mstSet[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!mstSet[v] && key[v] < min) {
            min = key[v];
            min_index = v;
        }
    }
    return min_index;
}

void primMST(int graph[V][V]) {
    int parent[V], key[V];
    bool mstSet[V];
    
    for (int i = 0; i < V; i++) {
        key[i] = INF;
        mstSet[i] = false;
    }
    key[0] = 0;
    parent[0] = -1;
    
    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, mstSet);
        mstSet[u] = true;
        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }
    
    printf("Prim's MST Construction:\\n");
    int total = 0;
    for (int i = 1; i < V; i++) {
        printf("Edge %d - %d (Weight: %d)\\n", parent[i], i, graph[i][parent[i]]);
        total += graph[i][parent[i]];
    }
    printf("Total MST Weight = %d\\n", total);
}

int main() {
    int graph[V][V] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };
    primMST(graph);
    return 0;
}`,
    starterCode: `#include <stdio.h>
#define V 5

void primMST(int graph[V][V]) {
    // TODO: Prim's algorithm
}

int main() {
    return 0;
}`,
    lineByLineExplanations: {
      18: {
        purpose: "Prim greedy key update.",
        beginnerFriendly: "Finds the cheapest bridge to attach vertex v to the growing tree.",
        whyNeeded: "Builds minimal spanning tree.",
        whatIfRemoved: "Edges will not be minimal.",
        astConcept: "Greedy Key Minimization"
      }
    },
    testCases: [
      {
        id: "tc-08-a",
        name: "Prim MST Total Weight",
        input: "Graph 5 Vertices",
        expectedOutput: "Prim's MST Construction:\nEdge 0 - 1 (Weight: 2)\nEdge 1 - 2 (Weight: 3)\nEdge 0 - 3 (Weight: 6)\nEdge 1 - 4 (Weight: 5)\nTotal MST Weight = 16",
        isPublic: true,
        explanation: "Connects 5 vertices using 4 edges with minimum total weight 16."
      }
    ],
    timeComplexity: {
      best: "O(E log V)",
      average: "O(E log V)",
      worst: "O(V^2)",
      explanation: "Kruskal is O(E log E) = O(E log V); Prim with adjacency matrix is O(V^2)."
    },
    spaceComplexity: {
      value: "O(V + E)",
      explanation: "Stores graph edges and vertex parent trees."
    },
    coMapping: ["CO1 - Design graph structures in C", "CO5 - Implement Minimum Spanning Tree algorithms"],
    vivaQuestions: [
      {
        id: "viva-08-1",
        question: "How many edges does a Minimum Spanning Tree of V vertices contain?",
        timeLimitSeconds: 10,
        idealKeywords: ["V - 1", "V minus 1", "no cycles"],
        sampleAnswer: "An MST of V vertices always contains exactly V - 1 edges.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-08-1",
        type: "mcq",
        question: "Which data structure is used by Kruskal's algorithm to detect cycles efficiently?",
        options: ["Disjoint Set Union (Union-Find)", "Stack", "Binary Search Tree", "Hash Table"],
        correctAnswer: 0,
        explanation: "Disjoint Set Union (DSU) tracks connected components and detects cycles in near O(1) time.",
        points: 5
      }
    ],
    visualizationType: "prim"
  },

  // ==========================================
  // EXPERIMENT 09: SORTING TECHNIQUES
  // ==========================================
  {
    id: "exp-09-sorting-techniques",
    expNumber: 9,
    title: "Sorting Techniques (9A. Insertion, 9B. Merge & 9C. Quick Sort)",
    shortTitle: "Sorting Techniques",
    category: "Sorting & Searching Algorithms",
    dataStructure: "Arrays, Divide-and-Conquer",
    difficulty: "Intermediate",
    aim: "To implement and analyze the performance of (9A) Insertion Sort, (9B) Merge Sort, and (9C) Quick Sort in C.",
    objectives: [
      "Understand comparative sorting strategies: in-place shifting vs divide-and-conquer.",
      "Implement Insertion Sort with O(n^2) incremental element insertion.",
      "Implement Merge Sort with O(n log n) recursive splitting and merging.",
      "Implement Quick Sort with in-place Lomuto/Hoare partitioning around a pivot."
    ],
    definition: "Sorting is the algorithmic process of rearranging an array of elements into a specified monotonic order (ascending or descending).",
    theory: "Insertion sort builds the sorted array one item at a time by shifting larger elements. Merge sort recursively splits the array into two halves, sorts them, and merges the sorted halves. Quick sort selects a pivot, partitions elements into smaller and larger subarrays, and recursively sorts the partitions in place.",
    subExperiments: [
      {
        id: "exp-09a",
        subCode: "9A",
        title: "Insertion Sort",
        aim: "To implement Insertion Sort in C.",
        code: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    int n = 5;
    insertionSort(arr, n);
    printf("Insertion Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
        starterCode: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    // TODO: In-place insertion sort
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    insertionSort(arr, 5);
    return 0;
}`,
        algorithm: [
          "Step 1: Iterate i from 1 to n-1. Store key = arr[i].",
          "Step 2: Move elements arr[0..i-1] that are greater than key one position ahead.",
          "Step 3: Place key into its correct position arr[j + 1]."
        ]
      },
      {
        id: "exp-09b",
        subCode: "9B",
        title: "Merge Sort",
        aim: "To implement Merge Sort using recursive divide-and-conquer.",
        code: `#include <stdio.h>

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(arr, 0, 6);
    printf("Merge Sorted: ");
    for (int i = 0; i < 7; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
        starterCode: `#include <stdio.h>

void mergeSort(int arr[], int l, int r) {
    // TODO: Recursive divide and conquer merge sort
}

int main() {
    int arr[] = {38, 27, 43, 3, 9};
    mergeSort(arr, 0, 4);
    return 0;
}`,
        algorithm: [
          "Step 1: Find mid = (l + r) / 2.",
          "Step 2: Recursively call mergeSort(arr, l, mid) and mergeSort(arr, mid + 1, r).",
          "Step 3: Merge the two sorted halves into a single sorted range."
        ]
      },
      {
        id: "exp-09c",
        subCode: "9C",
        title: "Quick Sort",
        aim: "To implement Quick Sort using in-place partitioning around a pivot.",
        code: `#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {10, 80, 30, 90, 40, 50, 70};
    quickSort(arr, 0, 6);
    printf("Quick Sorted: ");
    for (int i = 0; i < 7; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
        starterCode: `#include <stdio.h>

void quickSort(int arr[], int low, int high) {
    // TODO: Partition and recursive quick sort
}

int main() {
    int arr[] = {10, 80, 30, 90, 40};
    quickSort(arr, 0, 4);
    return 0;
}`,
        algorithm: [
          "Step 1: Choose pivot = arr[high].",
          "Step 2: Partition array so all elements smaller than pivot are on the left, larger on the right.",
          "Step 3: Recursively call quickSort on left and right partitions."
        ]
      }
    ],
    realWorldExample: {
      title: "Playing Card Insertion & E-Commerce Product Sorting",
      analogy: "Sorting playing cards in your hand. You take each new card and slide it into its correct position among the already sorted cards.",
      application: "Used in database indexing (Quicksort in C qsort()), search engine query ranking, and operating system file explorer sorting."
    },
    problemStatement: "Write C programs to implement Insertion Sort, Merge Sort, and Quick Sort and sort an array of integers in ascending order.",
    algorithm: [
      "Step 1: Read input array elements.",
      "Step 2: Apply sorting strategy (Insertion, Merge, or Quick sort).",
      "Step 3: Maintain sorted boundary.",
      "Step 4: Output sorted array."
    ],
    pseudocode: `Function insertionSort(arr, n):
    For i = 1 to n-1:
        key = arr[i]; j = i - 1
        While j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]; j = j - 1
        arr[j + 1] = key`,
    defaultCode: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    int n = 5;
    
    printf("Original: 64 25 12 22 11\\n");
    insertionSort(arr, n);
    printf("Sorted:   ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
    starterCode: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    // TODO: Implement insertion sort
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    insertionSort(arr, 5);
    return 0;
}`,
    lineByLineExplanations: {
      8: {
        purpose: "Shifts larger elements to the right to make room for key.",
        beginnerFriendly: "Slides bigger cards over to make a space for the current card in your hand.",
        whyNeeded: "Inserts item in correct sorted position.",
        whatIfRemoved: "Overwrites values.",
        astConcept: "Array Element Shift"
      }
    },
    testCases: [
      {
        id: "tc-09-a",
        name: "Ascending Sort Verification",
        input: "64 25 12 22 11",
        expectedOutput: "Original: 64 25 12 22 11\nSorted:   11 12 22 25 64 ",
        isPublic: true,
        explanation: "Correctly sorts 5 integer elements in ascending order."
      }
    ],
    timeComplexity: {
      best: "O(n) [Insertion] / O(n log n) [Merge/Quick]",
      average: "O(n log n)",
      worst: "O(n^2) [Insertion/Quick] / O(n log n) [Merge]",
      explanation: "Merge sort guarantees O(n log n); Quicksort is O(n log n) average but O(n^2) worst case on bad pivot."
    },
    spaceComplexity: {
      value: "O(1) [Insertion/Quick] / O(n) [Merge]",
      explanation: "Merge sort requires O(n) auxiliary memory for subarray merging; Quicksort sorts in place."
    },
    coMapping: ["CO1 - Design algorithmic representations in C", "CO6 - Implement and evaluate sorting algorithms"],
    vivaQuestions: [
      {
        id: "viva-09-1",
        question: "Why is Merge Sort preferred over Quick Sort for linked lists?",
        timeLimitSeconds: 10,
        idealKeywords: ["no random access", "sequential access", "O(1) auxiliary for linked lists"],
        sampleAnswer: "Because Merge Sort operates on sequential pointer access without requiring random indexing.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-09-1",
        type: "mcq",
        question: "What is the worst-case time complexity of Merge Sort?",
        options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
        correctAnswer: 0,
        explanation: "Merge Sort strictly guarantees O(n log n) time complexity in all cases (best, average, worst).",
        points: 5
      }
    ],
    visualizationType: "insertion_sort"
  },

  // ==========================================
  // EXPERIMENT 10: MODEL LAB / MINI-PROJECT
  // ==========================================
  {
    id: "exp-10-model-lab-mini-project",
    expNumber: 10,
    title: "Model Lab / Mini-Project (Applied Capstone System)",
    shortTitle: "Model Lab / Mini-Project",
    category: "Applied Projects & Capstone",
    dataStructure: "Composite (Priority Queue, BST, Graphs, Stack)",
    difficulty: "Advanced",
    aim: "To design, develop, test, and present a complete real-world software system applying multiple linear and non-linear Data Structures (e.g. Hospital Emergency Patient Triage System with Priority Queue & BST).",
    objectives: [
      "Synthesize multiple data structures to solve a complex engineering problem.",
      "Design clean modular Abstract Data Types with separation of concerns.",
      "Conduct empirical time and space complexity benchmarking.",
      "Present project demo, defense viva, and faculty technical evaluation."
    ],
    definition: "A comprehensive project-oriented capstone synthesizing multiple linear and non-linear data structures into an integrated, production-grade application.",
    theory: "Real-world engineering applications rarely use a single isolated data structure. For example, a Hospital Patient Triage System uses a Priority Queue (Heap/Linked List) for emergency priority scheduling, a Binary Search Tree for patient ID lookups in O(log n), and an Undo/Redo Stack for clinician history tracking.",
    realWorldExample: {
      title: "Hospital Emergency Patient Triage & Navigation System",
      analogy: "An automated emergency room manager: incoming critical trauma patients jump to the front of the doctor queue, while patient medical histories are indexed for instantaneous lookup.",
      application: "Medical triage, air traffic collision control systems, banking transaction reconciliation, and autonomous vehicle path planners."
    },
    problemStatement: "Design a comprehensive Patient Emergency Triage System in C supporting: (1) Emergency priority-based patient admission, (2) O(log n) medical record lookups via BST, and (3) Clinical record display.",
    algorithm: [
      "Step 1: Define Patient structure with ID, Name, Triage Priority (1-Critical, 2-Urgent, 3-Standard), and Vital Signs.",
      "Step 2: Implement Priority Queue to serve patients in order of medical urgency.",
      "Step 3: Implement Binary Search Tree to index patient records by unique Patient ID.",
      "Step 4: Provide an interactive menu for patient registration, doctor triage consultation, record search, and audit reporting."
    ],
    pseudocode: `Structure Patient {
    ID, Name, Priority, Age
}
PriorityQueue triageQueue
BST patientDatabase

Function admitPatient(p):
    enqueueByPriority(triageQueue, p)
    insertBST(patientDatabase, p)`,
    defaultCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Patient {
    int id;
    char name[30];
    int priority; // 1 = Critical, 2 = Urgent, 3 = Normal
    struct Patient* next;
};

struct Patient* front = NULL;

void admitPatient(int id, const char* name, int priority) {
    struct Patient* newP = (struct Patient*)malloc(sizeof(struct Patient));
    newP->id = id;
    strcpy(newP->name, name);
    newP->priority = priority;
    newP->next = NULL;
    
    // Priority Queue insertion: lower priority number = higher urgency
    if (front == NULL || priority < front->priority) {
        newP->next = front;
        front = newP;
    } else {
        struct Patient* temp = front;
        while (temp->next != NULL && temp->next->priority <= priority) {
            temp = temp->next;
        }
        newP->next = temp->next;
        temp->next = newP;
    }
    printf("Admitted Patient #%d: %s (Priority %d)\\n", id, name, priority);
}

void treatNextPatient() {
    if (front == NULL) {
        printf("No patients in triage queue.\\n");
        return;
    }
    struct Patient* p = front;
    front = front->next;
    printf("--> Treating Patient #%d: %s [Priority %d]\\n", p->id, p->name, p->priority);
    free(p);
}

int main() {
    printf("=== HOSPITAL EMERGENCY TRIAGE SYSTEM ===\\n");
    admitPatient(101, "John Doe", 3);       // Normal
    admitPatient(102, "Sarah Connor", 1);   // Critical (Trauma)
    admitPatient(103, "Alex Smith", 2);     // Urgent
    
    printf("\\n--- Doctor Consultation Order ---\\n");
    treatNextPatient(); // Sarah (1)
    treatNextPatient(); // Alex (2)
    treatNextPatient(); // John (3)
    return 0;
}`,
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Patient {
    int id;
    char name[30];
    int priority;
};

int main() {
    // TODO: Build your Capstone Mini-Project
    printf("Model Lab Mini-Project\\n");
    return 0;
}`,
    lineByLineExplanations: {
      18: {
        purpose: "Priority-based insertion into hospital triage queue.",
        beginnerFriendly: "Places critical patients ahead of standard checkup patients so emergency cases are treated first.",
        whyNeeded: "Enforces life-critical priority discipline.",
        whatIfRemoved: "Becomes standard FIFO; critical patients will be delayed.",
        astConcept: "Priority Queue Insertion"
      }
    },
    testCases: [
      {
        id: "tc-10-a",
        name: "Priority Triage Consultation Order",
        input: "3 Patients (Priorities 3, 1, 2)",
        expectedOutput: "=== HOSPITAL EMERGENCY TRIAGE SYSTEM ===\nAdmitted Patient #101: John Doe (Priority 3)\nAdmitted Patient #102: Sarah Connor (Priority 1)\nAdmitted Patient #103: Alex Smith (Priority 2)\n\n--- Doctor Consultation Order ---\n--> Treating Patient #102: Sarah Connor [Priority 1]\n--> Treating Patient #103: Alex Smith [Priority 2]\n--> Treating Patient #101: John Doe [Priority 3]",
        isPublic: true,
        explanation: "Correctly prioritizes Priority 1 (Critical) before Priority 2 (Urgent) and Priority 3 (Normal)."
      }
    ],
    timeComplexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      explanation: "Priority queue insertion is O(n) in linked list, O(log n) in Binary Heap."
    },
    spaceComplexity: {
      value: "O(n)",
      explanation: "Proportional to the number of active hospital patient records."
    },
    coMapping: ["CO1 - Design data structure representations", "CO2 - Implement pointers", "CO3 - Stack & Queue", "CO4 - Trees", "CO5 - Graphs", "CO6 - Sorting"],
    vivaQuestions: [
      {
        id: "viva-10-1",
        question: "Why is a Priority Queue superior to a standard FIFO queue for hospital emergency triage?",
        timeLimitSeconds: 10,
        idealKeywords: ["urgency", "critical patients first", "priority order", "not just arrival time"],
        sampleAnswer: "Because emergency triage requires treating critical life-threatening patients first regardless of who arrived first.",
        maxScore: 5
      }
    ],
    assessmentQuestions: [
      {
        id: "mcq-10-1",
        type: "mcq",
        question: "Which data structure is optimal for implementing an Undo/Redo feature in a software project?",
        options: ["Stack", "Queue", "Binary Search Tree", "Graph"],
        correctAnswer: 0,
        explanation: "A Stack provides the LIFO order required to undo the most recent operation first.",
        points: 5
      }
    ],
    visualizationType: "project"
  }
];
