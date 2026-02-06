import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Badge } from 'react-native-paper';

// Mock Data for "My Beat"
const BEAT_DATA = [
    { id: 1, name: 'Super Mart', address: '12 Main St', status: 'Pending', distance: '0.5 km' },
    { id: 2, name: 'Quick Stop', address: '45 South Ave', status: 'Visited', distance: '1.2 km' },
    { id: 3, name: 'Family Grocer', address: '88 West Blvd', status: 'Pending', distance: '2.0 km' },
];

export default function BeatScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="My Beat (Monday)" subtitle="3 Shops Remaining" />
                <Appbar.Action icon="map-marker-radius" onPress={() => navigation.navigate('Map')} />
            </Appbar.Header>

            <ScrollView style={styles.scroll}>
                {BEAT_DATA.map(shop => (
                    <Card key={shop.id} style={styles.card}>
                        <Card.Content>
                            <View style={styles.row}>
                                <Title>{shop.name}</Title>
                                {shop.status === 'Visited' ? (
                                    <Badge style={{backgroundColor:'#4ade80'}}>Visited</Badge>
                                ) : (
                                    <Badge style={{backgroundColor:'#fbbf24'}}>Pending</Badge>
                                )}
                            </View>
                            <Paragraph style={{color:'#666'}}>{shop.address}</Paragraph>
                            <Paragraph style={{marginTop:5, fontWeight:'bold', color:'#3b82f6'}}>📍 {shop.distance} away</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained" buttonColor="#000" onPress={() => navigation.navigate('Order', { shopId: shop.id })}>Check In</Button>
                            <Button mode="text" textColor="#666">Nav</Button>
                        </Card.Actions>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f7' },
    header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
    scroll: { padding: 10 },
    card: { marginBottom: 10, borderRadius: 12, backgroundColor: '#fff', elevation: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
