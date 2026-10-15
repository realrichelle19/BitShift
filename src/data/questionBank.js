// Question Bank for BitShift: Shift-and-Add Multiplication Algorithm
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
    hint: 'Hardware scanners inspect the lowest-order bit first because each shift to the right moves the next binary power into position.',
    explanation: 'Correct! The ALU examines the least significant bit (Q₀). If Q₀ is 1, the multiplicand is added to the accumulator; if 0, the addition is skipped.',
    registers: {
      a: '0000 0000',
      m: '0000 0101 (5)',
      q: '0011 (3)',
      targetBit: 'Q₀ = 1',
    },
  },
  {
    id: 'q2',
    concept: 'Bit Testing Decision',
    question: 'What operation does the hardware perform when the current multiplier bit Q₀ is equal to 1?',
    options: [
      { id: 'A', text: 'Adds the Multiplicand (M) into Accumulator (A ← A + M)', correct: true },
      { id: 'B', text: 'Clears the Multiplicand register to zero', correct: false },
      { id: 'C', text: 'Subtracts the Multiplicand from Accumulator (A ← A − M)', correct: false },
      { id: 'D', text: 'Skips addition and immediately halts the clock', correct: false },
    ],
    hint: 'When a binary bit is 1, it represents 1 × M at the current power of two, so that partial product must be accumulated.',
    explanation: 'Correct! When Q₀ = 1, the ALU accumulates the multiplicand into the running sum: A ← A + M.',
    registers: {
      a: '0000 0000 (0)',
      m: '0000 0101 (5)',
      q: '0011 (3)',
      targetBit: 'Q₀ = 1',
    },
  },
  {
    id: 'q3',
    concept: 'Zero-Bit Optimization',
    question: 'What occurs during a cycle where the rightmost multiplier bit Q₀ is 0?',
    options: [
      { id: 'A', text: 'Addition is bypassed; only register shifting occurs', correct: true },
      { id: 'B', text: 'The accumulator is reset to 0000 0000', correct: false },
      { id: 'C', text: 'Multiplicand M is inverted using two’s complement', correct: false },
      { id: 'D', text: 'The algorithm terminates immediately', correct: false },
    ],
    hint: '0 times any number is 0. Adding 0 would not change the accumulator.',
    explanation: 'Correct! Because 0 × M = 0, no addition is needed. The accumulator remains unchanged, saving clock cycles and switching power.',
    registers: {
      a: '0000 1111 (15)',
      m: '0001 0100 (20)',
      q: '0010 (2)',
      targetBit: 'Q₀ = 0',
    },
  },
  {
    id: 'q4',
    concept: 'Multiplicand Shift Direction',
    question: 'How is the Multiplicand (M) modified after each cycle in the standard shift-and-add multiplier?',
    options: [
      { id: 'A', text: 'Shifted LEFT by 1 bit (doubling its numeric weight)', correct: true },
      { id: 'B', text: 'Shifted RIGHT by 1 bit (halving its numeric weight)', correct: false },
      { id: 'C', text: 'Rotated cyclically by 2 bits', correct: false },
      { id: 'D', text: 'Kept completely static while Q shifts', correct: false },
    ],
    hint: 'Moving from bit position 2⁰ to 2¹ to 2² corresponds to multiplying by 2 at each step.',
    explanation: 'Correct! Shifting the multiplicand LEFT by 1 bit multiplies its value by 2, scaling it to match the next power of two in the multiplier.',
    registers: {
      a: '0000 0101',
      m: '0000 0101 → 0000 1010',
      q: '0001',
      targetBit: 'M << 1',
    },
  },
  {
    id: 'q5',
    concept: 'Multiplier Shift Direction',
    question: 'How is the Multiplier (Q) modified at the end of each clock cycle?',
    options: [
      { id: 'A', text: 'Shifted RIGHT by 1 bit (discarding the processed Q₀ bit)', correct: true },
      { id: 'B', text: 'Shifted LEFT by 1 bit inserting 1 at the LSB', correct: false },
      { id: 'C', text: 'Replaced by the accumulator’s contents', correct: false },
      { id: 'D', text: 'Incremented by 1 until overflow occurs', correct: false },
    ],
    hint: 'Once Q₀ has been evaluated, the next bit must become the new Q₀ in the next clock cycle.',
    explanation: 'Correct! The multiplier shifts RIGHT by 1 bit (Q >> 1) so that the next significant bit moves into the Q₀ position for examination.',
    registers: {
      a: '0000 0101',
      m: '0000 1010',
      q: '0011 → 0001',
      targetBit: 'Q >> 1',
    },
  },
  {
    id: 'q6',
    concept: '5 × 3 Calculation (Step 1)',
    question: 'Given M = 0101 (5) and Q = 0011 (3), with initial A = 0. What is A after the first cycle?',
    options: [
      { id: 'A', text: '0000 0101 (decimal 5)', correct: true },
      { id: 'B', text: '0000 0011 (decimal 3)', correct: false },
      { id: 'C', text: '0000 1010 (decimal 10)', correct: false },
      { id: 'D', text: '0000 1111 (decimal 15)', correct: false },
    ],
    hint: 'Q = 0011, so Q₀ = 1. The operation is A = A + M = 0 + 5.',
    explanation: 'Correct! In cycle 1, Q₀ = 1, so M (5) is added to A (0), resulting in A = 0000 0101 (decimal 5).',
    registers: {
      a: '0 + 5 = 0000 0101',
      m: '0000 0101 (5)',
      q: '0011 (3)',
      targetBit: 'Q₀ = 1',
    },
  },
  {
    id: 'q7',
    concept: '5 × 3 Calculation (Step 2)',
    question: 'Following cycle 1 (A = 5), M is shifted left to 10 (00001010) and Q is shifted right to 1 (0001). Since Q₀ = 1, what is the new accumulator value?',
    options: [
      { id: 'A', text: '0000 1111 (decimal 15)', correct: true },
      { id: 'B', text: '0000 1010 (decimal 10)', correct: false },
      { id: 'C', text: '0001 0100 (decimal 20)', correct: false },
      { id: 'D', text: '0000 0101 (decimal 5)', correct: false },
    ],
    hint: 'Add the shifted multiplicand M (10) to the previous accumulator A (5): 5 + 10 = ?',
    explanation: 'Correct! A = 5 + 10 = 15, which in 8-bit binary is 0000 1111₂.',
    registers: {
      a: '5 + 10 = 0000 1111',
      m: '0000 1010 (10)',
      q: '0001 (1)',
      targetBit: 'Q₀ = 1',
    },
  },
  {
    id: 'q8',
    concept: 'Termination Condition',
    question: 'When does the shift-and-add algorithm terminate for a 4-bit multiplier?',
    options: [
      { id: 'A', text: 'When all 4 multiplier bits have been evaluated and shifted', correct: true },
      { id: 'B', text: 'When the accumulator overflows past 16 bits', correct: false },
      { id: 'C', text: 'Immediately after the first addition is performed', correct: false },
      { id: 'D', text: 'Only when the multiplicand becomes zero', correct: false },
    ],
    hint: 'An n-bit multiplier requires exactly n clock iterations.',
    explanation: 'Correct! A 4-bit multiplier requires 4 loop iterations. Once the step counter reaches zero, all multiplier bits have contributed to the product.',
    registers: {
      a: '0000 1111 (Final)',
      m: '0010 1000 (40)',
      q: '0000 (Exhausted)',
      targetBit: 'Counter = 0',
    },
  },
  {
    id: 'q9',
    concept: 'Accumulator Bit-Width Design',
    question: 'Why does multiplying two 4-bit binary numbers require an 8-bit Accumulator register?',
    options: [
      { id: 'A', text: 'The maximum product (15 × 15 = 225) requires 8 bits (up to 255) to prevent overflow', correct: true },
      { id: 'B', text: 'CPUs can only physically manufacture registers in multiples of 16', correct: false },
      { id: 'C', text: '4 bits are reserved exclusively for negative sign flags', correct: false },
      { id: 'D', text: 'The multiplier must fit inside the high nibble of A', correct: false },
    ],
    hint: 'Calculate (2⁴ − 1) × (2⁴ − 1) = 15 × 15 = 225. How many bits are needed to represent 225?',
    explanation: 'Correct! Multiplying two n-bit numbers produces up to a 2n-bit result. For 4-bit inputs, 15 × 15 = 225, which requires 8 bits (2⁸ − 1 = 255 capacity).',
    registers: {
      a: 'Max: 1111 1111 (255)',
      m: 'Max: 1111 (15)',
      q: 'Max: 1111 (15)',
      targetBit: '2n = 8 bits',
    },
  },
  {
    id: 'q10',
    concept: 'Multiplication by Powers of Two',
    question: 'Multiplying 0110₂ (decimal 6) by 0100₂ (decimal 4) requires adding M at which bit position?',
    options: [
      { id: 'A', text: 'Only at bit 2 (weight 2² = 4), with bits 0 and 1 skipped', correct: true },
      { id: 'B', text: 'At all 4 bit positions equally', correct: false },
      { id: 'C', text: 'Only at bit 0 (weight 2⁰ = 1)', correct: false },
      { id: 'D', text: 'No additions because the multiplier has zeros', correct: false },
    ],
    hint: 'Multiplier Q = 0100 has a 1 only at bit index 2 (2² = 4).',
    explanation: 'Correct! Because Q = 0100₂, Q₀=0 and Q₁=0 (both skipped). Only when Q shifts right to position 2 does Q₀=1, adding 6 × 4 = 24.',
    registers: {
      a: '0001 1000 (24)',
      m: '0000 0110 (6)',
      q: '0100 (4)',
      targetBit: 'Q₂ = 1',
    },
  },
  {
    id: 'q11',
    concept: 'Final Verification: 0101 × 0011',
    question: 'What is the final binary product of 0101₂ (5) × 0011₂ (3) in 8-bit representation?',
    options: [
      { id: 'A', text: '0000 1111₂ (decimal 15)', correct: true },
      { id: 'B', text: '0000 1010₂ (decimal 10)', correct: false },
      { id: 'C', text: '0001 0001₂ (decimal 17)', correct: false },
      { id: 'D', text: '0000 1100₂ (decimal 12)', correct: false },
    ],
    hint: '5 × 3 = 15. In binary: 8 + 4 + 2 + 1 = 15.',
    explanation: 'Correct! 5 × 3 = 15, which in binary is 1111₂ (or 0000 1111₂ as an 8-bit byte).',
    registers: {
      a: '0000 1111 (15)',
      m: '0101 (5)',
      q: '0011 (3)',
      targetBit: 'Product = 15',
    },
  },
  {
    id: 'q12',
    concept: 'Clock Cycle Sequence',
    question: 'What is the fundamental 4-beat cycle executed in hardware for each bit of the multiplier?',
    options: [
      { id: 'A', text: 'CHECK (Q₀) → ADD (if 1) → SHIFT (M left, Q right) → REPEAT', correct: true },
      { id: 'B', text: 'SHIFT → CHECK → CLEAR → HALT', correct: false },
      { id: 'C', text: 'ADD → SUBTRACT → ROTATE → HALT', correct: false },
      { id: 'D', text: 'MULTIPLY → DIVIDE → STORE → FETCH', correct: false },
    ],
    hint: 'Remember the exam pro-tip: Check bit 0, add if high, shift registers, and repeat for the next bit.',
    explanation: 'Correct! The canonical sequence is: CHECK Q₀ → ADD M to A if Q₀=1 → SHIFT M left & Q right → REPEAT until all bits are processed.',
    registers: {
      a: 'Running Sum',
      m: 'Left Shift << 1',
      q: 'Right Shift >> 1',
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
      questLevel: idx + 1, // 1 to 5
      options: assignedOptions,
    };
  });
}
