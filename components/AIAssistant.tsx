import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Pressable } from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeOutDown, 
  SlideInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  withRepeat, 
  withSequence, 
  withDelay,
  interpolate,
  Extrapolate,
  interpolateColor,
  Easing
} from 'react-native-reanimated';
import { Brain, Send, X, Mic, SquareMenu as MenuSquare, PlayCircle, Command, CircleHelp, Sparkles } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample AI responses for demo purposes
const AI_RESPONSES = [
  "Based on your activity, I recommend a high-protein meal like grilled chicken with quinoa and vegetables.",
  "Your workout consistency has improved by 20% this week! Keep it up!",
  "I notice you haven't been sleeping well. Try these 3 stretches before bed to improve sleep quality.",
  "You're currently on track to reach your weight goal in approximately 6 weeks.",
  "Today's tip: Add a 5-minute warm-up before your HIIT session to prevent injuries.",
];

// Separated component for thinking circles animation
const ThinkingCircle = React.memo(({ delay = 0 }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  useEffect(() => {
    const animate = () => {
      scale.value = 0;
      opacity.value = 1;
      
      scale.value = withTiming(1, { duration: 1200 });
      opacity.value = withTiming(0, { duration: 1200 });
    };
    
    const timer = setTimeout(() => {
      animate();
      const interval = setInterval(animate, 1200);
      return () => clearInterval(interval);
    }, delay);
    
    return () => {
      clearTimeout(timer);
      scale.value = 0;
      opacity.value = 0;
    };
  }, [delay, scale, opacity]);
  
  return <Animated.View style={[styles.thinkingCircle, animatedStyle]} />;
});

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
}

export default function AIAssistant({ onClose }: AIAssistantProps) {
  // All state declarations
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI fitness assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions] = useState([
    "What should I eat after my workout?",
    "Give me a quick 10-minute exercise",
    "How can I improve my sleep?",
    "Am I on track with my goals?",
  ]);
  
  // All refs
  const scrollViewRef = useRef<ScrollView>(null);
  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);
  
  // All shared values - declare at top level, not in useMemo
  const containerHeight = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const brainPulse = useSharedValue(1);
  const micWaveScale = useSharedValue(0);
  const inputFocus = useSharedValue(0);
  const thinkingProgress = useSharedValue(0);
  
  // Voice lines - declared at top level
  const voiceLine1 = useSharedValue(0);
  const voiceLine2 = useSharedValue(0);
  const voiceLine3 = useSharedValue(0);
  const voiceLine4 = useSharedValue(0);
  const voiceLine5 = useSharedValue(0);
  const voiceLines = [voiceLine1, voiceLine2, voiceLine3, voiceLine4, voiceLine5];
  
  // All animated styles - define at top level, not inside useMemo
  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
    transform: [
      { translateY: interpolate(
          containerHeight.value, 
          [0, SCREEN_HEIGHT * 0.8], 
          [SCREEN_HEIGHT * 0.8, 0],
          Extrapolate.CLAMP
        ) 
      }
    ]
  }));
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0 ? 'auto' as const : 'none' as const,
  }));
  
  const brainStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: brainPulse.value }
    ]
  }));
  
  const brainHaloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(brainPulse.value, [1, 1.2], [0.5, 0]),
    transform: [
      { scale: interpolate(brainPulse.value, [1, 1.2], [1, 1.5]) }
    ]
  }));
  
  const micWaveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(micWaveScale.value, [1, 1.5], [0.2, 0]),
    transform: [
      { scale: micWaveScale.value }
    ]
  }));
  
  const inputContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      inputFocus.value,
      [0, 1],
      ['rgba(0, 0, 0, 0.04)', 'rgba(37, 99, 235, 0.08)']
    ),
    borderColor: interpolateColor(
      inputFocus.value,
      [0, 1],
      ['transparent', 'rgba(37, 99, 235, 0.3)']
    ),
  }));
  
  // Voice line styles - created separately for each line
  const voiceLineStyle1 = useAnimatedStyle(() => ({
    height: `${voiceLine1.value * 100}%`,
    opacity: voiceLine1.value,
  }));
  
  const voiceLineStyle2 = useAnimatedStyle(() => ({
    height: `${voiceLine2.value * 100}%`,
    opacity: voiceLine2.value,
  }));
  
  const voiceLineStyle3 = useAnimatedStyle(() => ({
    height: `${voiceLine3.value * 100}%`,
    opacity: voiceLine3.value,
  }));
  
  const voiceLineStyle4 = useAnimatedStyle(() => ({
    height: `${voiceLine4.value * 100}%`,
    opacity: voiceLine4.value,
  }));
  
  const voiceLineStyle5 = useAnimatedStyle(() => ({
    height: `${voiceLine5.value * 100}%`,
    opacity: voiceLine5.value,
  }));
  
  const voiceLineStyles = [
    voiceLineStyle1, 
    voiceLineStyle2, 
    voiceLineStyle3, 
    voiceLineStyle4, 
    voiceLineStyle5
  ];
  
  // Brain pulse animation
  useEffect(() => {
    brainPulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    return () => {
      brainPulse.value = 1;
    };
  }, []);
  
  // Clear animation timers on unmount
  useEffect(() => {
    return () => {
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  // Voice visualization effect
  useEffect(() => {
    // Clear any existing timers
    animationTimersRef.current.forEach(timer => clearTimeout(timer));
    animationTimersRef.current = [];
    
    if (isRecording) {
      micWaveScale.value = withRepeat(
        withTiming(1.5, { duration: 1500 }),
        -1,
        false
      );
      
      // Non-recursive approach using setTimeout
      voiceLines.forEach((line, index) => {
        const startAnimating = () => {
          if (!isRecording) return;
          
          const randomHeight = Math.random() * 0.8 + 0.2;
          const duration = Math.random() * 300 + 200;
          const nextDelay = Math.random() * 200 + 100;
          
          line.value = withTiming(randomHeight, { duration });
          
          // Schedule next animation
          const timer = setTimeout(startAnimating, duration + nextDelay);
          animationTimersRef.current.push(timer);
        };
        
        // Start with a staggered delay
        const timer = setTimeout(startAnimating, index * 100);
        animationTimersRef.current.push(timer);
      });
      
    } else {
      micWaveScale.value = withTiming(0);
      voiceLines.forEach((line) => {
        line.value = withTiming(0);
      });
    }
    
    return () => {
      micWaveScale.value = 0;
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [isRecording]);
  
  // Container animation
  useEffect(() => {
    containerHeight.value = withTiming(SCREEN_HEIGHT * 0.8, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    overlayOpacity.value = withTiming(0.5, { duration: 300 });
    
    return () => {
      containerHeight.value = withTiming(0, { duration: 300 });
      overlayOpacity.value = withTiming(0, { duration: 200 });
    };
  }, []);
  
  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollViewRef.current) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);
  
  // Thinking animation
  useEffect(() => {
    if (isThinking) {
      thinkingProgress.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        false
      );
    } else {
      thinkingProgress.value = withTiming(0);
    }
    
    return () => {
      thinkingProgress.value = 0;
    };
  }, [isThinking]);
  
  // Handler functions
  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);
    
    // Simulate AI thinking with a delay
    const timer = setTimeout(() => {
      // Pick a random response for demo
      const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
      const randomResponse = AI_RESPONSES[randomIndex];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setIsThinking(false);
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
    
    animationTimersRef.current.push(timer);
  };
  
  // Get a new suggestion
  const getNewSuggestion = (currentSuggestions: string[]): string => {
    const allSuggestions = [
      "What should I eat after my workout?",
      "Give me a quick 10-minute exercise",
      "How can I improve my sleep?",
      "Am I on track with my goals?",
      "Recommend a good stretch routine",
      "Help me plan tomorrow's workout",
      "How many calories should I eat?",
      "Why am I feeling sore today?",
    ];
    
    // Filter out current suggestions
    const availableSuggestions = allSuggestions.filter(
      s => !currentSuggestions.includes(s)
    );
    
    if (availableSuggestions.length === 0) return allSuggestions[0];
    
    return availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)];
  };
  
  // Handle suggestion press
  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    
    // Implement separately instead of using useState callback to avoid hook issues
    const filtered = suggestions.filter(s => s !== suggestion);
    const newSuggestion = getNewSuggestion(suggestions);
    const newSuggestions = [...filtered, newSuggestion];
    // Note: we're not updating suggestions state to simplify the component
  };
  
  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Simulate voice recording for demo
    if (!isRecording) {
      const timer = setTimeout(() => {
        setIsRecording(false);
        setInputText("Show me some exercise alternatives for lower back pain");
      }, 3000);
      
      animationTimersRef.current.push(timer);
    }
  };
  
  // Input focus handlers
  const handleInputFocus = () => {
    inputFocus.value = withTiming(1, { duration: 200 });
  };
  
  const handleInputBlur = () => {
    inputFocus.value = withTiming(0, { duration: 200 });
  };
  
  // Action button handler
  const handleActionButton = () => {
    if (isRecording) {
      toggleRecording();
    } else if (inputText.trim()) {
      handleSend();
    } else {
      toggleRecording();
    }
  };

  return (
    <>
      <Animated.View 
        style={[styles.overlay, overlayStyle]} 
        onTouchEnd={onClose}
      />
      
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View style={[styles.brainHalo, brainHaloStyle]} />
            <Animated.View style={[styles.brainContainer, brainStyle]}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                style={styles.brainGradient}
              >
                <Brain size={20} color="white" />
              </LinearGradient>
            </Animated.View>
            <MaskedView
              style={styles.titleMaskContainer}
              maskElement={
                <Text style={styles.aiTitle}>
                  AI Fitness Assistant
                </Text>
              }
            >
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={SlideInRight.duration(300).delay(index * 50)}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
              ]}
            >
              {!message.isUser && (
                <Animated.View 
                  style={styles.avatarContainer}
                  entering={FadeInUp.duration(200)}
                >
                  <LinearGradient
                    colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                    style={styles.aiMessageIcon}
                  >
                    <Brain size={16} color="white" />
                  </LinearGradient>
                </Animated.View>
              )}
              
              {message.isUser ? (
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.messageBubble, styles.userMessageBubble]}
                >
                  <Text style={styles.userMessageText}>{message.text}</Text>
                </LinearGradient>
              ) : (
                <BlurView 
                  intensity={10} 
                  tint="light"
                  style={[styles.messageBubble, styles.aiMessageBubble]}
                >
                  <Text style={styles.aiMessageText}>{message.text}</Text>
                </BlurView>
              )}
              
              {message.isUser && (
                <View style={styles.userIconContainer}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.userIcon}
                  />
                </View>
              )}
            </Animated.View>
          ))}
          
          {/* AI Thinking display */}
          {isThinking && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={[styles.messageContainer, styles.aiMessageContainer]}
            >
              <Animated.View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                  style={styles.aiMessageIcon}
                >
                  <Brain size={16} color="white" />
                </LinearGradient>
              </Animated.View>
              
              <BlurView 
                intensity={10} 
                tint="light"
                style={[styles.messageBubble, styles.aiMessageBubble]}
              >
                <View style={styles.thinkingContainer}>
                  <View style={styles.thinkingCircles}>
                    {[0, 1, 2].map((idx) => (
                      <ThinkingCircle key={idx} delay={idx * 400} />
                    ))}
                  </View>
                  <Text style={styles.thinkingText}>Thinking...</Text>
                </View>
              </BlurView>
            </Animated.View>
          )}
        </ScrollView>
        
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleSuggestionPress(suggestion)}
                activeOpacity={0.7}
              >
                <BlurView
                  intensity={10}
                  tint="light" 
                  style={styles.suggestionBlur}
                >
                  <LinearGradient
                    colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.25)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.suggestionGradient}
                  >
                    {index % 4 === 0 && <Command size={14} color={theme.colors.primary} style={styles.suggestionIcon} />}
                    {index % 4 === 1 && <Sparkles size={14} color={theme.colors.primary} style={styles.suggestionIcon} />}
                    {index % 4 === 2 && <PlayCircle size={14} color={theme.colors.primary} style={styles.suggestionIcon} />}
                    {index % 4 === 3 && <CircleHelp size={14} color={theme.colors.primary} style={styles.suggestionIcon} />}
                    <Text style={styles.suggestionText} numberOfLines={1}>
                      {suggestion}
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
          style={styles.inputContainer}
        >
          <Animated.View style={[styles.inputWrapper, inputContainerStyle]}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything about fitness or nutrition..."
              placeholderTextColor={theme.colors.textLight}
              value={inputText}
              onChangeText={setInputText}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              multiline
              maxLength={200}
            />
          </Animated.View>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isRecording ? styles.recordingButton : null
            ]}
            onPress={handleActionButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isRecording ? 
                ['#ef4444', '#dc2626', '#b91c1c'] : 
                ['#3b82f6', '#2563eb', '#1d4ed8']
              }
              style={styles.actionGradient}
            >
              {isRecording ? (
                <>
                  <Animated.View style={[styles.micWave, micWaveStyle]} />
                  <Mic size={24} color="white" />
                  
                  <View style={styles.voiceVisualizerContainer}>
                    {voiceLines.map((_, index) => (
                      <Animated.View 
                        key={index} 
                        style={[styles.voiceLine, voiceLineStyles[index]]} 
                      />
                    ))}
                  </View>
                </>
              ) : inputText.trim() ? (
                <Send size={24} color="white" />
              ) : (
                <Mic size={24} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brainContainer: {
    marginRight: 12,
  },
  brainGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainHalo: {
    position: 'absolute',
    left: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
  },
  titleMaskContainer: {
    height: 28,
    flex: 1,
  },
  aiTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: 'black',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '90%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    paddingBottom: 8,
  },
  aiMessageIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '90%',
  },
  userMessageBubble: {
    borderTopRightRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  aiMessageBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderTopLeftRadius: 4,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  aiMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text,
    fontFamily: 'Poppins-Regular',
  },
  userIconContainer: {
    width: 10,
    height: 10,
    alignSelf: 'flex-end',
    marginLeft: 4,
    marginBottom: 8,
  },
  userIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  thinkingCircles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    height: 20,
    width: 40,
    position: 'relative',
  },
  thinkingCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  thinkingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  suggestionsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  suggestionsContent: {
    paddingHorizontal: 16,
  },
  suggestionButton: {
    marginRight: 10,
    borderRadius: 24,
    overflow: 'hidden',
  },
  suggestionBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  suggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: 200,
    borderRadius: 24,
  },
  suggestionIcon: {
    marginRight: 6,
  },
  suggestionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.text,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  actionGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    width: 100,
    borderRadius: 25,
  },
  micWave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#ef4444',
  },
  voiceVisualizerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '60%',
    width: '50%',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    left: 40,
  },
  voiceLine: {
    width: 3,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});