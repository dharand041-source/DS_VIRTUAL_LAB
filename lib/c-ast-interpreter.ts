import { ASTProgramState, ASTVariable, ASTVisualNode, ASTStackItem } from './types';

/**
 * C AST & Memory State Simulator
 * Parses C source lines, simulates variable scopes, dynamic heap nodes, pointers,
 * arrays, and produces live program visual state + pedagogical explanations.
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

  // Track simulated node addresses
  let nextNodeAddress = 0x1020;

  // Parse up to current line or entire file if requested
  const maxLine = Math.min(currentLineNumber, lines.length);

  // Simulated node storage
  const simulatedNodes: Map<string, { value: number | string; next: string | null; address: string }> = new Map();
  let headNodeId: string | null = null;
  let simulatedTop = -1;
  const simulatedArrayStack: (number | string)[] = [];

  // Parse code sequentially to simulate state evolution
  for (let i = 0; i < maxLine; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//') || line.startsWith('/*')) continue;

    // 1. Primitive Variable Declarations: int x = 10;
    const intVarMatch = line.match(/(?:int|char|float|double)\s+([a-zA-Z_]\w*)\s*(?:=\s*([^;]+))?;/);
    if (intVarMatch) {
      const varName = intVarMatch[1];
      const valRaw = intVarMatch[2] ? intVarMatch[2].trim() : '0';
      const existingIdx = variables.findIndex(v => v.name === varName);
      const varObj: ASTVariable = {
        name: varName,
        type: line.startsWith('int') ? 'int' : line.startsWith('char') ? 'char' : 'float',
        value: isNaN(Number(valRaw)) ? valRaw : Number(valRaw),
        scope: 'local',
        address: `0x${(0x7fff0000 + i * 4).toString(16)}`
      };
      if (existingIdx >= 0) {
        variables[existingIdx] = varObj;
      } else {
        variables.push(varObj);
      }
    }

    // 2. Variable updates: x = x + 1; or top = top + 1;
    const varUpdateMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*([^;]+);/);
    if (varUpdateMatch && !line.includes('malloc') && !line.includes('struct')) {
      const vName = varUpdateMatch[1];
      const expr = varUpdateMatch[2].trim();
      const existing = variables.find(v => v.name === vName);
      if (existing) {
        if (expr.includes('+ 1') || expr.includes('++')) {
          existing.value = (Number(existing.value) || 0) + 1;
        } else if (expr.includes('- 1') || expr.includes('--')) {
          existing.value = (Number(existing.value) || 0) - 1;
        } else if (!isNaN(Number(expr))) {
          existing.value = Number(expr);
        }
      }
    }

    // 3. Linked List: insertAtBeginning / insertAtEnd calls in main
    const insertBegCall = line.match(/insertAtBeginning\s*\(\s*(\d+)\s*\)/);
    if (insertBegCall) {
      const val = parseInt(insertBegCall[1], 10);
      const newId = `node-${val}-${Date.now() % 10000}`;
      const addr = `0x${(nextNodeAddress += 0x20).toString(16)}`;
      
      simulatedNodes.set(newId, {
        value: val,
        next: headNodeId,
        address: addr
      });
      headNodeId = newId;
      consoleOutput.push(`Inserted ${val} at Beginning`);
    }

    const insertEndCall = line.match(/insertAtEnd\s*\(\s*(\d+)\s*\)/);
    if (insertEndCall) {
      const val = parseInt(insertEndCall[1], 10);
      const newId = `node-${val}-${Date.now() % 10000}`;
      const addr = `0x${(nextNodeAddress += 0x20).toString(16)}`;

      simulatedNodes.set(newId, {
        value: val,
        next: null,
        address: addr
      });

      if (!headNodeId) {
        headNodeId = newId;
      } else {
        // Find tail
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

    // 4. Pointer updates: head = newNode, temp->next = newNode
    if (line.includes('head = newNode') || line.includes('head = NULL')) {
      activePointerName = 'head';
      activePointerTarget = headNodeId;
    }

    // 5. Stack push / pop calls in main
    const pushCall = line.match(/push\s*\(\s*([^)]+)\s*\)/);
    if (pushCall) {
      const rawVal = pushCall[1].replace(/['"]/g, '').trim();
      const val = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
      simulatedTop++;
      simulatedArrayStack.push(val);
      consoleOutput.push(`Pushed ${val} (TOP = ${simulatedTop})`);
    }

    const popCall = line.match(/pop\s*\(\s*\)/);
    if (popCall) {
      if (simulatedArrayStack.length > 0) {
        const popped = simulatedArrayStack.pop();
        simulatedTop = Math.max(-1, simulatedTop - 1);
        consoleOutput.push(`Popped ${popped}`);
      }
    }

    // 6. For loop detection: for(i = 0; i < n; i++)
    const forLoopMatch = line.match(/for\s*\(\s*(?:int\s+)?([a-zA-Z_]\w*)\s*=\s*(\d+)\s*;\s*\1\s*(<|<=|>|>=)\s*([^;]+);\s*\1(\+\+|\+=|\-\-)?\s*\)/);
    if (forLoopMatch) {
      const loopVar = forLoopMatch[1];
      const startVal = parseInt(forLoopMatch[2], 10);
      const limitVal = parseInt(forLoopMatch[4], 10) || 5;
      loopStatus = {
        variable: loopVar,
        currentIteration: startVal,
        totalIterations: limitVal,
        condition: `${loopVar} ${forLoopMatch[3]} ${forLoopMatch[4]}`,
        isTerminated: false
      };
    }

    // 7. Function call detection
    const fnCallMatch = line.match(/^([a-zA-Z_]\w*)\s*\([^)]*\);/);
    if (fnCallMatch && !['printf', 'scanf', 'malloc', 'free'].includes(fnCallMatch[1])) {
      if (!callStack.includes(`${fnCallMatch[1]}()`)) {
        callStack.push(`${fnCallMatch[1]}()`);
      }
    }
  }

  // Convert simulated linked list nodes into linear display array
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

  // If no nodes generated dynamically yet, seed preview nodes from code syntax
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
      { id: 's1', value: 10, index: 0, isTop: false },
      { id: 's2', value: 20, index: 1, isTop: false },
      { id: 's3', value: 30, index: 2, isTop: true }
    );
  }

  // Synthesize Line Explanation for the current line
  const activeLineText = lines[currentLineNumber - 1]?.trim() || '';
  const lineExplanation = generatePedagogicalExplanation(activeLineText, currentLineNumber);

  return {
    activeLineNumber: currentLineNumber,
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
 * Generates beginner-friendly explanations for any C code line.
 */
function generatePedagogicalExplanation(line: string, lineNum: number) {
  if (!line || line.startsWith('//')) {
    return {
      purpose: "Comment / Whitespace line.",
      beginnerFriendly: "This is a comment or blank line. Comments help humans understand code without affecting computer execution.",
      whyNeeded: "Improves code documentation and readability.",
      whatIfRemoved: "No effect on program execution."
    };
  }

  if (line.includes('#include <stdio.h>')) {
    return {
      purpose: "Standard I/O header inclusion.",
      beginnerFriendly: "#include <stdio.h> grants access to printf() and scanf() to interact with the console.",
      whyNeeded: "The compiler needs standard prototypes before using I/O functions.",
      whatIfRemoved: "Compiler warning/error: 'printf' undeclared."
    };
  }

  if (line.includes('#include <stdlib.h>')) {
    return {
      purpose: "Standard Library header inclusion.",
      beginnerFriendly: "#include <stdlib.h> enables dynamic memory tools like malloc() and free().",
      whyNeeded: "Nodes created at runtime must request memory from the operating system heap.",
      whatIfRemoved: "malloc() and free() will be undefined."
    };
  }

  if (line.includes('struct Node')) {
    return {
      purpose: "Declares a self-referential Node blueprint.",
      beginnerFriendly: "struct Node defines a custom building block holding two items: data (payload) and next (pointer to next node).",
      whyNeeded: "Linked structures need both data values and connection addresses bundled together.",
      whatIfRemoved: "You cannot construct linked list nodes."
    };
  }

  if (line.includes('malloc(sizeof(struct Node))')) {
    return {
      purpose: "Heap dynamic memory allocation.",
      beginnerFriendly: "malloc requests a fresh compartment of memory from computer RAM to store a new node.",
      whyNeeded: "Dynamic nodes live beyond the lifecycle of a single function call.",
      whatIfRemoved: "Dereferencing a NULL pointer leads to immediate Segmentation Fault."
    };
  }

  if (line.includes('head = newNode') || line.includes('top = newNode')) {
    return {
      purpose: "Updates starting anchor pointer.",
      beginnerFriendly: "Points our head pointer to the freshly created node, making it the official start of the list.",
      whyNeeded: "Head must always reference the first accessible node in linear traversal.",
      whatIfRemoved: "New node remains disconnected and inaccessible (Memory Leak)."
    };
  }

  if (line.includes('newNode->next = head') || line.includes('newNode->next = top')) {
    return {
      purpose: "Preserves existing chain connection.",
      beginnerFriendly: "Connects our new node's next arrow to whatever was previously first in line.",
      whyNeeded: "Must link to previous elements before overwriting the head pointer.",
      whatIfRemoved: "All previously added nodes are lost in memory."
    };
  }

  if (line.includes('while (temp != NULL)') || line.includes('while (temp->next != NULL)')) {
    return {
      purpose: "Sequential pointer traversal loop.",
      beginnerFriendly: "Traverses node by node down the chain until reaching the terminator NULL.",
      whyNeeded: "Linked lists must be traversed sequentially from head to reach any node.",
      whatIfRemoved: "Cannot read, display, or find elements in the list."
    };
  }

  if (line.includes('temp = temp->next')) {
    return {
      purpose: "Advances traversal pointer to the next node.",
      beginnerFriendly: "Hops our temporary pointer 'temp' to the next coach in the train.",
      whyNeeded: "Moves traversal forward so loop terminates.",
      whatIfRemoved: "Infinite loop stuck on the same first node forever."
    };
  }

  if (line.includes('top = -1')) {
    return {
      purpose: "Initializes or resets stack pointer index.",
      beginnerFriendly: "top = -1 indicates that the stack is completely empty (0 elements).",
      whyNeeded: "Arrays are 0-indexed; index 0 holds an element, so -1 represents empty.",
      whatIfRemoved: "Stack starts with garbage index, corrupting memory on first push."
    };
  }

  if (line.includes('top == MAX - 1')) {
    return {
      purpose: "Checks for Stack Overflow condition.",
      beginnerFriendly: "Verifies if the stack array is 100% full before we try adding another item.",
      whyNeeded: "Prevents writing past the allocated bounds of the array buffer.",
      whatIfRemoved: "Out-of-bounds memory write and program crash."
    };
  }

  if (line.includes('top == -1') && (line.includes('Underflow') || line.includes('return -1'))) {
    return {
      purpose: "Checks for Stack Underflow condition.",
      beginnerFriendly: "Verifies if the stack is empty before popping, preventing reading non-existent data.",
      whyNeeded: "Popping an empty stack is an invalid logical operation.",
      whatIfRemoved: "Negative index array access (stack[-1])."
    };
  }

  if (line.includes('for(') || line.includes('for (')) {
    return {
      purpose: "For loop iteration control.",
      beginnerFriendly: "Initializes a counter, checks termination boundary, and steps forward each iteration.",
      whyNeeded: "Executes repetitive data operations across data collections.",
      whatIfRemoved: "Operations must be repeated manually."
    };
  }

  if (line.includes('printf(') || line.includes('printf (')) {
    return {
      purpose: "Standard output format print.",
      beginnerFriendly: "Displays text and variable values on the terminal console screen.",
      whyNeeded: "Allows students to see program results.",
      whatIfRemoved: "No output visible on console."
    };
  }

  return {
    purpose: `C statement execution (Line ${lineNum}).`,
    beginnerFriendly: `Executes: "${line.slice(0, 40)}${line.length > 40 ? '...' : ''}"`,
    whyNeeded: "Part of the structured program algorithm.",
    whatIfRemoved: "The program flow will skip this operation."
  };
}
