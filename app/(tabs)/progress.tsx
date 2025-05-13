import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
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
  useAnimatedScrollHandler,
  interpolateColor
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  Clock, 
  Zap, 
  BarChart2, 
  Target, 
  ArrowRight, 
  Medal,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import LineChart from '@/components/LineChart';
import ActivityChart from '@/components/ActivityChart';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Quantum card component with glass morphism
const QuantumCard = ({ children, style, glowColor, animate = true, delay = 0 }) => {
  const glowOpacity = useSharedValue(animate ? 0 : 0.3);
  const scale = useSharedValue(animate ? 0.97 : 1);
  
  useEffect(() => {
    if (animate) {
      glowOpacity.value = withDelay(
        delay, 
        withTiming(0.3, { duration: 1000, easing: Easing.out(Easing.cubic) })
      );
      
      scale.value = withDelay(
        delay, 
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    }
  }, []);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0.97, 1], [0, 1])
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value
  }));
  
  return (
    <Animated.View style={[styles.quantumCardContainer, containerStyle]}>
      <Animated.View 
        style={[
          styles.cardGlow, 
          glowStyle, 
          { backgroundColor: glowColor || theme.colors.primary }
        ]} 
      />
      <AnimatedBlurView intensity={25} tint="dark" style={[styles.quantumCard, style]}>
        {children}
      </AnimatedBlurView>
    </Animated.View>
  );
};

// Neural network pulse animation component - Simplified version without Skia Path
const NeuralPulse = ({ style }) => {
  const pulseAnim = useSharedValue(0);
  
  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);
  
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [0, 0.5, 1], [0.2, 0.5, 0.2]),
    transform: [
      { scale: interpolate(pulseAnim.value, [0, 1], [0.95, 1.05]) }
    ]
  }));
  
  return (
    <View style={[styles.neuralPulseContainer, style]}>
      <AnimatedLinearGradient
        colors={['rgba(79, 209, 197, 0.3)', 'rgba(99, 179, 237, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.neuralPulseGradient, pulseStyle]}
      />
      
      {/* Neural network lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Animated.View 
          key={`line-${i}`}
          style={[
            styles.neuralLine,
            {
              top: 20 + i * 10,
              left: 20 + i * 20,
              width: 100 + i * 10,
              transform: [{ 
                translateY: withRepeat(
                  withSequence(
                    withTiming(5, { duration: 1000 + i * 200 }),
                    withTiming(-5, { duration: 1000 + i * 200 })
                  ),
                  -1,
                  true
                ) 
              }]
            }
          ]}
        />
      ))}
      
      {/* Neural dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Animated.View 
          key={`dot-${i}`}
          style={[
            styles.neuralDot,
            {
              top: 15 + Math.random() * 30,
              left: 20 + (i * (width - 40) / 7),
              opacity: withRepeat(
                withSequence(
                  withTiming(0.8, { duration: 800 + Math.random() * 500 }),
                  withTiming(0.2, { duration: 800 + Math.random() * 500 })
                ),
                -1,
                true
              )
            }
          ]}
        />
      ))}
    </View>
  );
};

// AI insight card with pulsing animation
const AIInsightCard = ({ title, description, style, onPress }) => {
  const pulseAnim = useSharedValue(0);
  
  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);
  
  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        pulseAnim.value,
        [0, 0.5, 1],
        [
          'rgba(79, 209, 197, 0.3)',
          'rgba(79, 209, 197, 0.7)',
          'rgba(79, 209, 197, 0.3)'
        ]
      )
    };
  });
  
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Animated.View style={[styles.aiInsightCard, borderStyle, style]}>
        <NeuralPulse style={styles.neuralPulseBackground} />
        <View style={styles.aiIconContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiIconGradient}
          >
            <Zap size={18} color="white" />
          </LinearGradient>
        </View>
        <View style={styles.aiInsightContent}>
          <Text style={styles.aiInsightTitle}>{title}</Text>
          <Text style={styles.aiInsightDescription}>{description}</Text>
        </View>
        <ChevronRight size={18} color={theme.colors.primary} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Custom progress bar with animation
const AnimatedProgressBar = ({ progress, barColor, style }) => {
  const progressAnim = useSharedValue(0);
  
  useEffect(() => {
    progressAnim.value = withTiming(progress, { 
      duration: 1500, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
  }, [progress]);
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`
  }));
  
  return (
    <View style={[styles.progressContainer, style]}>
      <View style={styles.progressTrack}>
        <Animated.View 
          style={[
            styles.progressFill, 
            progressStyle, 
            { backgroundColor: barColor || theme.colors.primary }
          ]} 
        />
      </View>
    </View>
  );
};

// Stats Summary Bubble
const StatBubble = ({ icon, value, label, color, delay = 0 }) => {
  const scale = useSharedValue(0.7);
  
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, []);
  
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0.7, 1], [0, 1])
  }));
  
  return (
    <Animated.View style={[styles.statBubbleContainer, bubbleStyle]}>
      <LinearGradient
        colors={[`${color}20`, `${color}10`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statBubble}
      >
        <View style={[styles.statIconContainer, { backgroundColor: `${color}30` }]}>
          {icon}
        </View>
        
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default function ProgressScreen() {
  const scrollY = useSharedValue(0);
  const weeklyProgress = 0.65;
  
  // Handle scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Animated header style
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
  
  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <LinearGradient
          colors={['rgba(79, 209, 197, 0.05)', 'rgba(0, 0, 0, 0)']}
          style={styles.backgroundGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
        />
      </View>
      
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Progress Analytics</Text>
        <TouchableOpacity style={styles.periodSelector}>
          <Text style={styles.periodText}>This Week</Text>
          <ChevronDown size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* AI Insight */}
        <AIInsightCard
          title="AI Performance Insight"
          description="Your workout intensity has increased by 18% this week. Keep up the pace!"
          onPress={() => {}}
        />
        
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <StatBubble
            icon={<Calendar size={20} color={theme.colors.primary} />}
            value="16"
            label="Workouts"
            color={theme.colors.primary}
            delay={100}
          />
          
          <StatBubble
            icon={<TrendingUp size={20} color={theme.colors.accent} />}
            value="5,240"
            label="Calories"
            color={theme.colors.accent}
            delay={200}
          />
          
          <StatBubble
            icon={<Clock size={20} color={theme.colors.success} />}
            value="4.5"
            label="Hours"
            color={theme.colors.success}
            delay={300}
          />
        </View>
        
        {/* Weekly Progress Card */}
        <QuantumCard
          glowColor={theme.colors.primary}
          delay={300}
          style={styles.trendCard}
        >
          <View style={styles.trendCardHeader}>
            <View style={styles.trendCardTitleContainer}>
              <BarChart2 size={20} color={theme.colors.primary} />
              <Text style={styles.trendCardTitle}>Workout Duration</Text>
            </View>
            <TouchableOpacity style={styles.periodBadge}>
              <Text style={styles.periodBadgeText}>Weekly</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartWrapper}>
            <LineChart />
          </View>
          
          <View style={styles.chartMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>45 min</Text>
              <Text style={styles.metricLabel}>Average</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.colors.success }]}>+12%</Text>
              <Text style={styles.metricLabel}>Growth</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>70 min</Text>
              <Text style={styles.metricLabel}>Peak</Text>
            </View>
          </View>
        </QuantumCard>
        
        {/* Activity Breakdown Card */}
        <QuantumCard
          glowColor={theme.colors.accent}
          delay={600}
        >
          <View style={styles.trendCardHeader}>
            <View style={styles.trendCardTitleContainer}>
              <Medal size={20} color={theme.colors.accent} />
              <Text style={styles.trendCardTitle}>Activity Breakdown</Text>
            </View>
            <TouchableOpacity style={[styles.periodBadge, { backgroundColor: `${theme.colors.accent}15` }]}>
              <Text style={[styles.periodBadgeText, { color: theme.colors.accent }]}>Monthly</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartWrapper}>
            <ActivityChart />
          </View>
          
          <TouchableOpacity style={styles.activityDetails}>
            <Text style={styles.activityDetailsText}>View Activity Details</Text>
            <ArrowRight size={16} color={theme.colors.accent} />
          </TouchableOpacity>
        </QuantumCard>
        
        {/* Weight Goal Card */}
        <QuantumCard
          glowColor={theme.colors.success}
          delay={900}
        >
          <View style={styles.trendCardHeader}>
            <View style={styles.trendCardTitleContainer}>
              <Target size={20} color={theme.colors.success} />
              <Text style={styles.trendCardTitle}>Weight Goal</Text>
            </View>
            <TouchableOpacity style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>On Track</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalProgressSection}>
            <AnimatedProgressBar 
              progress={0.65} 
              barColor={theme.colors.success} 
              style={styles.weightProgressBar}
            />
            <Text style={styles.goalPercentage}>65%</Text>
          </View>
          
          <View style={styles.weightMilestones}>
            <View style={styles.milestone}>
              <View style={[styles.milestoneMarker, styles.completedMilestone]} />
              <Text style={styles.milestoneValue}>85 kg</Text>
              <Text style={styles.milestoneLabel}>Starting</Text>
            </View>
            
            <View style={styles.milestoneLine}>
              <View style={[styles.milestoneLineProgress, { width: '65%' }]} />
            </View>
            
            <View style={[styles.milestone, { alignItems: 'center' }]}>
              <View style={[styles.milestoneMarker, styles.currentMilestone]} />
              <Text style={[styles.milestoneValue, { color: theme.colors.success }]}>76 kg</Text>
              <Text style={styles.milestoneLabel}>Current</Text>
            </View>
            
            <View style={styles.milestoneLine}>
              <View style={[styles.milestoneLineProgress, { width: '0%' }]} />
            </View>
            
            <View style={[styles.milestone, { alignItems: 'flex-end' }]}>
              <View style={styles.milestoneMarker} />
              <Text style={styles.milestoneValue}>68 kg</Text>
              <Text style={styles.milestoneLabel}>Target</Text>
            </View>
          </View>
          
          <View style={styles.weightInsights}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightCard}
            >
              <Text style={styles.insightValue}>-9 kg</Text>
              <Text style={styles.insightLabel}>Progress</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightCard}
            >
              <Text style={styles.insightValue}>8 kg</Text>
              <Text style={styles.insightLabel}>Remaining</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightCard}
            >
              <Text style={styles.insightValue}>Sep 30</Text>
              <Text style={styles.insightLabel}>ETA</Text>
            </LinearGradient>
          </View>
        </QuantumCard>
        
        {/* Extra space at bottom */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
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
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: theme.colors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  
  // AI Insight Card
  aiInsightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.3)',
    overflow: 'hidden',
  },
  neuralPulseBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  neuralPulseContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  neuralPulseGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  neuralLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(79, 209, 197, 0.5)',
  },
  neuralDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(79, 209, 197, 0.7)',
  },
  aiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    overflow: 'hidden',
  },
  aiIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiInsightContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  aiInsightTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  aiInsightDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
    lineHeight: 18,
  },
  
  // Summary Stats
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBubbleContainer: {
    flex: 1,
    maxWidth: (width - 48) / 3 - 8,
  },
  statBubble: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
  
  // Quantum Card
  quantumCardContainer: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
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
  quantumCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    overflow: 'hidden',
  },
  trendCard: {
    paddingBottom: 16,
  },
  trendCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  periodBadge: {
    backgroundColor: `${theme.colors.primary}15`,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  periodBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.primary,
  },
  chartWrapper: {
    height: 200,
    marginHorizontal: -16,
  },
  chartMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  metricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityDetailsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.accent,
    marginRight: 8,
  },
  
  // Weight Goal Styles
  goalBadge: {
    backgroundColor: `${theme.colors.success}15`,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  goalBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.success,
  },
  goalProgressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  weightProgressBar: {
    flex: 1,
    marginRight: 12,
  },
  goalPercentage: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.success,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
  },
  progressTrack: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  weightMilestones: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  milestone: {
    width: 60,
    alignItems: 'flex-start',
  },
  milestoneMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 6,
  },
  completedMilestone: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  currentMilestone: {
    backgroundColor: theme.colors.success,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  milestoneValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'white',
    marginBottom: 2,
  },
  milestoneLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  milestoneLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  milestoneLineProgress: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  weightInsights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  insightValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
    marginBottom: 2,
  },
  insightLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});