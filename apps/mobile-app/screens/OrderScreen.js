import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, ToggleButton, IconButton } from 'react-native-paper';

// Mock Product Data
const PRODUCTS = [
    { id: 1, name: 'Coca-Cola 500ml', sku: 'COKE-500', priceCase: 24.00, priceUnit: 2.00 },
    { id: 2, name: 'Dairy Milk', sku: 'CAD-100', priceCase: 18.00, priceUnit: 1.50 },
    { id: 3, name: 'Lays Chips', sku: 'LAY-S', priceCase: 12.00, priceUnit: 1.00 },
];

export default function OrderScreen({ navigation }) {
    const [cart, setCart] = useState({}); // { 1: { qty: 2, uom: 'case', price: 24.00 } }

    const updateCart = (id, field, value) => {
        setCart(prev => {
            const item = prev[id] || { qty: 0, uom: 'case', price: 0 };
            const product = PRODUCTS.find(p => p.id === id);
            
            let newItem = { ...item, [field]: value };
            
            // Auto-update price if UOM changes
            if (field === 'uom') {
                newItem.price = value === 'case' ? product.priceCase : product.priceUnit;
            }
            
            return { ...prev, [id]: newItem };
        });
    };

    const getTotal = () => {
        return Object.values(cart).reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2);
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Taking Order" subtitle="Super Mart" />
            </Appbar.Header>

            <ScrollView style={styles.scroll}>
                {PRODUCTS.map(p => {
                    const item = cart[p.id] || { qty: 0, uom: 'case', price: p.priceCase };
                    
                    return (
                        <Card key={p.id} style={styles.card}>
                            <Card.Content>
                                <View style={styles.row}>
                                    <View>
                                        <Title>{p.name}</Title>
                                        <Paragraph style={{color:'#888'}}>{p.sku}</Paragraph>
                                    </View>
                                    <View style={styles.priceBox}>
                                        <Text style={{color:'#888', marginRight:4}}>$</Text>
                                        <TextInput 
                                            value={String(item.price)}
                                            keyboardType="numeric"
                                            style={styles.priceInput}
                                            onChangeText={t => updateCart(p.id, 'price', parseFloat(t) || 0)}
                                        />
                                    </View>
                                </View>

                                <View style={[styles.row, {marginTop: 15}]}>
                                    {/* UOM Toggle */}
                                    <View style={styles.toggleGroup}>
                                        <Button 
                                            mode={item.uom === 'case' ? 'contained' : 'outlined'} 
                                            compact 
                                            onPress={() => updateCart(p.id, 'uom', 'case')}
                                            style={styles.uomBtn}
                                        >
                                            Case
                                        </Button>
                                        <Button 
                                            mode={item.uom === 'unit' ? 'contained' : 'outlined'} 
                                            compact 
                                            onPress={() => updateCart(p.id, 'uom', 'unit')}
                                            style={styles.uomBtn}
                                        >
                                            Unit
                                        </Button>
                                    </View>

                                    {/* Stepper */}
                                    <View style={styles.stepper}>
                                        <IconButton icon="minus" size={20} onPress={() => updateCart(p.id, 'qty', Math.max(0, item.qty - 1))} />
                                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.qty}</Text>
                                        <IconButton icon="plus" size={20} onPress={() => updateCart(p.id, 'qty', item.qty + 1)} />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    );
                })}
                <View style={{height: 100}} /> 
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={{color:'#888'}}>Total</Text>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>${getTotal()}</Text>
                </View>
                <Button mode="contained" buttonColor="#000" contentStyle={{height: 50}} onPress={() => alert('Order Placed!')}>
                    Place Order
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f7' },
    header: { backgroundColor: '#fff', elevation: 0 },
    scroll: { padding: 10 },
    card: { marginBottom: 10, borderRadius: 12, backgroundColor: '#fff' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    priceBox: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd' },
    priceInput: { fontSize: 18, fontWeight: 'bold', width: 60, textAlign: 'right' },
    toggleGroup: { flexDirection: 'row' },
    uomBtn: { marginHorizontal: 2 },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 20 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingBottom: 30 }
});
