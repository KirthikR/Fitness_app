import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeInDown,
  SlideInRight,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
  useDerivedValue
} from 'react-native-reanimated';
import { ChevronRight, Dumbbell, Brain, LineChart } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, useMemo } from 'react';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const PARTICLE_COUNT = 15;

// Fallback fonts for different platforms
const fontFamily = Platform.select({
  ios: {
    bold: 'Arial-BoldMT',
    medium: 'Arial-BoldMT',
    regular: 'ArialMT'
  },
  android: {
    bold: 'sans-serif-bold',
    medium: 'sans-serif-medium',
    regular: 'sans-serif'
  },
  default: {
    bold: 'System',
    medium: 'System',
    regular: 'System'
  }
});

// Create gradient-colored particles for background
const ParticleBackground = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.particlesContainer]}>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Animated.View 
          key={i}
          style={[
            styles.particle,
            {
              backgroundColor: i % 3 === 0 ? '#4FD1C5' : i % 3 === 1 ? '#63B3ED' : '#B794F4',
              width: 3 + Math.random() * 6,
              height: 3 + Math.random() * 6,
              opacity: 0.1 + Math.random() * 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: [{ scale: 1 }],
            }
          ]}
          entering={FadeIn.delay(i * 100).duration(1000)}
        />
      ))}
    </View>
  );
};

export default function WelcomeScreen() {
  // Animation shared values
  const scrollY = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const shimmerValue = useSharedValue(0);
  const backgroundAnimValue = useSharedValue(0);
  
  useEffect(() => {
    // Set status bar style
    StatusBar.setBarStyle('light-content');
    
    // Start background animation
    backgroundAnimValue.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.linear }), 
      -1, 
      false
    );
    
    // Start shimmer animation
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }), 
      -1, 
      false
    );
    
    // Logo subtle rotation animation
    logoRotate.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }), 
      -1, 
      true
    );
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -50],
      'clamp'
    );
    
    return {
      transform: [{ translateY }]
    };
  });
  
  const logoAnimStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      logoRotate.value,
      [0, 0.5, 1],
      [-1, 0, 1],
      'clamp'
    );
    
    return {
      transform: [{ rotateZ: `${rotateZ}deg` }]
    };
  });

  const handleButtonPress = () => {
    // Complex sequence of animations for button press
    buttonGlow.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(600, withTiming(0, { duration: 300 }))
    );
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 150, easing: Easing.inOut(Easing.quad) }),
      withTiming(1.05, { duration: 150, easing: Easing.inOut(Easing.quad) }),
      withTiming(1, { duration: 150, easing: Easing.inOut(Easing.quad) }, () => {
        runOnJS(navigateToLogin)();
      })
    );
  };
  
  const navigateToLogin = () => {
    router.navigate('/(onboarding)/login');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            shimmerValue.value,
            [0, 1],
            [-width * 1.5, width * 1.5],
            'clamp'
          )
        }
      ]
    };
  });

  return (
    <View style={styles.container}>
      {/* Particle background (replacing Skia) */}
      <ParticleBackground />
      
      <AnimatedLinearGradient
        style={[styles.backgroundGradient, backgroundStyle]}
        colors={['#0A1218', '#162844', '#0A1320']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Container with animation */}
        <Animated.View 
          entering={FadeIn.delay(300).duration(1000)} 
          style={[styles.logoContainer, logoAnimStyle]}
        >
          <MaskedView
            maskElement={<Text style={styles.logoText}>FITPRO</Text>}
          >
            <LinearGradient
              colors={['#4FD1C5', '#63B3ED', '#B794F4', '#4FD1C5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 60 }}
            />
          </MaskedView>
          
          {/* Shimmer effect */}
          <Animated.View 
            style={[StyleSheet.absoluteFillObject, styles.shimmerContainer, shimmerStyle]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.shimmer}
            />
          </Animated.View>
          
          <Animated.View 
            entering={SlideInRight.delay(600).duration(800)}
            style={styles.taglineContainer}
          >
            <BlurView intensity={80} tint="dark" style={styles.blurView}>
              <Text style={styles.tagline}>ELITE FITNESS AI</Text>
            </BlurView>
          </Animated.View>
        </Animated.View>

        <View style={styles.contentContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(600).duration(800).springify()} 
            style={styles.title}
          >
            Redefine Your Limits
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInDown.delay(900).duration(800)} 
            style={styles.subtitle}
          >
            Advanced AI analyzes your performance in real-time to create a fitness experience uniquely tailored to your body's potential
          </Animated.Text>

          {/* Premium CTA Button */}
          <Animated.View 
            entering={FadeInDown.delay(1200).duration(800)}
            style={styles.buttonWrapper}
          >
            <AnimatedTouchableOpacity
              style={[styles.button, buttonAnimatedStyle]}
              onPress={handleButtonPress}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4FD1C5', '#63B3ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <BlurView intensity={20} tint="light" style={styles.buttonBlur}>
                  <Text style={styles.buttonText}>Begin Journey</Text>
                  <ChevronRight size={20} color="white" />
                </BlurView>
              </LinearGradient>
            </AnimatedTouchableOpacity>
          </Animated.View>
          
          {/* Feature highlights */}
          <Animated.View 
            entering={FadeInDown.delay(1500).duration(800)}
            style={styles.featuresContainer}
          >
            <View style={styles.featureItem}>
              <BlurView intensity={40} tint="dark" style={styles.featureIconBg}>
                <Brain size={18} color="#4FD1C5" />
              </BlurView>
              <Text style={styles.featureText}>AI Coaching</Text>
            </View>
            
            <View style={styles.featureItem}>
              <BlurView intensity={40} tint="dark" style={styles.featureIconBg}>
                <Dumbbell size={18} color="#63B3ED" />
              </BlurView>
              <Text style={styles.featureText}>Custom Plans</Text>
            </View>
            
            <View style={styles.featureItem}>
              <BlurView intensity={40} tint="dark" style={styles.featureIconBg}>
                <LineChart size={18} color="#B794F4" />
              </BlurView>
              <Text style={styles.featureText}>Progress Tracking</Text>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D14',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  backgroundGradient: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
    top: -height * 0.25,
    left: -width * 0.25,
    opacity: 0.7,
  },
  particlesContainer: {
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  logoText: {
    fontFamily: fontFamily.bold,
    fontSize: 42,
    color: 'white',
    letterSpacing: 4,
  },
  shimmerContainer: {
    overflow: 'hidden',
  },
  shimmer: {
    width: width * 1,
    height: 60,
    position: 'absolute',
    transform: [{ rotate: '25deg' }, { scale: 2 }],
  },
  taglineContainer: {
    marginTop: 12,
  },
  blurView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tagline: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 2,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  buttonWrapper: {
    marginBottom: 50,
    width: width * 0.8,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
  },
  buttonGradient: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonBlur: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: 'white',
    marginRight: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  featureItem: {
    alignItems: 'center',
    width: width * 0.25,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});