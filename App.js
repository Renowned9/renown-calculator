import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import BasicCalculator         from './src/screens/BasicCalculator';
import ScientificCalculator    from './src/screens/ScientificCalculator';
import MatrixCalculator        from './src/screens/MatrixCalculator';
import CombinatoricsCalculator from './src/screens/CombinatoricsCalculator';
import StatisticsCalculator    from './src/screens/StatisticsCalculator';

const Tab = createBottomTabNavigator();

const ICON_MAP = {
  Basic:   ['calculator',  'calculator-outline'],
  Science: ['flask',       'flask-outline'],
  Matrix:  ['grid',        'grid-outline'],
  Combina: ['shuffle',     'shuffle-outline'],
  Stats:   ['bar-chart',   'bar-chart-outline'],
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const [active, inactive] = ICON_MAP[route.name] || ['help', 'help-outline'];
            return <Ionicons name={focused ? active : inactive} size={size - 2} color={color} />;
          },
          tabBarActiveTintColor:   '#e94560',
          tabBarInactiveTintColor: '#666688',
          tabBarStyle: {
            backgroundColor: '#0d0d1a',
            borderTopColor:  '#222244',
            borderTopWidth:  1,
            height: 60,
            paddingBottom: 6,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          headerStyle:      { backgroundColor: '#0d0d1a', borderBottomColor: '#222244', borderBottomWidth: 1 },
          headerTintColor:  '#e8e8ff',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        })}
      >
        <Tab.Screen name="Basic"   component={BasicCalculator}         options={{ headerTitle: 'Simple Calculator' }} />
        <Tab.Screen name="Science" component={ScientificCalculator}    options={{ headerTitle: 'Scientific Calculator' }} />
        <Tab.Screen name="Matrix"  component={MatrixCalculator}        options={{ headerTitle: 'Matrix Calculator' }} />
        <Tab.Screen name="Combina" component={CombinatoricsCalculator} options={{ headerTitle: 'Combinatorics' }} />
        <Tab.Screen name="Stats"   component={StatisticsCalculator}    options={{ headerTitle: 'Statistics' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
