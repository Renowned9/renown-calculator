import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { permutation, combination, factorial, gcd, lcm, isPrime, fmtNum } from '../utils/mathEngine';

const C = {
  bg: '#0a1a0a',
  card: '#132313',
  input: '#1e3f1e',
  btn: '#2d8a2d',
  text: '#e8ffe8',
  sub: '#88aa88',
  white: '#fff',
  result: '#aaffaa',
  border: '#336633',
  error: '#ff6666',
};

function CalcCard({ title, children }) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function NumInput({ label, value, onChange }) {
  return (
    <View style={s.inputRow}>
      <Text style={s.inputLabel}>{label}</Text>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={C.sub}
        selectTextOnFocus
      />
    </View>
  );
}

function Result({ label, value, error }) {
  return (
    <View style={s.resultBox}>
      <Text style={s.resultLabel}>{label}</Text>
      <Text style={[s.resultValue, error && s.errorValue]}>{error ? error : String(value ?? '')}</Text>
    </View>
  );
}

function useCalc(compute) {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function set(key, val) {
    setInputs(prev => ({ ...prev, [key]: val }));
    setResult(null);
    setError('');
  }

  function run() {
    try {
      setError('');
      setResult(compute(inputs));
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  }

  return { inputs, set, result, error, run };
}

export default function CombinatoricsCalculator() {
  // nPr
  const npr = useCalc(({ n, r }) => {
    const ni = parseInt(n), ri = parseInt(r);
    if (isNaN(ni) || isNaN(ri)) throw new Error('Enter valid integers');
    return fmtNum(permutation(ni, ri));
  });

  // nCr
  const ncr = useCalc(({ n, r }) => {
    const ni = parseInt(n), ri = parseInt(r);
    if (isNaN(ni) || isNaN(ri)) throw new Error('Enter valid integers');
    return fmtNum(combination(ni, ri));
  });

  // factorial
  const fact = useCalc(({ n }) => {
    const ni = parseInt(n);
    if (isNaN(ni)) throw new Error('Enter valid integer');
    return fmtNum(factorial(ni));
  });

  // GCD / LCM
  const gcdlcm = useCalc(({ a, b }) => {
    const ai = parseInt(a), bi = parseInt(b);
    if (isNaN(ai) || isNaN(bi)) throw new Error('Enter valid integers');
    return `GCD = ${gcd(ai, bi)},  LCM = ${lcm(ai, bi)}`;
  });

  // Prime check
  const prime = useCalc(({ n }) => {
    const ni = parseInt(n);
    if (isNaN(ni)) throw new Error('Enter a valid integer');
    return `${ni} is ${isPrime(ni) ? 'PRIME ✓' : 'NOT prime ✗'}`;
  });

  // Power
  const power = useCalc(({ base, exp }) => {
    const b = parseFloat(base), e = parseFloat(exp);
    if (isNaN(b) || isNaN(e)) throw new Error('Enter valid numbers');
    return fmtNum(Math.pow(b, e));
  });

  // Modulo
  const modulo = useCalc(({ a, b }) => {
    const ai = parseInt(a), bi = parseInt(b);
    if (isNaN(ai) || isNaN(bi)) throw new Error('Enter valid integers');
    if (bi === 0) throw new Error('Cannot mod by 0');
    return `${ai} mod ${bi} = ${ai % bi}`;
  });

  const Btn = ({ label, onPress }) => (
    <TouchableOpacity style={s.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={s.btnTxt}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Combinatorics & Number Theory</Text>

      <CalcCard title="Permutation P(n, r)">
        <NumInput label="n" value={npr.inputs.n || ''} onChange={v => npr.set('n', v)} />
        <NumInput label="r" value={npr.inputs.r || ''} onChange={v => npr.set('r', v)} />
        <Btn label="Calculate P(n,r)" onPress={npr.run} />
        {(npr.result !== null || npr.error) && <Result label="P(n,r) =" value={npr.result} error={npr.error} />}
      </CalcCard>

      <CalcCard title="Combination C(n, r)">
        <NumInput label="n" value={ncr.inputs.n || ''} onChange={v => ncr.set('n', v)} />
        <NumInput label="r" value={ncr.inputs.r || ''} onChange={v => ncr.set('r', v)} />
        <Btn label="Calculate C(n,r)" onPress={ncr.run} />
        {(ncr.result !== null || ncr.error) && <Result label="C(n,r) =" value={ncr.result} error={ncr.error} />}
      </CalcCard>

      <CalcCard title="Factorial  n!">
        <NumInput label="n" value={fact.inputs.n || ''} onChange={v => fact.set('n', v)} />
        <Btn label="Calculate n!" onPress={fact.run} />
        {(fact.result !== null || fact.error) && <Result label="n! =" value={fact.result} error={fact.error} />}
      </CalcCard>

      <CalcCard title="GCD & LCM">
        <NumInput label="a" value={gcdlcm.inputs.a || ''} onChange={v => gcdlcm.set('a', v)} />
        <NumInput label="b" value={gcdlcm.inputs.b || ''} onChange={v => gcdlcm.set('b', v)} />
        <Btn label="Calculate GCD & LCM" onPress={gcdlcm.run} />
        {(gcdlcm.result !== null || gcdlcm.error) && <Result value={gcdlcm.result} error={gcdlcm.error} />}
      </CalcCard>

      <CalcCard title="Prime Check">
        <NumInput label="n" value={prime.inputs.n || ''} onChange={v => prime.set('n', v)} />
        <Btn label="Check" onPress={prime.run} />
        {(prime.result !== null || prime.error) && <Result value={prime.result} error={prime.error} />}
      </CalcCard>

      <CalcCard title="Power  baseᵉˣᵖ">
        <NumInput label="Base" value={power.inputs.base || ''} onChange={v => power.set('base', v)} />
        <NumInput label="Exponent" value={power.inputs.exp || ''} onChange={v => power.set('exp', v)} />
        <Btn label="Calculate" onPress={power.run} />
        {(power.result !== null || power.error) && <Result label="=" value={power.result} error={power.error} />}
      </CalcCard>

      <CalcCard title="Modulo  a mod b">
        <NumInput label="a" value={modulo.inputs.a || ''} onChange={v => modulo.set('a', v)} />
        <NumInput label="b" value={modulo.inputs.b || ''} onChange={v => modulo.set('b', v)} />
        <Btn label="Calculate" onPress={modulo.run} />
        {(modulo.result !== null || modulo.error) && <Result value={modulo.result} error={modulo.error} />}
      </CalcCard>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 12, paddingBottom: 40 },
  title: { color: C.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 12, elevation: 3 },
  cardTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputLabel: { color: C.sub, fontSize: 14, width: 80 },
  input: {
    flex: 1, backgroundColor: C.input, color: C.text, borderRadius: 8,
    padding: 8, fontSize: 15, borderWidth: 1, borderColor: C.border,
  },
  btn: {
    backgroundColor: C.btn, borderRadius: 10, padding: 10,
    alignItems: 'center', marginTop: 4, elevation: 2,
  },
  btnTxt: { color: C.white, fontSize: 14, fontWeight: '700' },
  resultBox: { marginTop: 10, padding: 10, backgroundColor: '#0a2a0a', borderRadius: 8 },
  resultLabel: { color: C.sub, fontSize: 12 },
  resultValue: { color: C.result, fontSize: 18, fontWeight: '700', marginTop: 2 },
  errorValue: { color: C.error },
});
