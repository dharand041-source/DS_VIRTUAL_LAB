import { ASTProgramState, ASTVariable, ASTVisualNode, ASTStackItem, LinePedagogicalExplanation } from './types';

/**
 * Continuous Live C AST & Pedagogical Explanation Engine
 * Analyzes code line-by-line in real time as the student writes or navigates code.
 */
export function analyzeCProgramState(code: string, currentLineNumber: number = 1): ASTProgramState {
  const lines = code.split('\n');
  const variables: ASTVariable[] = [];
  const nodes: ASTVisualNode[] = [];
  const stackItems: ASTStackItem[] = [];
  const callStack: string[] = ['main()'];
  const consoleOutput: string[] = [];

  let activePointerName: string | undefined = undefined;
  let activePointerTarget: string | null = null;
  let loopStatus: ASTProgramState['loopStatus'] = undefined;

  let nextNodeAddress = 0x1020;
  const maxLine = Math.min(Math.max(1, currentLineNumber), lines.length);

  // Simulated node storage
  const simulatedNodes: Map<string, { value: number | string; next: string | null; address: string }> = new Map();
  let headNodeId: string | null = null;
  let simulatedTop = -1;
  const simulatedArrayStack: (number | string)[] = [];

  // Parse lines up to currentLineNumber to build program state
  for (let i = 0; i < maxLine; i++) {
    const line = lines[i]?.trim() || '';
    if (!line || line.startsWith('//') || line.startsWith('/*')) continue;

    // 1. Primitive Variable Declarations: int x = 10; char ch = 'a';
    const varDeclMatch = line.match(/(?:int|char|float|double|long)\s+([a-zA-Z_]\w*)\s*(?:=\s*([^;]+))?;/);
    if (varDeclMatch) {
      const varName = varDeclMatch[1];
      const valRaw = varDeclMatch[2] ? varDeclMatch[2].trim() : '0';
      const existingIdx = variables.findIndex(v => v.name === varName);
      const varObj: ASTVariable = {
        name: varName,
        type: line.startsWith('int') ? 'int' : line.startsWith('char') ? 'char' : line.startsWith('float') ? 'float' : 'var',
        value: isNaN(Number(valRaw)) ? valRaw.replace(/['"]/g, '') : Number(valRaw),
        scope: 'local',
        address: `0x${(0x7fff0000 + i * 4).toString(16)}`
      };
      if (existingIdx >= 0) {
        variables[existingIdx] = varObj;
      } else {
        variables.push(varObj);
      }
    }

    // 2. Variable assignments & increments: x = 10; top = top + 1; top++; ++top;
    if (line.includes('top = -1')) {
      simulatedTop = -1;
    } else if (line.includes('top = top + 1') || line.includes('++top') || line.includes('top++')) {
      simulatedTop++;
    } else if (line.includes('top = top - 1') || line.includes('--top') || line.includes('top--')) {
      simulatedTop = Math.max(-1, simulatedTop - 1);
    }

    // 3. Linked List calls in main or functions
    const insertBegCall = line.match(/insertAtBeginning\s*\(\s*(\d+)\s*\)/);
    if (insertBegCall) {
      const val = parseInt(insertBegCall[1], 10);
      const newId = `node-${val}-${i}`;
      const addr = `0x${(nextNodeAddress += 0x20).toString(16)}`;
      simulatedNodes.set(newId, { value: val, next: headNodeId, address: addr });
      headNodeId = newId;
      consoleOutput.push(`Inserted ${val} at Beginning`);
    }

    const insertEndCall = line.match(/insertAtEnd\s*\(\s*(\d+)\s*\)/);
    if (insertEndCall) {
      const val = parseInt(insertEndCall[1], 10);
      const newId = `node-${val}-${i}`;
      const addr = `0x${(nextNodeAddress += 0x20).toString(16)}`;
      simulatedNodes.set(newId, { value: val, next: null, address: addr });
      if (!headNodeId) {
        headNodeId = newId;
      } else {
        let curr = headNodeId;
        while (curr && simulatedNodes.get(curr)?.next) {
          curr = simulatedNodes.get(curr)!.next!;
        }
        if (curr && simulatedNodes.has(curr)) {
          simulatedNodes.get(curr)!.next = newId;
        }
      }
      consoleOutput.push(`Inserted ${val} at End`);
    }

    // 4. Pointer updates
    if (line.includes('head = newNode') || line.includes('head = NULL') || line.includes('top = newNode')) {
      activePointerName = line.includes('head') ? 'head' : 'top';
      activePointerTarget = headNodeId;
    }

    // 5. Stack push / pop
    const pushCall = line.match(/push\s*\(\s*([^)]+)\s*\)/);
    if (pushCall) {
      const rawVal = pushCall[1].replace(/['"]/g, '').trim();
      const val = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
      simulatedArrayStack.push(val);
      consoleOutput.push(`Pushed ${val}`);
    }

    const popCall = line.match(/pop\s*\(\s*\)/);
    if (popCall && simulatedArrayStack.length > 0) {
      const popped = simulatedArrayStack.pop();
      consoleOutput.push(`Popped ${popped}`);
    }

    // 6. Loop tracking
    const forLoopMatch = line.match(/for\s*\(\s*(?:int\s+)?([a-zA-Z_]\w*)\s*=\s*(\d+|top)\s*;\s*([^;]+);\s*([^)]+)\)/);
    if (forLoopMatch) {
      loopStatus = {
        variable: forLoopMatch[1],
        currentIteration: isNaN(Number(forLoopMatch[2])) ? 0 : Number(forLoopMatch[2]),
        condition: forLoopMatch[3].trim(),
        isTerminated: false
      };
    }
  }

  // Populate dynamic linked list nodes
  let currId = headNodeId;
  const visited = new Set<string>();
  while (currId && !visited.has(currId)) {
    visited.add(currId);
    const nodeData = simulatedNodes.get(currId);
    if (!nodeData) break;
    nodes.push({
      id: currId,
      value: nodeData.value,
      address: nodeData.address,
      nextAddress: nodeData.next ? simulatedNodes.get(nodeData.next)?.address || '0x2000' : 'NULL',
      isHead: currId === headNodeId,
      isTail: nodeData.next === null,
      isHighlighted: false
    });
    currId = nodeData.next;
  }

  // Fallback visual nodes for Linked List if empty
  if (nodes.length === 0 && (code.includes('struct Node') || code.includes('insertAtBeginning'))) {
    nodes.push(
      { id: 'n1', value: 20, address: '0x1040', nextAddress: '0x1020', isHead: true, isHighlighted: false },
      { id: 'n2', value: 10, address: '0x1020', nextAddress: '0x1060', isHighlighted: false },
      { id: 'n3', value: 30, address: '0x1060', nextAddress: '0x1080', isHighlighted: false },
      { id: 'n4', value: 40, address: '0x1080', nextAddress: 'NULL', isTail: true, isHighlighted: false }
    );
  }

  // Populate stack items
  if (simulatedArrayStack.length > 0) {
    simulatedArrayStack.forEach((val, idx) => {
      stackItems.push({
        id: `stk-${idx}`,
        value: val,
        index: idx,
        isTop: idx === simulatedArrayStack.length - 1
      });
    });
  } else if (code.includes('stack[') || code.includes('top = -1')) {
    stackItems.push(
      { id: 's1', value: '{', index: 0, isTop: false },
      { id: 's2', value: '[', index: 1, isTop: false },
      { id: 's3', value: '(', index: 2, isTop: true }
    );
  }

  // Generate live line explanation
  const activeLineText = lines[currentLineNumber - 1] !== undefined ? lines[currentLineNumber - 1] : '';
  const lineExplanation = generateDynamicLiveExplanation(activeLineText, currentLineNumber);

  return {
    activeLineNumber: currentLineNumber,
    activeLineText: activeLineText.trim(),
    variables,
    nodes,
    stackItems,
    activePointerName,
    activePointerTarget,
    loopStatus,
    callStack,
    consoleOutput,
    lineExplanation
  };
}

/**
 * Universal dynamic C code explainer for ANY arbitrary line of code written by the student.
 */
export function generateDynamicLiveExplanation(rawLine: string, lineNum: number): LinePedagogicalExplanation {
  const line = rawLine.trim();

  // 1. Empty line or Comment
  if (!line || line.startsWith('//') || line.startsWith('/*')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'general',
      purpose: "Comment / Whitespace line.",
      whatItDoes: "This line is ignored by the C compiler during compilation. It exists solely for human readers to document algorithms.",
      whyUsed: "Documents the purpose of subsequent code sections for readability and maintainability.",
      whyNeeded: "Clear comments make complex pointer algorithms understandable during laboratory viva and code reviews.",
      whatIfRemoved: "No impact on binary execution or compilation.",
      internalMemoryEffect: "Consumes 0 bytes of RAM. Discarded during the Lexical Analysis compiler phase.",
      beginnerFriendly: "Like a sticky note on your notebook page — it helps you remember what you're doing, but the computer skips right past it!",
      keySymbols: [{ symbol: '//', meaning: 'Single-line comment marker in C' }]
    };
  }

  // 2. Preprocessor Directives (#include, #define)
  if (line.startsWith('#include')) {
    const header = line.includes('<stdio.h>') ? 'stdio.h (Standard I/O)' : line.includes('<stdlib.h>') ? 'stdlib.h (Memory Allocation)' : line.includes('<string.h>') ? 'string.h (String Utilities)' : 'Header File';
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'preprocessor',
      purpose: `Includes the ${header} standard library header.`,
      whatItDoes: `Instructs the C preprocessor to copy function prototypes (like ${line.includes('stdio') ? 'printf, scanf' : line.includes('stdlib') ? 'malloc, free, exit' : 'strlen, strcmp'}) into this file before compilation begins.`,
      whyUsed: `Gives our program access to proven system functions without writing OS device drivers from scratch.`,
      whyNeeded: `The C compiler strictly requires prototypes before functions can be invoked.`,
      whatIfRemoved: `Compiler will produce 'implicit declaration of function' errors and fail to link.`,
      internalMemoryEffect: `Processed at compile-time. Introduces standard library symbol tables into the symbol resolution table.`,
      beginnerFriendly: `Think of this as grabbing a toolbox from the workshop before you start building. stdio.h is the display screen toolbox, and stdlib.h is the memory creation toolbox!`,
      keySymbols: [
        { symbol: '#include', meaning: 'Preprocessor directive to insert external library declarations' },
        { symbol: '<...>', meaning: 'Directs preprocessor to search standard system include paths' }
      ],
      potentialMistakes: ['Forgetting #include <stdlib.h> when using malloc/free causes undefined pointer behavior.']
    };
  }

  if (line.startsWith('#define')) {
    const match = line.match(/#define\s+([a-zA-Z_]\w*)\s+(.+)/);
    const macroName = match ? match[1] : 'MACRO';
    const macroVal = match ? match[2] : 'VALUE';
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'preprocessor',
      purpose: `Defines constant macro '${macroName}' with value ${macroVal}.`,
      whatItDoes: `The preprocessor performs literal textual search-and-replace, replacing all occurrences of '${macroName}' with '${macroVal}' across the code.`,
      whyUsed: `Avoids hardcoding 'magic numbers' everywhere. If stack capacity changes from 5 to 100, you only change this one line.`,
      whyNeeded: `Enforces single-source-of-truth array bounds and constant boundaries.`,
      whatIfRemoved: `All array declarations using '${macroName}' will fail with 'undeclared identifier' compiler errors.`,
      internalMemoryEffect: `Consumes 0 bytes of runtime variable RAM. Values are directly baked into machine code instructions.`,
      beginnerFriendly: `Like a find-and-replace rule in MS Word! Everywhere it sees '${macroName}', it swaps it with '${macroVal}' before compiling.`,
      keySymbols: [{ symbol: '#define', meaning: 'Macro definition for compile-time token substitution' }]
    };
  }

  // 3. Self-Referential Structure (struct Node)
  if (line.includes('struct Node') && (line.includes('{') || line.includes('};'))) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'struct_type',
      purpose: "Declares a self-referential structure blueprint named 'Node'.",
      whatItDoes: "Defines a custom composite data type combining data fields (payload) and a pointer to another 'struct Node' of the exact same type.",
      whyUsed: "Arrays cannot grow dynamically or link disparate memory boxes. Self-referential structs create chainable building blocks.",
      whyNeeded: "Fundamental requirement for Linked Lists, Stacks, Queues, and Binary Trees in C.",
      whatIfRemoved: "Cannot instantiate dynamic nodes; linked list data structure becomes impossible.",
      internalMemoryEffect: "Defines memory alignment blueprint: sizeof(int) [4B] + sizeof(pointer) [8B] = 16 bytes per node (with padding).",
      beginnerFriendly: "Imagine building a train coach. Each coach has a passenger cabin (data) and a metal hitch coupling (next pointer) to hook up the coach behind it!",
      keySymbols: [
        { symbol: 'struct', meaning: 'Keyword defining a custom composite record' },
        { symbol: 'struct Node*', meaning: 'Self-referential pointer storing the address of the next node' }
      ],
      potentialMistakes: ['Forgetting the semicolon at the end: `struct Node { ... };` is a very common syntax error!']
    };
  }

  // 4. Dynamic Memory Allocation (malloc, sizeof, free)
  if (line.includes('malloc') || line.includes('sizeof')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'dynamic_memory',
      purpose: "Dynamic Heap Memory Allocation using malloc().",
      whatItDoes: "Requests a contiguous block of bytes from the Operating System Heap at runtime and returns a void pointer cast to the target type.",
      whyUsed: "Local variables inside functions are destroyed when the function finishes (Stack). Heap memory created with malloc persists until explicitly freed.",
      whyNeeded: "Dynamic data structures must grow and shrink in size based on user input during execution.",
      whatIfRemoved: "Variables created locally will be overwritten on the stack, causing immediate crashes or Segmentation Faults.",
      internalMemoryEffect: "Heap allocation: OS kernel marks 16 bytes as occupied in the process heap and returns the starting memory address (e.g. 0x1040).",
      beginnerFriendly: "malloc is like asking hotel reception for a room key. The hotel (RAM) gives you room number 0x1040. You can store your luggage there as long as you want until you check out (free)!",
      keySymbols: [
        { symbol: 'malloc()', meaning: 'Memory Allocate function from <stdlib.h>' },
        { symbol: 'sizeof()', meaning: 'Compile-time operator returning type size in bytes' },
        { symbol: '(struct Node*)', meaning: 'Explicit typecast converting void* address to Node pointer' }
      ],
      potentialMistakes: [
        'Always check if the returned pointer is NULL (which happens when RAM is completely exhausted).',
        'Failing to free() allocated nodes causes Memory Leaks in long-running programs.'
      ]
    };
  }

  if (line.includes('free(')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'dynamic_memory',
      purpose: "Deallocates Heap Memory using free().",
      whatItDoes: "Returns the dynamically allocated memory block referenced by the pointer back to the Operating System heap manager.",
      whyUsed: "Prevents memory leaks and ensures system RAM is recycled for future allocations.",
      whyNeeded: "In C, there is no automatic garbage collector. Programmers must manually return unused memory.",
      whatIfRemoved: "Memory leak occurs; repeated allocations will eventually exhaust system memory and crash the OS process.",
      internalMemoryEffect: "Marks heap address block as free in the memory allocator freelist. The pointer variable becomes a 'dangling pointer'.",
      beginnerFriendly: "Checking out of the hotel room! You give the key back to reception so another guest can use the room.",
      keySymbols: [{ symbol: 'free(ptr)', meaning: 'Releases heap memory block back to the OS memory pool' }],
      potentialMistakes: ['Never use or dereference a pointer after calling free() on it (Use-After-Free bug).']
    };
  }

  // 5. Pointer Manipulations & Arrows (head = newNode, temp->next = ..., head = NULL)
  if (line.includes('head = NULL') || line.includes('top = NULL')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: "Initializes pointer to NULL (Empty State).",
      whatItDoes: "Sets the starting anchor pointer address to 0x0 (NULL), signifying that the data structure currently contains 0 nodes.",
      whyUsed: "Uninitialized pointers in C contain random 'garbage' memory addresses that point to arbitrary RAM locations.",
      whyNeeded: "Provides a safe, checkable sentinel condition (if head == NULL) before attempting traversal.",
      whatIfRemoved: "Wild pointer pointing to garbage memory causes immediate Segmentation Fault upon first dereference.",
      internalMemoryEffect: "Writes address 0x00000000 into the 8-byte pointer slot.",
      beginnerFriendly: "Starting with a clean slate! Setting head = NULL is like hanging an 'Empty - 0 Items' sign on our list.",
      keySymbols: [{ symbol: 'NULL', meaning: 'Null pointer constant representing memory address 0' }]
    };
  }

  if (line.includes('newNode->next = head') || line.includes('newNode->next = top')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: "Preserves existing chain by linking new node to current head/top.",
      whatItDoes: "Copies the memory address currently stored in 'head' into the 'next' pointer field of the newly created node.",
      whyUsed: "Ensures the entire existing sequence of nodes remains attached before we update the head pointer.",
      whyNeeded: "If we update head first, the memory address of all existing nodes is lost forever (Memory Leak).",
      whatIfRemoved: "All previously created nodes in the list are permanently orphaned and inaccessible.",
      internalMemoryEffect: "Node at 0x1040 now stores address 0x1020 in its 'next' field.",
      beginnerFriendly: "Before you become the new leader of the line, you grab the hand of the person who was previously standing first!",
      keySymbols: [{ symbol: '->', meaning: 'Arrow operator: dereferences pointer and accesses structure member' }]
    };
  }

  if (line.includes('head = newNode') || line.includes('top = newNode')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: "Updates starting anchor pointer to the new node.",
      whatItDoes: "Stores the address of 'newNode' into the global 'head' / 'top' pointer variable.",
      whyUsed: "Makes the newly created node the official first element of the linked list or top of the stack.",
      whyNeeded: "All operations and traversals begin from the head pointer.",
      whatIfRemoved: "The new node is never recognized as the starting node; list remains unchanged.",
      internalMemoryEffect: "Global pointer variable now points to the new heap address (e.g. 0x1040).",
      beginnerFriendly: "Crowning the new leader! Head now points proudly to our brand new node.",
      keySymbols: [{ symbol: '=', meaning: 'Assignment: updates pointer address' }]
    };
  }

  if (line.includes('temp->next = newNode')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: "Appends new node to the tail of the linked list.",
      whatItDoes: "Modifies the 'next' pointer of the current last node from NULL to point to the newly allocated node.",
      whyUsed: "Connects a new element at the very end of the sequential chain.",
      whyNeeded: "Extends the linked list dynamically at the tail end.",
      whatIfRemoved: "The tail node continues pointing to NULL, leaving the new node disconnected.",
      internalMemoryEffect: "The node at tail address overwrites its NULL pointer with the address of newNode.",
      beginnerFriendly: "Hooking on a new caboose at the very back of the train!",
      keySymbols: [{ symbol: '->next', meaning: 'Accesses the next node pointer compartment' }]
    };
  }

  if (line.includes('temp = temp->next')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: "Advances traversal pointer to the subsequent node.",
      whatItDoes: "Follows the 'next' pointer link, updating the temporary pointer 'temp' to the address of the next node in the chain.",
      whyUsed: "Steps sequentially from node to node during display, search, or insertion operations.",
      whyNeeded: "Without advancing the pointer, traversal loops will examine the same node infinitely.",
      whatIfRemoved: "Causes an Infinite Loop, freezing the program on the first node forever.",
      internalMemoryEffect: "Pointer register updates from current node address (e.g. 0x1040) to next node address (0x1020).",
      beginnerFriendly: "Taking a step forward! Jumping from one stepping stone to the next one across the river.",
      keySymbols: [{ symbol: 'temp', meaning: 'Temporary traversal cursor pointer' }]
    };
  }

  // 6. Stack Specific Operations (Array & Character Stack)
  if (line.includes('int top = -1') || line.includes('top = -1')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'stack_op',
      purpose: "Initializes / Resets Stack Top index to -1 (Empty Stack).",
      whatItDoes: "Sets the integer index 'top' to -1, indicating that the stack array contains zero elements.",
      whyUsed: "C arrays are 0-indexed. Array index 0 holds an element, so index -1 mathematically represents an empty stack.",
      whyNeeded: "Establishes the base underflow boundary condition before pushing or popping items.",
      whatIfRemoved: "Top will hold an undefined garbage integer, causing out-of-bounds array writes on first push.",
      internalMemoryEffect: "Stack variable 'top' initialized to -1 (0xFFFFFFFF).",
      beginnerFriendly: "Starting with an empty plate dispenser! -1 means zero plates are loaded.",
      keySymbols: [{ symbol: 'top = -1', meaning: 'Standard sentinel value for empty array stack' }]
    };
  }

  if (line.includes('top == MAX - 1') || line.includes('top < MAX - 1')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'stack_op',
      purpose: "Stack Overflow Boundary Verification.",
      whatItDoes: "Compares current top index against maximum array capacity boundary (MAX - 1).",
      whyUsed: "Guards against pushing elements into a stack that is already 100% full.",
      whyNeeded: "Writing past the end of a fixed array buffer causes Memory Corruption and Buffer Overflow vulnerabilities.",
      whatIfRemoved: "Buffer overflow: program will overwrite adjacent memory and crash with segmentation fault.",
      internalMemoryEffect: "CPU comparison instruction: compares register 'top' with constant (MAX - 1).",
      beginnerFriendly: "Checking if the elevator is full before letting another passenger step inside!",
      keySymbols: [
        { symbol: 'MAX - 1', meaning: 'Highest valid 0-based array index' },
        { symbol: '==', meaning: 'Equality comparison operator' }
      ]
    };
  }

  if (line.includes('top == -1') || (line.includes('top >= 0') && line.includes('pop'))) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'stack_op',
      purpose: "Stack Underflow Boundary Verification.",
      whatItDoes: "Checks whether the stack is empty (top == -1) before attempting to retrieve or delete an element.",
      whyUsed: "Prevents popping or reading from a non-existent element in an empty stack.",
      whyNeeded: "Popping an empty stack is an invalid logical operation and would access stack[-1] (invalid memory).",
      whatIfRemoved: "Array out-of-bounds error: reads garbage values from memory preceding the array.",
      internalMemoryEffect: "Evaluates zero-flag in CPU status register based on 'top == -1'.",
      beginnerFriendly: "Looking into the biscuit tin before reaching in — if it's empty, you can't take a biscuit out!",
      keySymbols: [{ symbol: 'Underflow', meaning: 'Attempting deletion from an already empty data structure' }]
    };
  }

  if (line.includes('stack[++top] =') || line.includes('stack[top] =')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'stack_op',
      purpose: "Stack PUSH Operation (Increment TOP & Store Value).",
      whatItDoes: "Increments top pointer index by 1 (pre-increment ++top) and writes the input value into the new topmost array slot.",
      whyUsed: "Implements the core LIFO (Last-In-First-Out) insertion discipline in constant O(1) time.",
      whyNeeded: "Places new items directly on the peak of the stack.",
      whatIfRemoved: "Item is not saved to the stack storage buffer.",
      internalMemoryEffect: "Writes payload to array base address + (top * sizeof(element)).",
      beginnerFriendly: "Placing a brand new plate right on top of the pile! The top marker moves up by one.",
      keySymbols: [
        { symbol: '++top', meaning: 'Pre-increment: increments index first, then accesses array slot' },
        { symbol: 'stack[...]', meaning: 'Array subscript assignment' }
      ]
    };
  }

  if (line.includes('return stack[top--]') || line.includes('stack[top--]')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'stack_op',
      purpose: "Stack POP Operation (Retrieve Top Element & Decrement TOP).",
      whatItDoes: "Fetches the topmost element currently at stack[top], returns it to the caller, and decrements top by 1 (post-decrement top--).",
      whyUsed: "Implements the core LIFO removal discipline in constant O(1) time.",
      whyNeeded: "Removes the most recently pushed item and updates the top marker to reveal the item below it.",
      whatIfRemoved: "Top pointer is never decremented, causing the stack size to appear frozen.",
      internalMemoryEffect: "Reads array value into CPU return register, then decrements integer variable 'top'.",
      beginnerFriendly: "Taking the top plate off the pile and handing it to the diner! The top marker drops down by one.",
      keySymbols: [
        { symbol: 'top--', meaning: 'Post-decrement: reads current index value first, then decreases index by 1' }
      ]
    };
  }

  // 7. Balanced Parentheses & Delimiter Logic
  if (line.includes('isMatchingPair') || (line.includes("opening == '('") && line.includes("closing == ')'"))) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'conditional',
      purpose: "Bracket Delimiter Pair Matching Logic.",
      whatItDoes: "Verifies whether the popped opening delimiter matches the exact corresponding closing delimiter type (e.g. '(' with ')', '{' with '}', '[' with ']').",
      whyUsed: "Ensures that nested expressions close with the correct corresponding bracket type rather than mismatched delimiters.",
      whyNeeded: "Catches syntax errors like `(}` or `[)` in compilers and interpreters.",
      whatIfRemoved: "Code will falsely accept mismatched cross-nested expressions as valid.",
      internalMemoryEffect: "Evaluates boolean logic and returns integer 1 (True) or 0 (False).",
      beginnerFriendly: "Checking if the lock matches the key! A round key only opens a round lock, and a square key only opens a square lock.",
      keySymbols: [
        { symbol: '==', meaning: 'Character equality check' },
        { symbol: '&&', meaning: 'Logical AND: both conditions must be true' }
      ]
    };
  }

  if (line.includes('return (top == -1)')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'conditional',
      purpose: "Terminal Expression Balance State Verification.",
      whatItDoes: "Evaluates whether the stack is 100% empty after scanning the complete expression string.",
      whyUsed: "If any unclosed opening brackets remain on the stack (e.g. in `(()`), the expression is NOT balanced.",
      whyNeeded: "Guarantees that every opening delimiter found its matching closing partner.",
      whatIfRemoved: "Unclosed delimiters like `(((` will be erroneously reported as balanced.",
      internalMemoryEffect: "Returns 1 (Balanced) if top == -1, or 0 (Unbalanced) if top >= 0.",
      beginnerFriendly: "The final check! Checking our backpack after the journey — if no lonely unclosed brackets are left behind, the expression is balanced!",
      keySymbols: [{ symbol: '(top == -1)', meaning: 'Boolean expression returning 1 if empty, 0 otherwise' }]
    };
  }

  // 8. Loops (for, while)
  if (line.startsWith('for') || line.includes('for (')) {
    const match = line.match(/for\s*\(\s*(?:int\s+)?([a-zA-Z_]\w*)\s*=\s*([^;]+);\s*([^;]+);\s*([^)]+)\)/);
    const vName = match ? match[1] : 'i';
    const initVal = match ? match[2] : '0';
    const cond = match ? match[3] : 'condition';
    const inc = match ? match[4] : 'i++';

    return {
      rawLine,
      lineNumber: lineNum,
      category: 'loop_control',
      purpose: `For Loop Iteration Control over variable '${vName}'.`,
      whatItDoes: `1. Initializes counter ${vName} = ${initVal}.\n2. Evaluates loop condition (${cond}) before every iteration.\n3. Executes loop body if true.\n4. Applies step update (${inc}) at the end of each pass.`,
      whyUsed: `Automates repetitive operations over arrays, linked nodes, or string characters with clean boundary controls.`,
      whyNeeded: `Enables structured linear traversal across sequential collections.`,
      whatIfRemoved: `Statements inside the loop will not execute, or must be manually written out repetitively.`,
      internalMemoryEffect: `Allocates loop index integer in stack frame, checks CPU branch condition, and jumps execution address.`,
      beginnerFriendly: `A lap counter! Start at lap ${initVal}, keep running as long as (${cond}) is true, and count up (+1) after each lap.`,
      keySymbols: [
        { symbol: `${vName} = ${initVal}`, meaning: 'Loop variable initialization' },
        { symbol: cond, meaning: 'Termination boundary condition' },
        { symbol: inc, meaning: 'Step increment/decrement expression' }
      ]
    };
  }

  if (line.startsWith('while') || line.includes('while (')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'loop_control',
      purpose: "While Loop Entry & Continuation Condition.",
      whatItDoes: "Evaluates the condition inside parentheses before each iteration. Continues looping as long as the expression evaluates to non-zero (True).",
      whyUsed: "Used when the number of iterations is unknown in advance (e.g. traversing until pointer reaches NULL).",
      whyNeeded: "Safely processes dynamic linked lists of arbitrary length.",
      whatIfRemoved: "Code inside loop will not repeat across nodes.",
      internalMemoryEffect: "Conditional branch instruction: if condition is false, jumps program counter beyond loop closing brace.",
      beginnerFriendly: "A gatekeeper! As long as the condition is satisfied, you are allowed to take another step.",
      keySymbols: [{ symbol: 'while()', meaning: 'Pre-test loop statement evaluated before each cycle' }]
    };
  }

  // 9. Conditionals (if, else)
  if (line.startsWith('if') || line.includes('if (')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'conditional',
      purpose: "Conditional Decision Branch (if statement).",
      whatItDoes: "Evaluates the enclosed logical expression. If True (non-zero), executes the nested block; otherwise skips to else/next statement.",
      whyUsed: "Enables dynamic decision making in algorithms (e.g. checking empty lists, matching characters, overflow guards).",
      whyNeeded: "Algorithms must handle edge cases and branch appropriately.",
      whatIfRemoved: "Edge case handling is skipped, risking runtime errors or invalid calculations.",
      internalMemoryEffect: "CPU evaluates condition flags (Zero Flag, Sign Flag) and executes conditional jump (JNE/JE).",
      beginnerFriendly: "A fork in the road! If the sign says 'Yes', go down path A; otherwise take path B.",
      keySymbols: [{ symbol: 'if()', meaning: 'Conditional control flow statement' }]
    };
  }

  // 10. Functions & Declarations
  if (line.match(/^(?:void|int|char|float|struct\s+Node\*)\s+([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{?/)) {
    const match = line.match(/^(?:void|int|char|float|struct\s+Node\*)\s+([a-zA-Z_]\w*)/);
    const fnName = match ? match[1] : 'function';
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'function',
      purpose: `Function Definition: '${fnName}()'.`,
      whatItDoes: `Defines a reusable, modular block of C code named '${fnName}' with dedicated parameter signature and return type.`,
      whyUsed: `Encapsulates data structure operations (e.g. insert, delete, push, pop) for clean modular ADT design.`,
      whyNeeded: `Promotes code reuse, modularity, and separation of concerns.`,
      whatIfRemoved: `The function capability will not exist; calling it will result in 'undefined reference' linker error.`,
      internalMemoryEffect: `Creates a new stack frame on call stack, allocating space for parameters and local variables.`,
      beginnerFriendly: `A custom recipe! Whenever your program calls '${fnName}', it follows these exact step-by-step instructions.`,
      keySymbols: [{ symbol: fnName, meaning: 'Identifier name of the function routine' }]
    };
  }

  // 11. Return statements
  if (line.startsWith('return')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'function',
      purpose: "Function Return Statement.",
      whatItDoes: "Terminates execution of the current function immediately and passes the specified result value back to the caller.",
      whyUsed: "Transmits computed answers (or status codes like 0 for success, -1 for error) back to calling code.",
      whyNeeded: "Yields function output and restores previous execution context.",
      whatIfRemoved: "Function will not return desired values, producing undefined results in caller.",
      internalMemoryEffect: "Pops current stack frame from call stack, places return value in RAX/EAX register, and restores return address.",
      beginnerFriendly: "Handing in your completed test paper and returning back to your classroom desk!",
      keySymbols: [{ symbol: 'return', meaning: 'Exit function and yield value to caller' }]
    };
  }

  // 12. Input / Output (printf, scanf)
  if (line.includes('printf(')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'io',
      purpose: "Formatted Console Output Print (printf).",
      whatItDoes: "Formats text, integers, and pointers according to specifier strings (%d, %s, %c, %p) and writes bytes to standard output (stdout).",
      whyUsed: "Displays data structure contents and algorithmic state to the student on the console screen.",
      whyNeeded: "Allows visual verification of program results and test outputs.",
      whatIfRemoved: "Program will run silently with zero visible output on the terminal.",
      internalMemoryEffect: "Flushes formatted string buffer to standard output file descriptor (stdout / File Handle 1).",
      beginnerFriendly: "Printing on the screen! Like writing a message on the classroom blackboard so everyone can read it.",
      keySymbols: [
        { symbol: 'printf()', meaning: 'Formatted print routine from <stdio.h>' },
        { symbol: '%d', meaning: 'Integer format specifier' }
      ]
    };
  }

  // 13. General Assignment or Expression
  return {
    rawLine,
    lineNumber: lineNum,
    category: 'assignment',
    purpose: `C Statement Execution (Line ${lineNum}).`,
    whatItDoes: `Executes: \`${line}\``,
    whyUsed: "Performs structured state calculation or assignment in the C runtime.",
    whyNeeded: "Essential step in the procedural data structure algorithm.",
    whatIfRemoved: "The specific calculation or state update will be skipped during execution.",
    internalMemoryEffect: "Updates variables or registers allocated in current memory stack frame.",
    beginnerFriendly: `Executes this specific operation step-by-step: "${line}"`,
    keySymbols: [{ symbol: ';', meaning: 'Statement terminator in C' }]
  };
}
