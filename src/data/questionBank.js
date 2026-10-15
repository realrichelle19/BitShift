// Question Bank for BitShift: Right-Shift Shift-and-Add Multiplication Algorithm
// Each question covers core computer architecture and ALU hardware concepts.

export const MASTER_QUESTION_BANK = [
  {
    id: 'q1',
    concept: 'Rightmost Bit Examination',
    question: 'In the shift-and-add algorithm, which bit of the multiplier (Q) is examined at each step?',
    options: [
      { id: 'A', text: 'The least significant bit (Q₀)', correct: true },
      { id: 'B', text: 'The most significant bit (Q_msb)', correct: false },
      { id: 'C', text: 'The parity bit in the accumulator', correct: false },
      { id: 'D', text: 'All multiplier bits simultaneously', correct: false },
    ],
    hint: 'Hardware scanners inspect the lowest-order bit first before the right shift moves the next bit into position.',
    explanation: 'Correct! The ALU examines the least significant bit (Q₀) of multiplier Q before shifting. If Q₀ is 1, M is added to A; if 0, addition is skipped.',
    registers: {
      c: '0',
      a: '0000',
      m: '0011 (3)',
      q: '0101 (5)',
      targetBit: 'Q₀ = 1',
    },
  },
  {
    id: 'q2',
    concept: 'Bit Testing Decision',
    question: 'What operation does the hardware perform when the current multiplier bit Q₀ is equal to 1?',
    options: [
      { id: 'A', text: 'Adds Multiplicand M into Accumulator (A ← A + M) and stores carry in C', correct: true },
      { id: 'B', text: 'Clears the Multiplicand register to zero', correct: false },
      { id: 'C', text: 'Subtracts the Multiplicand from Accumulator (A ← A − M)', correct: false },
      { id: 'D', text: 'Skips addition and immediately halts the clock', correct: false },
    ],
    hint: 'When a multiplier bit is 1, it contributes 1 × M to the accumulator before the registers shift.',
    explanation: 'Correct! When Q₀ = 1, the ALU adds Multiplicand M to Accumulator A (A ← A + M) and stores any carry-out in register C.',
    registers: {
      c: '0',
      a: '0000 → 0011',
      m: '0011 (3)',
      q: '0101 (5)',
      targetBit: 'Q₀ = 1',
    },
  },
  {
    id: 'q3',
    concept: 'Zero-Bit Decision',
    question: 'What occurs during a cycle where the rightmost multiplier bit Q₀ is 0?',
    options: [
      { id: 'A', text: 'Addition is bypassed; C, A, and Q proceed directly to the right shift', correct: true },
      { id: 'B', text: 'The accumulator is reset to 0000', correct: false },
      { id: 'C', text: 'Multiplicand M is inverted using two’s complement', correct: false },
      { id: 'D', text: 'The algorithm terminates immediately', correct: false },
    ],
    hint: '0 times any number is 0. Adding 0 would not change the accumulator.',
    explanation: 'Correct! Because 0 × M = 0, no addition is needed. Registers C, A, and Q remain unchanged during this phase, proceeding directly to the right shift.',
    registers: {
      c: '0',
      a: '0001 (holds)',
      m: '0011 (3)',
      q: '1010',
      targetBit: 'Q₀ = 0',
    },
  },
  {
    id: 'q4',
    concept: 'Combined Register Shift Direction',
    question: 'In which direction does the combined register group (C-A-Q) shift during every cycle of the algorithm?',
    options: [
      { id: 'A', text: 'Shifted RIGHT by 1 bit (moving C into A, and A’s LSB into Q)', correct: true },
      { id: 'B', text: 'Shifted LEFT by 1 bit (doubling the accumulator)', correct: false },
      { id: 'C', text: 'C and A shift left while Q shifts right', correct: false },
      { id: 'D', text: 'Registers do not shift; only values are incremented', correct: false },
    ],
    hint: 'The combined C-A-Q register shifts right, allowing partial products and carries to cascade downward.',
    explanation: 'Correct! In every cycle, the combined C-A-Q register group shifts RIGHT by 1 bit: Carry C moves into A’s MSB, A’s LSB moves into Q’s MSB, and Q₀ is discarded.',
    registers: {
      c: 'C → A[3]',
      a: 'A >> 1 (A[0] → Q[3])',
      m: 'Constant (0011)',
      q: 'Q >> 1 (Q₀ dropped)',
      targetBit: 'Shift RIGHT',
    },
  },
  {
    id: 'q5',
    concept: 'Bit Cascade During Right Shift',
    question: 'During the combined C-A-Q right shift, which bit moves into the most significant bit (MSB) of Accumulator A?',
    options: [
      { id: 'A', text: 'The Carry bit (C) generated during the addition phase', correct: true },
      { id: 'B', text: 'The least significant bit of the Multiplier (Q₀)', correct: false },
      { id: 'C', text: 'A constant binary 1', correct: false },
      { id: 'D', text: 'The sign bit of Multiplicand M', correct: false },
    ],
    hint: 'Think of the register arrangement: C | A | Q. When shifting right, the bit to the left of A moves into A’s MSB.',
    explanation: 'Correct! The register group is arranged as C | A | Q. During the right shift, the Carry register C moves into the MSB of Accumulator A, and new C resets to 0.',
    registers: {
      c: 'C (0 or 1)',
      a: 'Receives C at b3',
      m: '0011',
      q: 'Receives A₀ at q3',
      targetBit: 'C → A[3]',
    },
  },
  {
    id: 'q6',
    concept: '3 × 5 Calculation (Cycle 1)',
    question: 'Given M = 0011 (3), Q = 0101 (5), C = 0, and initial A = 0000. In Cycle 1 (Q₀ = 1), what are A and Q after the right shift?',
    options: [
      { id: 'A', text: 'A = 0001, Q = 1010', correct: true },
      { id: 'B', text: 'A = 0011, Q = 0101', correct: false },
      { id: 'C', text: 'A = 0000, Q = 1111', correct: false },
      { id: 'D', text: 'A = 0110, Q = 0010', correct: false },
    ],
    hint: 'First add M: A = 0000 + 0011 = 0011 (C = 0). Then shift C-A-Q right: A’s LSB (1) moves into Q’s MSB, and C (0) moves into A’s MSB.',
    explanation: 'Correct! Adding M yields A = 0011, C = 0. Shifting C-A-Q right by 1 bit results in A = 0001 and Q = 1010.',
    registers: {
      c: '0',
      a: '0001',
      m: '0011 (3)',
      q: '1010',
      targetBit: 'Cycle 1 Done',
    },
  },
  {
    id: 'q7',
    concept: '3 × 5 Calculation (Cycle 2)',
    question: 'Continuing from Cycle 1 (A = 0001, Q = 1010), in Cycle 2 the examined bit Q₀ is 0. What are A and Q after Cycle 2’s right shift?',
    options: [
      { id: 'A', text: 'A = 0000, Q = 1101', correct: true },
      { id: 'B', text: 'A = 0001, Q = 1010', correct: false },
      { id: 'C', text: 'A = 0011, Q = 1101', correct: false },
      { id: 'D', text: 'A = 0000, Q = 1111', correct: false },
    ],
    hint: 'Since Q₀ = 0, addition is bypassed. Shifting C (0) | A (0001) | Q (1010) right moves A’s LSB (1) into Q’s MSB.',
    explanation: 'Correct! Addition is skipped because Q₀ = 0. Shifting C-A-Q right gives A = 0000 and Q = 1101.',
    registers: {
      c: '0',
      a: '0000',
      m: '0011 (3)',
      q: '1101',
      targetBit: 'Cycle 2 Done',
    },
  },
  {
    id: 'q8',
    concept: 'Multiplicand Register Behavior',
    question: 'How does the Multiplicand (M) register change during the execution of the right-shift multiplication algorithm?',
    options: [
      { id: 'A', text: 'M remains completely constant and unchanged throughout all cycles', correct: true },
      { id: 'B', text: 'M shifts left by 1 bit each cycle', correct: false },
      { id: 'C', text: 'M shifts right by 1 bit each cycle', correct: false },
      { id: 'D', text: 'M is cleared to zero after the first cycle', correct: false },
    ],
    hint: 'In the right-shift algorithm, partial products shift right through C-A-Q, so the multiplicand does not need to scale.',
    explanation: 'Correct! In the standard right-shift architecture, Multiplicand M is stored in its register and remains constant throughout all n cycles.',
    registers: {
      c: '0',
      a: 'Partial Sum',
      m: 'CONSTANT (0011)',
      q: 'Multiplier',
      targetBit: 'M is Static',
    },
  },
  {
    id: 'q9',
    concept: 'Final Product Formation',
    question: 'After all n cycles finish, where is the final 2n-bit product located?',
    options: [
      { id: 'A', text: 'In the combined registers A and Q (Product = A | Q)', correct: true },
      { id: 'B', text: 'Exclusively inside the Multiplicand register M', correct: false },
      { id: 'C', text: 'In the Carry register C', correct: false },
      { id: 'D', text: 'Scattered across CPU memory cache lines', correct: false },
    ],
    hint: 'Accumulator A holds the upper n bits, and Multiplier Q holds the lower n bits.',
    explanation: 'Correct! The final 2n-bit product is obtained by combining A and Q: Accumulator A contains the upper n bits, and Multiplier Q contains the lower n bits.',
    registers: {
      c: 'Discarded',
      a: 'Upper n bits',
      m: '0011',
      q: 'Lower n bits',
      targetBit: 'Product = A | Q',
    },
  },
  {
    id: 'q10',
    concept: 'Handling Addition Carry',
    question: 'If adding M to A produces a carry-out (e.g. 7 + 10 = 17 in 4-bit addition), how is that carry handled?',
    options: [
      { id: 'A', text: 'The carry is captured in 1-bit register C and shifted into A’s MSB on the next right shift', correct: true },
      { id: 'B', text: 'The carry is discarded and causes a hardware exception', correct: false },
      { id: 'C', text: 'The carry overwrites the multiplier register Q', correct: false },
      { id: 'D', text: 'The clock cycle terminates immediately', correct: false },
    ],
    hint: 'The C register holds the carry specifically so it can enter the most significant position of A during the combined right shift.',
    explanation: 'Correct! Register C stores the addition carry-out, which immediately moves into the most significant bit (b3) of Accumulator A during the subsequent right shift.',
    registers: {
      c: 'Carry Out (1)',
      a: 'Sum (Lower 4 bits)',
      m: 'Multiplicand',
      q: 'Multiplier',
      targetBit: 'C holds carry',
    },
  },
  {
    id: 'q11',
    concept: 'Final Verification: 0011₂ × 0101₂',
    question: 'What is the final binary product of Multiplicand M = 0011₂ (3) and Multiplier Q = 0101₂ (5) in 8-bit representation?',
    options: [
      { id: 'A', text: '0000 1111₂ (decimal 15)', correct: true },
      { id: 'B', text: '0000 1010₂ (decimal 10)', correct: false },
      { id: 'C', text: '0001 0001₂ (decimal 17)', correct: false },
      { id: 'D', text: '0000 1100₂ (decimal 12)', correct: false },
    ],
    hint: '3 × 5 = 15. In 8-bit binary: A = 0000, Q = 1111.',
    explanation: 'Correct! 3 × 5 = 15, which in 8-bit binary is 0000 1111₂ (A = 0000, Q = 1111).',
    registers: {
      c: '0',
      a: '0000',
      m: '0011 (3)',
      q: '1111',
      targetBit: 'Product = 15',
    },
  },
  {
    id: 'q12',
    concept: 'Canonical Clock Cycle Sequence',
    question: 'What is the correct sequence of operations executed in hardware for each cycle of the shift-and-add multiplier?',
    options: [
      { id: 'A', text: 'EXAMINE Q₀ → ADD M to A (if Q₀=1) → SHIFT C-A-Q RIGHT → REPEAT', correct: true },
      { id: 'B', text: 'SHIFT C-A-Q RIGHT → EXAMINE Q₀ → ADD M → HALT', correct: false },
      { id: 'C', text: 'ADD M → SHIFT LEFT → CLEAR C → REPEAT', correct: false },
      { id: 'D', text: 'EXAMINE C → ROTATE Q → SUBTRACT M → HALT', correct: false },
    ],
    hint: 'Hardware must check the current Q₀ before shifting, add if Q₀ is 1, and then shift C-A-Q right.',
    explanation: 'Correct! The canonical sequence in every cycle is: 1) Examine Q₀, 2) Add M to A (with carry to C) if Q₀=1, 3) Shift combined C-A-Q registers RIGHT by 1 bit, 4) Repeat for n cycles.',
    registers: {
      c: 'Carry Bit',
      a: 'Accumulator',
      m: 'Multiplicand',
      q: 'Multiplier',
      targetBit: 'Canonical Cycle',
    },
  },
];

// Helper to shuffle an array in place (Fisher-Yates)
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Selects exactly 5 distinct randomized questions and safely shuffles answer choices
export function getRandomQuestQuestions() {
  const shuffledQuestions = shuffleArray(MASTER_QUESTION_BANK);
  const selectedFive = shuffledQuestions.slice(0, 5);

  const optionLetters = ['A', 'B', 'C', 'D'];

  return selectedFive.map((q, idx) => {
    // Shuffle the options while tracking which is correct
    const shuffledOpts = shuffleArray(q.options);
    const assignedOptions = shuffledOpts.map((opt, optIdx) => ({
      ...opt,
      id: optionLetters[optIdx] || opt.id,
    }));

    return {
      ...q,
      questNumber: idx + 1,
      options: assignedOptions,
    };
  });
}
