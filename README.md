# BitShift

An interactive, quest-based educational game built with **React Native** and **Expo** that teaches the **Shift-and-Add Multiplication Algorithm** used in computer architecture and Arithmetic Logic Units (ALUs).

![BitShift Logo](assets/logo.png)

---

## 🎯 Educational Objectives

BitShift demystifies how processors multiply binary numbers without requiring complex single-cycle multiplication arrays. Players master:

- **Registers & Microarchitecture**:
  - **Accumulator ($A$)**: 8-bit register holding partial products and the running sum (initialized to `0x00`).
  - **Multiplicand ($M$)**: 8-bit register shifted **left** by 1 bit each cycle ($M \ll 1$), doubling its binary weight ($2^0 \to 2^1 \to 2^2 \dots$).
  - **Multiplier ($Q$)**: 4-bit register scanned at its least-significant bit ($Q_0$) and shifted **right** each cycle ($Q \gg 1$).
- **The Core Decision Rule**:
  - **If $Q_0 == 1$**: Add the multiplicand into the accumulator ($A \leftarrow A + M$).
  - **If $Q_0 == 0$**: Skip addition (bypass adder), leaving $A$ unchanged.
  - **Always**: Shift $M$ left ($M \ll 1$), shift $Q$ right ($Q \gg 1$), and decrement step counter until all bits are processed.
- **Benchmark Calculation**:
  - $5 \times 3$ ($0101_2 \times 0011_2$) producing the verified 8-bit binary product $0000\,1111_2$ (decimal $15$).

---

## 🚀 Key Features

### 1. Personalized Player Entry
- First-time welcome screen asking for the student's name with input validation.
- Local persistence using `@react-native-async-storage/async-storage` (with localStorage fallback for web).
- Dynamic greeting on the learning dashboard: *"Ready for your next challenge, {Name}?"*
- In-app profile modal allowing players to update their name anytime.

### 2. 5-Level Interactive Quest
- **Exactly 5 Sequential Question Levels** (Level 1 through Level 5).
- **Master Question Bank & Randomization**: Draws 5 distinct randomized questions per quest attempt, with safely shuffled multiple-choice options.
- **Real-Time Answer Validation**: Instant feedback highlighting correct/incorrect choices and revealing architectural insight drawers.
- **Hardware Architecture Hints**: Contextual hints for each question that can be opened and closed without timer resets or penalties.
- **Skip Functionality**: Allows players to skip questions and proceed through the quest.
- **Continuous Hardware Timer**: Tracks elapsed solve time continuously across all 5 questions.
- **QUEST UNLOCKED Completion Screen**:
  - Features the official **QUEST UNLOCKED** milestone banner.
  - Personalized congratulatory message for the player.
  - Complete results breakdown: Correct + Incorrect + Skipped = 5.
  - Total solve time display.
- **Play Again (Replay)**: Starts a fresh attempt with a newly shuffled set of 5 questions, reset timer, and preserved player name.

### 3. Interactive Register Simulator
- Step-by-step hardware cycle execution (`Step 1 of 4` through `Step 4 of 4`).
- Real-time bit cells for Accumulator ($A$), Multiplicand ($M$), and Multiplier ($Q$).
- **ALU Addition Scratchpad**: Deep midnight navy canvas showing binary arithmetic rows ($A$, $+ M$, $= A+M$) with hexadecimal and decimal readouts.
- **Controls**: *Reset*, *Auto-Play*, and *Next Shift*.
- **Custom Multiplier Sandbox**: Allows testing custom multiplicand and multiplier values (e.g. $6 \times 7$, $7 \times 3$) with live simulation.

### 4. Trace Matrix & Flowchart
- **5 × 3 Trace Matrix Table**: Complete row-by-row register trace showing $A$ (Before), $Q$ (Before), $Q_0$, Operation, and $A$ (After).
- **Hardware Control Flowchart**: Interactive sequential logic flowchart with selectable nodes (*START*, *Initialization*, *Decision Checks*, *ADD / BYPASS branches*, *Clock Transition*).
- **Exam Cheat-Sheet Accordions**: Deep dive into register bit-width mathematical proofs, $O(n)$ time complexity, and Booth's algorithm comparison.

---

## 🛠️ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86.3)
- **Tooling & Runtime**: [Expo](https://expo.dev/) (SDK 57)
- **Web Support**: `react-native-web` & `@expo/metro-runtime`
- **Icons**: `@expo/vector-icons` (MaterialIcons)
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Design System**: Vintage Technical Editorial aesthetic (Parchment `#E6D5B7`, Card Cream `#FAF3E8`, Midnight Obsidian `#1E223D`, Terracotta Flame `#F54F1B`).

---

## 📦 Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node v26)
- **npm**: `v9.0.0` or higher

---

## 💻 Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/realrichelle19/BitShift_COA.git
   cd BitShift_COA
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   - **Web Browser**:
     ```bash
     npm run web
     ```
   - **iOS Simulator** (macOS with Xcode required):
     ```bash
     npm run ios
     ```
   - **Android Emulator / Device** (Android Studio required):
     ```bash
     npm run android
     ```
   - **Expo Dev Server**:
     ```bash
     npx expo start
     ```

---

## 🌐 Web Build and Deployment

BitShift can be deployed as a static web application to any modern hosting platform (GitHub Pages, Vercel, Netlify, Cloudflare Pages):

1. **Export the Web Production Bundle**:
   ```bash
   npm run build
   ```
   This invokes `expo export -p web` and compiles the complete React Native Web bundle into the `dist/` directory, including `dist/index.html` and static assets.

2. **Preview the Production Web Build Locally**:
   ```bash
   npm run serve
   ```
   Or:
   ```bash
   npx serve dist
   ```

3. **Deploy to GitHub Pages**:
   - The repository includes `.github/workflows/deploy.yml` which automatically builds and deploys `dist/` on pushes to `main`.
   - In your GitHub repository settings, go to **Settings > Pages > Build and deployment**, and set **Source** to **GitHub Actions**.

4. **Deploy to Vercel / Netlify**:
   - Configuration files `vercel.json` and `netlify.toml` are included.
   - Build Command: `npm run build`
   - Output / Publish Directory: `dist`

---

## 🔒 Security & Environment Notice

- This application does not require external backend API keys or secrets.
- Never commit private keys, `.env` files with credentials, or personal access tokens to this repository.
- Standard `.gitignore` rules are configured to exclude `node_modules/`, `.expo/`, `dist/`, and local caches.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
