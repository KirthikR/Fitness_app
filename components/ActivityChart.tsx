import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { theme } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence, 
  withDelay,
  withSpring,
  interpolateColor,
  Easing,
  FadeIn,
  ZoomIn,
  SlideInRight
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ActivityData {
  name: string;
  percentage: number;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  gradient: string[];
}

export default function ActivityChart() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const highlightScale = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  
  useEffect(() => {
    // Initial animation for the entire chart
    rotateValue.value = withSequence(
      withTiming(5, { duration: 300 }),
      withTiming(-5, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );
    
    // Auto-select the first item after a delay
    setTimeout(() => {
      setSelectedIndex(0);
    }, 1000);
  }, []);
  
  const activities: ActivityData[] = [
    { 
      name: 'HIIT', 
      percentage: 35, 
      color: theme.colors.primary, 
      icon: 'lightning-bolt',
      gradient: ['#2563eb', '#4f46e5', '#3b82f6']
    },
    { 
      name: 'Cardio', 
      percentage: 25, 
      color: theme.colors.accent, 
      icon: 'heart-pulse',
      gradient: ['#ec4899', '#db2777', '#f472b6']
    },
    { 
      name: 'Strength', 
      percentage: 30, 
      color: theme.colors.success, 
      icon: 'weight-lifter',
      gradient: ['#10b981', '#059669', '#34d399']
    },
    { 
      name: 'Yoga', 
      percentage: 10, 
      color: '#7c3aed', 
      icon: 'meditation',
      gradient: ['#7c3aed', '#6d28d9', '#a78bfa']
    },
  ];
  
  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }]
    };
  });
  
  return (
    <Animated.View 
      style={[styles.container, rotateStyle]}
      entering={FadeIn.duration(800)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Activity Stats</Text>
          <Text style={styles.subtitle}>Your weekly workout breakdown</Text>
        </View>
        <Animated.View entering={ZoomIn.delay(300)}>
          <PremiumIndicator />
        </Animated.View>
      </View>
      
      <View style={styles.chartContainer}>
        {activities.map((activity, index) => (
          <Pressable 
            key={index} 
            onPress={() => setSelectedIndex(index)}
            style={({ pressed }) => [
              styles.activityWrap,
              pressed ? { opacity: 0.9 } : {}
            ]}
          >
            <Animated.View 
              entering={SlideInRight.delay(index * 100).springify()}
              style={[
                styles.activityContainer,
                selectedIndex === index && styles.selectedActivity
              ]}
            >
              <View style={styles.labelContainer}>
                <View style={[styles.iconContainer, { backgroundColor: activity.color }]}>
                  <MaterialCommunityIcons name={activity.icon} size={14} color="white" />
                </View>
                <Text style={styles.activityName}>{activity.name}</Text>
              </View>
              <View style={styles.barContainer}>
                <ProgressBar 
                  percentage={activity.percentage} 
                  gradient={activity.gradient} 
                  index={index}
                  isSelected={selectedIndex === index}
                />
                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageText}>{activity.percentage}%</Text>
                </View>
              </View>
            </Animated.View>
          </Pressable>
        ))}
      </View>
      
      <Animated.View 
        entering={FadeIn.delay(800).duration(1000)}
        style={styles.summaryContainer}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <BlurView intensity={10} style={styles.summaryBlur}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Feather name="trending-up" size={18} color={theme.colors.success} />
                <Text style={styles.summaryValue}>28%</Text>
                <Text style={styles.summaryLabel}>Weekly Gain</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="fire" size={18} color={theme.colors.accent} />
                <Text style={styles.summaryValue}>1,528</Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Feather name="clock" size={18} color={theme.colors.primary} />
                <Text style={styles.summaryValue}>4.3h</Text>
                <Text style={styles.summaryLabel}>Total Time</Text>
              </View>
            </View>
          </BlurView>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

interface ProgressBarProps {
  percentage: number;
  gradient: string[];
  index: number;
  isSelected: boolean;
}

function ProgressBar({ percentage, gradient, index, isSelected }: ProgressBarProps) {
  const width = useSharedValue(0);
  const pulseValue = useSharedValue(1);
  
  useEffect(() => {
    // Add staggered animation delay based on index
    width.value = 0;
    setTimeout(() => {
      width.value = withTiming(percentage, { 
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
    }, index * 300);
    
    // If this bar is selected, add a pulse animation
    if (isSelected) {
      pulseValue.value = withSequence(
        withTiming(1.05, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
    } else {
      pulseValue.value = withTiming(1, { duration: 200 });
    }
  }, [percentage, isSelected]);
  
  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
      transform: [{ scaleY: pulseValue.value }]
    };
  });
  
  return (
    <View style={styles.progressBackground}>
      <Animated.View style={animatedBarStyle}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.progressBar}
        >
          {isSelected && (
            <View style={styles.glowDot} />
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

function PremiumIndicator() {
  return (
    <View style={styles.premiumTag}>
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumGradient}
      >
        <Text style={styles.premiumText}>AI</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
  chartContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  activityWrap: {
    marginBottom: 18,
  },
  activityContainer: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedActivity: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginRight: 4,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
  },
  percentageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    minWidth: 45,
    alignItems: 'center',
  },
  percentageText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: theme.colors.text,
  },
  premiumTag: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  premiumGradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  premiumText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: 'white',
  },
  summaryContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  summaryBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryContent: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 5,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: theme.colors.textLight,
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
});