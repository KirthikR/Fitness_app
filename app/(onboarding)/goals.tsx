import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  withRepeat,
  interpolate,
  Easing,
  runOnJS,
  ZoomIn
} from 'react-native-reanimated';
import { ChevronRight, Activity, TrendingUp, Dumbbell, BarChart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type Goal = 'lose_weight' | 'build_muscle' | 'improve_fitness' | 'maintain';

// Floating particles component with shared values
const FloatingParticles = () => {
  // Create an array of shared values for particles
  const particleAnimations = Array.from({ length: 20 }).map(() => useSharedValue(0));
  
  useEffect(() => {
    // Animate each particle with its own animation
    particleAnimations.forEach((anim, index) => {
      // Reset animation
      anim.value = 0;
      
      // Start animation with delay
      anim.value = withDelay(
        index * 200,
        withRepeat(
          withTiming(height + 100, { 
            duration: 10000 + (index * 1000), 
            easing: Easing.linear 
          }),
          -1,
          false
        )
      );
    });
  }, []);
  
  // Generate animation styles for each particle
  const particleStyles = particleAnimations.map((anim, index) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{ translateY: -1 * anim.value }]
      };
    });
  });
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Animated.View 
          key={`particle-${i}`}
          style={[
            styles.particle,
            {
              left: `${Math.random() * 100}%`,
              bottom: -20,
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              opacity: 0.1 + Math.random() * 0.4,
              backgroundColor: i % 3 === 0 ? '#4FD1C5' : i % 3 === 1 ? '#63B3ED' : '#B794F4',
            },
            particleStyles[i]
          ]}
        />
      ))}
    </View>
  );
};

export default function GoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const selectedScale = useSharedValue(1);
  const backgroundGlow = useSharedValue(0);
  
  const goals = [
    { 
      id: 'lose_weight', 
      title: 'Lose Weight', 
      description: 'Burn fat and reduce body weight',
      gradientStart: '#FF6B6B',
      gradientEnd: '#FF8E53',
      icon: (props) => <Activity {...props} />
    },
    { 
      id: 'build_muscle', 
      title: 'Build Muscle', 
      description: 'Increase strength and muscle mass',
      gradientStart: '#63B3ED',
      gradientEnd: '#4C51BF',
      icon: (props) => <Dumbbell {...props} />
    },
    { 
      id: 'improve_fitness', 
      title: 'Improve Fitness', 
      description: 'Boost stamina and overall fitness',
      gradientStart: '#4FD1C5',
      gradientEnd: '#319795',
      icon: (props) => <TrendingUp {...props} />
    },
    { 
      id: 'maintain', 
      title: 'Maintain', 
      description: 'Maintain current weight and fitness level',
      gradientStart: '#B794F4',
      gradientEnd: '#805AD5',
      icon: (props) => <BarChart {...props} />
    },
  ];
  
  useEffect(() => {
    // Start animations
    headerOpacity.value = withTiming(1, { duration: 1000 });
    
    // Pulsating background glow
    backgroundGlow.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Animate selection
    if (selectedGoal) {
      selectedScale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [selectedGoal]);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      buttonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 }, () => {
          runOnJS(navigateToNextScreen)();
        })
      );
    }
  };
  
  const navigateToNextScreen = () => {
    router.push('/(tabs)');
  };
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        { 
          translateY: interpolate(
            headerOpacity.value,
            [0, 1],
            [-20, 0]
          )
        }
      ]
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      opacity: selectedGoal ? 1 : 0.7,
    };
  });
  
  const backgroundGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        backgroundGlow.value,
        [0, 0.5, 1],
        [0.4, 0.7, 0.4]
      )
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Keep the background image */}
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg' }}
        style={styles.backgroundImage}
        blurRadius={3}
      />
      
      {/* Animated overlay with gradient */}
      <View style={styles.overlayContainer}>
        <Animated.View style={backgroundGlowStyle}>
          <LinearGradient
            colors={['rgba(10, 12, 26, 0.8)', 'rgba(23, 36, 72, 0.8)', 'rgba(10, 12, 26, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overlay}
          />
        </Animated.View>
      </View>
      
      {/* Floating particles for futuristic effect */}
      <FloatingParticles />
      
      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Animated.View style={headerAnimatedStyle}>
            <MaskedView
              maskElement={
                <Text style={styles.titleMask}>FITNESS TRAJECTORY</Text>
              }
            >
              <LinearGradient
                colors={['#4FD1C5', '#63B3ED', '#B794F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 38 }}
              />
            </MaskedView>
            
            <Text style={styles.subtitle}>Select your primary fitness goal</Text>
          </Animated.View>
        </View>
        
        {/* Goals list */}
        <View style={styles.goalsContainer}>
          {goals.map((goal, index) => {
            const itemDelay = 300 + (index * 150);
            return (
              <Animated.View 
                key={goal.id}
                entering={FadeInDown.delay(itemDelay).duration(800)}
              >
                <AnimatedTouchableOpacity
                  style={styles.goalItemContainer}
                  onPress={() => handleSelectGoal(goal.id as Goal)}
                  activeOpacity={0.9}
                >
                  <BlurView 
                    intensity={90} 
                    tint="dark" 
                    style={[
                      styles.goalItem,
                      selectedGoal === goal.id && styles.selectedGoal
                    ]}
                  >
                    {/* Icon container with gradient */}
                    <LinearGradient
                      colors={[goal.gradientStart, goal.gradientEnd]}
                      style={styles.goalIconContainer}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {goal.icon({ size: 24, color: 'white' })}
                    </LinearGradient>
                    
                    {/* Goal details */}
                    <View style={styles.goalDetails}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalDescription}>{goal.description}</Text>
                    </View>
                    
                    {/* Selection indicator */}
                    <View style={[
                      styles.selectionIndicator,
                      selectedGoal === goal.id ? styles.indicatorActive : {}
                    ]}>
                      {selectedGoal === goal.id && (
                        <Animated.View
                          entering={ZoomIn.duration(200)}
                          style={styles.checkmark}
                        >
                          <LinearGradient
                            colors={[goal.gradientStart, goal.gradientEnd]}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          />
                        </Animated.View>
                      )}
                    </View>
                  </BlurView>
                  
                  {/* Selection highlight effect */}
                  {selectedGoal === goal.id && (
                    <AnimatedLinearGradient 
                      colors={['transparent', goal.gradientStart + '30', goal.gradientEnd + '30', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.selectionGlow}
                    />
                  )}
                </AnimatedTouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        
        {/* Continue button */}
        <View style={styles.buttonContainerWrapper}>
          <Animated.View 
            entering={FadeInDown.delay(1000).duration(800)}
            style={styles.buttonContainer}
          >
            <View style={styles.buttonScaleWrapper}>
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity
                  style={styles.buttonWrapper}
                  onPress={handleContinue}
                  disabled={!selectedGoal}
                >
                  <LinearGradient
                    colors={
                      selectedGoal 
                        ? ['#4FD1C5', '#63B3ED'] 
                        : ['rgba(79, 209, 197, 0.5)', 'rgba(99, 179, 237, 0.5)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <BlurView intensity={30} tint="light" style={styles.buttonBlur}>
                      <Text style={styles.buttonText}>ANALYZE GOAL</Text>
                      <ChevronRight size={20} color="white" />
                    </BlurView>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
            
            {/* AI processing indication */}
            {selectedGoal && (
              <Animated.Text 
                entering={FadeInDown.delay(200).duration(500)}
                style={styles.aiProcessingText}
              >
                AI analyzing optimal fitness trajectory
              </Animated.Text>
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    borderRadius: 4,
    zIndex: 0,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  titleMask: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 10,
  },
  goalsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  goalItemContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  selectedGoal: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectionGlow: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 16,
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorActive: {
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  buttonContainerWrapper: {
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buttonScaleWrapper: {
    width: '100%',
  },
  buttonWrapper: {
    width: width - 48,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonBlur: {
    height: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
    letterSpacing: 1,
  },
  aiProcessingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
});