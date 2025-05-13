import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  withRepeat, 
  withSequence,
  withDelay, 
  interpolate,
  interpolateColor,
  useDerivedValue,
  Easing,
  FadeIn
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Chrome as Home, Dumbbell, BarChart, User, Brain, Zap, Activity } from 'lucide-react-native';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 56;
const INDICATOR_SIZE = 4;

// Animated gradient component for the active tab
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Neural pattern generator for background - replaced MotiView with Animated.View
const NeuralPattern = () => {
  // Create animation values for each line
  const lineAnimations = Array.from({ length: 5 }).map(() => useSharedValue(0));
  
  useEffect(() => {
    // Animate each line with a delay
    lineAnimations.forEach((anim, index) => {
      anim.value = withRepeat(
        withSequence(
          withDelay(
            index * 200,
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
          ),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    });
    
    return () => {
      // Cleanup animations
      lineAnimations.forEach(anim => {
        anim.value = 0;
      });
    };
  }, []);

  return (
    <View style={styles.neuralPatternContainer}>
      {lineAnimations.map((anim, lineIndex) => {
        const lineStyle = useAnimatedStyle(() => ({
          opacity: interpolate(anim.value, [0, 1], [0.1, 0.2]),
          transform: [
            { translateX: interpolate(anim.value, [0, 1], [-5, 0]) }
          ],
        }));
        
        return (
          <Animated.View
            key={`line-${lineIndex}`}
            style={[
              styles.neuralLine,
              lineStyle,
              {
                top: 10 + lineIndex * 14,
                width: 20 + lineIndex * 5,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  // Global animation values
  const tabBarAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  
  // Start animations when component mounts
  useEffect(() => {
    tabBarAnimation.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    
    return () => {
      // Cleanup animations
      tabBarAnimation.value = 0;
      pulseAnimation.value = 0;
    };
  }, []);
  
  // Tab bar container animations
  const tabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(tabBarAnimation.value, [0, 1], [80, 0]) },
        { scale: interpolate(tabBarAnimation.value, [0, 1], [0.8, 1]) }
      ],
      opacity: tabBarAnimation.value,
    };
  });
  
  // Glow effect animation
  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseAnimation.value, [0, 1], [0.2, 0.5]),
      transform: [
        { scale: interpolate(pulseAnimation.value, [0, 1], [0.85, 1]) }
      ],
    };
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
        tabBarShowLabel: false,
      }}
      tabBar={(props) => (
        <Animated.View style={[styles.tabBarWrapper, tabBarStyle]}>
          <Animated.View style={[styles.tabBarGlow, glowStyle]} />
          <AnimatedBlurView intensity={15} tint="dark" style={styles.tabBarContainer}>
            <View style={styles.tabBarInner}>
              <QuantumTabBar {...props} />
            </View>
          </AnimatedBlurView>
        </Animated.View>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              primaryIcon={<Home size={24} color="white" strokeWidth={1.5} />}
              secondaryIcon={<Activity size={14} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />}
              label="Dashboard"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              primaryIcon={<Dumbbell size={24} color="white" strokeWidth={1.5} />}
              secondaryIcon={<Zap size={14} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />}
              label="Workouts"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              primaryIcon={<BarChart size={24} color="white" strokeWidth={1.5} />}
              secondaryIcon={<Brain size={14} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />} 
              label="Analytics"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              primaryIcon={<User size={24} color="white" strokeWidth={1.5} />}
              secondaryIcon={<Activity size={14} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />}
              label="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}

// Advanced tab icon with multiple animations and indicators
function TabIcon({ focused, primaryIcon, secondaryIcon, label }) {
  // Animation values
  const focusAnimation = useSharedValue(focused ? 1 : 0);
  const pulseAnimation = useSharedValue(0);
  const rotateAnimation = useSharedValue(0);

  // Update animation when focus changes
  useEffect(() => {
    focusAnimation.value = withSpring(focused ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 100,
      overshootClamping: false,
    });
    
    if (focused) {
      pulseAnimation.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      rotateAnimation.value = withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      pulseAnimation.value = 0;
      rotateAnimation.value = 0;
    }
  }, [focused]);

  // Secondary icon position
  const secondaryIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusAnimation.value, [0, 1], [0, 0.8]),
    transform: [
      { translateX: interpolate(focusAnimation.value, [0, 1], [0, 16]) },
      { translateY: interpolate(focusAnimation.value, [0, 1], [0, -12]) },
      { scale: interpolate(focusAnimation.value, [0, 1], [0, 1]) },
    ],
  }));

  // Glow ring animation
  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusAnimation.value, [0, 0.8, 1], [0, 0.2, 0.6]),
    transform: [
      { scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.15]) },
    ],
  }));

  // Rotating outer ring
  const outerRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusAnimation.value, [0, 1], [0, 0.4]),
    transform: [
      { rotate: `${interpolate(rotateAnimation.value, [0, 1], [0, 360])}deg` },
    ],
  }));

  // Icon container animation
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(focusAnimation.value, [0, 1], [1, 1.1]) },
    ],
  }));

  // Tab indicator animation
  const indicatorStyle = useAnimatedStyle(() => ({
    width: interpolate(focusAnimation.value, [0, 1], [0, 20]),
    opacity: interpolate(focusAnimation.value, [0, 1], [0, 1]),
  }));

  // Text animation
  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusAnimation.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(focusAnimation.value, [0, 1], [5, 0]) },
    ],
  }));

  // Label background animation
  const labelBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusAnimation.value, [0, 1], [0, 0.15]),
    width: interpolate(focusAnimation.value, [0, 1], [0, 100]),
  }));

  return (
    <View style={styles.tabIconRoot}>
      {/* Ambient background elements */}
      <Animated.View style={[styles.labelBackground, labelBgStyle]} />
      
      <View style={styles.iconContainer}>
        {/* Outer animated rings */}
        <Animated.View style={[styles.outerRing, outerRingStyle]}>
          <View style={styles.ringDash} />
          <View style={[styles.ringDash, { transform: [{ rotate: '120deg' }] }]} />
          <View style={[styles.ringDash, { transform: [{ rotate: '240deg' }] }]} />
        </Animated.View>
        
        {/* Inner pulse ring */}
        <Animated.View style={[styles.glowRing, ringStyle]}>
          <LinearGradient
            colors={focused ? 
              ['rgba(79, 209, 197, 0.3)', 'rgba(79, 209, 197, 0)'] :
              ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)']}
            style={styles.ringGradient}
          />
        </Animated.View>
        
        {/* Main icon container */}
        <Animated.View style={[styles.iconInner, containerStyle]}>
          {/* Main icon background */}
          <AnimatedLinearGradient
            colors={focused ? 
              ['#4FD1C5', '#63B3ED'] : 
              ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBackground}
          />
          
          {/* Secondary icon (AI indicator) */}
          <Animated.View style={[styles.secondaryIcon, secondaryIconStyle]}>
            {secondaryIcon}
          </Animated.View>
          
          {/* Primary icon */}
          <View style={styles.primaryIcon}>
            {primaryIcon}
          </View>
        </Animated.View>
      </View>
      
      {/* Tab indicator line */}
      <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
      
      {/* Tab label */}
      <Animated.Text style={[styles.tabLabel, textStyle]}>
        {label}
      </Animated.Text>
      
      {/* Neural pattern decorations */}
      {focused && <NeuralPattern />}
    </View>
  );
}

function QuantumTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.quantumTabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
          >
            {options.tabBarIcon && options.tabBarIcon({ 
              focused: isFocused,
              color: isFocused ? theme.colors.primary : 'rgba(255,255,255,0.5)',
            })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Tab bar container styles
  tabBarWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 35,
    backgroundColor: '#4FD1C5',
    opacity: 0.2,
  },
  tabBarContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tabBarInner: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },
  quantumTabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    height: '100%',
  },
  
  // Tab button and icon styles
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 70,
    position: 'relative',
  },
  labelBackground: {
    position: 'absolute',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#4FD1C5',
    opacity: 0.1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconInner: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  primaryIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryIcon: {
    position: 'absolute',
    zIndex: 3,
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(79, 209, 197, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  glowRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 20,
    zIndex: 1,
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  outerRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  ringDash: {
    position: 'absolute',
    width: '40%',
    height: 1.5,
    backgroundColor: 'rgba(79, 209, 197, 0.5)',
  },
  tabIndicator: {
    height: INDICATOR_SIZE,
    marginTop: 4,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: '#4FD1C5',
  },
  tabLabel: {
    color: 'white',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  neuralPatternContainer: {
    position: 'absolute',
    top: 2,
    right: 0,
    height: 70,
    width: 30,
    opacity: 0.6,
    overflow: 'hidden',
  },
  neuralLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#4FD1C5',
    right: 0,
  },
});