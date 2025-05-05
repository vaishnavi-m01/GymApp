import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Octicons, MaterialIcons, Foundation, EvilIcons, Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const activeColor = "#282826";
  const inactiveColor = "gray";

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: "absolute",
          height: 60,
          backgroundColor: "#fff",
          display: isKeyboardVisible ? "none" : "flex",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <Octicons name="home" size={24} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="memberdashboard"
        options={{
          title: "Members",
          tabBarIcon: ({ focused }) => (
            // <MaterialIcons name="group" size={30} color={focused ? activeColor : inactiveColor} />
            <Feather name="users" size={24} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ focused }) => (
            <Foundation name="clipboard-notes" size={30} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="payment" size={28} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ focused }) => (
            <EvilIcons name="chart" size={28} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
    </Tabs>
  );
}
