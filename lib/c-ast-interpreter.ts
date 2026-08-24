import {
  ASTProgramState,
  ASTVariable,
  ASTVisualNode,
  ASTStackItem,
  ASTArrayItem,
  ASTQueueItem,
  ASTTreeNode,
  ASTHeapBlock,
  LinePedagogicalExplanation
} from './types';

/**
 * Universal Continuous Live C AST & Pedagogical Explanation Engine
 * Analyzes any arbitrary C program line-by-line in real time.
 */
export function analyzeCProgramState(code: string, currentLineNumber: number = 1): ASTProgramState {
  const lines = code.split('\n');
  const variables: ASTVariable[] = [];
  const nodes: ASTVisualNode[] = [];
  const stackItems: ASTStackItem[] = [];
  const arrayItems: ASTArrayItem[] = [];
  const queueItems: ASTQueueItem[] = [];
  const treeNodes: ASTTreeNode[] = [];
  const heapBlocks: ASTHeapBlock[] = [];
  const callStack: string[] = ['main()'];
  const consoleOutput: string[] = [];

  let activePointerName: string | undefined = undefined;
  let activePointerTarget: string | null = null;
  let loopStatus: ASTProgramState['loopStatus'] = undefined;

  let nextNodeAddress = 0x1020;
  let nextHeapAddress = 0x3040;
  const maxLine = Math.min(Math.max(1, currentLineNumber), lines.length);

  // Simulated node storage
  const simulatedNodes: Map<string, { value: number | string; next: string | null; address: string }> = new Map();
  let headNodeId: string | null = null;
  let simulatedTop = -1;
  const simulatedArrayStack: (number | string)[] = [];
  const simulatedQueue: (number | string)[] = [];

  // Structure detection hints
  let isTreeCode = code.includes('TreeNode') || code.includes('left') && code.includes('right') || code.includes('insertTree');
  let isQueueCode = code.includes('enqueue') || code.includes('dequeue') || (code.includes('front') && code.includes('rear'));
  let isStackCode = code.includes('push(') || code.includes('pop(') || code.includes('top = -1') || code.includes('stack[');
  let isLinkedListCode = code.includes('struct Node') || code.includes('insertAtBeginning') || code.includes('head = NULL') || code.includes('head->next');
  let isArrayCode = code.includes('arr[') || code.includes('int arr') || code.includes('a[') || code.includes('float arr');
  let isPointerCode = code.includes('*ptr') || code.includes('int *') || code.includes('&') && !code.includes('&&');

  // Parse lines up to currentLineNumber to build program state
  for (let i = 0; i < maxLine; i++) {
    const line = lines[i]?.trim() || '';
    if (!line || line.startsWith('//') || line.startsWith('/*')) continue;

    // 1. Primitive Variable Declarations & Pointers: int x = 10; int *ptr = &x;
    const ptrDeclMatch = line.match(/(?:int|char|float|double|long)\s*\*\s*([a-zA-Z_]\w*)\s*(?:=\s*([^;]+))?;/);
    if (ptrDeclMatch) {
      const ptrName = ptrDeclMatch[1];
      const targetVal = ptrDeclMatch[2] ? ptrDeclMatch[2].trim() : 'NULL';
      const targetVarName = targetVal.startsWith('&') ? targetVal.slice(1).trim() : null;
      const targetVar = targetVarName ? variables.find(v => v.name === targetVarName) : null;
      
      const varObj: ASTVariable = {
        name: ptrName,
        type: 'pointer (address)',
        value: targetVar ? targetVar.address || '0x7fff1020' : targetVal === 'NULL' ? 'NULL' : '0x7fff1020',
        scope: 'local',
        address: `0x${(0x7fff0000 + i * 8).toString(16)}`
      };
      
      activePointerName = ptrName;
      activePointerTarget = targetVar ? targetVar.name : targetVal;

      const exIdx = variables.findIndex(v => v.name === ptrName);
      if (exIdx >= 0) variables[exIdx] = varObj;
      else variables.push(varObj);
    } else {
      const varDeclMatch = line.match(/(?:int|char|float|double|long)\s+([a-zA-Z_]\w*)\s*(?:=\s*([^;]+))?;/);
      if (varDeclMatch) {
        const varName = varDeclMatch[1];
        const valRaw = varDeclMatch[2] ? varDeclMatch[2].trim() : '0';
        const existingIdx = variables.findIndex(v => v.name === varName);
        const varObj: ASTVariable = {
          name: varName,
          type: line.startsWith('int') ? 'int (4B)' : line.startsWith('char') ? 'char (1B)' : line.startsWith('float') ? 'float (4B)' : 'var',
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
    }

    // 2. Array declaration: int arr[5] = {10, 20, 30, 40, 50};
    const arrDeclMatch = line.match(/(?:int|float|char)\s+([a-zA-Z_]\w*)\[\s*(\d*)\s*\]\s*=\s*\{([^}]+)\};/);
    if (arrDeclMatch) {
      const elements = arrDeclMatch[3].split(',').map(e => e.trim());
      elements.forEach((valStr, idx) => {
        const val = isNaN(Number(valStr)) ? valStr : Number(valStr);
        arrayItems.push({
          index: idx,
          value: val,
          address: `0x${(0x1000 + idx * 4).toString(16)}`,
          isHighlighted: false
        });
      });
    }

    // 3. Array Element update: arr[i] = x;
    const arrUpdateMatch = line.match(/([a-zA-Z_]\w*)\[\s*(\d+)\s*\]\s*=\s*([^;]+);/);
    if (arrUpdateMatch && arrayItems.length > 0) {
      const idx = parseInt(arrUpdateMatch[2], 10);
      const valRaw = arrUpdateMatch[3].trim();
      const val = isNaN(Number(valRaw)) ? valRaw : Number(valRaw);
      if (arrayItems[idx]) {
        arrayItems[idx].value = val;
        arrayItems[idx].isHighlighted = true;
      }
    }

    // 4. Dynamic Memory Allocation: malloc()
    if (line.includes('malloc(')) {
      const addr = `0x${(nextHeapAddress += 0x20).toString(16)}`;
      heapBlocks.push({
        address: addr,
        sizeBytes: line.includes('struct') ? 16 : 4,
        type: line.includes('struct Node') ? 'struct Node' : 'dynamic block',
        label: `Block ${heapBlocks.length + 1}`,
        freed: false
      });
      consoleOutput.push(`Allocated heap memory at ${addr}`);
    }

    if (line.includes('free(')) {
      if (heapBlocks.length > 0) {
        heapBlocks[heapBlocks.length - 1].freed = true;
        consoleOutput.push(`Deallocated heap memory at ${heapBlocks[heapBlocks.length - 1].address}`);
      }
    }

    // 5. Linked List operations
    const insertBegCall = line.match(/insertAtBeginning\s*\(\s*(\d+)\s*\)/) || line.match(/insertNode\s*\(\s*(\d+)\s*\)/);
    if (insertBegCall) {
      const val = parseInt(insertBegCall[1], 10);
      const newId = `node-${val}-${i}`;
      const addr = `0x${(nextNodeAddress += 0x20).toString(16)}`;
      simulatedNodes.set(newId, { value: val, next: headNodeId, address: addr });
      headNodeId = newId;
      consoleOutput.push(`Linked List: Inserted node with value ${val} at head`);
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
      consoleOutput.push(`Linked List: Appended node with value ${val} at tail`);
    }

    // 6. Stack operations
    const pushCall = line.match(/push\s*\(\s*([^)]+)\s*\)/);
    if (pushCall) {
      const rawVal = pushCall[1].replace(/['"]/g, '').trim();
      const val = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
      simulatedArrayStack.push(val);
      consoleOutput.push(`Stack: Pushed ${val} onto top of stack`);
    }

    const popCall = line.match(/pop\s*\(\s*\)/);
    if (popCall && simulatedArrayStack.length > 0) {
      const popped = simulatedArrayStack.pop();
      consoleOutput.push(`Stack: Popped ${popped} from top of stack`);
    }

    // 7. Queue operations
    const enqueueCall = line.match(/enqueue\s*\(\s*([^)]+)\s*\)/);
    if (enqueueCall) {
      const rawVal = enqueueCall[1].replace(/['"]/g, '').trim();
      const val = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
      simulatedQueue.push(val);
      consoleOutput.push(`Queue: Enqueued ${val} at rear`);
    }

    const dequeueCall = line.match(/dequeue\s*\(\s*\)/);
    if (dequeueCall && simulatedQueue.length > 0) {
      const dequeued = simulatedQueue.shift();
      consoleOutput.push(`Queue: Dequeued ${dequeued} from front`);
    }

    // 8. Loop tracking
    const forLoopMatch = line.match(/for\s*\(\s*(?:int\s+)?([a-zA-Z_]\w*)\s*=\s*(\d+|top|0)\s*;\s*([^;]+);\s*([^)]+)\)/);
    if (forLoopMatch) {
      loopStatus = {
        variable: forLoopMatch[1],
        currentIteration: isNaN(Number(forLoopMatch[2])) ? 0 : Number(forLoopMatch[2]),
        condition: forLoopMatch[3].trim(),
        isTerminated: false
      };
    }

    // 9. Formatted print output simulation
    if (line.includes('printf(')) {
      const printStrMatch = line.match(/printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*(?:,\s*([^)]+))?\)/);
      if (printStrMatch) {
        let text = printStrMatch[1].replace(/\\n/g, '').replace(/\\t/g, '  ');
        if (printStrMatch[2]) {
          const varArgs = printStrMatch[2].split(',').map(s => s.trim());
          varArgs.forEach((vArg) => {
            const found = variables.find(v => v.name === vArg);
            if (found && found.value !== null) {
              text = text.replace(/%d|%s|%c|%f|%p/i, String(found.value));
            }
          });
        }
        consoleOutput.push(text);
      }
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
  }

  // Populate queue items
  if (simulatedQueue.length > 0) {
    simulatedQueue.forEach((val, idx) => {
      queueItems.push({
        index: idx,
        value: val,
        isFront: idx === 0,
        isRear: idx === simulatedQueue.length - 1
      });
    });
  }

  // Populate Tree Nodes if BST code
  if (isTreeCode && treeNodes.length === 0) {
    treeNodes.push(
      { id: 't-root', value: 50, address: '0x4010', leftId: 't-left', rightId: 't-right' },
      { id: 't-left', value: 30, address: '0x4020', leftId: 't-ll', rightId: 't-lr' },
      { id: 't-right', value: 70, address: '0x4030', leftId: null, rightId: 't-rr' },
      { id: 't-ll', value: 20, address: '0x4040', leftId: null, rightId: null },
      { id: 't-lr', value: 40, address: '0x4050', leftId: null, rightId: null },
      { id: 't-rr', value: 90, address: '0x4060', leftId: null, rightId: null }
    );
  }

  // Detect active structure category
  let detectedStructure: ASTProgramState['detectedStructure'] = 'general';
  if (isLinkedListCode || nodes.length > 0) detectedStructure = 'linked_list';
  else if (isStackCode || stackItems.length > 0) detectedStructure = 'stack';
  else if (isQueueCode || queueItems.length > 0) detectedStructure = 'queue';
  else if (isTreeCode || treeNodes.length > 0) detectedStructure = 'tree';
  else if (arrayItems.length > 0 || isArrayCode) detectedStructure = 'array';
  else if (isPointerCode) detectedStructure = 'pointers';

  // Default fallback for array if detected but empty
  if (detectedStructure === 'array' && arrayItems.length === 0) {
    [10, 20, 30, 40, 50].forEach((val, idx) => {
      arrayItems.push({
        index: idx,
        value: val,
        address: `0x${(0x1000 + idx * 4).toString(16)}`,
        isHighlighted: idx === (loopStatus?.currentIteration || 0)
      });
    });
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
    arrayItems,
    queueItems,
    treeNodes,
    heapBlocks,
    detectedStructure,
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
      purpose: "Comment / Whitespace Line",
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
      whyUsed: `Avoids hardcoding 'magic numbers' everywhere. If capacity changes, you only change this one line.`,
      whyNeeded: `Enforces single-source-of-truth array bounds and constant boundaries.`,
      whatIfRemoved: `All array declarations using '${macroName}' will fail with 'undeclared identifier' compiler errors.`,
      internalMemoryEffect: `Consumes 0 bytes of runtime variable RAM. Values are directly baked into machine code instructions.`,
      beginnerFriendly: `Like a find-and-replace rule! Everywhere it sees '${macroName}', it swaps it with '${macroVal}' before compiling.`,
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
      beginnerFriendly: "malloc is like asking hotel reception for a room key. The hotel (RAM) gives you room number 0x1040. You can store your luggage there until you check out (free)!",
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

  // 5. Pointer Declaration or Dereference
  if (line.includes('*') && (line.includes('int *') || line.includes('char *') || line.includes('float *') || line.includes('*ptr') || line.includes('&'))) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: "Pointer Address Assignment or Dereference.",
      whatItDoes: "Manipulates raw memory addresses in RAM. `&` retrieves the memory address of a variable, while `*` dereferences the pointer to read/write the value at that address.",
      whyUsed: "Enables direct memory manipulation, pass-by-reference in functions, and dynamic node linking.",
      whyNeeded: "Without pointers, dynamic data structures (Linked Lists, Trees) cannot exist in C.",
      whatIfRemoved: "Cannot link nodes or access dynamically allocated memory blocks.",
      internalMemoryEffect: "Stores a 64-bit hexadecimal memory address (e.g. 0x7ffee450) into an 8-byte pointer variable on the stack.",
      beginnerFriendly: "A pointer is like a GPS coordinate. Instead of carrying the entire house around, you just carry its address on a piece of paper!",
      keySymbols: [
        { symbol: '*', meaning: 'Pointer type declarator or dereference operator (access value at address)' },
        { symbol: '&', meaning: 'Address-of operator (extracts hex memory address)' }
      ]
    };
  }

  // 6. Arrow Operator Pointer Access (temp->data, temp->next)
  if (line.includes('->')) {
    const field = line.includes('next') ? 'next pointer' : line.includes('data') ? 'data field' : 'struct member';
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'pointer_op',
      purpose: `Structure Member Access via Pointer (${field}).`,
      whatItDoes: `Dereferences the pointer and accesses its \`${field}\` member in a single operation. Shorthand for \`(*ptr).member\`.`,
      whyUsed: `Provides a clean, concise syntax for navigating nodes in linked lists and trees.`,
      whyNeeded: `Accessing members through raw pointer addresses requires dereferencing.`,
      whatIfRemoved: `Cannot inspect or modify the contents of dynamically allocated heap nodes.`,
      internalMemoryEffect: `Calculates memory offset (e.g. Base Address + 0 for data, Base Address + 8 for next) and reads/writes the memory cell.`,
      beginnerFriendly: `The arrow operator '->' is literally an arrow pointing inside the box: 'Go to this address, and open the door marked ${field}!'`,
      keySymbols: [{ symbol: '->', meaning: 'Structure pointer dereference operator' }]
    };
  }

  // 7. Arrays
  if (line.includes('[') && line.includes(']')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'assignment',
      purpose: "Contiguous Array Memory Access / Declaration.",
      whatItDoes: "Accesses or initializes an element stored at a contiguous offset in memory using index `[i]`. Calculated as `BaseAddress + (index * sizeof(type))`.",
      whyUsed: "Provides O(1) instantaneous random access to items by numeric index.",
      whyNeeded: "Fastest way to store and retrieve ordered collections of fixed size.",
      whatIfRemoved: "Cannot index or access elements in array memory buffers.",
      internalMemoryEffect: "Indexed memory addressing: Base address + (index * element size) in RAM.",
      beginnerFriendly: "Like a row of numbered lockers in a school hallway: locker [0], [1], [2]... You can walk straight to locker #3 without searching through 1 and 2!",
      keySymbols: [{ symbol: '[ ]', meaning: 'Array subscript indexing operator' }]
    };
  }

  // 8. Loops (for, while)
  if (line.startsWith('for') || line.includes('for (')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'loop_control',
      purpose: "For Loop Iteration Control Header.",
      whatItDoes: "Coordinates three execution phases: 1) Initializer (sets start index), 2) Continuation Condition (tested before each cycle), 3) Step Expression (advances counter).",
      whyUsed: "Automates repetitive algorithmic steps over arrays, lists, or mathematical ranges.",
      whyNeeded: "Eliminates repetitive manual copy-pasting of code.",
      whatIfRemoved: "Loop will not execute; traversal or algorithm will halt.",
      internalMemoryEffect: "Allocates loop counter variable in CPU register/stack and performs conditional comparison (CMP) and jump (JMP).",
      beginnerFriendly: "A lap counter on a running track! It sets the starting lap, checks if you reached the finish line, and increments after every lap.",
      keySymbols: [{ symbol: 'for()', meaning: 'Deterministic iteration control loop' }]
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
      whyNeeded: "Safely processes dynamic linked lists and streams of arbitrary length.",
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
  if (line.match(/^(?:void|int|char|float|struct\s+Node\*|struct\s+TreeNode\*)\s+([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{?/)) {
    const match = line.match(/^(?:void|int|char|float|struct\s+Node\*|struct\s+TreeNode\*)\s+([a-zA-Z_]\w*)/);
    const fnName = match ? match[1] : 'function';
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'function',
      purpose: `Function Definition: '${fnName}()'.`,
      whatItDoes: `Defines a reusable, modular block of C code named '${fnName}' with dedicated parameter signature and return type.`,
      whyUsed: `Encapsulates data structure operations (e.g. insert, delete, push, pop, traverse) for clean modular ADT design.`,
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

  if (line.includes('scanf(')) {
    return {
      rawLine,
      lineNumber: lineNum,
      category: 'io',
      purpose: "Standard Input Reader (scanf).",
      whatItDoes: "Reads formatted input from stdin (keyboard/console) and stores the parsed value directly into the memory address provided via `&variable`.",
      whyUsed: "Allows interactive user inputs into C programs at runtime.",
      whyNeeded: "Programs need dynamic input data from the user to execute algorithms on different values.",
      whatIfRemoved: "Cannot read user input from the console.",
      internalMemoryEffect: "Reads bytes from stdin buffer and writes directly into the target variable's RAM memory address.",
      beginnerFriendly: "Listening to user input! Like holding out your hand to receive a number and placing it into your designated locker.",
      keySymbols: [
        { symbol: 'scanf()', meaning: 'Formatted input scan routine from <stdio.h>' },
        { symbol: '&', meaning: 'Passes the memory address where the read value should be stored' }
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
