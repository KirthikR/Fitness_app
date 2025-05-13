import React, { useEffect } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import { theme } from '@/constants/theme';

// Web compatibility helper - fixed version for transform properties
const withWebCompatibility = (style) => {
  if (Platform.OS !== 'web') return style;
  
  // Create a new style object with web-compatible properties
  const webStyle = {...style};
  
  // Fix transform property names for web
  if (webStyle.transform) {
    webStyle.transform = webStyle.transform.map(transform => {
      const key = Object.keys(transform)[0];
      
      // Convert rotateZ to rotate for web
      if (key === 'rotateZ') {
        const value = transform[key];
        return { rotate: value };
      }
      
      return transform;
    });
  }
  
  return webStyle;
};

// Custom animated background component - Fixed version
const QuantumBackground = () => {
  const animValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  
  useEffect(() => {
    // Create pulsing animations for the orbs
    animValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // Create rotation animation for the neural grid
    rotateValue.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  
  const orb1Style = useAnimatedStyle(() => {
    const style = {
      transform: [
        { scale: 0.8 + animValue.value * 0.4 },
        { translateX: -50 + animValue.value * 30 },
        { translateY: -50 + (1 - animValue.value) * 30 }
      ],
      opacity: 0.2 + animValue.value * 0.2,
    };
    
    return withWebCompatibility(style);
  });
  
  const orb2Style = useAnimatedStyle(() => {
    const style = {
      transform: [
        { scale: 1.0 + (1 - animValue.value) * 0.3 },
        { translateX: 20 - animValue.value * 40 },
        { translateY: 20 + animValue.value * 30 }
      ],
      opacity: 0.1 + (1 - animValue.value) * 0.15,
    };
    
    return withWebCompatibility(style);
  });
  
  const gridStyle = useAnimatedStyle(() => {
    const style = {
      transform: [{ rotateZ: `${rotateValue.value}deg` }],
      opacity: 0.03 + animValue.value * 0.02,
    };
    
    return withWebCompatibility(style);
  });

  return (
    <View style={styles.backgroundContainer}>
      {/* Neural grid pattern */}
      <Animated.View 
        style={[styles.neuralGrid, gridStyle]} 
        // Disable layout animations to fix conflict
        layout={null}
      />
      
      {/* Animated orbs with gradients */}
      <Animated.View 
        style={[styles.orb, orb1Style]} 
        // Disable layout animations to fix conflict
        layout={null}
      >
        <LinearGradient
          colors={[theme.colors.primary, 'rgba(79, 209, 197, 0)']}
          style={styles.orbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View 
        style={[styles.orb, orb2Style]}
        // Disable layout animations to fix conflict
        layout={null}
      >
        <LinearGradient
          colors={[theme.colors.accent, 'rgba(161, 99, 247, 0)']}
          style={styles.orbGradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};

// Custom transition animations for stack screens - Fixed web compatibility
const customTransition = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.92, 1],
            }),
          },
          {
            rotate: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['2deg', '0deg'],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.6],
        }),
      },
    };
  },
};

// Custom modal presentation style with glass effect - Fixed for web
const modalPresentation = {
  presentation: 'transparentModal',
  gestureEnabled: true,
  gestureResponseDistance: 150,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.95, 1],
        }),
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      },
      overlayStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    };
  },
};

export default function ProfileLayout() {
  // Load Google fonts instead of local files
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {/* Animated background for the entire profile section */}
      <QuantumBackground />
      
      {/* Apply glass backdrop to the header */}
      <View style={[styles.headerGlassContainer, { pointerEvents: 'none' }]}>
        {Platform.OS !== 'web' ? (
          <BlurView intensity={20} tint="dark" style={styles.headerBlur} />
        ) : (
          <View style={[styles.headerBlur, { 
            backgroundColor: 'rgba(20, 20, 20, 0.75)',
            backdropFilter: 'blur(10px)' 
          }]} />
        )}
      </View>
      
      {/* Dark mode status bar */}
      <StatusBar style="light" />
      
      {/* Enhanced stack navigation */}
      <Stack 
        screenOptions={{
          headerShown: false,
          headerTransparent: true,
          headerBlurEffect: 'dark',
          headerStyle: {
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
            color: 'white',
          },
          headerBackTitle: '',
          headerTintColor: theme.colors.primary,
          ...customTransition,
          contentStyle: {
            backgroundColor: 'transparent',
          }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Profile',
            headerLargeTitle: true,
            headerLargeTitleStyle: {
              fontFamily: 'Poppins-Bold',
              fontSize: 34,
              color: 'white',
              borderBottomWidth: 0,
            },
            animation: 'fade',
          }}
        />
        
        <Stack.Screen 
          name="account-settings" 
          options={{
            ...modalPresentation,
            title: 'Account Settings',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="notifications" 
          options={{
            ...modalPresentation,
            title: 'Notifications',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="payment-methods" 
          options={{
            ...modalPresentation,
            title: 'Payment Methods',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="privacy" 
          options={{
            ...modalPresentation,
            title: 'Privacy',
            headerShown: true,
            headerTransparent: true,
          }} 
        />
        
        <Stack.Screen 
          name="help" 
          options={{
            ...modalPresentation,
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
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  headerGlassContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    zIndex: 100,
  },
  headerBlur: {
    width: '100%',
    height: '100%',
  },
  neuralGrid: {
    position: 'absolute',
    width: 800,
    height: 800,
    top: -200,
    left: -200,
    borderWidth: 0.5,
    borderColor: 'rgba(79, 209, 197, 0.1)',
    borderRadius: 400,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { transformOrigin: 'center' } : {}),
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
  },
  orbGradient: {
    width: '100%',
    height: '100%',
  },
});