import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Vibration,
} from 'react-native';

const COLORS = {
  bg: '#1a1a2e',
  displayBg: '#16213e',
  numBtn: '#0f3460',
  opBtn: '#e94560',
  eqBtn: '#e94560',
  clearBtn: '#533483',
  fnBtn: '#1a1a2e',
  textPrimary: '#eaeaea',
  textSecondary: '#a0a0b0',
  btnText: '#ffffff',
  shadow: '#000',
};

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  const press = useCallback((val) => {
    Vibration.vibrate(30);

    if (val === 'C') {
      setDisplay('0'); setExpression(''); setPrevValue(null);
      setOperator(null); setWaitingForOperand(false);
      return;
    }

    if (val === '⌫') {
      if (display.length > 1) setDisplay(display.slice(0, -1));
      else setDisplay('0');
      return;
    }

    if (val === '±') {
      setDisplay(String(parseFloat(display) * -1));
      return;
    }

    if (val === '%') {
      setDisplay(String(parseFloat(display) / 100));
      return;
    }

    if (['+', '−', '×', '÷'].includes(val)) {
      const opMap = { '+': '+', '−': '-', '×': '*', '÷': '/' };
      const current = parseFloat(display);
      if (prevValue !== null && !waitingForOperand) {
        const result = calculate(prevValue, current, operator);
        setDisplay(String(result));
        setPrevValue(result);
        setExpression(`${result} ${val}`);
      } else {
        setPrevValue(current);
        setExpression(`${current} ${val}`);
      }
      setOperator(opMap[val]);
      setWaitingForOperand(true);
      return;
    }

    if (val === '=') {
      if (operator === null || prevValue === null) return;
      const current = parseFloat(display);
      const result = calculate(prevValue, current, operator);
      const entry = `${expression} ${current} = ${result}`;
      setHistory(h => [entry, ...h.slice(0, 9)]);
      setDisplay(String(result));
      setExpression('');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      return;
    }

    if (val === '.') {
      if (waitingForOperand) { setDisplay('0.'); setWaitingForOperand(false); return; }
      if (!display.includes('.')) setDisplay(display + '.');
      return;
    }

    if (waitingForOperand) {
      setDisplay(String(val));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(val) : display + val);
    }
  }, [display, prevValue, operator, waitingForOperand, expression]);

  function calculate(a, b, op) {
    switch (op) {
      case '+': return round(a + b);
      case '-': return round(a - b);
      case '*': return round(a * b);
      case '/': return b === 0 ? 'Error' : round(a / b);
      default:  return b;
    }
  }

  function round(n) {
    return parseFloat(n.toPrecision(12));
  }

  const Row = ({ btns }) => (
    <View style={s.row}>
      {btns.map(({ label, type, wide }) => (
        <TouchableOpacity
          key={label}
          style={[s.btn, s[type] || s.num, wide && s.wide]}
          onPress={() => press(label)}
          activeOpacity={0.7}
        >
          <Text style={[s.btnTxt, type === 'op' && s.opTxt]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={s.container}>
      {/* Display */}
      <View style={s.display}>
        <Text style={s.expr} numberOfLines={1}>{expression}</Text>
        <Text style={s.value} adjustsFontSizeToFit numberOfLines={1}>{display}</Text>
      </View>

      {/* Keypad */}
      <View style={s.keypad}>
        <Row btns={[
          { label: 'C', type: 'clear' }, { label: '±', type: 'fn' },
          { label: '%', type: 'fn' }, { label: '÷', type: 'op' }
        ]} />
        <Row btns={[
          { label: '7', type: 'num' }, { label: '8', type: 'num' },
          { label: '9', type: 'num' }, { label: '×', type: 'op' }
        ]} />
        <Row btns={[
          { label: '4', type: 'num' }, { label: '5', type: 'num' },
          { label: '6', type: 'num' }, { label: '−', type: 'op' }
        ]} />
        <Row btns={[
          { label: '1', type: 'num' }, { label: '2', type: 'num' },
          { label: '3', type: 'num' }, { label: '+', type: 'op' }
        ]} />
        <Row btns={[
          { label: '⌫', type: 'fn' }, { label: '0', type: 'num' },
          { label: '.', type: 'num' }, { label: '=', type: 'eq' }
        ]} />
      </View>

      {/* History */}
      {history.length > 0 && (
        <ScrollView style={s.history} showsVerticalScrollIndicator={false}>
          <Text style={s.historyTitle}>History</Text>
          {history.map((item, i) => (
            <Text key={i} style={s.historyItem}>{item}</Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  display: {
    flex: 1, backgroundColor: COLORS.displayBg,
    justifyContent: 'flex-end', padding: 20, paddingBottom: 10,
  },
  expr: { color: COLORS.textSecondary, fontSize: 18, textAlign: 'right', marginBottom: 4 },
  value: { color: COLORS.textPrimary, fontSize: 56, fontWeight: '200', textAlign: 'right' },
  keypad: { padding: 8, paddingBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  btn: {
    width: '23%', aspectRatio: 1, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: COLORS.shadow, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  wide: { width: '48%', aspectRatio: undefined, height: 72 },
  num: { backgroundColor: COLORS.numBtn },
  op: { backgroundColor: COLORS.opBtn },
  eq: { backgroundColor: COLORS.eqBtn },
  clear: { backgroundColor: COLORS.clearBtn },
  fn: { backgroundColor: '#2a2a4a' },
  btnTxt: { color: COLORS.btnText, fontSize: 22, fontWeight: '600' },
  opTxt: { color: '#fff', fontWeight: '700' },
  history: { maxHeight: 140, backgroundColor: COLORS.displayBg, padding: 10 },
  historyTitle: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  historyItem: { color: COLORS.textPrimary, fontSize: 13, marginBottom: 2 },
});
