import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../utils/constants';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AdminLoginScreen from '../screens/auth/AdminLoginScreen';

// User Screens
import HomeScreen from '../screens/user/HomeScreen';
import NewComplaintScreen from '../screens/user/NewComplaintScreen';
import MyComplaintsScreen from '../screens/user/MyComplaintsScreen';
import ComplaintDetailScreen from '../screens/user/ComplaintDetailScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ComplaintListScreen from '../screens/admin/ComplaintListScreen';
import ComplaintManageScreen from '../screens/admin/ComplaintManageScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
  </Stack.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'NewComplaint') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'MyComplaints') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.grey,
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Home', headerTitle: 'CleanTrack' }}
    />
    <Tab.Screen
      name="NewComplaint"
      component={NewComplaintScreen}
      options={{ title: 'Report', headerTitle: 'New Complaint' }}
    />
    <Tab.Screen
      name="MyComplaints"
      component={MyComplaintsScreen}
      options={{ title: 'My Issues', headerTitle: 'My Complaints' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile', headerTitle: 'My Profile' }}
    />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'AllComplaints') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'AdminProfile') {
          iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primaryDark,
      tabBarInactiveTintColor: COLORS.grey,
      headerStyle: {
        backgroundColor: COLORS.primaryDark,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboard}
      options={{ title: 'Dashboard', headerTitle: 'Admin Dashboard' }}
    />
    <Tab.Screen
      name="AllComplaints"
      component={ComplaintListScreen}
      options={{ title: 'Complaints', headerTitle: 'All Complaints' }}
    />
    <Tab.Screen
      name="AdminProfile"
      component={AdminProfileScreen}
      options={{ title: 'Profile', headerTitle: 'Admin Profile' }}
    />
  </Tab.Navigator>
);

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="UserTabs"
      component={UserTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ComplaintDetail"
      component={ComplaintDetailScreen}
      options={{
        title: 'Complaint Details',
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminTabs"
      component={AdminTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ComplaintManage"
      component={ComplaintManageScreen}
      options={{
        title: 'Manage Complaint',
        headerStyle: { backgroundColor: COLORS.primaryDark },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, userProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : isAdmin ? (
        <AdminStack />
      ) : (
        <UserStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
