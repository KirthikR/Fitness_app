import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence, 
  withRepeat, 
  Easing,
  useAnimatedScrollHandler,
  runOnJS
} from 'react-native-reanimated';
import { ChevronLeft, Mail, Lock, LogIn, Fingerprint, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Neural network grid visualization
const NeuralGrid = () => {
  const NODES = 24;
  const CONNECTIONS = 12;
  
  // Generate random positions for nodes
  const nodes = Array.from({ length: NODES }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.5,
    size: 2 + Math.random() * 4
  }));
  
  // Generate random connections between nodes
  const connections = Array.from({ length: CONNECTIONS }).map(() => {
    const fromIndex = Math.floor(Math.random() * NODES);
    let toIndex = Math.floor(Math.random() * NODES);
    while (toIndex === fromIndex) {
      toIndex = Math.floor(Math.random() * NODES);
    }
    return { from: fromIndex, to: toIndex };
  });

  return (
    <View style={styles.neuralContainer}>
      {connections.map((connection, i) => {
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];
        
        // Calculate line properties
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const length = Math.sqrt(dx * dx + dy * dy);
        
        return (
          <Animated.View 
            key={`c-${i}`}
            style={[
              styles.connection,
              {
                width: length,
                left: fromNode.x,
                top: fromNode.y,
                transform: [{ rotate: `${angle}deg` }],
              }
            ]}
            entering={FadeIn.delay(300 + i * 200).duration(800)}
          />
        );
      })}
      
      {nodes.map((node, i) => (
        <Animated.View 
          key={`n-${i}`}
          style={[
            styles.node,
            {
              width: node.size,
              height: node.size,
              left: node.x,
              top: node.y,
              backgroundColor: i % 3 === 0 ? '#4FD1C5' : i % 3 === 1 ? '#63B3ED' : '#B794F4',
            }
          ]}
          entering={FadeIn.delay(100 + i * 50).duration(1000)}
        />
      ))}
    </View>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation values
  const backgroundY = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const emailFocus = useSharedValue(0);
  const passwordFocus = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const pulseAnim = useSharedValue(0);
  
  useEffect(() => {
    // Start animations when component mounts
    formOpacity.value = withTiming(1, { duration: 1000 });
    
    // Pulse animation for biometric button
    pulseAnim.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    
    // Subtle background scroll
    backgroundY.value = withRepeat(
      withTiming(10, { duration: 20000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);
  
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: backgroundY.value }]
    };
  });
  
  const handleEmailFocus = (focused: boolean) => {
    emailFocus.value = withTiming(focused ? 1 : 0, { duration: 200 });
  };
  
  const handlePasswordFocus = (focused: boolean) => {
    passwordFocus.value = withTiming(focused ? 1 : 0, { duration: 200 });
  };
  
  const emailContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolate(
        emailFocus.value,
        [0, 1],
        ['rgba(255, 255, 255, 0.2)', '#4FD1C5']
      ),
      transform: [
        { 
          scale: interpolate(
            emailFocus.value,
            [0, 1],
            [1, 1.02]
          ) 
        }
      ]
    };
  });
  
  const passwordContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolate(
        passwordFocus.value,
        [0, 1],
        ['rgba(255, 255, 255, 0.2)', '#63B3ED']
      ),
      transform: [
        { 
          scale: interpolate(
            passwordFocus.value,
            [0, 1],
            [1, 1.02]
          ) 
        }
      ]
    };
  });
  
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pulseAnim.value,
      [0, 0.5, 1],
      [1, 1.12, 1]
    );
    
    return {
      transform: [{ scale }],
      opacity: interpolate(
        pulseAnim.value,
        [0, 0.5, 1],
        [0.8, 1, 0.8]
      )
    };
  });
  
  const handleLogin = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 }, () => {
        runOnJS(navigateToMain)();
      })
    );
  };
  
  const navigateToMain = () => {
    router.push('/user-info');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      
      {/* Animated Background */}
      <AnimatedLinearGradient
        colors={['#0a0c1a', '#172448', '#132240', '#0a1018']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.backgroundGradient, backgroundStyle]}
      />
      
      {/* Neural Network Visualization */}
      <NeuralGrid />
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <AnimatedBlurView intensity={70} tint="dark" style={styles.blurButton}>
          <ChevronLeft size={24} color="white" />
        </AnimatedBlurView>
      </TouchableOpacity>
      
      <Animated.View style={[styles.contentContainer, { opacity: formOpacity }]}>
        <View style={styles.headerContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.title}
          >
            Login to FITPRO
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.subtitle}
          >
            Your AI fitness journey awaits
          </Animated.Text>
        </View>
        
        <Animated.View
          entering={FadeInDown.delay(500).duration(800)}
          style={[styles.inputContainer, emailContainerStyle]}
        >
          <View style={styles.iconContainer}>
            <Mail size={18} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleEmailFocus(true)}
            onBlur={() => handleEmailFocus(false)}
          />
        </Animated.View>
        
        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={[styles.inputContainer, passwordContainerStyle]}
        >
          <View style={styles.iconContainer}>
            <Lock size={18} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => handlePasswordFocus(true)}
            onBlur={() => handlePasswordFocus(false)}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={18} color="rgba(255,255,255,0.7)" />
            ) : (
              <Eye size={18} color="rgba(255,255,255,0.7)" />
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          style={styles.forgotContainer}
        >
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4FD1C5', '#63B3ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>LOGIN</Text>
                <LogIn size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        
        <Animated.View
          entering={FadeInDown.delay(900).duration(800)}
          style={styles.orContainer}
        >
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </Animated.View>
        
        <Animated.View
          entering={FadeInDown.delay(1000).duration(800)}
          style={styles.biometricContainer}
        >
          <Animated.View style={pulseStyle}>
            <TouchableOpacity style={styles.biometricButton}>
              <LinearGradient
                colors={['rgba(79, 209, 197, 0.2)', 'rgba(99, 179, 237, 0.2)']}
                style={styles.biometricGradient}
              >
                <Fingerprint size={30} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.biometricText}>Login with biometrics</Text>
        </Animated.View>
        
        <Animated.View
          entering={FadeInDown.delay(1100).duration(800)}
          style={styles.signupContainer}
        >
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(onboarding)/signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0c1a',
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: height * 2,
    top: -height / 2,
  },
  neuralContainer: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.5,
  },
  node: {
    position: 'absolute',
    borderRadius: 4,
  },
  connection: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transformOrigin: 'left',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
    height: 60,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  input: {
    flex: 1,
    height: 60,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'white',
  },
  eyeIcon: {
    padding: 15,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#63B3ED',
    fontSize: 14,
  },
  loginButton: {
    width: width - 60,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4FD1C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    letterSpacing: 1,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orText: {
    color: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  biometricContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  biometricButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  biometricGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
  },
  biometricText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  signupLink: {
    color: '#4FD1C5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});