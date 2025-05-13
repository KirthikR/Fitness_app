import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  SlideInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring, 
  withRepeat, 
  withSequence,
  interpolate,
  Extrapolation,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Filter, 
  Clock, 
  Flame, 
  Dumbbell, 
  Heart, 
  Target, 
  Zap, 
  Brain, 
  TrendingUp,
  BarChart,
  Calendar 
} from 'lucide-react-native';
// Make sure this import is at the top
import { theme } from '@/constants/theme';

// Helper functions for category colors and labels
function getCategoryColor(categoryId, opacity = 1) {
  switch(categoryId) {
    case 'cardio':
      return `rgba(255, 107, 107, ${opacity})`;
    case 'strength':
      return `rgba(79, 209, 197, ${opacity})`;
    case 'flexibility':
      return `rgba(161, 99, 247, ${opacity})`;
    case 'hiit':
      return `rgba(255, 177, 66, ${opacity})`;
    case 'recommended':
      return `rgba(79, 209, 197, ${opacity})`;
    case 'all':
      return `rgba(255, 255, 255, ${opacity})`;
    default:
      return `rgba(79, 209, 197, ${opacity})`;
  }
}

function getCategoryLabel(categoryId) {
  switch(categoryId) {
    case 'cardio':
      return 'Cardio';
    case 'strength':
      return 'Strength';
    case 'flexibility':
      return 'Flexibility';
    case 'hiit':
      return 'HIIT';
    case 'recommended':
      return 'For You';
    case 'all':
      return 'All';
    default:
      return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  }
}

type Category = 'all' | 'cardio' | 'strength' | 'flexibility' | 'hiit' | 'recommended';

// Make sure CategoryPill has proper TypeScript types
type CategoryItemProps = {
  category: {
    id: Category;
    label: string;
  };
  isSelected: boolean;
  onPress: () => void;
  index: number;
};

// Define AnimatedBlurView
const AnimatedBlurView = Platform.OS === 'web' 
  ? Animated.createAnimatedComponent(View)
  : Animated.createAnimatedComponent(BlurView);

// Category pill with animations - Improved
const CategoryPill = ({ category, isSelected, onPress, index }: CategoryItemProps) => {
  const animatedColor = useSharedValue(isSelected ? 1 : 0);
  
  useEffect(() => {
    animatedColor.value = withTiming(isSelected ? 1 : 0, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  }, [isSelected]);
  
  const pillStyle = useAnimatedStyle(() => {
    const backgroundColor = isSelected
      ? getCategoryColor(category.id, 0.15)
      : 'rgba(255, 255, 255, 0.08)';
      
    const borderColor = isSelected
      ? getCategoryColor(category.id)
      : 'rgba(255, 255, 255, 0.1)';
    
    return {
      backgroundColor,
      borderColor,
      transform: [
        { scale: interpolate(animatedColor.value, [0, 1], [1, 1.05]) }
      ],
      ...(Platform.OS === 'web' ? { transformOrigin: 'center' } : {}),
    };
  });
  
  const textStyle = useAnimatedStyle(() => {
    const color = isSelected
      ? getCategoryColor(category.id)
      : theme.colors.text;
    
    return { color };
  });
  
  const getIcon = () => {
    switch(category.id) {
      case 'cardio':
        return <Heart size={16} color={isSelected ? getCategoryColor(category.id) : theme.colors.text} />;
      case 'strength':
        return <Dumbbell size={16} color={isSelected ? getCategoryColor(category.id) : theme.colors.text} />;
      case 'flexibility':
        return <Target size={16} color={isSelected ? getCategoryColor(category.id) : theme.colors.text} />;
      case 'hiit':
        return <Flame size={16} color={isSelected ? getCategoryColor(category.id) : theme.colors.text} />;
      case 'recommended':
        return <Brain size={16} color={isSelected ? getCategoryColor(category.id) : theme.colors.text} />;
      case 'all':
        return <Zap size={16} color={isSelected ? getCategoryColor(category.id) : theme.colors.text} />;
      default:
        return null;
    }
  };
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(300 + (index * 100)).springify()}
      style={styles.categoryPillWrapper}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <AnimatedBlurView
          intensity={Platform.OS !== 'web' ? 20 : undefined}
          tint={Platform.OS !== 'web' ? "dark" : undefined}
          style={[
            styles.categoryPill, 
            pillStyle,
            Platform.OS === 'web' && { 
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(8px)' 
            }
          ]}
        >
          <View style={styles.categoryIconContainer}>
            {getIcon()}
          </View>
          <Animated.Text style={[styles.categoryPillText, textStyle]}>
            {category.label}
          </Animated.Text>
        </AnimatedBlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Add Workout Card Component
const WorkoutCard = ({ workout, index }) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.workoutCard}
    >
      <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.categoryBadge}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(workout.category) }]} />
            <Text style={styles.categoryLabel}>{getCategoryLabel(workout.category)}</Text>
          </View>
          
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Clock size={16} color="white" />
              <Text style={styles.metricText}>{workout.duration}</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Flame size={16} color="#FF7D45" />
              <Text style={styles.metricText}>{workout.calories} cal</Text>
            </View>
            
            <View style={styles.metricItem}>
              <TrendingUp size={16} color="#16BDCA" />
              <Text style={styles.metricText}>{workout.level}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      <TouchableOpacity 
        style={[
          styles.favoriteButton, 
          workout.favorite && styles.favoriteButtonActive
        ]}
      >
        <Heart 
          size={16} 
          color={workout.favorite ? "white" : theme.colors.text} 
          fill={workout.favorite ? "#FF4A6B" : "transparent"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WorkoutScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const scrollY = useSharedValue(0);
  
  // Enhanced category list with 'all' option
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'strength', label: 'Strength' },
    { id: 'flexibility', label: 'Flexibility' },
    { id: 'hiit', label: 'HIIT' },
    { id: 'recommended', label: 'For You' },
  ];

  // Sample workout data
  const workouts = [
    {
      id: '1',
      title: 'Metabolic Burn Circuit',
      category: 'hiit',
      duration: '35 min',
      calories: '385',
      level: 'Intermediate',
      imageUrl: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg',
      favorite: true,
    },
    {
      id: '2',
      title: 'Cardio Endurance Flow',
      category: 'cardio',
      duration: '28 min',
      calories: '310',
      level: 'Beginner',
      imageUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
      favorite: false,
    },
    {
      id: '3',
      title: 'Progressive Overload',
      category: 'strength',
      duration: '50 min',
      calories: '480',
      level: 'Advanced',
      imageUrl: 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg',
      favorite: true,
    },
    {
      id: '4',
      title: 'Deep Stretch Release',
      category: 'flexibility',
      duration: '40 min',
      calories: '220',
      level: 'All Levels',
      imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg',
      favorite: false,
    }
  ];

  // Filter workouts by category
  const filteredWorkouts = selectedCategory === 'all'
    ? workouts
    : workouts.filter(workout => workout.category === selectedCategory);
  
  // Animation for header on scroll
  const scrollHandler = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.value = offsetY;
  };
  
  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -15],
            Extrapolation.CLAMP
          ) 
        }
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 80],
        [1, 0.9],
        Extrapolation.CLAMP
      ),
    };
  });
  
  const searchBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          scale: interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.95],
            Extrapolation.CLAMP
          ) 
        }
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 80],
        [1, 0.85],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['rgba(25, 25, 25, 0.8)', 'rgba(0, 0, 0, 0.95)']}
        style={styles.backgroundGradient}
      />
      
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Workouts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Calendar size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Search Bar */}
      <Animated.View style={[styles.searchBarContainer, searchBarStyle]}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.textLight} />
          <Text style={styles.searchPlaceholder}>Find workouts...</Text>
        </View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category, index) => (
            <CategoryPill
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id as Category)}
              index={index}
            />
          ))}
        </ScrollView>
      </View>

      {/* Workouts List */}
      <ScrollView 
        style={styles.workoutsContainer}
        contentContainerStyle={styles.workoutsContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {filteredWorkouts.map((workout, index) => (
          <WorkoutCard key={workout.id} workout={workout} index={index} />
        ))}
        
        {/* Add space at bottom for tab navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    fontSize: 32,
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Search Bar
  searchBarContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginLeft: 10,
  },
  
  workoutsContainer: {
    flex: 1,
  },
  workoutsContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  workoutCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' }
      : {
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }
    ),
  },
  workoutImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContent: {
    zIndex: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF4A6B',
    borderColor: '#FF4A6B',
  },
  
  // Keep your existing category styles
  categoryWrapper: {
    // marginBottom: 10,
    paddingHorizontal: 24,
  },
  categoryContainer: {
    paddingBottom: 10,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPillWrapper: {
    marginRight: 8,
    marginBottom: 8,
    height: 40,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 40,
  },
  categoryIconContainer: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  categoryPillText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 2,
    textAlign: 'center',
  },
});