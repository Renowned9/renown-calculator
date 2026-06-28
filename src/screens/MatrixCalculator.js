import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  matAdd, matSub, matMul, matScalar, matTranspose,
  matDet, matInverse, matTrace, fmtMatrix, fmtNum,
} from '../utils/mathEngine';

const C = {
  bg: '#0a0a1a',
  card: '#13132a',
  input: '#1e1e3f',
  btn: '#6a0dad',
  btn2: '#1a5c3a',
  btn3: '#5c1a3a',
  text: '#e8e8ff',
  sub: '#8888aa',
  border: '#333366',
  white: '#fff',
  result: '#aaffaa',
};

const SIZES = [2, 3, 4];

function emptyMatrix(n) {
  return Array.from({ length: n }, () => Array(n).fill(''));
}

function parseMatrix(m) {
  return m.map(row => row.map(v => {
    const n = parseFloat(v);
    if (isNaN(n)) throw new Error('All cells must be numbers');
    return n;
  }));
}

function MatrixInput({ matrix, onChange, label }) {
  const n = matrix.length;
  return (
    <View style={s.matCard}>
      <Text style={s.matLabel}>{label}</Text>
      {matrix.map((row, i) => (
        <View key={i} style={s.matRow}>
          {row.map((val, j) => (
            <TextInput
              key={j}
              style={s.cell}
              value={String(val)}
              onChangeText={v => {
                const copy = matrix.map(r => [...r]);
                copy[i][j] = v;
                onChange(copy);
              }}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={C.sub}
              selectTextOnFocus
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function MatrixDisplay({ matrix, label }) {
  if (!matrix) return null;
  const fmt = typeof matrix[0] === 'object' ? fmtMatrix(matrix) : null;
  return (
    <View style={s.matCard}>
      <Text style={s.matLabel}>{label}</Text>
      {fmt ? fmt.map((row, i) => (
        <View key={i} style={s.matRow}>
          {row.map((v, j) => (
            <View key={j} style={[s.cell, s.cellResult]}>
              <Text style={s.cellResultTxt}>{v}</Text>
            </View>
          ))}
        </View>
      )) : (
        <Text style={s.scalarResult}>{String(matrix)}</Text>
      )}
    </View>
  );
}

export default function MatrixCalculator() {
  const [size, setSize] = useState(2);
  const [A, setA] = useState(emptyMatrix(2));
  const [B, setB] = useState(emptyMatrix(2));
  const [result, setResult] = useState(null);
  const [resultLabel, setResultLabel] = useState('');
  const [scalar, setScalar] = useState('1');

  const changeSize = useCallback((n) => {
    setSize(n);
    setA(emptyMatrix(n));
    setB(emptyMatrix(n));
    setResult(null);
  }, []);

  function run(op) {
    try {
      const a = parseMatrix(A);
      let r, label;
      switch (op) {
        case 'add':       r = matAdd(a, parseMatrix(B)); label = 'A + B'; break;
        case 'sub':       r = matSub(a, parseMatrix(B)); label = 'A − B'; break;
        case 'mul':       r = matMul(a, parseMatrix(B)); label = 'A × B'; break;
        case 'scalar':    r = matScalar(a, parseFloat(scalar) || 1); label = `${scalar} × A`; break;
        case 'transA':    r = matTranspose(a); label = 'Aᵀ'; break;
        case 'transB':    r = matTranspose(parseMatrix(B)); label = 'Bᵀ'; break;
        case 'detA':      r = `det(A) = ${fmtNum(matDet(a))}`; label = 'Determinant'; break;
        case 'detB':      r = `det(B) = ${fmtNum(matDet(parseMatrix(B)))}`; label = 'Determinant'; break;
        case 'invA':      r = matInverse(a); label = 'A⁻¹'; break;
        case 'invB':      r = matInverse(parseMatrix(B)); label = 'B⁻¹'; break;
        case 'traceA':    r = `tr(A) = ${fmtNum(matTrace(a))}`; label = 'Trace'; break;
        case 'traceB':    r = `tr(B) = ${fmtNum(matTrace(parseMatrix(B)))}`; label = 'Trace'; break;
        default: return;
      }
      setResult(r);
      setResultLabel(label);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  const OpBtn = ({ label, op, color }) => (
    <TouchableOpacity style={[s.opBtn, { backgroundColor: color || C.btn }]}
      onPress={() => run(op)} activeOpacity={0.8}>
      <Text style={s.opBtnTxt}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Matrix Calculator</Text>

      {/* Size selector */}
      <View style={s.sizeRow}>
        <Text style={s.sub}>Matrix size:</Text>
        {SIZES.map(n => (
          <TouchableOpacity key={n} style={[s.sizeBtn, size === n && s.sizeBtnActive]}
            onPress={() => changeSize(n)}>
            <Text style={s.sizeBtnTxt}>{n}×{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Matrices */}
      <View style={s.matrices}>
        <MatrixInput matrix={A} onChange={setA} label="Matrix A" />
        <MatrixInput matrix={B} onChange={setB} label="Matrix B" />
      </View>

      {/* Binary operations */}
      <Text style={s.sectionTitle}>Binary Operations (A ★ B)</Text>
      <View style={s.btnRow}>
        <OpBtn label="A + B" op="add" />
        <OpBtn label="A − B" op="sub" />
        <OpBtn label="A × B" op="mul" />
      </View>

      {/* Unary A */}
      <Text style={s.sectionTitle}>Operations on A</Text>
      <View style={s.btnRow}>
        <OpBtn label="Aᵀ" op="transA" color={C.btn2} />
        <OpBtn label="det(A)" op="detA" color={C.btn2} />
        <OpBtn label="A⁻¹" op="invA" color={C.btn2} />
        <OpBtn label="tr(A)" op="traceA" color={C.btn2} />
      </View>

      {/* Unary B */}
      <Text style={s.sectionTitle}>Operations on B</Text>
      <View style={s.btnRow}>
        <OpBtn label="Bᵀ" op="transB" color={C.btn3} />
        <OpBtn label="det(B)" op="detB" color={C.btn3} />
        <OpBtn label="B⁻¹" op="invB" color={C.btn3} />
        <OpBtn label="tr(B)" op="traceB" color={C.btn3} />
      </View>

      {/* Scalar */}
      <Text style={s.sectionTitle}>Scalar × A</Text>
      <View style={s.scalarRow}>
        <TextInput
          style={s.scalarInput}
          value={scalar}
          onChangeText={setScalar}
          keyboardType="numeric"
          placeholderTextColor={C.sub}
        />
        <OpBtn label="Multiply" op="scalar" />
      </View>

      {/* Result */}
      {result !== null && (
        typeof result === 'string'
          ? <Text style={s.scalarResult}>{result}</Text>
          : <MatrixDisplay matrix={result} label={resultLabel} />
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 12, paddingBottom: 40 },
  title: { color: C.text, fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  sizeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  sub: { color: C.sub, fontSize: 13, marginRight: 8 },
  sizeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.input, marginRight: 6 },
  sizeBtnActive: { backgroundColor: C.btn },
  sizeBtnTxt: { color: C.white, fontWeight: '600' },
  matrices: { flexDirection: 'row', justifyContent: 'space-between' },
  matCard: { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 8, margin: 4 },
  matLabel: { color: C.sub, fontSize: 12, marginBottom: 6, textAlign: 'center' },
  matRow: { flexDirection: 'row', marginBottom: 4 },
  cell: {
    flex: 1, backgroundColor: C.input, color: C.text, textAlign: 'center',
    borderRadius: 6, marginHorizontal: 2, padding: 6, fontSize: 13,
    borderWidth: 1, borderColor: C.border,
  },
  cellResult: { backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  cellResultTxt: { color: C.result, fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: C.sub, fontSize: 12, marginTop: 12, marginBottom: 6, marginLeft: 4 },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  opBtn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    margin: 4, elevation: 2,
  },
  opBtnTxt: { color: C.white, fontSize: 13, fontWeight: '700' },
  scalarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  scalarInput: {
    width: 70, backgroundColor: C.input, color: C.text, borderRadius: 8,
    padding: 8, fontSize: 15, marginRight: 8, borderWidth: 1, borderColor: C.border,
    textAlign: 'center',
  },
  scalarResult: { color: C.result, fontSize: 18, fontWeight: '700', marginTop: 12, textAlign: 'center' },
});
