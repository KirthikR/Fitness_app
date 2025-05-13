import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Plus, Droplet, Medal, Moon, Coffee, Heart, Edit, Trash, Dumbbell } from 'lucide-react-native';
import { theme } from '@/constants/theme';

// Sample habit data for demo purposes
const INITIAL_HABITS = [
  {
    id: '1',
    name: 'Drink Water',
    icon: 'water',
    target: 8,
    unit: 'glasses',
    current: 4,
    color: '#3b82f6',
    streak: 7,
  },
  {
    id: '2',
    name: 'Sleep',
    icon: 'sleep',
    target: 8,
    unit: 'hours',
    current: 7,
    color: '#7c3aed',
    streak: 4,
  },
  {
    id: '3',
    name: 'Stretching',
    icon: 'stretching',
    target: 10,
    unit: 'minutes',
    current: 10,
    color: '#10b981',
    streak: 12,
  },
  {
    id: '4',
    name: 'No Coffee',
    icon: 'coffee',
    target: 1,
    unit: 'day',
    current: 1,
    color: '#f59e0b',
    streak: 2,
  },
  {
    id: '5',
    name: 'Meditation',
    icon: 'meditation',
    target: 15,
    unit: 'minutes',
    current: 0,
    color: '#ef4444',
    streak: 0,
  },
];

const getHabitIcon = (icon: string, color: string, size: number = 24) => {
  switch (icon) {
    case 'water':
      return <Droplet size={size} color={color} />;
    case 'sleep':
      return <Moon size={size} color={color} />;
    case 'stretching':
      return <Heart size={size} color={color} />;
    case 'coffee':
      return <Coffee size={size} color={color} />;
    case 'meditation':
      return <Dumbbell size={size} color={color} />;
    default:
      return <Heart size={size} color={color} />;
  }
};

export default function HabitTracker() {
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [editMode, setEditMode] = useState(false);
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const increaseHabitProgress = (id: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id && habit.current < habit.target
          ? { ...habit, current: habit.current + 1 }
          : habit
      )
    );
  };
  
  const decreaseHabitProgress = (id: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id && habit.current > 0
          ? { ...habit, current: habit.current - 1 }
          : habit
      )
    );
  };
  
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };
  
  const addHabit = () => {
    // In a real app, this would open a form to create a new habit
    console.log('Add new habit');
  };
  
  const calculateTotalProgress = () => {
    let completed = 0;
    let total = 0;
    
    habits.forEach(habit => {
      if (habit.current >= habit.target) {
        completed++;
      }
      total++;
    });
    
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };
  
  const progress = calculateTotalProgress();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habits</Text>
        <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
          <Text style={styles.editButtonText}>{editMode ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <View style={styles.progressMedalContainer}>
              <Medal size={20} color={theme.colors.accent} />
              <Text style={styles.streakText}>Best streak: 12 days</Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress.completed} of {progress.total} completed
            </Text>
          </View>
        </Animated.View>
        
        <View style={styles.habitsList}>
          {habits.map((habit, index) => (
            <Animated.View 
              key={habit.id}
              entering={FadeInDown.delay(300 + (index * 100)).duration(600)}
              style={[
                styles.habitCard,
                { borderLeftColor: habit.color, borderLeftWidth: 4 }
              ]}
            >
              <View style={styles.habitHeader}>
                <View style={[styles.habitIconContainer, { backgroundColor: `${habit.color}20` }]}>
                  {getHabitIcon(habit.icon, habit.color)}
                </View>
                
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <View style={styles.habitStreak}>
                    <Medal size={14} color={theme.colors.accent} />
                    <Text style={styles.habitStreakText}>{habit.streak} day streak</Text>
                  </View>
                </View>
                
                {editMode ? (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteHabit(habit.id)}
                  >
                    <Trash size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                ) : (
                  <HabitCounter 
                    current={habit.current}
                    target={habit.target}
                    onIncrease={() => increaseHabitProgress(habit.id)}
                    onDecrease={() => decreaseHabitProgress(habit.id)}
                  />
                )}
              </View>
              
              {!editMode && (
                <View style={styles.habitProgressContainer}>
                  <HabitProgressBar 
                    current={habit.current} 
                    target={habit.target} 
                    color={habit.color} 
                  />
                  <Text style={styles.habitProgressText}>
                    {habit.current} / {habit.target} {habit.unit}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))}
          
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <TouchableOpacity style={styles.addHabitButton} onPress={addHabit}>
              <Plus size={24} color={theme.colors.primary} />
              <Text style={styles.addHabitText}>Add New Habit</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <Animated.View 
          entering={FadeInDown.delay(700).duration(600)}
          style={styles.habitStatsCard}
        >
          <Text style={styles.habitStatsTitle}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>83%</Text>
              <Text style={styles.statLabel}>Week Completion</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>64%</Text>
              <Text style={styles.statLabel}>Month Completion</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

interface HabitCounterProps {
  current: number;
  target: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function HabitCounter({ current, target, onIncrease, onDecrease }: HabitCounterProps) {
  return (
    <View style={styles.habitCounter}>
      <TouchableOpacity 
        style={[styles.counterButton, current === 0 && styles.disabledButton]} 
        onPress={onDecrease}
        disabled={current === 0}
      >
        <Text style={styles.counterButtonText}>−</Text>
      </TouchableOpacity>
      
      <View style={styles.counterValueContainer}>
        <Text style={[
          styles.counterValue,
          current >= target && styles.completedValue
        ]}>
          {current}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.counterButton, current === target && styles.disabledButton]} 
        onPress={onIncrease}
        disabled={current === target}
      >
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

interface HabitProgressBarProps {
  current: number;
  target: number;
  color: string;
}

function HabitProgressBar({ current, target, color }: HabitProgressBarProps) {
  const progress = (current / target) * 100;
  const width = useSharedValue(0);
  
  React.useEffect(() => {
    width.value = withTiming(progress, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);
  
  const barStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.min(width.value, 100)}%`,
    };
  });
  
  return (
    <View style={styles.habitProgressBar}>
      <Animated.View 
        style={[
          styles.habitProgressFill, 
          barStyle, 
          { backgroundColor: color }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: theme.colors.text,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 20,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
  },
  progressMedalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  habitsList: {
    marginBottom: 24,
  },
  habitCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  habitStreak: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitStreakText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
  habitCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: theme.colors.text,
  },
  disabledButton: {
    opacity: 0.3,
  },
  counterValueContainer: {
    width: 40,
    alignItems: 'center',
  },
  counterValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
  },
  completedValue: {
    color: theme.colors.success,
  },
  habitProgressContainer: {
    marginTop: 12,
  },
  habitProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  habitProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitProgressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
  addHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
  },
  addHabitText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  habitStatsCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitStatsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});