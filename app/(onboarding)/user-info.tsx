import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { ChevronLeft, CircleCheck, Brain, Activity, User, Scale, Ruler, Database, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function UserInfoScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(true);
  
  // Calculate form validity before using it in useEffect
  const isFormValid = !!(name && age && weight && height && gender && fitnessLevel);
  
  // Animation values
  const progressValue = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const activeSectionScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const aiPulse = useSharedValue(0);
  const typingAnim = useSharedValue(0);
  const continueBtnGlow = useSharedValue(0);
  
  // Particle animation values - one for each particle
  const particleAnimations = Array.from({ length: 12 }).map(() => useSharedValue(-10));
  
  // Update progress based on form completion
  const updateProgress = () => {
    let progress = 0;
    if (name) progress += 0.2;
    if (age) progress += 0.2;
    if (weight) progress += 0.2;
    if (height) progress += 0.2;
    if (gender) progress += 0.2;
    
    progressValue.value = withTiming(progress, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };
  
  useEffect(() => {
    // Initial animations
    headerOpacity.value = withTiming(1, { duration: 800 });
    formOpacity.value = withTiming(1, { duration: 1000 });
    
    // AI pulse effect
    aiPulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Typing animation
    typingAnim.value = withRepeat(
      withTiming(1, { duration: 600, easing: Easing.linear }),
      -1,
      true
    );
    
    // Simulate typing completion
    setTimeout(() => {
      setTypingIndicator(false);
    }, 3000);
    
    // Button glow effect if form is valid
    if (isFormValid) {
      continueBtnGlow.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
    
    // Animate particles with different delays
    particleAnimations.forEach((anim, index) => {
      anim.value = 0; // Reset
      // Staggered delay
      anim.value = withDelay(
        index * 200, 
        withRepeat(
          withTiming(width + 20, { 
            duration: 20000 + (index * 1000), 
            easing: Easing.linear 
          }),
          -1,
          false
        )
      );
    });
    
    // Update progress initially
    updateProgress();
  }, [isFormValid]);
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
    backgroundColor: interpolate(
      progressValue.value,
      [0, 0.5, 1],
      ['rgba(99, 179, 237, 0.8)', 'rgba(79, 209, 197, 0.8)', 'rgba(79, 209, 197, 1)']
    ),
  }));
  
  const aiPulseStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        aiPulse.value,
        [0, 0.5, 1],
        [0.7, 1, 0.7]
      ),
      transform: [
        { 
          scale: interpolate(
            aiPulse.value,
            [0, 0.5, 1],
            [1, 1.1, 1]
          ) 
        }
      ]
    };
  });
  
  const typingAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        typingAnim.value,
        [0, 0.5, 1],
        [0.2, 1, 0.2]
      )
    };
  });
  
  const buttonGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: isFormValid ? interpolate(
        continueBtnGlow.value,
        [0, 0.5, 1],
        [0, 0.6, 0]
      ) : 0
    };
  });

  const handleFinish = () => {
    // Button animation on press
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 }, () => {
        // Navigate after animation completes
        runOnJS(navigateToGoals)();
      })
    );
  };

  const navigateToGoals = () => {
    router.push('/(onboarding)/goals');
  };
  
  const activateField = (isActive: boolean) => {
    activeSectionScale.value = withSpring(isActive ? 1.02 : 1, {
      mass: 0.5,
      damping: 10,
      stiffness: 100,
    });
  };
  
  const buttonAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  // Generate particle animation styles
  const particleStyles = particleAnimations.map((anim, index) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{ translateX: anim.value }]
      };
    });
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
    >
      <LinearGradient
        colors={['#0a0c1a', '#172448', '#0a1020']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Floating particles for futuristic effect */}
      <View style={StyleSheet.absoluteFillObject}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Animated.View 
            key={`particle-${i}`}
            style={[
              styles.particle,
              {
                top: `${Math.random() * 100}%`,
                right: -10,
                width: 3 + Math.random() * 6,
                height: 3 + Math.random() * 6,
                opacity: 0.1 + Math.random() * 0.3,
                backgroundColor: i % 3 === 0 ? '#4FD1C5' : i % 3 === 1 ? '#63B3ED' : '#B794F4',
              },
              particleStyles[i]
            ]}
          />
        ))}
      </View>
      
      <Animated.View style={styles.mainContainer}>
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BlurView intensity={70} tint="dark" style={styles.backButtonBlur}>
              <ChevronLeft size={24} color="white" />
            </BlurView>
          </TouchableOpacity>
          
          <MaskedView
            maskElement={<Text style={styles.headerTitleMask}>BIOMETRIC PROFILE</Text>}
          >
            <LinearGradient
              colors={['#4FD1C5', '#63B3ED', '#B794F4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 26 }}
            />
          </MaskedView>
          
          <View style={{ width: 40 }} />
        </Animated.View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressStyle]}>
            <LinearGradient
              colors={['#4FD1C5', '#63B3ED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View 
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.aiCardContainer}
          >
            <BlurView intensity={60} tint="dark" style={styles.aiCard}>
              <View style={styles.aiIconWrapper}>
                <Animated.View style={aiPulseStyle}>
                  <LinearGradient
                    colors={['#4FD1C5', '#63B3ED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.aiIconGradient}
                  >
                    <Brain size={26} color="white" />
                  </LinearGradient>
                </Animated.View>
              </View>
              
              <View style={styles.aiMessageContent}>
                <Text style={styles.aiMessageHeader}>AI FITNESS ASSISTANT</Text>
                <Text style={styles.aiMessage}>
                  {typingIndicator ? 
                    "Analyzing optimal parameters for your fitness program..." : 
                    "I'll use this biometric data to create a personalized fitness plan tailored to your unique body composition."
                  }
                </Text>
                
                {typingIndicator && (
                  <Animated.View style={[styles.typingIndicator, typingAnimStyle]}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, {marginLeft: 4}]} />
                    <View style={[styles.typingDot, {marginLeft: 4}]} />
                  </Animated.View>
                )}
              </View>
            </BlurView>
          </Animated.View>

          <Animated.Text 
            entering={FadeInDown.delay(500).duration(800)}
            style={styles.title}
          >
            Calibrate Your Profile
          </Animated.Text>

          <Animated.View 
            entering={FadeInDown.delay(700).duration(800)}
            onLayout={() => updateProgress()}
          >
            <Text style={styles.inputLabel}>Full Name</Text>
            <BlurView intensity={40} tint="dark" style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <User size={20} color="#63B3ED" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={name}
                onFocus={() => activateField(true)}
                onBlur={() => activateField(false)}
                onChangeText={(text) => {
                  setName(text);
                  updateProgress();
                }}
              />
            </BlurView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(900).duration(800)}
            onLayout={() => updateProgress()}
          >
            <Text style={styles.inputLabel}>Age</Text>
            <BlurView intensity={40} tint="dark" style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Database size={20} color="#4FD1C5" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="number-pad"
                value={age}
                onFocus={() => activateField(true)}
                onBlur={() => activateField(false)}
                onChangeText={(text) => {
                  setAge(text);
                  updateProgress();
                }}
              />
              <Text style={styles.inputSuffix}>years</Text>
            </BlurView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(1100).duration(800)}
            onLayout={() => updateProgress()}
          >
            <Text style={styles.inputLabel}>Weight</Text>
            <BlurView intensity={40} tint="dark" style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Scale size={20} color="#B794F4" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your weight"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="number-pad"
                value={weight}
                onFocus={() => activateField(true)}
                onBlur={() => activateField(false)}
                onChangeText={(text) => {
                  setWeight(text);
                  updateProgress();
                }}
              />
              <Text style={styles.inputSuffix}>kg</Text>
            </BlurView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(1300).duration(800)}
            onLayout={() => updateProgress()}
          >
            <Text style={styles.inputLabel}>Height</Text>
            <BlurView intensity={40} tint="dark" style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ruler size={20} color="#63B3ED" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your height"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="number-pad"
                value={height}
                onFocus={() => activateField(true)}
                onBlur={() => activateField(false)}
                onChangeText={(text) => {
                  setHeight(text);
                  updateProgress();
                }}
              />
              <Text style={styles.inputSuffix}>cm</Text>
            </BlurView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(1500).duration(800)}
            onLayout={() => updateProgress()}
          >
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'male' && styles.selectedOption
                ]}
                onPress={() => {
                  setGender('male');
                  updateProgress();
                }}
              >
                <BlurView 
                  intensity={gender === 'male' ? 70 : 40} 
                  tint="dark" 
                  style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                  colors={gender === 'male' ? 
                    ['rgba(79, 209, 197, 0.6)', 'rgba(99, 179, 237, 0.6)'] : 
                    ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.genderGradient}
                />
                <Text style={styles.genderText}>Male</Text>
                {gender === 'male' && (
                  <CircleCheck size={20} color="#4FD1C5" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'female' && styles.selectedOption
                ]}
                onPress={() => {
                  setGender('female');
                  updateProgress();
                }}
              >
                <BlurView 
                  intensity={gender === 'female' ? 70 : 40} 
                  tint="dark" 
                  style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                  colors={gender === 'female' ? 
                    ['rgba(79, 209, 197, 0.6)', 'rgba(99, 179, 237, 0.6)'] : 
                    ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.genderGradient}
                />
                <Text style={styles.genderText}>Female</Text>
                {gender === 'female' && (
                  <CircleCheck size={20} color="#4FD1C5" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(1700).duration(800)}
            onLayout={() => updateProgress()}
          >
            <Text style={styles.inputLabel}>Fitness Level</Text>
            <View style={styles.fitnessLevelContainer}>
              {[
                { id: 'beginner', label: 'Beginner', color: '#FF6B6B' },
                { id: 'intermediate', label: 'Intermediate', color: '#63B3ED' },
                { id: 'advanced', label: 'Advanced', color: '#4FD1C5' }
              ].map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.fitnessOption,
                    fitnessLevel === level.id && styles.selectedOption
                  ]}
                  onPress={() => {
                    setFitnessLevel(level.id as typeof fitnessLevel);
                    updateProgress();
                  }}
                >
                  <BlurView 
                    intensity={fitnessLevel === level.id ? 70 : 40} 
                    tint="dark" 
                    style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient
                    colors={fitnessLevel === level.id ? 
                      [level.color + 'CC', level.color + '66'] : 
                      ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fitnessGradient}
                  />
                  <View style={styles.fitnessContent}>
                    <Text style={styles.fitnessText}>{level.label}</Text>
                    <Activity size={18} color={fitnessLevel === level.id ? level.color : 'rgba(255,255,255,0.5)'} />
                  </View>
                  {fitnessLevel === level.id && (
                    <View style={styles.checkIconContainer}>
                      <CircleCheck size={20} color={level.color} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        <Animated.View 
          entering={FadeInDown.delay(1900).duration(800)}
          style={styles.buttonContainer}
        >
          <Animated.View style={[
            styles.buttonGlow,
            buttonGlowStyle
          ]}>
            <BlurView intensity={90} tint="dark" style={styles.buttonGlowBlur} />
          </Animated.View>
          
          <View style={styles.buttonWrapper}>
            <Animated.View style={buttonAnimStyle}>
              <TouchableOpacity 
                style={[
                  styles.finishButton,
                  !isFormValid && styles.disabledButton
                ]}
                onPress={handleFinish}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isFormValid ? 
                    ['#4FD1C5', '#63B3ED'] : 
                    ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <BlurView intensity={40} tint="dark" style={styles.buttonBlur}>
                    <Text style={styles.finishButtonText}>ANALYZE DATA</Text>
                    <ArrowRight size={20} color="white" />
                  </BlurView>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    borderRadius: 4,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleMask: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: 3,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  aiCardContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  aiIconWrapper: {
    marginRight: 16,
  },
  aiIconContainer: {
    marginRight: 16,
  },
  aiIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  aiMessageContent: {
    flex: 1,
  },
  aiMessageHeader: {
    color: '#4FD1C5',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  aiMessage: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4FD1C5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    height: 56,
    marginBottom: 24,
    overflow: 'hidden',
  },
  inputIconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    height: 56,
  },
  inputSuffix: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  genderOption: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  genderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  selectedOption: {
    borderColor: '#4FD1C5',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  checkIcon: {
    marginLeft: 8,
  },
  fitnessLevelContainer: {
    marginBottom: 24,
  },
  fitnessOption: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 12,
  },
  fitnessGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fitnessContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  fitnessText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  checkIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    position: 'relative',
  },
  buttonWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  buttonGlow: {
    position: 'absolute',
    width: width * 1.5,
    height: 100,
    bottom: 10,
    left: -width * 0.25,
    zIndex: 0,
  },
  buttonGlowBlur: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(79, 209, 197, 0.2)',
  },
  finishButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonBlur: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
    letterSpacing: 1,
  },
});