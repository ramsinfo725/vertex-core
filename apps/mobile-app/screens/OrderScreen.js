import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, Alert, ActivityIndicator } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('https://sfa-platform-fresh.onrender.com/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setProducts(data);
                } else {
                    // Fallback if DB is empty
                    setProducts([
                        { id: 99, name: 'No Products in DB', sku: 'EMPTY', priceCase: 0, priceUnit: 0 }
                    ]);
                }
            } else {
                setProducts([{ id: 1, name: 'Demo Item (API Error)', sku: 'DEMO', priceCase: 10, priceUnit: 1 }]);
            }
        } catch (e) {
            console.error(e);
            setProducts([{ id: 1, name: 'Demo Item (Network Error)', sku: 'DEMO', priceCase: 10, priceUnit: 1 }]);
        } finally {
            setLoading(false);
        }
    };

    const updateCart = (id, field, value) => {
        setCart(prev => {
            const item = prev[id] || { qty: 0, uom: 'case', price: 0 };
            const product = products.find(p => p.id === id);
            
            let newItem = { ...item, [field]: value };
            
            // Auto-update price if UOM changes
            if (field === 'uom') {
                newItem.price = value === 'case' ? product.priceCase : product.priceUnit;
            }
            // Initialize price if adding first time
            if (item.qty === 0 && field === 'qty' && value > 0 && newItem.price === 0) {
                newItem.price = newItem.uom === 'case' ? product.priceCase : product.priceUnit;
            }
            
            return { ...prev, [id]: newItem };
        });
    };

    const getTotal = () => {
        return Object.values(cart).reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2);
    };

    const handlePlaceOrder = async () => {
        const orderItems = Object.entries(cart).filter(([_, item]) => item.qty > 0).map(([id, item]) => ({
            productId: parseInt(id),
            quantity: item.qty,
            uom: item.uom,
            price: item.price
        }));

        if (orderItems.length === 0) return Alert.alert("Empty Cart", "Add some items first.");

        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch('https://sfa-platform-fresh.onrender.com/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    total: parseFloat(getTotal()),
                    items: orderItems 
                })
            });

            if (res.ok) {
                Alert.alert("Success", "Order Placed!");
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to submit order");
            }
        } catch (e) {
            Alert.alert("Network Error", e.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Taking Order" />
            </Appbar.Header>

            <ScrollView style={styles.scroll}>
                {products.map(p => {
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
                <Button mode="contained" buttonColor="#000" loading={submitting} contentStyle={{height: 50}} onPress={handlePlaceOrder}>
                    Place Order
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f7' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
