import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ChevronDown, Plus, Camera, BarChart4, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';

// Sample meal data for demo purposes
const MEAL_DATA = {
  breakfast: [
    {
      id: 'b1',
      name: 'Greek Yogurt with Berries',
      calories: 240,
      protein: 18,
      carbs: 30,
      fat: 6,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ],
  lunch: [
    {
      id: 'l1',
      name: 'Grilled Chicken Salad',
      calories: 350,
      protein: 32,
      carbs: 12,
      fat: 18,
      image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ],
  dinner: [
    {
      id: 'd1',
      name: 'Salmon with Quinoa',
      calories: 480,
      protein: 38,
      carbs: 40,
      fat: 16,
      image: 'https://images.pexels.com/photos/1323421/pexels-photo-1323421.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ],
  snacks: [
    {
      id: 's1',
      name: 'Protein Shake',
      calories: 180,
      protein: 25,
      carbs: 9,
      fat: 2,
      image: 'https://images.pexels.com/photos/3651513/pexels-photo-3651513.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ],
};

// Calculate daily totals
const calculateDailyTotals = () => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  Object.values(MEAL_DATA).forEach(meals => {
    meals.forEach(meal => {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFat += meal.fat;
    });
  });

  return { totalCalories, totalProtein, totalCarbs, totalFat };
};

interface MealSectionProps {
  title: string;
  meals: any[];
  onAddMeal: () => void;
}

const MealSection = ({ title, meals, onAddMeal }: MealSectionProps) => {
  const [expanded, setExpanded] = useState(true);
  const rotateValue = useSharedValue(0);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
    rotateValue.value = withTiming(expanded ? 1 : 0, { duration: 300 });
  };
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value * 180}deg` }],
    };
  });

  return (
    <View style={styles.mealSection}>
      <TouchableOpacity style={styles.mealHeader} onPress={toggleExpanded}>
        <Text style={styles.mealTitle}>{title}</Text>
        <Animated.View style={iconStyle}>
          <ChevronDown size={20} color={theme.colors.text} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.mealContent}>
          {meals.map((meal, index) => (
            <Animated.View
              key={meal.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={styles.mealItem}
            >
              <Image source={{ uri: meal.image }} style={styles.mealImage} />
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.macrosContainer}>
                  <Text style={styles.caloriesText}>{meal.calories} cal</Text>
                  <Text style={styles.macroText}>P: {meal.protein}g</Text>
                  <Text style={styles.macroText}>C: {meal.carbs}g</Text>
                  <Text style={styles.macroText}>F: {meal.fat}g</Text>
                </View>
              </View>
            </Animated.View>
          ))}
          
          <TouchableOpacity style={styles.addMealButton} onPress={onAddMeal}>
            <Plus size={20} color={theme.colors.primary} />
            <Text style={styles.addMealText}>Add {title}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function MealPlanner() {
  const dailyTotals = calculateDailyTotals();
  const calorieGoal = 2000; // Example calorie goal
  const calorieProgress = (dailyTotals.totalCalories / calorieGoal) * 100;
  
  const handleAddMeal = (mealType: string) => {
    console.log(`Add ${mealType}`);
    // In a real app, this would open a meal selection/creation screen
  };
  
  const handleLogMealWithCamera = () => {
    console.log('Log meal with camera');
    // In a real app, this would open the camera for food recognition
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Planner</Text>
        <TouchableOpacity style={styles.dateSelector}>
          <Text style={styles.dateText}>Today</Text>
          <ChevronDown size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.nutritionSummary}
        >
          <View style={styles.calorieContainer}>
            <View style={styles.calorieTextContainer}>
              <Text style={styles.calorieConsumed}>{dailyTotals.totalCalories}</Text>
              <Text style={styles.calorieGoal}>/ {calorieGoal} cal</Text>
            </View>
            
            <View style={styles.calorieProgressContainer}>
              <View style={styles.calorieProgressBar}>
                <View 
                  style={[
                    styles.calorieProgress, 
                    { width: `${Math.min(calorieProgress, 100)}%` },
                    calorieProgress > 100 ? styles.calorieExceeded : {}
                  ]} 
                />
              </View>
              <Text style={styles.calorieProgressText}>
                {Math.round(calorieProgress)}% of daily goal
              </Text>
            </View>
          </View>
          
          <View style={styles.macrosRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, styles.proteinCircle]}>
                <Text style={styles.macroValue}>{dailyTotals.totalProtein}g</Text>
              </View>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, styles.carbsCircle]}>
                <Text style={styles.macroValue}>{dailyTotals.totalCarbs}g</Text>
              </View>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, styles.fatCircle]}>
                <Text style={styles.macroValue}>{dailyTotals.totalFat}g</Text>
              </View>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.mealsSectionContainer}>
          <MealSection 
            title="Breakfast" 
            meals={MEAL_DATA.breakfast} 
            onAddMeal={() => handleAddMeal('breakfast')} 
          />
          
          <MealSection 
            title="Lunch" 
            meals={MEAL_DATA.lunch} 
            onAddMeal={() => handleAddMeal('lunch')} 
          />
          
          <MealSection 
            title="Dinner" 
            meals={MEAL_DATA.dinner} 
            onAddMeal={() => handleAddMeal('dinner')} 
          />
          
          <MealSection 
            title="Snacks" 
            meals={MEAL_DATA.snacks} 
            onAddMeal={() => handleAddMeal('snacks')} 
          />
        </View>
        
        <Animated.View 
          entering={FadeInDown.delay(800).duration(600)}
          style={styles.recommendationsContainer}
        >
          <Text style={styles.recommendationsTitle}>Recommended Meals</Text>
          <Text style={styles.recommendationsSubtitle}>Based on your nutrition needs</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsScroll}
          >
            <TouchableOpacity style={styles.recommendationCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                style={styles.recommendationImage} 
              />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationName}>Protein Oatmeal</Text>
                <Text style={styles.recommendationCalories}>380 cal</Text>
                <View style={styles.recommendationTags}>
                  <View style={styles.recommendationTag}>
                    <Text style={styles.recommendationTagText}>High Protein</Text>
                  </View>
                  <View style={styles.recommendationTag}>
                    <Text style={styles.recommendationTagText}>Breakfast</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recommendationCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                style={styles.recommendationImage} 
              />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationName}>Avocado Toast</Text>
                <Text style={styles.recommendationCalories}>320 cal</Text>
                <View style={styles.recommendationTags}>
                  <View style={styles.recommendationTag}>
                    <Text style={styles.recommendationTagText}>Healthy Fats</Text>
                  </View>
                  <View style={styles.recommendationTag}>
                    <Text style={styles.recommendationTagText}>Quick</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recommendationCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                style={styles.recommendationImage} 
              />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationName}>Chicken Bowl</Text>
                <Text style={styles.recommendationCalories}>410 cal</Text>
                <View style={styles.recommendationTags}>
                  <View style={styles.recommendationTag}>
                    <Text style={styles.recommendationTagText}>High Protein</Text>
                  </View>
                  <View style={styles.recommendationTag}>
                    <Text style={styles.recommendationTagText}>Lunch</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogMealWithCamera}>
          <Camera size={24} color="white" />
          <Text style={styles.actionButtonText}>Log Meal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
          <BarChart4 size={24} color={theme.colors.primary} />
          <Text style={styles.secondaryActionButtonText}>Nutrition Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
          <Clock size={24} color={theme.colors.primary} />
          <Text style={styles.secondaryActionButtonText}>Meal Schedule</Text>
        </TouchableOpacity>
      </View>
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  nutritionSummary: {
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
  calorieContainer: {
    marginBottom: 16,
  },
  calorieTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  calorieConsumed: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: theme.colors.text,
  },
  calorieGoal: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  calorieProgressContainer: {
    marginBottom: 8,
  },
  calorieProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  calorieProgress: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  calorieExceeded: {
    backgroundColor: theme.colors.error,
  },
  calorieProgressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  proteinCircle: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  carbsCircle: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  fatCircle: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  macroValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
  },
  macroLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  mealsSectionContainer: {
    marginBottom: 24,
  },
  mealSection: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  mealTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
  },
  mealContent: {
    padding: 16,
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mealImage: {
    width: 80,
    height: 80,
  },
  mealDetails: {
    flex: 1,
    padding: 12,
  },
  mealName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caloriesText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 12,
  },
  macroText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginRight: 8,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 12,
  },
  addMealText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  recommendationsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  recommendationsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  recommendationsSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 16,
  },
  recommendationsScroll: {
    paddingBottom: 8,
  },
  recommendationCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  recommendationImage: {
    width: '100%',
    height: 120,
  },
  recommendationContent: {
    padding: 12,
  },
  recommendationName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  recommendationCalories: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  recommendationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recommendationTag: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  recommendationTagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: theme.colors.primary,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  secondaryActionButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    flex: 0.8,
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  secondaryActionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 4,
  },
});