# Data Structures Virtual Laboratory (C)

An interactive, academic laboratory web application for learning Data Structures through C programming, featuring line-by-line AST code analysis, live program-state visualizers, isolated C sandbox execution, 10-second typing viva, Anna University continuous assessment marks, and weekly gamified leaderboards.

---

## Key Features

1. **Live Line-by-Line AST Program State Visualizer**:
   - Analyzes C code in real time as the student writes.
   - Dynamically updates heap nodes, pointers (`head = newNode`, `temp->next`), stack memory frames, array indices, and loop counters.
   - Provides beginner-friendly pedagogical explanations (*"Why this line?"*, *"Explain like I'm a beginner"*, *"What happens if removed?"*).

2. **Flagship 3-Panel Monaco Coding Lab**:
   - Left: Monaco C Code Editor with active line tracking.
   - Center: Interactive Data Structure Visualizers (Singly Linked List, Stack ADT Array, Stack ADT Linked List, Balanced Parentheses).
   - Right: AI Teaching Assistant and Runtime Memory Variables Table.
   - Bottom: Sandboxed C Output Console & Test Cases Evaluator.

3. **10-Second Typing Viva System**:
   - Strict 10-second countdown timer per question.
   - Typing-only responses with anti-copy/paste integrity protection.
   - Automated provisional AI score suggestion + faculty final grading.

4. **Anna University 75-Mark Evaluation Scheme (`/faculty`)**:
   - Configurable continuous assessment scheme (Coding, Assessment, Viva, Observation).
   - Submissions review queue, student viva response inspector, and feedback publisher.

5. **Weekly Gamified Leaderboard (`/leaderboard`)**:
   - **Our College Leaderboard**: Displays Top 5 students.
   - **Global Leaderboard**: Displays Top 10 learners.
   - Weekly cycle (Monday to Sunday) with active countdown timer and strict privacy protection.

6. **Role-Based College Access Control**:
   - **Our College Students**: Full curriculum access, internal 75-mark evaluation records, and College Top 5 leaderboard.
   - **Other College / Guest Students**: Public learning access, interactive visualizers, and Global Top 10 leaderboard (strictly isolated from internal college marks).
   - **Faculty / Staff**: Evaluation management, mark allocation, and weak-topic analytics.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```