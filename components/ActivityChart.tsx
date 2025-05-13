import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface ActivityData {
  name: string;
  percentage: number;
  color: string;
}

export default function ActivityChart() {
  const activities: ActivityData[] = [
    { name: 'HIIT', percentage: 35, color: theme.colors.primary },
    { name: 'Cardio', percentage: 25, color: theme.colors.accent },
    { name: 'Strength', percentage: 30, color: theme.colors.success },
    { name: 'Yoga', percentage: 10, color: '#7c3aed' },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityContainer}>
            <View style={styles.labelContainer}>
              <View style={[styles.colorIndicator, { backgroundColor: activity.color }]} />
              <Text style={styles.activityName}>{activity.name}</Text>
            </View>
            <View style={styles.barContainer}>
              <ProgressBar 
                percentage={activity.percentage} 
                color={activity.color} 
                index={index}
              />
              <Text style={styles.percentageText}>{activity.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

interface ProgressBarProps {
  percentage: number;
  color: string;
  index: number;
}

function ProgressBar({ percentage, color, index }: ProgressBarProps) {
  const width = useSharedValue(0);
  
  useEffect(() => {
    // Add staggered animation delay based on index
    setTimeout(() => {
      width.value = withTiming(percentage, { duration: 1000 });
    }, index * 200);
  }, []);
  
  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });
  
  return (
    <View style={styles.progressBackground}>
      <Animated.View 
        style={[
          styles.progressBar, 
          animatedBarStyle,
          { backgroundColor: color }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
  chartContainer: {
    flex: 1,
  },
  activityContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activityName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
});