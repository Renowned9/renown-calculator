import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Vibration,
} from 'react-native';
import { trig, hyperbolic, factorial, fmtNum } from '../utils/mathEngine';

const C = {
  bg: '#0d0d1a',
  display: '#13132a',
  num: '#1e1e3f',
  op: '#6a0dad',
  eq: '#9b59b6',
  sci: '#1a3a5c',
  trig: '#1a5c3a',
  hyp: '#5c3a1a',
  clear: '#3a0d0d',
  text: '#e8e8ff',
  sub: '#8888aa',
  white: '#fff',
};

export default function ScientificCalculator() {
  const [display, setDisplay]     = useState('0');
  const [expr, setExpr]           = useState('');
  const [prev, setPrev]           = useState(null);
  const [op, setOp]               = useState(null);
  const [waiting, setWaiting]     = useState(false);
  const [isDeg, setIsDeg]         = useState(true);
  const [isHyp, setIsHyp]         = useState(false);
  const [isInv, setIsInv]         = useState(false);

  const cur = () => parseFloat(display) || 0;

  const vib = () => Vibration.vibrate(20);

  function applyUnary(fn) {
    vib();
    try {
      let result;
      const v = cur();
      switch (fn) {
        case 'sin': result = isHyp ? hyperbolic(isInv ? 'asinh' : 'sinh', v) : trig(isInv ? 'asin' : 'sin', v, isDeg); break;
        case 'cos': result = isHyp ? hyperbolic(isInv ? 'acosh' : 'cosh', v) : trig(isInv ? 'acos' : 'cos', v, isDeg); break;
        case 'tan': result = isHyp ? hyperbolic(isInv ? 'atanh' : 'tanh', v) : trig(isInv ? 'atan' : 'tan', v, isDeg); break;
        case 'sqrt':   result = Math.sqrt(v); break;
        case 'cbrt':   result = Math.cbrt(v); break;
        case 'sq':     result = v * v; break;
        case 'cube':   result = v * v * v; break;
        case 'inv':    result = 1 / v; break;
        case 'ln':     result = Math.log(v); break;
        case 'log':    result = Math.log10(v); break;
        case 'log2':   result = Math.log2(v); break;
        case 'exp':    result = Math.exp(v); break;
        case '10x':    result = Math.pow(10, v); break;
        case '2x':     result = Math.pow(2, v); break;
        case 'fact':   result = factorial(Math.round(v)); break;
        case 'abs':    result = Math.abs(v); break;
        case 'floor':  result = Math.floor(v); break;
        case 'ceil':   result = Math.ceil(v); break;
        case 'round':  result = Math.round(v); break;
        case 'pi':     result = Math.PI; break;
        case 'e':      result = Math.E; break;
        default: result = v;
      }
      setDisplay(fmtNum(result));
      setExpr(`${fn}(${v}) = ${fmtNum(result)}`);
      setWaiting(true);
    } catch (e) {
      setDisplay('Error');
    }
  }

  function pressNum(val) {
    vib();
    if (val === '.') {
      if (waiting) { setDisplay('0.'); setWaiting(false); return; }
      if (!display.includes('.')) setDisplay(display + '.');
      return;
    }
    if (waiting) { setDisplay(String(val)); setWaiting(false); }
    else setDisplay(display === '0' ? String(val) : display + val);
  }

  function pressOp(symbol) {
    vib();
    const opMap = { '+': '+', '−': '-', '×': '*', '÷': '/', 'xʸ': '**', 'ʸ√x': 'yrt' };
    const mapped = opMap[symbol];
    const v = cur();
    if (prev !== null && !waiting) {
      const r = calc(prev, v, op);
      setDisplay(fmtNum(r));
      setPrev(r);
      setExpr(`${r} ${symbol}`);
    } else {
      setPrev(v);
      setExpr(`${v} ${symbol}`);
    }
    setOp(mapped);
    setWaiting(true);
  }

  function pressEq() {
    vib();
    if (!op || prev === null) return;
    const v = cur();
    const r = calc(prev, v, op);
    setDisplay(fmtNum(r));
    setExpr('');
    setPrev(null);
    setOp(null);
    setWaiting(false);
  }

  function calc(a, b, o) {
    switch (o) {
      case '+':   return a + b;
      case '-':   return a - b;
      case '*':   return a * b;
      case '/':   return b === 0 ? NaN : a / b;
      case '**':  return Math.pow(a, b);
      case 'yrt': return Math.pow(a, 1 / b);
      default:    return b;
    }
  }

  function pressC() {
    vib();
    setDisplay('0'); setExpr(''); setPrev(null); setOp(null); setWaiting(false);
  }

  const Btn = ({ label, onPress, color, small }) => (
    <TouchableOpacity style={[s.btn, { backgroundColor: color || C.num }, small && s.small]}
      onPress={onPress} activeOpacity={0.7}>
      <Text style={[s.btnTxt, small && s.smallTxt]}>{label}</Text>
    </TouchableOpacity>
  );

  const trigLabel = (base, inv) => isInv ? inv : base;
  const sinLabel  = isHyp ? (isInv ? 'asinh' : 'sinh') : (isInv ? 'sin⁻¹' : 'sin');
  const cosLabel  = isHyp ? (isInv ? 'acosh' : 'cosh') : (isInv ? 'cos⁻¹' : 'cos');
  const tanLabel  = isHyp ? (isInv ? 'atanh' : 'tanh') : (isInv ? 'tan⁻¹' : 'tan');

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Display */}
      <View style={s.display}>
        <Text style={s.expr} numberOfLines={1}>{expr}</Text>
        <Text style={s.val} adjustsFontSizeToFit numberOfLines={1}>{display}</Text>

        <View style={s.toggleRow}>
          <Text style={s.toggleLbl}>{isDeg ? 'DEG' : 'RAD'}</Text>
          <Switch value={isDeg} onValueChange={setIsDeg} trackColor={{ true: C.op }} />
          <Text style={[s.toggleLbl, { marginLeft: 16 }]}>HYP</Text>
          <Switch value={isHyp} onValueChange={setIsHyp} trackColor={{ true: C.trig }} />
          <Text style={[s.toggleLbl, { marginLeft: 16 }]}>INV</Text>
          <Switch value={isInv} onValueChange={setIsInv} trackColor={{ true: C.hyp }} />
        </View>
      </View>

      {/* Scientific row 1 */}
      <View style={s.row}>
        <Btn label={sinLabel} onPress={() => applyUnary('sin')} color={C.trig} small />
        <Btn label={cosLabel} onPress={() => applyUnary('cos')} color={C.trig} small />
        <Btn label={tanLabel} onPress={() => applyUnary('tan')} color={C.trig} small />
        <Btn label={isInv ? 'x²→' : 'x²'} onPress={() => applyUnary('sq')} color={C.sci} small />
        <Btn label={isInv ? 'x³→' : 'x³'} onPress={() => applyUnary('cube')} color={C.sci} small />
      </View>

      <View style={s.row}>
        <Btn label={isInv ? 'eˣ' : 'ln'} onPress={() => applyUnary(isInv ? 'exp' : 'ln')} color={C.sci} small />
        <Btn label={isInv ? '10ˣ' : 'log'} onPress={() => applyUnary(isInv ? '10x' : 'log')} color={C.sci} small />
        <Btn label={isInv ? '2ˣ' : 'log₂'} onPress={() => applyUnary(isInv ? '2x' : 'log2')} color={C.sci} small />
        <Btn label='√x' onPress={() => applyUnary('sqrt')} color={C.sci} small />
        <Btn label='∛x' onPress={() => applyUnary('cbrt')} color={C.sci} small />
      </View>

      <View style={s.row}>
        <Btn label='n!' onPress={() => applyUnary('fact')} color={C.hyp} small />
        <Btn label='|x|' onPress={() => applyUnary('abs')} color={C.hyp} small />
        <Btn label='1/x' onPress={() => applyUnary('inv')} color={C.hyp} small />
        <Btn label='xʸ' onPress={() => pressOp('xʸ')} color={C.op} small />
        <Btn label='ʸ√x' onPress={() => pressOp('ʸ√x')} color={C.op} small />
      </View>

      <View style={s.row}>
        <Btn label='π' onPress={() => applyUnary('pi')} color={C.sci} small />
        <Btn label='e' onPress={() => applyUnary('e')} color={C.sci} small />
        <Btn label='⌊x⌋' onPress={() => applyUnary('floor')} color={C.hyp} small />
        <Btn label='⌈x⌉' onPress={() => applyUnary('ceil')} color={C.hyp} small />
        <Btn label='[x]' onPress={() => applyUnary('round')} color={C.hyp} small />
      </View>

      {/* Numeric + basic ops */}
      <View style={s.row}>
        <Btn label='C' onPress={pressC} color={C.clear} />
        <Btn label='⌫' onPress={() => { vib(); if (display.length > 1) setDisplay(display.slice(0,-1)); else setDisplay('0'); }} color={C.clear} />
        <Btn label='%' onPress={() => { vib(); setDisplay(fmtNum(cur() / 100)); }} color={C.num} />
        <Btn label='÷' onPress={() => pressOp('÷')} color={C.op} />
      </View>
      {[['7','8','9','×'],['4','5','6','−'],['1','2','3','+']].map(row => (
        <View style={s.row} key={row[0]}>
          {row.map(l => (
            <Btn key={l} label={l} onPress={() => ['×','−','+'].includes(l) ? pressOp(l) : pressNum(l)}
              color={['×','−','+'].includes(l) ? C.op : C.num} />
          ))}
        </View>
      ))}
      <View style={s.row}>
        <Btn label='±' onPress={() => { vib(); setDisplay(fmtNum(-cur())); }} color={C.num} />
        <Btn label='0' onPress={() => pressNum('0')} color={C.num} />
        <Btn label='.' onPress={() => pressNum('.')} color={C.num} />
        <Btn label='=' onPress={pressEq} color={C.eq} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content:   { paddingBottom: 20 },
  display: {
    backgroundColor: C.display, padding: 16, paddingTop: 8, minHeight: 120,
    justifyContent: 'flex-end',
  },
  expr: { color: C.sub, fontSize: 14, textAlign: 'right' },
  val:  { color: C.text, fontSize: 42, fontWeight: '200', textAlign: 'right' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'flex-end',
  },
  toggleLbl: { color: C.sub, fontSize: 12, marginRight: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 6 },
  btn: {
    flex: 1, marginHorizontal: 3, height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', elevation: 3,
  },
  small: { height: 46 },
  btnTxt: { color: C.white, fontSize: 20, fontWeight: '600' },
  smallTxt: { fontSize: 13, fontWeight: '500' },
});
