import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  withSequence, 
  withRepeat, 
  withDelay,
  interpolate,
  Easing,
  SlideInUp,
  useAnimatedScrollHandler,
  useDerivedValue,
  cancelAnimation
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { 
  Play, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Brain, 
  ChevronRight, 
  Zap, 
  Dumbbell, 
  User, 
  Activity, 
  BarChart, 
  Heart, 
  Award, 
  AlertCircle 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import ProgressRing from '@/components/ProgressRing';
import WorkoutCard from '@/components/WorkoutCard';
import AIAssistant from '@/components/AIAssistant';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Neural network visualization component
const NeuralPattern = ({ style, density = 5, color = 'rgba(79, 209, 197, 0.5)' }) => {
  // Generate nodes for visualization
  const nodes = Array.from({ length: density }).map((_, i) => ({
    x: width * (0.2 + Math.random() * 0.6),
    y: 20 + Math.random() * 40,
    pulseDelay: i * 200
  }));

  return (
    <View style={[styles.neuralPatternContainer, style]}>
      {nodes.map((node, i) => {
        // Create animated connections between nodes
        const connections = nodes
          .filter((_, j) => j !== i && Math.random() > 0.7)
          .map((targetNode, j) => (
            <View
              key={`connection-${i}-${j}`}
              style={[
                styles.neuralConnection,
                {
                  width: Math.hypot(node.x - targetNode.x, node.y - targetNode.y),
                  left: Math.min(node.x, targetNode.x),
                  top: Math.min(node.y, targetNode.y),
                  transform: [
                    { 
                      rotate: `${Math.atan2(
                        targetNode.y - node.y, 
                        targetNode.x - node.x
                      )}rad` 
                    }
                  ],
                  backgroundColor: color
                }
              ]}
            />
          ));

        return (
          <Fragment key={`node-fragment-${i}`}>
            {connections}
            <Animated.View
              key={`node-${i}`}
              style={[
                styles.neuralNode,
                {
                  left: node.x,
                  top: node.y,
                  backgroundColor: color
                }
              ]}
            />
          </Fragment>
        );
      })}
    </View>
  );
};

// Animated card component with glass effect
const QuantumCard = ({ children, style, glowColor, enteringDelay = 300 }) => {
  const glowOpacity = useSharedValue(0.3);
  
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    return () => cancelAnimation(glowOpacity);
  }, []);
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value
  }));
  
  return (
    <Animated.View
      entering={FadeInDown.delay(enteringDelay).duration(800).springify()}
      style={[styles.quantumCard, style]}
    >
      <Animated.View style={[styles.cardGlow, glowStyle, { backgroundColor: glowColor || theme.colors.primary }]} />
      <AnimatedBlurView intensity={20} tint="dark" style={styles.cardBlur}>
        <View style={styles.cardContent}>
          {children}
        </View>
      </AnimatedBlurView>
    </Animated.View>
  );
};

// Floating interactive 3D button
const QuantumButton = ({ icon, label, onPress, color = theme.colors.primary }) => {
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);
  
  const onPressIn = () => {
    pressed.value = withSpring(1, { damping: 15, stiffness: 150 });
  };
  
  const onPressOut = () => {
    pressed.value = withSpring(0, { damping: 15, stiffness: 150 });
  };
  
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, 0.95]) },
      { translateY: interpolate(pressed.value, [0, 1], [0, 2]) }
    ],
    shadowOpacity: interpolate(pressed.value, [0, 1], [0.3, 0.1])
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [0.7, 0.3]),
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, 0.9]) }
    ]
  }));
  
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.buttonContainer}
      activeOpacity={1}
    >
      <Animated.View style={[styles.buttonGlow, glowStyle, { backgroundColor: color }]} />
      <Animated.View style={[styles.quantumButton, buttonStyle]}>
        <LinearGradient
          colors={[color, `${color}80`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          {icon}
          {label && <Text style={styles.buttonLabel}>{label}</Text>}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  // Animated values
  const scrollY = useSharedValue(0);
  const progressValue = useSharedValue(0);
  const energyPulse = useSharedValue(0);
  const headerScale = useSharedValue(1);
  
  // State
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  // Setup animations
  useEffect(() => {
    // Start pulsing animation for energy field
    energyPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // Animate progress with spring physics
    progressValue.value = withSpring(0.75, { damping: 15, stiffness: 100, mass: 1 });
    
    // Hide welcome message after 6 seconds
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 6000);
    
    return () => {
      clearTimeout(timer);
      cancelAnimation(energyPulse);
      cancelAnimation(progressValue);
    };
  }, []);
  
  // Handle scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Derived animations
  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -20],
            { extrapolateRight: 'clamp' }
          )
        },
        { 
          scale: interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.9],
            { extrapolateRight: 'clamp' }
          )
        }
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 100],
        [1, 0.8],
        { extrapolateRight: 'clamp' }
      )
    };
  });
  
  const energyFieldStyle = useAnimatedStyle(() => ({
    opacity: interpolate(energyPulse.value, [0, 0.5, 1], [0.3, 0.5, 0.3]),
    transform: [{ scale: interpolate(energyPulse.value, [0, 1], [1, 1.15]) }]
  }));
  
  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(!showAIAssistant);
  }, [showAIAssistant]);
  
  // Array of AI wellness tips
  const wellnessTips = [
    "Your recovery levels are optimal. I recommend a high-intensity workout today to maximize gains.",
    "Based on your sleep data, consider extending your warm-up by 5 minutes to optimize performance.",
    "Your heart rate variability shows excellent recovery. Consider increasing resistance by 10% today.",
    "I've detected a pattern in your training: you perform 20% better in evening workouts.",
    "Your cortisol levels appear elevated. A meditation session before your workout could enhance results."
  ];
  
  // Randomly select a tip
  const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];

  return (
    <View style={styles.container}>
      {/* Background neural elements */}
      <View style={styles.backgroundElements}>
        <Animated.View style={[styles.energyField, energyFieldStyle]}>
          <LinearGradient
            colors={['rgba(79, 209, 197, 0.2)', 'rgba(99, 179, 237, 0.05)', 'rgba(79, 209, 197, 0)']}
            style={styles.energyGradient}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      </View>
      
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>Kirthik</Text>
            <Animated.View 
              style={styles.aiStatusIndicator}
              entering={FadeInDown.delay(300).springify()}
            >
              <Zap size={12} color="white" />
            </Animated.View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.profileImageContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileImageBorder}
          />
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.profileImage}
          />
          <View style={styles.profileActiveIndicator} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* AI Welcome Message */}
        {showWelcomeMessage && (
          <Animated.View 
            entering={SlideInUp.springify().damping(12)}
            style={styles.welcomeMessage}
          >
            <AnimatedBlurView intensity={30} tint="dark" style={styles.welcomeBlur}>
              <NeuralPattern density={3} style={styles.welcomeNeuralPattern} />
              
              <View style={styles.aiIconContainer}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.accent]}
                  style={styles.aiIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Brain size={20} color="white" />
                </LinearGradient>
              </View>
              
              <View style={styles.welcomeMessageContent}>
                <Text style={styles.welcomeMessageText}>
                  Welcome back! I've optimized today's workout based on your biometric data and recovery status.
                </Text>
              </View>
              
              <QuantumButton
                icon={<Zap size={16} color="white" />}
                onPress={toggleAIAssistant}
              />
            </AnimatedBlurView>
          </Animated.View>
        )}
        
        {/* Daily Progress Card */}
        <QuantumCard
          glowColor={theme.colors.primary}
          enteringDelay={400}
          style={styles.statsCardContainer}
        >
          <View style={styles.statsCardHeader}>
            <Text style={styles.statsCardTitle}>Daily Progress</Text>
            <Animated.View 
              style={styles.statsAiBadge}
              entering={FadeInDown.delay(600).springify()}
            >
              <Text style={styles.statsAiBadgeText}>AI Optimized</Text>
            </Animated.View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.progressContainer}>
              <ProgressRing 
                progress={progressValue}
                size={120}
                strokeWidth={12}
                radius={54}
                gradientColors={['#4FD1C5', '#63B3ED']}
                showGlow={true}
              />
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalPercentage}>75%</Text>
                <Text style={styles.goalLabel}>Complete</Text>
              </View>
            </View>
            
            <View style={styles.statsDetails}>
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['rgba(79, 209, 197, 0.2)', 'rgba(79, 209, 197, 0.1)']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <TrendingUp size={16} color={theme.colors.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.statValue}>1,840</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['rgba(99, 179, 237, 0.2)', 'rgba(99, 179, 237, 0.1)']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Activity size={16} color={theme.colors.accent} />
                </LinearGradient>
                <View>
                  <Text style={styles.statValue}>12,600</Text>
                  <Text style={styles.statLabel}>Steps</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Clock size={16} color={theme.colors.warning} />
                </LinearGradient>
                <View>
                  <Text style={styles.statValue}>48</Text>
                  <Text style={styles.statLabel}>Minutes</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.biometricsContainer}>
            <View style={styles.biometricItem}>
              <Heart size={14} color={theme.colors.success} />
              <Text style={styles.biometricValue}>68 <Text style={styles.biometricUnit}>bpm</Text></Text>
            </View>
            <View style={styles.biometricDivider} />
            <View style={styles.biometricItem}>
              <AlertCircle size={14} color={theme.colors.warning} />
              <Text style={styles.biometricValue}>12.2 <Text style={styles.biometricUnit}>stress</Text></Text>
            </View>
            <View style={styles.biometricDivider} />
            <View style={styles.biometricItem}>
              <Award size={14} color={theme.colors.primary} />
              <Text style={styles.biometricValue}>86 <Text style={styles.biometricUnit}>readiness</Text></Text>
            </View>
          </View>
        </QuantumCard>
        
        {/* AI Insight Card */}
        <QuantumCard
          glowColor={theme.colors.accent}
          enteringDelay={600}
          style={styles.aiInsightCardContainer}
        >
          <View style={styles.aiHeader}>
            <View style={styles.aiTitleContainer}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                style={styles.aiTitleIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Brain size={18} color="white" />
              </LinearGradient>
              <Text style={styles.aiTitle}>AI Optimization Insight</Text>
            </View>
            
            <TouchableOpacity onPress={toggleAIAssistant}>
              <Zap size={20} color={theme.colors.accent} />
            </TouchableOpacity>
          </View>
          
          <NeuralPattern density={8} style={styles.aiNeuralPattern} color="rgba(99, 179, 237, 0.15)" />
          
          <Text style={styles.aiTipText}>{randomTip}</Text>
          
          <TouchableOpacity style={styles.aiActionButton} onPress={toggleAIAssistant}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiActionButtonGradient}
            >
              <Text style={styles.aiActionButtonText}>Explore Details</Text>
              <ChevronRight size={16} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </QuantumCard>
        
        {/* Today's Workout Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.featuredWorkoutContainer}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.3)']}
            style={styles.featuredWorkoutGradient}
          >
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3766222/pexels-photo-3766222.jpeg' }}
              style={styles.featuredWorkoutImage}
            />
            
            <View style={styles.workoutOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                style={styles.workoutOverlayGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutTitle}>Full Body HIIT</Text>
                  <View style={styles.workoutMetaContainer}>
                    <View style={styles.workoutMetaItem}>
                      <Clock size={14} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.workoutMetaText}>30 min</Text>
                    </View>
                    <View style={styles.workoutMetaDot} />
                    <View style={styles.workoutMetaItem}>
                      <Zap size={14} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.workoutMetaText}>High Intensity</Text>
                    </View>
                    <View style={styles.workoutMetaDot} />
                    <View style={styles.workoutMetaItem}>
                      <TrendingUp size={14} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.workoutMetaText}>430 cal</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.playButtonContainer}>
                  <TouchableOpacity style={styles.playButton}>
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.accent]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.playButtonGradient}
                    >
                      <Play size={22} color="white" fill="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.aiRecommendedBadge}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiBadgeGradient}
              >
                <Brain size={14} color="white" />
                <Text style={styles.aiRecommendedText}>AI Selected for You</Text>
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.aiBadgeShine}
                />
              </LinearGradient>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Weekly Goal Progress */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Training Goals</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Details</Text>
          </TouchableOpacity>
        </View>
        
        <QuantumCard
          glowColor={theme.colors.success}
          enteringDelay={1000}
          style={styles.goalsCardContainer}
        >
          <View style={styles.goalItem}>
            <LinearGradient
              colors={[`${theme.colors.primary}30`, `${theme.colors.primary}10`]}
              style={styles.goalIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Dumbbell size={20} color={theme.colors.primary} />
            </LinearGradient>
            
            <View style={styles.goalContent}>
              <View style={styles.goalHeaderRow}>
                <Text style={styles.goalTitle}>Strength Training</Text>
                <Text style={styles.goalProgress}>3/4</Text>
              </View>
              
              <View style={styles.goalProgressBar}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.goalProgressFill, { width: '75%' }]}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <LinearGradient
              colors={[`${theme.colors.accent}30`, `${theme.colors.accent}10`]}
              style={styles.goalIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Activity size={20} color={theme.colors.accent} />
            </LinearGradient>
            
            <View style={styles.goalContent}>
              <View style={styles.goalHeaderRow}>
                <Text style={styles.goalTitle}>Cardio Sessions</Text>
                <Text style={[styles.goalProgress, { color: theme.colors.accent }]}>2/3</Text>
              </View>
              
              <View style={styles.goalProgressBar}>
                <LinearGradient
                  colors={[theme.colors.accent, `${theme.colors.accent}80`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.goalProgressFill, { width: '66%' }]}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <LinearGradient
              colors={[`${theme.colors.success}30`, `${theme.colors.success}10`]}
              style={styles.goalIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Calendar size={20} color={theme.colors.success} />
            </LinearGradient>
            
            <View style={styles.goalContent}>
              <View style={styles.goalHeaderRow}>
                <Text style={styles.goalTitle}>Active Days</Text>
                <Text style={[styles.goalProgress, { color: theme.colors.success }]}>5/7</Text>
              </View>
              
              <View style={styles.goalProgressBar}>
                <LinearGradient
                  colors={[theme.colors.success, `${theme.colors.success}80`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.goalProgressFill, { width: '71%' }]}
                />
              </View>
            </View>
          </View>
        </QuantumCard>
        
        {/* Recommended Workouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedContainer}
        >
          <RecommendedWorkoutCard
            title="Cardio Blast"
            duration="25 min"
            level="Medium"
            calories="320"
            imageUrl="https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg"
            enteringDelay={1200}
          />
          
          <RecommendedWorkoutCard
            title="Core Strength"
            duration="20 min"
            level="Beginner"
            calories="280"
            imageUrl="https://images.pexels.com/photos/4024914/pexels-photo-4024914.jpeg"
            enteringDelay={1400}
          />
          
          <RecommendedWorkoutCard
            title="Total Body"
            duration="35 min"
            level="Advanced"
            calories="450"
            imageUrl="https://images.pexels.com/photos/2468339/pexels-photo-2468339.jpeg"
            enteringDelay={1600}
          />
        </ScrollView>
      </Animated.ScrollView>
      
      {/* Floating AI Assistant Button */}
      <View style={styles.floatingButtonsContainer}>
        <QuantumButton
          icon={<Brain size={24} color="white" />}
          onPress={toggleAIAssistant}
          color={theme.colors.primary}
        />
      </View>
      
      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant onClose={toggleAIAssistant} />
      )}
    </View>
  );
}

// Recommended workout card with premium styling
function RecommendedWorkoutCard({ title, duration, level, calories, imageUrl, enteringDelay = 1000 }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(enteringDelay).duration(800).springify()}
      style={styles.recommendedCard}
    >
      <View style={styles.recommendedCardInner}>
        <Image source={{ uri: imageUrl }} style={styles.recommendedCardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
          style={styles.recommendedCardOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text style={styles.recommendedCardTitle}>{title}</Text>
          <View style={styles.recommendedCardMeta}>
            <View style={styles.recommendedCardMetaItem}>
              <Clock size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.recommendedCardMetaText}>{duration}</Text>
            </View>
            <View style={styles.recommendedCardMetaDot} />
            <View style={styles.recommendedCardMetaItem}>
              <TrendingUp size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.recommendedCardMetaText}>{calories} cal</Text>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.recommendedCardLevelBadge}>
          <Text style={styles.recommendedCardLevelText}>{level}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  energyField: {
    position: 'absolute',
    top: -height * 0.3,
    left: width * 0.5 - height * 0.5,
    width: height,
    height: height,
    borderRadius: height / 2,
    overflow: 'hidden',
  },
  energyGradient: {
    width: '100%',
    height: '100%',
  },
  neuralPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  neuralNode: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  neuralConnection: {
    position: 'absolute',
    height: 1,
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    zIndex: 10,
  },
  greeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginRight: 8,
  },
  aiStatusIndicator: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  profileImageContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageBorder: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  profileActiveIndicator: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.background,
    bottom: 0,
    right: 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeMessage: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    height: 90,
  },
  welcomeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeNeuralPattern: {
    opacity: 0.2,
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  aiIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeMessageContent: {
    flex: 1,
    marginRight: 16,
  },
  welcomeMessageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  
  // Quantum Card Styles
  quantumCard: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  cardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 30,
    opacity: 0.3,
  },
  cardBlur: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  cardContent: {
    padding: 20,
  },
  
  // Stats Card
  statsCardContainer: {
    marginBottom: 24,
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  statsAiBadge: {
    backgroundColor: 'rgba(79, 209, 197, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statsAiBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPercentage: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: 'white',
  },
  goalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsDetails: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  biometricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },
  biometricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  biometricValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
  biometricUnit: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  biometricDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // AI Insight Card
  aiInsightCardContainer: {
    marginBottom: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  aiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTitleIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  aiNeuralPattern: {
    opacity: 0.3,
    height: '100%',
  },
  aiTipText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'white',
    lineHeight: 22,
    marginBottom: 16,
    zIndex: 1,
  },
  aiActionButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1,
  },
  aiActionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  aiActionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'white',
    marginRight: 4,
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  viewAllButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  
  // Featured Workout
  featuredWorkoutContainer: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    height: 200,
    
    // Shadow for Android
    elevation: 5,
    
    // Shadow for iOS
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  featuredWorkoutGradient: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuredWorkoutImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  workoutOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  workoutOverlayGradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  workoutInfo: {
    flex: 1,
    marginRight: 16,
  },
  workoutTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 4,
  },
  workoutMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  workoutMetaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  workoutMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6,
  },
  playButtonContainer: {
    alignItems: 'flex-end',
  },
  playButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiRecommendedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  aiBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  aiBadgeShine: {
    position: 'absolute',
    top: 0,
    left: -50,
    width: 30,
    height: '100%',
    transform: [{ skewX: '-30deg' }],
    opacity: 0.5,
  },
  aiRecommendedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'white',
    marginLeft: 6,
  },
  
  // Goals Section
  goalsCardContainer: {
    marginBottom: 24,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  goalIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  goalContent: {
    flex: 1,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'white',
  },
  goalProgress: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: theme.colors.primary,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Recommended Workouts
  recommendedContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  recommendedCard: {
    width: 180,
    height: 220,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    
    // Shadow for Android
    elevation: 5,
    
    // Shadow for iOS
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  recommendedCardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recommendedCardImage: {
    width: '100%',
    height: '100%',
  },
  recommendedCardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
  recommendedCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  recommendedCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedCardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedCardMetaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  recommendedCardMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6,
  },
  recommendedCardLevelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recommendedCardLevelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: 'white',
  },
  
  // Floating Buttons
  floatingButtonsContainer: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    position: 'relative',
    marginVertical: 8,
  },
  buttonGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -5,
    left: -5,
  },
  quantumButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    
    // Shadow for Android
    elevation: 5,
    
    // Shadow for iOS
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
});