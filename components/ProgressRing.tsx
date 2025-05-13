import { StyleSheet } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: Animated.SharedValue<number>;
  size: number;
  strokeWidth: number;
  color?: string;
  backgroundColor?: string;
}

export default function ProgressRing({
  progress,
  size,
  strokeWidth,
  color = 'white',
  backgroundColor = 'rgba(255, 255, 255, 0.3)',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <Svg width={size} height={size}>
      {/* Background Circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
      
      {/* Progress Circle */}
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeLinecap="round"
        fill="transparent"
        animatedProps={animatedProps}
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {},
});