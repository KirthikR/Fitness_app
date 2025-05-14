import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants/theme';

export default function ProfileLayout() {
  return (
    <>
      {/* Dark mode status bar */}
      <StatusBar style="light" />
      
      {/* Configure Stack with no header for index */}
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false, // Explicitly hide header for main profile screen
            animation: 'fade',
          }}
        />
        
        {/* Keep other screens with their modal presentations */}
        <Stack.Screen 
          name="account-settings" 
          options={{
            title: 'Account Settings',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="notifications" 
          options={{
            title: 'Notifications',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="payment-methods" 
          options={{
            title: 'Payment Methods',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="privacy" 
          options={{
            title: 'Privacy',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="help" 
          options={{
            title: 'Help & Support',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  // Removed headerGlassContainer and headerBlur styles
});