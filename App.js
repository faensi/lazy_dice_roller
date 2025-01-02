import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const App = () => {
  const [dice, setDice] = useState('1');
  const [modifier, setModifier] = useState('0');
  const [customSides, setCustomSides] = useState('3');
  const [history, setHistory] = useState([]);

  const [lastRoll, setLastRoll] = useState({
    sides: null,
    count: null,
    type: null,
  });

  /**
   * Rolls dice of given sides and updates the history.
   * @param {number} sides - number of sides on the dice
   */
  const handleRollDice = (sides) => {
    const numDice = parseInt(dice) || 1;
    const mod = parseInt(modifier) || 0;

    let rollsArray = [];
    let total = 0;

    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rollsArray.push(roll);
      total += roll;
    }
    total += mod;

    // Build display string
    let rollStr = `${numDice}d${sides}`;
    if (numDice > 1) {
      rollStr += ` (${rollsArray.join(', ')})`;
    }
    if (mod !== 0) {
      rollStr += ` + ${mod}`;
    }
    rollStr += ` = ${total}`;

    setHistory((prev) => [rollStr, ...prev]);

    setLastRoll({ sides, count: numDice, type: 'preset' });
  };

  /**
   * Rolls custom dice with user-defined sides.
   */
  const handleRollCustomDice = () => {
    const numDice = parseInt(dice) || 1;
    const mod = parseInt(modifier) || 0;
    const sides = parseInt(customSides) || 10;

    let total = 0;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    total += mod;

    let rollStr = `${numDice}d${sides}`;
    if (mod !== 0) {
      rollStr += ` + ${mod}`;
    }
    rollStr += ` = ${total}`;

    // If multiple dice, show sum (excluding modifier)
    if (numDice > 1) {
      rollStr += ` (${total - mod})`;
    }
    setHistory((prev) => [rollStr, ...prev]);
    setLastRoll({ sides, count: numDice, type: 'custom' });
  };

  /**
   * Clears the roll history.
   */
  const clearHistory = () => {
    setHistory([]);
  };

  /**
   * Re-roll the same dice as the last roll whenever
   * the modifier changes and the user presses "Done."
   */
  const handleModifierSubmit = () => {
    if (!lastRoll.sides || !lastRoll.count || !lastRoll.type) return;

    if (lastRoll.type === 'preset') {
      handleRollDice(lastRoll.sides);
    } else {
      setCustomSides(String(lastRoll.sides));
      handleRollCustomDice();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Lazy Dice Roller</Text>

        {/* Inputs for Dice and Modifier */}
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dice</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={dice}
              onChangeText={setDice}
              accessibilityLabel="Number of dice to roll"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mod</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={modifier}
              onChangeText={setModifier}
              onSubmitEditing={handleModifierSubmit}
              accessibilityLabel="Modifier to add to dice rolls"
            />
          </View>
        </View>

        {/* Preset Dice Buttons */}
        <View style={styles.diceRow}>
          {['4', '6', '8', '10', '12', '20', '100'].map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.diceButton}
              onPress={() => handleRollDice(parseInt(s))}
              accessibilityLabel={`Roll a D${s}`}
              accessibilityRole="button"
            >
              <Text style={styles.diceButtonText}>D{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Dice */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={customSides}
            onChangeText={setCustomSides}
            accessibilityLabel="Number of sides for custom dice"
          />
          <TouchableOpacity
            style={styles.customButton}
            onPress={handleRollCustomDice}
            accessibilityLabel="Roll custom dice"
            accessibilityRole="button"
          >
            <Text style={styles.customButtonText}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Clear History Button */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearHistory}
          accessibilityLabel="Clear roll history"
          accessibilityRole="button"
        >
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>

        {/* History */}
        <ScrollView style={styles.historyContainer}>
          {history.map((entry, index) => (
            <Text key={index} style={styles.historyText}>
              {entry}
            </Text>
          ))}
        </ScrollView>

        <Text style={styles.footer}>
          This app is written using React Native. The code is available on github.com/faensi/lazy_dice_roller
        </Text>
        <Text style={styles.footer}>
          Inspired by the creativity of Michael Shea / Slyflourish / The Lazy DM.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    marginVertical: 6,
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 18,
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
    minHeight: 48,
  },
  diceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 6,
  },
  diceButton: {
    backgroundColor: '#4a90e2',
    minHeight: 48,
    minWidth: 48,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  customButton: {
    backgroundColor: '#7b52ab',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 48,
    borderRadius: 6,
    marginLeft: 6,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'stretch',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  historyContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  historyText: {
    fontSize: 16,
    marginBottom: 4,
  },
  footer: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 13,
    color: '#555',
  },
});
