import React, { useState } from 'react';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Appbar, Button, Title, Paragraph, Card, IconButton } from 'react-native-paper';

const SHOPS = [
  { id: 1, name: 'Super Mart', address: '12 Main St', latitude: -15.416667, longitude: 28.283333 },
  { id: 2, name: 'Quick Stop', address: '45 South Ave', latitude: -15.420000, longitude: 28.290000 },
  { id: 3, name: 'Family Grocer', address: '88 West Blvd', latitude: -15.410000, longitude: 28.275000 },
];

export default function MapScreen({ navigation }) {
  const [selectedShop, setSelectedShop] = useState(null);

  const initialRegion = {
    latitude: -15.416667,
    longitude: 28.283333,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleNavigate = () => {
    if (!selectedShop) return;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${selectedShop.latitude},${selectedShop.longitude}`;
    const label = selectedShop.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
        <Appbar.Header style={styles.header}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Route Map" />
        </Appbar.Header>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        onPress={() => setSelectedShop(null)}
      >
        {SHOPS.map(shop => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
            title={shop.name}
            description={shop.address}
            onPress={(e) => {
                e.stopPropagation();
                setSelectedShop(shop);
            }}
          />
        ))}
      </MapView>

      {selectedShop && (
        <View style={styles.bottomSheet}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <Title>{selectedShop.name}</Title>
                <IconButton icon="close" size={20} onPress={() => setSelectedShop(null)} />
              </View>
              <Paragraph>{selectedShop.address}</Paragraph>
            </Card.Content>
            <Card.Actions>
               <Button mode="contained" buttonColor="#000" onPress={handleNavigate} style={{flex:1}}>
                  Navigate
               </Button>
            </Card.Actions>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#fff', elevation: 4 },
  map: { flex: 1 },
  bottomSheet: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  card: { borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
