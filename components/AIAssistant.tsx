import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, SlideInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Brain, Send, X, Mic, SquareMenu as MenuSquare } from 'lucide-react-native';
import { theme } from '@/constants/theme';

// Sample AI responses for demo purposes
const AI_RESPONSES = [
  "Based on your activity, I recommend a high-protein meal like grilled chicken with quinoa and vegetables.",
  "Your workout consistency has improved by 20% this week! Keep it up!",
  "I notice you haven't been sleeping well. Try these 3 stretches before bed to improve sleep quality.",
  "You're currently on track to reach your weight goal in approximately 6 weeks.",
  "Today's tip: Add a 5-minute warm-up before your HIIT session to prevent injuries.",
];

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
  const [suggestions, setSuggestions] = useState([
    "What should I eat after my workout?",
    "Give me a quick 10-minute exercise",
    "How can I improve my sleep?",
    "Am I on track with my goals?",
  ]);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const containerHeight = useSharedValue(0);
  
  const containerStyle = useAnimatedStyle(() => ({
    height: withSpring(containerHeight.value, { 
      damping: 20, 
      stiffness: 90 
    })
  }));
  
  useEffect(() => {
    containerHeight.value = 500; // Open animation
    return () => {
      containerHeight.value = 0; // Close animation when unmounting
    };
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
    
    // Simulate AI thinking with a delay
    setTimeout(() => {
      // Pick a random response for demo
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };
  
  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    
    // Remove the selected suggestion and add a new one
    setSuggestions(prev => {
      const filtered = prev.filter(s => s !== suggestion);
      const newSuggestion = getNewSuggestion(prev);
      return [...filtered, newSuggestion];
    });
  };
  
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
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Simulate voice recording for demo
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText("Show me some exercise alternatives for lower back pain");
      }, 3000);
    }
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <View style={styles.aiContainer}>
          <View style={styles.aiIconContainer}>
            <Brain size={24} color="white" />
          </View>
          <Text style={styles.aiTitle}>AI Fitness Assistant</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <Animated.View
            key={message.id}
            entering={SlideInRight.duration(300)}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
            ]}
          >
            {!message.isUser && (
              <View style={styles.avatarContainer}>
                <View style={styles.aiMessageIcon}>
                  <Brain size={16} color="white" />
                </View>
              </View>
            )}
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userMessageBubble : styles.aiMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          </Animated.View>
        ))}
        
        {/* Typing indicator - shown when AI is "thinking" */}
        {messages[messages.length - 1]?.isUser && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutDown.duration(300)}
            style={[styles.messageContainer, styles.aiMessageContainer]}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.aiMessageIcon}>
                <Brain size={16} color="white" />
              </View>
            </View>
            <View style={[styles.messageBubble, styles.aiMessageBubble, styles.typingBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDotMiddle]} />
                <View style={styles.typingDot} />
              </View>
            </View>
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
            >
              <MenuSquare size={14} color={theme.colors.primary} style={styles.suggestionIcon} />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Ask anything about fitness or nutrition..."
          placeholderTextColor={theme.colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
        />
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            isRecording ? styles.recordingButton : null
          ]}
          onPress={isRecording ? toggleRecording : inputText.trim() ? handleSend : toggleRecording}
        >
          {isRecording ? (
            <Mic size={24} color="white" />
          ) : inputText.trim() ? (
            <Send size={24} color="white" />
          ) : (
            <Mic size={24} color="white" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  aiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
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
    paddingTop: 16,
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
    paddingBottom: 6,
  },
  aiMessageIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '90%',
  },
  userMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  aiMessageText: {
    color: theme.colors.text,
    fontFamily: 'Poppins-Regular',
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textLight,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  typingDotMiddle: {
    opacity: 0.4,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  suggestionsContent: {
    paddingHorizontal: 16,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    maxWidth: 200,
  },
  suggestionIcon: {
    marginRight: 4,
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: theme.colors.error,
  },
});