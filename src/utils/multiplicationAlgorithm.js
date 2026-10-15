// src/utils/multiplicationAlgorithm.js
// Standard Right-Shift Shift-and-Add Multiplication Algorithm
// Registers:
// C: 1-bit Carry register (stores addition carry-out, shifts into A)
// A: n-bit Accumulator register (4 bits, stores intermediate partial product)
// Q: n-bit Multiplier register (4 bits, initially multiplier, stores lower product)
// M: n-bit Multiplicand register (4 bits, remains constant)
// Combined Register Group: C | A | Q (2n + 1 bits, shifts RIGHT each cycle)

export function runShiftAndAddMultiplication(mInit = 3, qInit = 5, bitCount = 4) {
  let c = 0;
  let a = 0;
  let q = qInit & ((1 << bitCount) - 1);
  const m = mInit & ((1 << bitCount) - 1);
  const mask = (1 << bitCount) - 1;

  const steps = [];

  for (let i = 0; i < bitCount; i++) {
    const q0 = q & 1;
    const cBefore = c;
    const aBefore = a;
    const qBefore = q;

    // Step 1: Examine Q0 and conditionally add M to A
    let cAfterAdd = 0;
    let aAfterAdd = a;
    let operation = '';
    let addOccurred = false;

    if (q0 === 1) {
      const sum = a + m;
      cAfterAdd = (sum >> bitCount) & 1;
      aAfterAdd = sum & mask;
      operation = 'Add M → A';
      addOccurred = true;
    } else {
      cAfterAdd = 0;
      aAfterAdd = a;
      operation = 'Skip Add (Q₀ = 0)';
      addOccurred = false;
    }

    // Step 2: Combined Right Shift of C-A-Q
    // C | A | Q shifted right by 1
    // A0 (LSB of A after add) moves into MSB of Q
    const a0 = aAfterAdd & 1;
    const qAfterShift = (qBefore >> 1) | (a0 << (bitCount - 1));
    // C moves into MSB of A
    const aAfterShift = (aAfterAdd >> 1) | (cAfterAdd << (bitCount - 1));
    // New C becomes 0
    const cAfterShift = 0;

    steps.push({
      stepIndex: i + 1,
      bitIndex: i,
      q0,
      mVal: m,
      // States before addition
      cBefore,
      aBefore,
      qBefore,
      // States after addition (before shift)
      cAfterAdd,
      aAfterAdd,
      addOccurred,
      operation,
      // States after combined right shift
      cAfterShift,
      aAfterShift,
      qAfterShift,
      a0ShiftedToQ: a0,
      cShiftedToA: cAfterAdd,
      desc:
        q0 === 1
          ? `Q₀ = 1: Add M (${m}) to A (${aBefore} + ${m} = ${aAfterAdd}, Carry C = ${cAfterAdd}). Then shift C-A-Q RIGHT: C (${cAfterAdd}) moves into A MSB, A₀ (${a0}) moves into Q MSB.`
          : `Q₀ = 0: Addition skipped. Shift combined C-A-Q RIGHT: C (0) moves into A MSB, A₀ (${a0}) moves into Q MSB.`,
    });

    // Advance register state for next cycle
    c = cAfterShift;
    a = aAfterShift;
    q = qAfterShift;
  }

  const finalProduct = (a << bitCount) | q;

  return {
    m,
    qInit,
    steps,
    finalA: a,
    finalQ: q,
    finalProduct,
  };
}

export function to4BitArray(num) {
  const binary = (num & 0xf).toString(2).padStart(4, '0');
  return binary.split('');
}

export function to8BitArray(num) {
  const binary = (num & 0xff).toString(2).padStart(8, '0');
  return binary.split('');
}

export function toBinaryString(num, bits = 4) {
  return (num & ((1 << bits) - 1)).toString(2).padStart(bits, '0');
}
