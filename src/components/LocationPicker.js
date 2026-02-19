import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../utils/constants';

const LocationPicker = ({ location, onLocationChange }) => {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location access is needed to detect your current position. Please enable it in your device settings.'
        );
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;

      let address = '';
      try {
        const [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (reverseGeocode) {
          const parts = [
            reverseGeocode.street,
            reverseGeocode.city,
            reverseGeocode.region,
            reverseGeocode.postalCode,
          ].filter(Boolean);
          address = parts.join(', ');
        }
      } catch {
        address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }

      onLocationChange({ latitude, longitude, address });
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to fetch your current location. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={getCurrentLocation}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Ionicons name="locate-outline" size={20} color={COLORS.white} />
        )}
        <Text style={styles.buttonText}>
          {loading ? 'Fetching Location...' : 'Get Current Location'}
        </Text>
      </TouchableOpacity>

      {location && location.address ? (
        <View style={styles.locationInfo}>
          <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
          <Text style={styles.addressText} numberOfLines={2}>
            {location.address}
          </Text>
        </View>
      ) : null}

      {location && location.latitude && location.longitude ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            >
              <Ionicons name="location-sharp" size={32} color={COLORS.primary} />
            </Marker>
          </MapView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 4,
    gap: 6,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginLeft: 4,
  },
  mapContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    width: '100%',
    height: 160,
  },
});

export default LocationPicker;
