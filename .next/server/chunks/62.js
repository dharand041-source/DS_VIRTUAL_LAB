"use strict";exports.id=62,exports.ids=[62],exports.modules={1062:(e,t,n)=>{n.d(t,{H:()=>i,r:()=>a});let i={maxMarks:75,codingWeight:30,assessmentWeight:20,vivaWeight:15,facultyObservationWeight:10,regulation:"Anna University Lab Regulation (Configurable 75 Marks)"},a=[{id:"exp-01-singly-linked-list",expNumber:1,title:"Implementation of Singly Linked List ADT",shortTitle:"Singly Linked List",category:"Linear Data Structures",aim:"To design, write and implement a C program to perform basic operations on a Singly Linked List including creation, insertion at beginning/end, deletion, and traversal.",objectives:["Understand dynamic memory allocation using malloc() in C.","Comprehend self-referential structures (struct Node).","Implement pointer manipulation for node linkage.","Analyze time and space complexity of linked list operations."],definition:"A Singly Linked List is a linear dynamic data structure composed of nodes, where each node contains two fields: 'data' (the payload) and 'next' (a pointer storing the memory address of the subsequent node in the sequence). The last node points to NULL.",theory:"Unlike arrays with contiguous memory allocation and fixed sizes, linked lists allocate memory dynamically on the heap during runtime. Each node is linked sequentially through pointers. This eliminates array overflow issues and allows O(1) insertions and deletions at the head without shifting remaining elements.",realWorldExample:{title:"Train Coaches & Music Playlist",analogy:"Think of a train where each coach is physically hooked to the next coach behind it. The engine is the 'HEAD'. If you want to attach a new coach at the front, you disconnect the engine, connect it to the new coach, and connect the new coach to the rest.",application:"Used in OS memory management, music player playlists (Next track pointer), image viewers, and undo/redo stacks."},problemStatement:"Write a C program to implement a Singly Linked List ADT with operations: (1) Insert at beginning, (2) Insert at end, (3) Delete by value, (4) Display all elements, and (5) Search for an element.",algorithm:["Step 1: Define a self-referential structure 'Node' with an integer 'data' and a struct pointer 'next'.","Step 2: Initialize 'head' pointer to NULL to indicate an empty list.","Step 3: [Insert Beginning] Allocate memory for 'newNode' using malloc. Assign 'newNode->data = value'. Set 'newNode->next = head'. Update 'head = newNode'.","Step 4: [Insert End] Allocate 'newNode'. If head is NULL, set head = newNode. Otherwise, traverse with 'temp' until 'temp->next == NULL'. Set 'temp->next = newNode'.","Step 5: [Display] Traverse from 'head' using pointer 'temp', printing 'temp->data' until temp becomes NULL.","Step 6: [Delete] If head contains key, update head = head->next and free old head. Else find node preceding key, bypass it, and free target node."],pseudocode:`Structure Node {
    Integer data
    Pointer to Node next
}
Pointer head = NULL

Function insertAtBeginning(val):
    newNode = allocate Node
    newNode.data = val
    newNode.next = head
    head = newNode

Function display():
    temp = head
    While temp != NULL:
        print temp.data ->
        temp = temp.next
    print NULL`,defaultCode:`#include <stdio.h>
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
}`,starterCode:`#include <stdio.h>
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
}`,lineByLineExplanations:{1:{purpose:"Header inclusion for Standard Input and Output functions.",beginnerFriendly:"#include <stdio.h> brings in printf() and scanf() tools so our C program can communicate with the user.",whyNeeded:"Without this, the compiler will not recognize printf() to display output.",whatIfRemoved:"Compiler error: 'printf' undeclared.",astConcept:"Preprocessor Directive"},2:{purpose:"Header inclusion for Dynamic Memory Management (malloc, free).",beginnerFriendly:"#include <stdlib.h> gives us access to malloc() to request memory from the operating system heap.",whyNeeded:"Dynamic nodes require runtime heap memory allocation.",whatIfRemoved:"Compiler warning / error: implicit declaration of function 'malloc'.",astConcept:"Preprocessor Directive"},4:{purpose:"Declares a self-referential structure named 'Node'.",beginnerFriendly:"struct Node creates a custom blueprint having two compartments: an integer data and a pointer to another Node.",whyNeeded:"Standard primitive types cannot bundle data and memory links together.",whatIfRemoved:"You cannot construct linked list nodes.",astConcept:"Type Definition / Struct Declaration"},5:{purpose:"Data field of the node.",beginnerFriendly:"int data holds the actual value or number stored in this linked list compartment.",whyNeeded:"Stores the student's payload or numerical data.",whatIfRemoved:"The node has no payload to store.",astConcept:"Struct Member Declaration"},6:{purpose:"Pointer field storing the address of the next node.",beginnerFriendly:"struct Node* next is a pointer that holds the memory address of the next box in the chain.",whyNeeded:"Links consecutive nodes together.",whatIfRemoved:"Nodes cannot point to each other; chain breaks.",astConcept:"Self-Referential Pointer"},9:{purpose:"Global head pointer initialized to NULL.",beginnerFriendly:"struct Node* head = NULL sets our starting pointer to empty (0), meaning our list has zero items currently.",whyNeeded:"The entry point to traverse or modify any linked list.",whatIfRemoved:"Uninitialized pointer pointing to garbage memory (Segmentation fault).",astConcept:"Global Pointer Variable"},11:{purpose:"Function definition for inserting an element at the front.",beginnerFriendly:"void insertAtBeginning(int value) is a function that creates a new node and puts it right at the start.",whyNeeded:"Provides O(1) front insertion capability.",whatIfRemoved:"You cannot prepend nodes to your list.",astConcept:"Function Declaration"},12:{purpose:"Allocates memory on the heap for a single Node.",beginnerFriendly:"malloc(sizeof(struct Node)) asks the computer for enough heap space to store one node and returns its address.",whyNeeded:"Static variables inside functions vanish when function exits; heap memory persists.",whatIfRemoved:"No memory allocated; program will crash when assigning data.",astConcept:"Dynamic Memory Allocation"},13:{purpose:"Assigns value to newNode data compartment.",beginnerFriendly:"newNode->data = value copies the input number into the data slot of our freshly created node.",whyNeeded:"Initializes node data.",whatIfRemoved:"Node stores random garbage integer.",astConcept:"Pointer Member Assignment"},14:{purpose:"Points new node to existing head.",beginnerFriendly:"newNode->next = head connects our new node's arrow to whatever was previously first in line.",whyNeeded:"Ensures existing chain is preserved before head pointer is overwritten.",whatIfRemoved:"All previously added nodes are orphaned in memory (Memory Leak).",astConcept:"Pointer Linkage"},15:{purpose:"Updates head pointer to new node.",beginnerFriendly:"head = newNode makes our new node the official first element of the list.",whyNeeded:"Head must always designate the starting node.",whatIfRemoved:"Head still points to old node; new node is unreachable.",astConcept:"Head Pointer Mutation"},38:{purpose:"Traverses list and prints every node until NULL.",beginnerFriendly:"while (temp != NULL) loops through every node in the chain one by one until reaching the end.",whyNeeded:"Reads all elements sequentially.",whatIfRemoved:"Cannot display or inspect the linked list.",astConcept:"Pointer Traversal Loop"}},testCases:[{id:"tc-01",name:"Basic Insert & Display",input:"10 20 30",expectedOutput:"20 -> 10 -> 30 -> 40 -> NULL",isPublic:!0,explanation:"Inserts 10 then 20 at beginning, then 30 and 40 at end."},{id:"tc-02",name:"Multiple Head Insertions",input:"5 15 25",expectedOutput:"20 -> 10 -> 30 -> 40 -> NULL",isPublic:!0,explanation:"Verifies correct ordering after consecutive head and tail insertions."},{id:"tc-03",name:"Boundary Empty Traversal",input:"EMPTY",expectedOutput:"NULL",isPublic:!1,explanation:"Tests that an unpopulated list safely outputs NULL without crashing."}],timeComplexity:{best:"O(1)",average:"O(n)",worst:"O(n)",explanation:"Insertion at beginning is O(1). Insertion at end or searching requires O(n) traversal from head to tail."},spaceComplexity:{value:"O(n)",explanation:"Each node consumes sizeof(int) + sizeof(pointer) = 12-16 bytes on heap per element."},coMapping:["CO1 - Design linear data structure representations in C","CO2 - Implement dynamic memory operations with pointers"],vivaQuestions:[{id:"viva-01",question:"What is a self-referential structure in C and why is it used in Linked Lists?",timeLimitSeconds:10,idealKeywords:["struct","pointer","same type","next","address"],sampleAnswer:"A structure that contains a pointer to another structure of the same type, allowing nodes to link sequentially.",maxScore:5},{id:"viva-02",question:"What will happen if you do not set the last node's 'next' pointer to NULL?",timeLimitSeconds:10,idealKeywords:["garbage","segmentation fault","infinite loop","crash"],sampleAnswer:"It will contain garbage pointer address causing undefined behavior, infinite loops, or segmentation faults.",maxScore:5},{id:"viva-03",question:"Compare array vs singly linked list insertion time complexity at the beginning.",timeLimitSeconds:10,idealKeywords:["O(1)","O(n)","shift","linked list is faster"],sampleAnswer:"Linked list is O(1) by updating head, while array is O(n) because all existing elements must shift right.",maxScore:5}],assessmentQuestions:[{id:"mcq-01",type:"mcq",question:"Which C operator is used to access structure members through a pointer?",options:[". (dot operator)","-> (arrow operator)","* (dereference only)","& (address-of)"],correctAnswer:1,explanation:"The arrow operator (->) dereferences the pointer and accesses the structure member in one step.",points:5},{id:"mcq-02",type:"output_prediction",question:'If head points to Node(10)->Node(20)->NULL, what is printed by `printf("%d", head->next->data);`?',codeSnippet:`struct Node* head; // points to 10 -> 20 -> NULL
printf("%d", head->next->data);`,options:["10","20","Address of 20","NULL"],correctAnswer:1,explanation:"head->next points to the second node whose data value is 20.",points:5},{id:"mcq-03",type:"debug",question:"Identify the bug in this insertion snippet:",codeSnippet:`void insert(int x) {
    struct Node* temp;
    temp->data = x;
    temp->next = head;
    head = temp;
}`,options:["temp is not allocated using malloc()","head should not be assigned to temp","temp->next should be NULL","No return statement"],correctAnswer:0,explanation:"temp is an uninitialized wild pointer. Memory must be allocated using malloc before dereferencing.",points:5}],visualizationType:"linked_list"},{id:"exp-02-stack-using-array",expNumber:2,title:"Implementation of Stack ADT using Array",shortTitle:"Stack ADT (Array)",category:"Linear Data Structures",aim:"To implement the Stack Abstract Data Type using a fixed-size 1D array in C with Push, Pop, Peek, and Display operations.",objectives:["Comprehend the Last-In-First-Out (LIFO) access discipline.","Manage top pointer index boundaries (Overflow at MAX-1, Underflow at -1).","Implement constant O(1) push and pop operations."],definition:"A Stack is a linear data structure following the LIFO (Last-In-First-Out) principle, where insertions (push) and deletions (pop) occur strictly at one end designated as 'TOP'.",theory:"In array-based stack implementation, a static array of size MAX is declared alongside an integer variable 'top' initialized to -1. When top == MAX-1, stack overflow occurs. When top == -1, stack underflow occurs.",realWorldExample:{title:"Pile of Plates & Browser Back Button",analogy:"A stack of dinner plates in a cafeteria. The plate placed last on the pile is the very first one picked up.",application:"Browser forward/back navigation history, undo/redo mechanisms in text editors, recursion call frames in OS."},problemStatement:"Design a menu-driven C program to implement Stack ADT using an array of size 5 supporting PUSH, POP, PEEK, and DISPLAY with error messages for overflow and underflow.",algorithm:["Step 1: Declare array 'stack[MAX]' and set 'top = -1'.","Step 2: [Push(val)] If top == MAX - 1, print 'Stack Overflow'. Else increment top by 1, and set stack[top] = val.","Step 3: [Pop()] If top == -1, print 'Stack Underflow'. Else return stack[top] and decrement top by 1.","Step 4: [Peek()] If top == -1, print empty. Else return stack[top].","Step 5: [Display] Iterate from top down to 0 and print each stack[i]."],pseudocode:`Global stack[MAX], top = -1

Function push(val):
    If top == MAX - 1:
        Print "Overflow"
    Else:
        top = top + 1
        stack[top] = val

Function pop():
    If top == -1:
        Print "Underflow"
    Else:
        val = stack[top]
        top = top - 1
        return val`,defaultCode:`#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int value) {
    if (top == MAX - 1) {
        printf("Stack Overflow! Cannot push %d\\n", value);
        return;
    }
    top = top + 1;
    stack[top] = value;
    printf("Pushed: %d (TOP = %d)\\n", value, top);
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
        printf("Stack is empty.\\n");
        return;
    }
    printf("Stack Elements (Top to Bottom):\\n");
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
}`,starterCode:`#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int value) {
    // TODO: Implement push with overflow check
}

int pop() {
    // TODO: Implement pop with underflow check
    return -1;
}

int main() {
    push(10);
    push(20);
    return 0;
}`,lineByLineExplanations:{2:{purpose:"Defines constant MAX stack capacity.",beginnerFriendly:"#define MAX 5 sets the maximum plate count in our stack box to 5 slots.",whyNeeded:"Sets a boundary for the fixed-size array.",whatIfRemoved:"Compiler will not recognize MAX symbol.",astConcept:"Macro Definition"},4:{purpose:"Declares static integer array for stack items.",beginnerFriendly:"int stack[MAX] reserves 5 continuous integer memory boxes in RAM.",whyNeeded:"Storage buffer for stack elements.",whatIfRemoved:"No storage space for elements.",astConcept:"Array Variable Declaration"},5:{purpose:"Initializes top index to -1.",beginnerFriendly:"int top = -1 means our stack currently has 0 items. Index -1 indicates completely empty.",whyNeeded:"Tracks the topmost valid element index.",whatIfRemoved:"Top contains garbage, causing array out-of-bounds corruption.",astConcept:"Global Variable Initialization"},8:{purpose:"Stack overflow boundary verification.",beginnerFriendly:"if (top == MAX - 1) checks if the stack is 100% full before we try adding another plate.",whyNeeded:"Prevents writing past array bounds (Buffer Overflow).",whatIfRemoved:"Buffer overflow error and memory corruption.",astConcept:"Boundary Conditional"},12:{purpose:"Increments top pointer index.",beginnerFriendly:"top = top + 1 moves the top marker up to point to the next free room.",whyNeeded:"Prepares array slot for new item.",whatIfRemoved:"Overwrites index 0 repeatedly.",astConcept:"Pointer/Index Increment"},13:{purpose:"Stores value at top index.",beginnerFriendly:"stack[top] = value writes the number into the topmost position.",whyNeeded:"Stores payload.",whatIfRemoved:"Value is lost.",astConcept:"Array Assignment"}},testCases:[{id:"tc-stack-01",name:"Push 3 and Pop 1",input:"10 20 30",expectedOutput:"Pushed: 10\nPushed: 20\nPushed: 30\nPopped: 30",isPublic:!0,explanation:"Verifies LIFO order where 30 is popped first."},{id:"tc-stack-02",name:"Overflow Guard Test",input:"1 2 3 4 5 6",expectedOutput:"Stack Overflow! Cannot push 6",isPublic:!0,explanation:"Capacity is 5; the 6th push must trigger overflow message."}],timeComplexity:{best:"O(1)",average:"O(1)",worst:"O(1)",explanation:"Push, Pop, and Peek operations perform simple arithmetic on the 'top' index in constant time."},spaceComplexity:{value:"O(MAX)",explanation:"Fixed array size allocated upfront regardless of actual element count."},coMapping:["CO1 - Design linear data structure representations in C","CO3 - Analyze time complexities of LIFO stacks"],vivaQuestions:[{id:"viva-stack-01",question:"Why is 'top' initialized to -1 instead of 0 in array stack?",timeLimitSeconds:10,idealKeywords:["0-indexed","index 0 is valid","empty indicator","-1"],sampleAnswer:"Because C arrays are 0-indexed; index 0 holds an element, so -1 represents an empty stack.",maxScore:5},{id:"viva-stack-02",question:"What is stack underflow and when does it occur?",timeLimitSeconds:10,idealKeywords:["empty","pop on empty","top == -1"],sampleAnswer:"Stack underflow occurs when attempting to pop or delete an element from an empty stack (top == -1).",maxScore:5}],assessmentQuestions:[{id:"mcq-stk-01",type:"mcq",question:"If elements 'A', 'B', 'C' are pushed in order, what is the order of elements popped?",options:["A, B, C","C, B, A","B, C, A","C, A, B"],correctAnswer:1,explanation:"Stack is LIFO, so 'C' (last in) comes out first, followed by 'B' then 'A'.",points:5}],visualizationType:"stack_array"},{id:"exp-03-stack-using-linked-list",expNumber:3,title:"Implementation of Stack ADT using Linked List",shortTitle:"Stack ADT (Linked List)",category:"Linear Data Structures",aim:"To implement dynamic Stack ADT using a singly linked list in C, overcoming static array size limitations.",objectives:["Dynamically allocate stack nodes with malloc().","Implement Push as insertion at head and Pop as deletion at head.","Understand why dynamic stack never overflows unless heap is exhausted."],definition:"A Linked Stack is a dynamic implementation of Stack ADT using nodes where 'top' acts as the head pointer. Push inserts a node at the head, and Pop removes the node at head.",theory:"Unlike array stacks which have a rigid MAX limit, a linked stack can grow and shrink dynamically according to available heap memory. Memory is allocated on demand and returned via free() when popped.",realWorldExample:{title:"Infinite Call Stack in Modern Runtimes",analogy:"A receipt spike at a restaurant counter. Every new ticket is spiked on top. The cook pulls off the top receipt first.",application:"Expression parsing engines, recursive function call stack frames, compiler syntax analyzers."},problemStatement:"Write a C program to implement Stack using Linked List with PUSH, POP, PEEK and DISPLAY functions with proper dynamic memory allocation and deallocation.",algorithm:["Step 1: Define struct Node { int data; struct Node* next; } and initialize 'top = NULL'.","Step 2: [Push(val)] Allocate newNode. If allocation fails, print Heap Overflow. Set newNode->data = val, newNode->next = top, top = newNode.","Step 3: [Pop()] If top == NULL, print Underflow. Else temp = top, top = top->next, val = temp->data, free(temp), return val.","Step 4: [Display] Traverse temp from top to NULL and print each value."],pseudocode:`Pointer top = NULL

Function push(val):
    newNode = allocate Node
    newNode.data = val
    newNode.next = top
    top = newNode

Function pop():
    If top == NULL:
        Print "Underflow"
    Else:
        temp = top
        top = top.next
        val = temp.data
        free temp
        return val`,defaultCode:`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* top = NULL;

void push(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    if (newNode == NULL) {
        printf("Heap Memory Exhausted!\\n");
        return;
    }
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
    int poppedVal = temp->data;
    top = top->next;
    free(temp);
    printf("Popped: %d\\n", poppedVal);
    return poppedVal;
}

void display() {
    struct Node* temp = top;
    if (temp == NULL) {
        printf("Stack is empty\\n");
        return;
    }
    printf("Stack (Top to Bottom):\\n");
    while (temp != NULL) {
        printf("| %d |%s\\n", temp->data, (temp == top ? " <-- TOP" : ""));
        temp = temp->next;
    }
}

int main() {
    push(100);
    push(200);
    push(300);
    display();
    pop();
    display();
    return 0;
}`,starterCode:`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* top = NULL;

void push(int value) {
    // TODO: Dynamic push
}

int pop() {
    // TODO: Dynamic pop and free memory
    return -1;
}

int main() {
    push(100);
    push(200);
    return 0;
}`,lineByLineExplanations:{9:{purpose:"Top pointer for the linked stack.",beginnerFriendly:"struct Node* top = NULL creates our pointer pointing to the current highest node on the stack.",whyNeeded:"Designates the stack entry and exit point.",whatIfRemoved:"Cannot track the top node.",astConcept:"Global Pointer"},12:{purpose:"Dynamic memory allocation for new stack frame node.",beginnerFriendly:"malloc creates a brand new box in heap memory for the pushed number.",whyNeeded:"Dynamic expansion.",whatIfRemoved:"Cannot store new elements.",astConcept:"Heap Allocation"},18:{purpose:"Links new node to previous top and moves top.",beginnerFriendly:"newNode->next = top connects new node to the old top; top = newNode makes the new node the king of the stack.",whyNeeded:"Maintains LIFO link.",whatIfRemoved:"Broken stack linkage.",astConcept:"Pointer Linkage"},30:{purpose:"Frees heap memory of popped node.",beginnerFriendly:"free(temp) returns the discarded node's RAM back to the operating system.",whyNeeded:"Prevents memory leaks.",whatIfRemoved:"Memory leak in long-running programs.",astConcept:"Dynamic Memory Deallocation"}},testCases:[{id:"tc-stk-ll-01",name:"Push and Pop Sequence",input:"100 200 300",expectedOutput:"Pushed: 100\nPushed: 200\nPushed: 300\nPopped: 300",isPublic:!0,explanation:"Ensures 300 is popped first according to LIFO rules."}],timeComplexity:{best:"O(1)",average:"O(1)",worst:"O(1)",explanation:"Push and Pop only touch the top node at the head in O(1) time."},spaceComplexity:{value:"O(n)",explanation:"Each node consumes heap memory dynamically for integer data and next pointer."},coMapping:["CO1 - Design linear data structure representations in C","CO2 - Implement dynamic memory operations with pointers"],vivaQuestions:[{id:"viva-stk-ll-01",question:"Why does a linked stack not suffer from fixed-size overflow?",timeLimitSeconds:10,idealKeywords:["heap","dynamic allocation","malloc","grows on demand"],sampleAnswer:"Because memory is dynamically allocated node-by-node on the heap as long as system memory is available.",maxScore:5}],assessmentQuestions:[{id:"mcq-stk-ll-01",type:"mcq",question:"In a linked list implementation of stack, where should Push and Pop operations take place for O(1) complexity?",options:["At the head/beginning","At the tail/end","In the middle","At random positions"],correctAnswer:0,explanation:"Inserting and deleting at the head is O(1). Doing it at the tail requires traversing the entire list in O(n).",points:5}],visualizationType:"stack_linked_list"},{id:"exp-04-balanced-parentheses",expNumber:4,title:"Check for Balanced Parentheses using Stack",shortTitle:"Balanced Parentheses",category:"Applications of Stack",aim:"To design and implement a C program to check whether a given arithmetic or code expression has balanced delimiters (parentheses '()', curly brackets '{}', and square brackets '[]') using a character stack.",objectives:["Apply Stack ADT to solve compiler delimiter validation problems.","Understand character matching logic for opening and closing brackets.","Detect mismatch errors and unclosed delimiter errors."],definition:"An expression has balanced parentheses if every opening delimiter `(`, `{`, `[` has a corresponding closing delimiter of the same type `)`, `}`, `]` and delimiters are properly nested.",theory:"When scanning the expression from left to right: (1) If an opening bracket is found, push it onto the stack. (2) If a closing bracket is found, pop the top bracket and verify matching type. (3) If stack is empty on closing bracket or doesn't match, expression is invalid. (4) After scanning entire string, if stack is empty, it is balanced.",realWorldExample:{title:"C Compiler & IDE Syntax Highlighting",analogy:"Packing nesting Russian dolls. You must close the smallest inner doll before you can close the larger outer doll.",application:"Used in compilers (GCC/Clang), XML/HTML tag validators, and IDE bracket pair colorizers."},problemStatement:"Given a string of characters containing '(', ')', '{', '}', '[', ']', write a C program using a stack to check if the delimiters are balanced.",algorithm:["Step 1: Initialize a character stack with top = -1.","Step 2: Traverse the input string character by character.","Step 3: If character is '(', '{', or '[', push it onto the stack.","Step 4: If character is ')', '}', or ']', check if stack is empty (Underflow -> Unbalanced). Else pop character 'ch' and check if matches.","Step 5: If mismatched pair (e.g. '(' with '}'), return Unbalanced.","Step 6: At end of string, if top == -1 return Balanced, else return Unbalanced (Unclosed brackets remaining)."],pseudocode:`Function isBalanced(expr):
    stack = createStack()
    For each char in expr:
        If char in ['(', '{', '[']:
            push(stack, char)
        Else If char in [')', '}', ']']:
            If isEmpty(stack): return False
            topChar = pop(stack)
            If not isMatchingPair(topChar, char):
                return False
    Return isEmpty(stack)`,defaultCode:`#include <stdio.h>
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
    top = -1; // Reset stack
    for (int i = 0; expr[i] != '\\0'; i++) {
        char ch = expr[i];
        if (ch == '(' || ch == '{' || ch == '[') {
            push(ch);
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (top == -1) return 0; // Closing bracket without opening
            char popped = pop();
            if (!isMatchingPair(popped, ch)) return 0; // Mismatched type
        }
    }
    return (top == -1); // Must be empty at end
}

int main() {
    char exp1[] = "{[()]}";
    char exp2[] = "{[(])}";
    
    printf("%s is %s\\n", exp1, isBalanced(exp1) ? "BALANCED" : "NOT BALANCED");
    printf("%s is %s\\n", exp2, isBalanced(exp2) ? "BALANCED" : "NOT BALANCED");
    return 0;
}`,starterCode:`#include <stdio.h>
#include <string.h>
#define MAX 100

char stack[MAX];
int top = -1;

int isBalanced(char* expr) {
    // TODO: Push opening brackets, pop & match closing brackets
    return 1;
}

int main() {
    char exp[] = "{[()]}";
    printf("%s is %s\\n", exp, isBalanced(exp) ? "BALANCED" : "NOT BALANCED");
    return 0;
}`,lineByLineExplanations:{22:{purpose:"Evaluates if opening and closing delimiters match in type.",beginnerFriendly:"isMatchingPair verifies that '(' matches ')', '{' matches '}', and '[' matches ']'.",whyNeeded:"Prevents mismatched closures like `(}`.",whatIfRemoved:"Code will falsely accept mismatched brackets.",astConcept:"Helper Predicate"},30:{purpose:"Pushes opening delimiters onto stack.",beginnerFriendly:"When the program sees an opening bracket like '{', it puts it in the stack backpack to wait for its partner.",whyNeeded:"Saves expected closing requirements.",whatIfRemoved:"Stack stays empty; matching impossible.",astConcept:"Stack Push on Condition"},35:{purpose:"Pops top opening bracket and checks if it matches current closing bracket.",beginnerFriendly:"When we see a closing bracket, we check if it matches the most recent opening bracket in our backpack.",whyNeeded:"Validates correct nesting.",whatIfRemoved:"Incorrect nesting will not be caught.",astConcept:"Stack Pop & Comparison"},40:{purpose:"Final empty stack check.",beginnerFriendly:"return (top == -1) ensures that every single opening bracket found its closing partner and none were left behind.",whyNeeded:"Catches unclosed brackets like `(()`.",whatIfRemoved:"Expressions with unclosed opening brackets will be incorrectly marked as balanced.",astConcept:"Terminal State Verification"}},testCases:[{id:"tc-paren-01",name:"Fully Nested Balanced",input:"{[()]}",expectedOutput:"{[()]} is BALANCED\n{[(])} is NOT BALANCED",isPublic:!0,explanation:"Correctly evaluates properly nested brackets vs interleaved cross-nested brackets."}],timeComplexity:{best:"O(n)",average:"O(n)",worst:"O(n)",explanation:"Single linear pass scanning 'n' characters in the expression with O(1) stack operations."},spaceComplexity:{value:"O(n)",explanation:"Stack can hold up to 'n' opening brackets in worst case like `(((((`."},coMapping:["CO1 - Design linear data structure representations in C","CO3 - Implement stack applications"],vivaQuestions:[{id:"viva-paren-01",question:"Why is a Stack data structure specifically used for parentheses balancing rather than a Queue?",timeLimitSeconds:10,idealKeywords:["LIFO","last opened first closed","nested order"],sampleAnswer:"Because bracket nesting requires the most recently opened delimiter to be closed first (LIFO order).",maxScore:5}],assessmentQuestions:[{id:"mcq-paren-01",type:"mcq",question:"Which expression is properly balanced?",options:["[(])","([{}])","({[})]","(((())"],correctAnswer:1,explanation:"([{}]) has properly paired inner brackets closed before outer brackets.",points:5}],visualizationType:"parentheses"}]}};