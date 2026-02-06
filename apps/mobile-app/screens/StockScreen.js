import React, { useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Text, useTheme } from 'react-native-paper';

// Mock Data for Products
const MOCK_PRODUCTS = [
  { id: '1', name: 'Coca-Cola 500ml', sku: 'CC500' },
  { id: '2', name: 'Coca-Cola 1.5L', sku: 'CC1500' },
  { id: '3', name: 'Fanta Orange 330ml', sku: 'FO330' },
  { id: '4', name: 'Sprite 500ml', sku: 'SP500' },
  { id: '5', name: 'Water 500ml', sku: 'WA500' },
];

const StockScreen = () => {
  const theme = useTheme();
  // State to store input values: { [productId]: { cases: '0', units: '0' } }
  const [stockData, setStockData] = useState({});

  const handleInputChange = (id, field, value) => {
    // Allow only numeric input
    if (!/^\d*$/.test(value)) return;

    setStockData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Format data for submission
    const formattedData = MOCK_PRODUCTS.map(product => ({
      productId: product.id,
      name: product.name,
      cases: parseInt(stockData[product.id]?.cases || '0', 10),
      units: parseInt(stockData[product.id]?.units || '0', 10),
    })).filter(item => item.cases > 0 || item.units > 0);

    console.log('Submitting Inventory:', formattedData);
    // In a real app, this would be an API call
    alert(`Inventory Submitted for ${formattedData.length} items!`);
  };

  const renderItem = ({ item }) => {
    const cases = stockData[item.id]?.cases || '';
    const units = stockData[item.id]?.units || '';

    return (
      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Title style={styles.productTitle}>{item.name}</Title>
          <Text style={styles.skuText}>SKU: {item.sku}</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              label="Cases"
              mode="outlined"
              keyboardType="numeric"
              value={cases}
              onChangeText={(text) => handleInputChange(item.id, 'cases', text)}
              style={styles.input}
              dense
            />
            <View style={styles.spacer} />
            <TextInput
              label="Units"
              mode="outlined"
              keyboardType="numeric"
              value={units}
              onChangeText={(text) => handleInputChange(item.id, 'units', text)}
              style={styles.input}
              dense
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        data={MOCK_PRODUCTS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={false} // Helps with input focus on some versions
      />
      
      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.button}
          icon="check"
        >
          Submit Inventory
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for footer
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skuText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  spacer: {
    width: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 4,
  },
  button: {
    paddingVertical: 6,
  },
});

export default StockScreen;
