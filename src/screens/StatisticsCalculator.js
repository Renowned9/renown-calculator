import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { stats, fmtNum } from '../utils/mathEngine';

const C = {
  bg: '#0a0a1f',
  card: '#13132f',
  input: '#1e1e4f',
  btn: '#e94560',
  text: '#e8e8ff',
  sub: '#8888cc',
  white: '#fff',
  result: '#88ddff',
  border: '#333377',
  row1: '#1a1a3a',
  row2: '#131328',
};

export default function StatisticsCalculator() {
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function compute() {
    try {
      setError('');
      const numbers = raw.split(/[\s,;]+/).filter(Boolean).map(x => {
        const n = parseFloat(x);
        if (isNaN(n)) throw new Error(`"${x}" is not a number`);
        return n;
      });
      if (!numbers.length) throw new Error('Enter at least one number');
      setResult(stats(numbers));
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  }

  const Row = ({ label, value, shade }) => (
    <View style={[s.row, { backgroundColor: shade ? C.row1 : C.row2 }]}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Statistics Calculator</Text>

      <View style={s.card}>
        <Text style={s.hint}>Enter numbers separated by commas or spaces:</Text>
        <TextInput
          style={s.input}
          value={raw}
          onChangeText={setRaw}
          placeholder="e.g. 1, 2, 3, 4, 5"
          placeholderTextColor={C.sub}
          multiline
          numberOfLines={3}
          keyboardType="default"
        />
        {error ? <Text style={s.error}>{error}</Text> : null}
        <TouchableOpacity style={s.btn} onPress={compute} activeOpacity={0.8}>
          <Text style={s.btnTxt}>Compute Statistics</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Results</Text>

          <Row label="Count (n)"         value={result.count} shade />
          <Row label="Sum (Σx)"          value={fmtNum(result.sum)} />
          <Row label="Minimum"           value={fmtNum(result.min)} shade />
          <Row label="Maximum"           value={fmtNum(result.max)} />
          <Row label="Range"             value={fmtNum(result.range)} shade />

          <View style={s.divider} />

          <Row label="Mean (x̄)"         value={fmtNum(result.mean)} shade />
          <Row label="Median"            value={fmtNum(result.median)} />
          <Row label="Mode"              value={result.mode.map(fmtNum).join(', ')} shade />

          <View style={s.divider} />

          <Row label="Variance (pop.)"   value={fmtNum(result.variance)} shade />
          <Row label="Variance (sample)" value={fmtNum(result.sampleVariance)} />
          <Row label="Std Dev (pop.)"    value={fmtNum(result.stdDev)} shade />
          <Row label="Std Dev (sample)"  value={fmtNum(result.sampleStdDev)} />

          <View style={s.divider} />

          <Row label="Q1 (25th pct)"     value={fmtNum(result.q1)} shade />
          <Row label="Q3 (75th pct)"     value={fmtNum(result.q3)} />
          <Row label="IQR (Q3 − Q1)"     value={fmtNum(result.q3 - result.q1)} shade />
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 12, paddingBottom: 40 },
  title: { color: C.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 14, elevation: 3 },
  cardTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  hint: { color: C.sub, fontSize: 13, marginBottom: 8 },
  input: {
    backgroundColor: C.input, color: C.text, borderRadius: 10, padding: 12,
    fontSize: 15, textAlignVertical: 'top', borderWidth: 1, borderColor: C.border,
    minHeight: 80,
  },
  error: { color: '#ff6666', fontSize: 13, marginTop: 6 },
  btn: {
    backgroundColor: C.btn, borderRadius: 10, padding: 12,
    alignItems: 'center', marginTop: 12, elevation: 2,
  },
  btnTxt: { color: C.white, fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 6, marginBottom: 2 },
  rowLabel: { color: C.sub, fontSize: 13 },
  rowValue: { color: C.result, fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 6 },
});
