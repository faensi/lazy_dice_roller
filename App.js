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
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

const App = () => {
  const [dice, setDice] = useState('1');
  const [modifier, setModifier] = useState('0');
  const [customSides, setCustomSides] = useState('3');
  const [history, setHistory] = useState([]);
  const [lastRoll, setLastRoll] = useState({ sides: null, count: null, type: null });
  const [showInfo, setShowInfo] = useState(false);

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
    if (numDice > 1) {
      rollStr += ` (${total - mod})`;
    }
    setHistory((prev) => [rollStr, ...prev]);
    setLastRoll({ sides, count: numDice, type: 'custom' });
  };

  const clearHistory = () => {
    setHistory([]);
  };

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
        <View style={styles.headerRow}>
          <Text style={styles.title}>Lazy Dice Roller</Text>
          <TouchableOpacity onPress={() => setShowInfo(true)} style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>i</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}># Dice</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={dice}
              onChangeText={setDice}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modifier</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={modifier}
              onChangeText={setModifier}
              onSubmitEditing={handleModifierSubmit}
            />
          </View>
        </View>

        <View style={styles.diceRow}>
          {['4', '6', '8', '10', '12', '20', '100'].map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.diceButton}
              onPress={() => handleRollDice(parseInt(s))}
            >
              <Text style={styles.diceButtonText}>D{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={customSides}
              onChangeText={setCustomSides}
            />
          </View>
          <View style={[styles.inputGroup, styles.customButtonContainer]}>
            <TouchableOpacity style={styles.customButton} onPress={handleRollCustomDice}>
              <Text style={styles.customButtonText}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>

        <ScrollView style={styles.historyContainer}>
          {history.map((entry, index) => (
            <Text key={index} style={styles.historyText}>
              {entry}
            </Text>
          ))}
        </ScrollView>

        {showInfo && (
          <TouchableWithoutFeedback onPress={() => setShowInfo(false)}>
            <View style={styles.overlay}>
              <View style={styles.popup}>
                <Text style={styles.popupText}>
                  This app is written using React Native. The code is available on
                  github.com/faensi/lazy_dice_roller
                </Text>
                <Text style={styles.popupText}>
                  Inspired by the creativity of Michael Shea / Slyflourish / The Lazy DM.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
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
    paddingTop: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    marginVertical: 8,
    fontWeight: 'bold'
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoIcon: {
    fontSize: 16,
    color: '#555'
  },
  inputRow: {
    flexDirection: 'row',
    marginVertical: 6,
    justifyContent: 'space-between'
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 18,
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
    minHeight: 48
  },
  diceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 6
  },
  diceButton: {
    backgroundColor: '#F57C00',
    minHeight: 48,
    minWidth: 48,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  diceButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600'
  },
  customButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  customButton: {
    backgroundColor: '#FFA71A',
    paddingHorizontal: 20,
    minHeight: 48,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18
  },
  clearButton: {
    backgroundColor: '#ed9609',
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'stretch',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  historyContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 20
  },
  historyText: {
    fontSize: 16,
    marginBottom: 4
  },
  overlay: {
    position: 'absolute',
    top: 0,  // so it covers the entire screen including header
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(163, 163, 163, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    maxWidth: '90%'
  },
  popupText: {
    fontSize: 14,
    marginBottom: 6
  }
});
