import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export default function LineChart() {
  const data = [30, 65, 45, 70, 60, 80, 75];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = Math.max(...data);
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.map((value, index) => (
          <ChartBar 
            key={index} 
            value={value} 
            maxValue={maxValue} 
            day={days[index]} 
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

interface ChartBarProps {
  value: number;
  maxValue: number;
  day: string;
  index: number;
}

function ChartBar({ value, maxValue, day, index }: ChartBarProps) {
  const normalizedHeight = (value / maxValue) * 150;
  const heightValue = useSharedValue(0);
  
  useEffect(() => {
    // Add staggered animation delay based on index
    setTimeout(() => {
      heightValue.value = withTiming(normalizedHeight, { duration: 1000 });
    }, index * 100);
  }, []);
  
  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
    };
  });
  
  return (
    <View style={styles.barContainer}>
      <Animated.View 
        style={[
          styles.bar, 
          animatedBarStyle,
          { backgroundColor: theme.colors.primary }
        ]} 
      />
      <Text style={styles.dayLabel}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 180,
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  dayLabel: {
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
});