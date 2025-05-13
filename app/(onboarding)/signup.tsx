import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions, 
  StatusBar, 
  ScrollView 
} from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withRepeat, 
  withDelay,
  interpolate,
  Easing,
  runOnJS,
  cancelAnimation,
  LinearTransition,
  FadeIn
} from 'react-native-reanimated';
import { 
  ChevronLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight, 
  Brain, 
  Shield, 
  RefreshCw, 
  Activity, 
  Dumbbell,
  Flame,
  Zap,
  LineChart,
  HeartPulse
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Define these constants at the file level
const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Define window dimensions safely with a hook for updates
function useWindowDimensions() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  return dimensions;
}

// Radial gradient component
const RadialGradient = () => {
  const dimensions = useWindowDimensions();
  
  return (
    <View style={styles.radialGradient}>
      <View style={[
        styles.radialInner,
        { borderRadius: dimensions.width }
      ]} />
    </View>
  );
};

// Particle animation component
const ParticleField = () => {
  const dimensions = useWindowDimensions();
  
  // Create particles array with shared values at the top level
  const particles = useMemo(() => 
    Array.from({ length: 30 }).map(() => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: 1.5 + Math.random() * 3,
      speedX: -0.2 + Math.random() * 0.4,
      speedY: -0.2 + Math.random() * 0.4,
      opacity: 0.3 + Math.random() * 0.4,
      animValue: useSharedValue(0)
    })),
  [dimensions]);
  
  // Setup animations
  useEffect(() => {
    // Animate each particle
    particles.forEach(particle => {
      particle.animValue.value = withRepeat(
        withTiming(1, { duration: 8000 + Math.random() * 10000, easing: Easing.linear }),
        -1,
        false
      );
    });
    
    return () => {
      // Cleanup animations
      particles.forEach(particle => {
        cancelAnimation(particle.animValue);
      });
    };
  }, [particles]);
  
  // Render the particles
  return (
    <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>
      {particles.map((particle, index) => {
        // Pre-calculate styles outside of the render loop
        const particleStyle = useAnimatedStyle(() => {
          return {
            opacity: interpolate(
              particle.animValue.value,
              [0, 0.5, 1],
              [particle.opacity, particle.opacity + 0.2, particle.opacity]
            ),
            transform: [
              {
                translateX: interpolate(
                  particle.animValue.value,
                  [0, 1],
                  [0, particle.speedX * dimensions.width]
                )
              },
              {
                translateY: interpolate(
                  particle.animValue.value,
                  [0, 1],
                  [0, particle.speedY * dimensions.height]
                )
              },
              {
                scale: interpolate(
                  particle.animValue.value,
                  [0, 0.5, 1],
                  [1, 1.2, 1]
                )
              }
            ]
          };
        });
        
        // Color based on index for variety
        const particleColor = index % 5 === 0 
          ? '#4FD1C5' 
          : index % 5 === 1 
            ? '#63B3ED' 
            : index % 5 === 2 
              ? '#B794F4' 
              : index % 5 === 3 
                ? '#F687B3'
                : '#48BB78';
        
        return (
          <Animated.View
            key={`particle-${index}`}
            style={[
              styles.particle,
              {
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: particleColor,
                left: particle.x,
                top: particle.y,
              },
              particleStyle
            ]}
          />
        );
      })}
    </View>
  );
};

// Neural network node connection effect
const NeuralConnections = () => {
  const dimensions = useWindowDimensions();
  
  // Create nodes array with shared values at the top level
  const nodes = useMemo(() => 
    Array.from({ length: 15 }).map(() => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      pulseValue: useSharedValue(0)
    })),
  [dimensions]);
  
  // Setup animations
  useEffect(() => {
    // Create pulsing effect for each node
    nodes.forEach((node, index) => {
      node.pulseValue.value = withDelay(
        index * 200,
        withRepeat(
          withTiming(1, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        )
      );
    });
    
    return () => {
      // Cleanup animations
      nodes.forEach(node => {
        cancelAnimation(node.pulseValue);
      });
    };
  }, [nodes]);
  
  // Pre-calculate connections
  const connections = useMemo(() => {
    const result = [];
    
    nodes.forEach((node, i) => {
      nodes.forEach((node2, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(node.x - node2.x, 2) + Math.pow(node.y - node2.y, 2)
          );
          
          // Only connect relatively close nodes
          if (distance <= dimensions.width * 0.6) {
            result.push({
              id: `connection-${i}-${j}`,
              node1: node,
              node2: node2,
              distance,
              left: Math.min(node.x, node2.x),
              top: Math.min(node.y, node2.y),
              translateX: (node.x < node2.x ? 0 : distance),
              translateY: (node.y < node2.y ? 0 : distance),
              rotateZ: Math.atan2(node2.y - node.y, node2.x - node.x)
            });
          }
        }
      });
    });
    
    return result;
  }, [nodes, dimensions.width]);
  
  return (
    <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>
      {connections.map((connection) => {
        const connectionStyle = useAnimatedStyle(() => {
          return {
            opacity: interpolate(
              connection.node1.pulseValue.value + connection.node2.pulseValue.value,
              [0, 1, 2],
              [0.05, 0.2, 0.05]
            ),
            width: connection.distance,
            left: connection.left,
            top: connection.top,
            transform: [
              { translateX: connection.translateX },
              { translateY: connection.translateY },
              { rotateZ: `${connection.rotateZ}rad` }
            ]
          };
        });
        
        return (
          <Animated.View 
            key={connection.id}
            style={[styles.neuralConnection, connectionStyle]} 
          />
        );
      })}
    </View>
  );
};

// Adding the missing HolographicScanner component
const HolographicScanner = () => {
  const scanProgress = useSharedValue(0);
  const glowOpacity = useSharedValue(0.6);
  const rotationValue = useSharedValue(0);
  
  // Setup animations
  useEffect(() => {
    // Scanning animation
    scanProgress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Glow effect animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Rotation animation
    rotationValue.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );
    
    return () => {
      // Cleanup animations
      cancelAnimation(scanProgress);
      cancelAnimation(glowOpacity);
      cancelAnimation(rotationValue);
    };
  }, []);
  
  // Animation styles
  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ 
      translateY: interpolate(
        scanProgress.value,
        [0, 0.5, 1],
        [0, 110, 0]
      )
    }],
    opacity: interpolate(
      scanProgress.value,
      [0, 0.5, 1],
      [0.8, 1, 0.8]
    )
  }));
  
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }]
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value
  }));
  
  // Pre-compute binary digits
  const binaryRows = useMemo(() => {
    return Array.from({ length: 5 }).map((_, rowIndex) => ({
      id: `row-${rowIndex}`,
      digits: Array.from({ length: 10 }).map((_, colIndex) => ({
        id: `binary-${rowIndex}-${colIndex}`,
        value: Math.random() > 0.5 ? '1' : '0',
        opacity: Math.random() > 0.5 ? 0.8 : 0.3
      }))
    }));
  }, []);
  
  return (
    <View style={styles.scannerContainer}>
      {/* Outer rotating ring */}
      <Animated.View style={[styles.scannerRing, ringStyle]}>
        <View style={styles.ringAccent} />
        <View style={[styles.ringAccent, { transform: [{ rotate: '90deg' }] }]} />
        <View style={[styles.ringAccent, { transform: [{ rotate: '180deg' }] }]} />
        <View style={[styles.ringAccent, { transform: [{ rotate: '270deg' }] }]} />
      </Animated.View>
      
      {/* Main scanner frame */}
      <View style={styles.scannerFrame}>
        {/* Corner elements */}
        <View style={styles.scannerCorner} />
        <View style={[styles.scannerCorner, { top: 0, right: 0, transform: [{ rotate: '90deg' }] }]} />
        <View style={[styles.scannerCorner, { bottom: 0, right: 0, transform: [{ rotate: '180deg' }] }]} />
        <View style={[styles.scannerCorner, { bottom: 0, left: 0, transform: [{ rotate: '270deg' }] }]} />
        
        {/* Inner glow */}
        <Animated.View style={[styles.scannerGlow, glowStyle]}>
          <LinearGradient
            colors={['rgba(79, 209, 197, 0)', 'rgba(79, 209, 197, 0.1)', 'rgba(79, 209, 197, 0)']}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        
        {/* Scanning line */}
        <Animated.View style={[styles.scanLine, scanLineStyle]}>
          <LinearGradient
            colors={['rgba(79, 209, 197, 0)', 'rgba(79, 209, 197, 0.8)', 'rgba(79, 209, 197, 0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.scanLineGradient}
          />
        </Animated.View>
        
        {/* Binary code pattern */}
        <View style={styles.binaryPattern}>
          {binaryRows.map((row) => (
            <View key={row.id} style={styles.binaryRow}>
              {row.digits.map((digit) => (
                <Text 
                  key={digit.id} 
                  style={[styles.binaryDigit, { opacity: digit.opacity }]}
                >
                  {digit.value}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// Adding the missing HealthMetricsViz component
const HealthMetricsViz = () => {
  // Pre-define metrics with shared values
  const metrics = useMemo(() => [
    { id: 'metric-flame', icon: Flame, color: '#F56565', value: useSharedValue(0) },
    { id: 'metric-heart', icon: HeartPulse, color: '#ED64A6', value: useSharedValue(0) },
    { id: 'metric-activity', icon: Activity, color: '#4FD1C5', value: useSharedValue(0) },
    { id: 'metric-chart', icon: LineChart, color: '#63B3ED', value: useSharedValue(0) },
    { id: 'metric-dumbbell', icon: Dumbbell, color: '#9F7AEA', value: useSharedValue(0) }
  ], []);
  
  // Setup animations
  useEffect(() => {
    // Animate metrics with staggered start
    metrics.forEach((metric, index) => {
      metric.value.value = withDelay(
        index * 300,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1,
          true
        )
      );
    });
    
    return () => {
      // Cleanup animations
      metrics.forEach(metric => {
        cancelAnimation(metric.value);
      });
    };
  }, [metrics]);
  
  return (
    <View style={styles.metricsContainer}>
      {metrics.map((metric) => {
        const metricStyle = useAnimatedStyle(() => ({
          opacity: interpolate(
            metric.value.value,
            [0, 0.5, 1],
            [0.5, 1, 0.5]
          ),
          transform: [{
            scale: interpolate(
              metric.value.value,
              [0, 0.5, 1],
              [1, 1.1, 1]
            )
          }]
        }));
        
        const MetricIcon = metric.icon;
        
        return (
          <Animated.View 
            key={metric.id}
            style={[styles.metricItem, metricStyle]}
          >
            <LinearGradient
              colors={[`${metric.color}60`, `${metric.color}20`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.metricGradient}
            >
              <MetricIcon size={12} color={metric.color} />
            </LinearGradient>
          </Animated.View>
        );
      })}
    </View>
  );
};

// Password strength component with fixed hooks
const PasswordStrengthIndicator = ({ password, validations }) => {
  const fillAnimation = useSharedValue(0);
  
  // Update strength on password change
  useEffect(() => {
    const strength = Math.min(1, password.length / 10);
    fillAnimation.value = withTiming(strength, { duration: 300 });
  }, [password]);
  
  const getBackgroundColor = (value) => {
    if (value >= 0.8) return '#48BB78';
    if (value >= 0.6) return '#ECC94B';
    if (value >= 0.3) return '#ED8936';
    return '#F56565';
  };
  
  // Pre-define animated styles
  const fillStyle = useAnimatedStyle(() => {
    const widthPercentage = `${fillAnimation.value * 100}%`;
    return {
      width: widthPercentage,
      backgroundColor: getBackgroundColor(fillAnimation.value)
    };
  });
  
  return (
    <View style={styles.passwordValidation}>
      <View style={styles.strengthBar}>
        <Animated.View style={[styles.strengthFill, fillStyle]} />
      </View>
      
      <View style={styles.validationRules}>
        {validations.map((rule, index) => (
          <View key={`rule-${index}`} style={styles.validationRule}>
            <View style={[
              styles.validationCircle,
              rule.isValid ? styles.validationValid : {}
            ]}>
              {rule.isValid && <Check size={10} color="#fff" />}
            </View>
            <Text style={styles.validationText}>{rule.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function SignupScreen() {
  const dimensions = useWindowDimensions();
  // Input state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Focus state
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Validation state
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [processingSignup, setProcessingSignup] = useState(false);
  
  // Password validation rules
  const passwordValidations = useMemo(() => [
    { label: 'At least 8 characters', isValid: password.length >= 8 },
    { label: 'Contains uppercase letter', isValid: /[A-Z]/.test(password) },
    { label: 'Contains number', isValid: /[0-9]/.test(password) },
    { label: 'Contains special character', isValid: /[^A-Za-z0-9]/.test(password) }
  ], [password]);
  
  // Define all animation values
  const formOpacity = useSharedValue(0);
  const backgroundY = useSharedValue(0);
  const nameFieldScale = useSharedValue(1);
  const emailFieldScale = useSharedValue(1);
  const passwordFieldScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const processingRotation = useSharedValue(0);
  const highlightPosition = useSharedValue(0);
  const shimmerOpacity = useSharedValue(0);
  const energyPulse = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const logoGlow = useSharedValue(0.5);

  // Error state
  const [hasError, setHasError] = useState(false);
  
  // Validate inputs
  useEffect(() => {
    setNameValid(name.length >= 3);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    setPasswordValid(
      password.length >= 8 && 
      /[A-Z]/.test(password) && 
      /[0-9]/.test(password) && 
      /[^A-Za-z0-9]/.test(password)
    );
  }, [name, email, password]);
  
  // Setup animations
  useEffect(() => {
    try {
      // Use React Native's StatusBar directly
      StatusBar.setBarStyle('light-content');
      
      formOpacity.value = withTiming(1, { duration: 1000 });
      
      backgroundY.value = withRepeat(
        withTiming(20, { duration: 20000, easing: Easing.linear }),
        -1,
        true
      );
      
      highlightPosition.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
      
      // Logo animations
      logoRotation.value = withRepeat(
        withTiming(360, { duration: 12000, easing: Easing.linear }),
        -1,
        false
      );
      
      logoGlow.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      
      // Energy pulse animation
      energyPulse.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      // Processing animations
      if (processingSignup) {
        processingRotation.value = withRepeat(
          withTiming(2 * Math.PI, { duration: 1000, easing: Easing.linear }),
          -1,
          false
        );
        
        shimmerOpacity.value = withTiming(1, { duration: 200 });
        
        // Simulate API call and navigate
        setTimeout(() => {
          buttonScale.value = withSequence(
            withTiming(1.05, { duration: 200 }),
            withTiming(1, { duration: 200 }, () => {
              runOnJS(completeSignup)();
            })
          );
        }, 2500);
      } else {
        processingRotation.value = 0;
        shimmerOpacity.value = withTiming(0, { duration: 200 });
      }
    } catch (error) {
      console.error("Animation setup error:", error);
      setHasError(true);
      formOpacity.value = 1;
    }
    
    return () => {
      // Cleanup animations
      cancelAnimation(formOpacity);
      cancelAnimation(backgroundY);
      cancelAnimation(highlightPosition);
      cancelAnimation(logoRotation);
      cancelAnimation(logoGlow);
      cancelAnimation(energyPulse);
      cancelAnimation(processingRotation);
      cancelAnimation(shimmerOpacity);
    };
  }, [processingSignup]);
  
  // Handle input focus
  const handleFocus = (field, focused) => {
    const scaleValue = focused ? 1.02 : 1;
    const config = { duration: 200 };
    
    switch (field) {
      case 'name':
        setNameFocused(focused);
        nameFieldScale.value = withTiming(scaleValue, config);
        break;
      case 'email':
        setEmailFocused(focused);
        emailFieldScale.value = withTiming(scaleValue, config);
        break;
      case 'password':
        setPasswordFocused(focused);
        passwordFieldScale.value = withTiming(scaleValue, config);
        break;
    }
  };
  
  // Handle signup button press
  const handleSignup = () => {
    if (nameValid && emailValid && passwordValid) {
      buttonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 }, () => {
          runOnJS(setProcessingSignup)(true);
        })
      );
    }
  };
  
  // Complete signup process
  const completeSignup = () => {
    setProcessingSignup(false);
    navigateToUserInfo();
  };
  
  // Navigate to user info screen
  const navigateToUserInfo = () => {
    try {
      router.push('/(onboarding)/user-info');
    } catch (error) {
      console.log('Navigation error, redirecting to root');
      router.push('/(onboarding)');
    }
  };

  // Safe handler for back navigation
  const handleBack = () => {
    try {
      router.push('/');
    } catch (error) {
      console.log('Navigation error, redirecting to root');
      router.push('/(onboarding)');
    }
  };
  
  // Animation styles - Fixed to avoid direct .value access
  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: backgroundY.value }],
    width: dimensions.width,
    height: dimensions.height * 2,
    top: -dimensions.height / 2,
  }));
  
  const nameContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nameFieldScale.value }]
  }));
  
  const emailContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emailFieldScale.value }]
  }));
  
  const passwordContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: passwordFieldScale.value }]
  }));
  
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));
  
  const processingIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${processingRotation.value}rad` }]
  }));
  
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
    transform: [{ 
      translateX: interpolate(
        highlightPosition.value,
        [0, 1],
        [-dimensions.width, dimensions.width]
      )
    }]
  }));
  
  const logoRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${logoRotation.value}deg` }]
  }));
  
  const logoGlowStyle = useAnimatedStyle(() => ({
    opacity: logoGlow.value
  }));
  
  const energyPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(energyPulse.value, [0, 0.5, 1], [0, 0.15, 0]),
    transform: [{ 
      scale: interpolate(energyPulse.value, [0, 1], [1, 1.5]) 
    }],
    top: dimensions.height * 0.4,
    left: dimensions.width * 0.5,
    width: dimensions.width * 2,
    height: dimensions.width * 2,
    marginLeft: -dimensions.width,
    marginTop: -dimensions.width,
  }));

  // Safe components with error handling
  const SafeParticleField = () => {
    try {
      return <ParticleField />;
    } catch (error) {
      console.error("ParticleField error:", error);
      return null;
    }
  };

  const SafeNeuralConnections = () => {
    try {
      return <NeuralConnections />;
    } catch (error) {
      console.error("NeuralConnections error:", error);
      return null;
    }
  };

  const SafeHolographicScanner = () => {
    try {
      return <HolographicScanner />;
    } catch (error) {
      console.error("HolographicScanner error:", error);
      return null;
    }
  };

  const SafeHealthMetricsViz = () => {
    try {
      return <HealthMetricsViz />;
    } catch (error) {
      console.error("HealthMetricsViz error:", error);
      return null;
    }
  };

  // Error fallback
  if (hasError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Something went wrong. Please try again.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.reload()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ExpoStatusBar style="light" />
      
      {/* Animated background */}
      <AnimatedLinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.backgroundGradient, backgroundStyle]}
      />
      
      {/* Background effects */}
      <SafeParticleField />
      <SafeNeuralConnections />
      
      {/* Animated energy pulse */}
      <Animated.View style={[styles.energyPulse, energyPulseStyle]}>
        <RadialGradient />
      </Animated.View>
      
      {/* Back button */}
      <Animated.View entering={FadeIn.duration(1000)} style={styles.headerSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <BlurView intensity={90} tint="dark" style={styles.blurButton}>
            <ChevronLeft size={22} color="white" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Wrap the ScrollView and its content to fix layout animation conflicts */}
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Separate container for opacity animation */}
          <View style={{ flex: 1 }}>
            <Animated.View style={{ opacity: formOpacity }}>
              {/* Static wrapper to prevent layout animation conflicts */}
              <View style={styles.staticWrapper}>
                {/* Layout-animated container for form */}
                <Animated.View layout={LinearTransition.duration(500)} style={styles.formContainer}>
                  {/* Logo and title */}
                  <View style={styles.titleContainer}>
                    <View style={styles.logoContainer}>
                      <Animated.View style={[styles.logoRing, logoRotationStyle]}>
                        <View style={styles.ringSegment} />
                        <View style={[styles.ringSegment, { transform: [{ rotate: '180deg' }] }]} />
                      </Animated.View>
                      
                      <LinearGradient
                        colors={['#4FD1C5', '#63B3ED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.logoBackground}
                      >
                        <Animated.View style={logoGlowStyle}>
                          <BlurView intensity={40} tint="light" style={styles.logoGlow} />
                        </Animated.View>
                        <Zap size={28} color="white" />
                      </LinearGradient>
                    </View>
                    
                    <MaskedView
                      maskElement={<Text style={styles.title}>QUANTUM FIT AI</Text>}
                    >
                      <LinearGradient
                        colors={['#4FD1C5', '#63B3ED', '#B794F4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 40 }}
                      />
                    </MaskedView>
                    
                    <Animated.Text 
                      entering={FadeInDown.delay(300).duration(800)}
                      style={styles.subtitle}
                    >
                      Create your advanced fitness profile
                    </Animated.Text>
                  </View>
                  
                  {/* Replace with Safe versions of visual components */}
                  <SafeHolographicScanner />
                  <SafeHealthMetricsViz />
                  
                  {/* Input fields with safe animation wrappers */}
                  <View style={styles.inputWrapper}>
                    <View style={{ opacity: 1 }}>
                      <Animated.View
                        entering={FadeInDown.delay(400).duration(800)}
                        style={nameContainerStyle}
                      >
                        <BlurView intensity={80} tint="dark" style={[
                          styles.inputContainer,
                          nameFocused && styles.inputContainerFocused
                        ]}>
                          <LinearGradient
                            colors={['rgba(79, 209, 197, 0.3)', 'rgba(79, 209, 197, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.iconContainer}
                          >
                            <User size={20} color="white" />
                          </LinearGradient>
                          
                          <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            selectionColor="#4FD1C5"
                            value={name}
                            onChangeText={setName}
                            onFocus={() => handleFocus('name', true)}
                            onBlur={() => handleFocus('name', false)}
                          />
                          
                          {nameValid && (
                            <View style={styles.validIconContainer}>
                              <Check size={18} color="#4FD1C5" />
                            </View>
                          )}
                        </BlurView>
                        
                        <Animated.View style={[styles.inputShimmer, shimmerStyle]}>
                          <LinearGradient
                            colors={['rgba(79, 209, 197, 0)', 'rgba(79, 209, 197, 0.3)', 'rgba(79, 209, 197, 0)']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{ flex: 1 }}
                          />
                        </Animated.View>
                      </Animated.View>
                    </View>
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <View style={{ opacity: 1 }}>
                      <Animated.View
                        entering={FadeInDown.delay(600).duration(800)}
                        style={emailContainerStyle}
                      >
                        <BlurView intensity={80} tint="dark" style={[
                          styles.inputContainer,
                          emailFocused && styles.inputContainerFocused
                        ]}>
                          <LinearGradient
                            colors={['rgba(99, 179, 237, 0.3)', 'rgba(99, 179, 237, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.iconContainer}
                          >
                            <Mail size={20} color="white" />
                          </LinearGradient>
                          
                          <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            selectionColor="#63B3ED"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => handleFocus('email', true)}
                            onBlur={() => handleFocus('email', false)}
                          />
                          
                          {emailValid && (
                            <View style={styles.validIconContainer}>
                              <Check size={18} color="#63B3ED" />
                            </View>
                          )}
                        </BlurView>
                        
                        <Animated.View style={[styles.inputShimmer, shimmerStyle]}>
                          <LinearGradient
                            colors={['rgba(99, 179, 237, 0)', 'rgba(99, 179, 237, 0.3)', 'rgba(99, 179, 237, 0)']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{ flex: 1 }}
                          />
                        </Animated.View>
                      </Animated.View>
                    </View>
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <View style={{ opacity: 1 }}>
                      <Animated.View
                        entering={FadeInDown.delay(800).duration(800)}
                        style={passwordContainerStyle}
                      >
                        <BlurView intensity={80} tint="dark" style={[
                          styles.inputContainer,
                          passwordFocused && styles.inputContainerFocused
                        ]}>
                          <LinearGradient
                            colors={['rgba(183, 148, 244, 0.3)', 'rgba(183, 148, 244, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.iconContainer}
                          >
                            <Shield size={20} color="white" />
                          </LinearGradient>
                          
                          <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            selectionColor="#B794F4"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => handleFocus('password', true)}
                            onBlur={() => handleFocus('password', false)}
                          />
                          
                          <TouchableOpacity 
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={20} color="rgba(255,255,255,0.7)" />
                            ) : (
                              <Eye size={20} color="rgba(255,255,255,0.7)" />
                            )}
                          </TouchableOpacity>
                        </BlurView>
                        
                        <Animated.View style={[styles.inputShimmer, shimmerStyle]}>
                          <LinearGradient
                            colors={['rgba(183, 148, 244, 0)', 'rgba(183, 148, 244, 0.3)', 'rgba(183, 148, 244, 0)']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{ flex: 1 }}
                          />
                        </Animated.View>
                        
                        {/* Advanced password strength indicator */}
                        {password.length > 0 && (
                          <PasswordStrengthIndicator 
                            password={password}
                            validations={passwordValidations}
                          />
                        )}
                      </Animated.View>
                    </View>
                  </View>
                  
                  {/* Sign up button */}
                  <View style={styles.buttonWrapper}>
                    <View style={{ opacity: 1 }}>
                      <Animated.View
                        entering={FadeInDown.delay(1000).duration(800)}
                        style={buttonAnimStyle}
                      >
                        <TouchableOpacity
                          style={[
                            styles.signupButton,
                            !nameValid || !emailValid || !passwordValid ? styles.buttonDisabled : {}
                          ]}
                          onPress={handleSignup}
                          disabled={!nameValid || !emailValid || !passwordValid || processingSignup}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={[
                              nameValid && emailValid && passwordValid ? '#4FD1C5' : 'rgba(79, 209, 197, 0.5)',
                              nameValid && emailValid && passwordValid ? '#63B3ED' : 'rgba(99, 179, 237, 0.5)'
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                          >
                            <BlurView intensity={30} tint="dark" style={styles.buttonContent}>
                              {!processingSignup ? (
                                <>
                                  <Text style={[styles.buttonText, { marginRight: 8 }]}>CREATE PROFILE</Text>
                                  <ArrowRight size={20} color="white" />
                                </>
                              ) : (
                                <>
                                  <Animated.View style={processingIconStyle}>
                                    <RefreshCw size={20} color="white" />
                                  </Animated.View>
                                  <Text style={[styles.buttonText, { marginLeft: 8 }]}>PROCESSING</Text>
                                </>
                              )}
                            </BlurView>
                          </LinearGradient>
                          
                          <Animated.View style={[styles.buttonShimmer, shimmerStyle]}>
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
                              start={{ x: 0, y: 0.5 }}
                              end={{ x: 1, y: 0.5 }}
                              style={{ flex: 1 }}
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      </Animated.View>
                    </View>
                  </View>
                  
                  {/* Login link */}
                  <Animated.View 
                    entering={FadeInDown.delay(1200).duration(800)}
                    style={styles.loginContainer}
                  >
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(onboarding)/login')}>
                      <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  
                  {/* Feature badges */}
                  <Animated.View
                    entering={FadeInDown.delay(1400).duration(800)}
                    style={styles.featureBadges}
                  >
                    <View style={styles.badgesRow}>
                      <View style={styles.featureBadge}>
                        <LinearGradient
                          colors={['rgba(79, 209, 197, 0.2)', 'rgba(79, 209, 197, 0.05)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.badgeGradient}
                        >
                          <View style={styles.badgeContent}>
                            <Brain size={16} color="#4FD1C5" />
                            <Text style={styles.badgeText}>Neural Analysis</Text>
                          </View>
                        </LinearGradient>
                      </View>
                      
                      <View style={styles.featureBadge}>
                        <LinearGradient
                          colors={['rgba(99, 179, 237, 0.2)', 'rgba(99, 179, 237, 0.05)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.badgeGradient}
                        >
                          <View style={styles.badgeContent}>
                            <HeartPulse size={16} color="#63B3ED" />
                            <Text style={styles.badgeText}>Health Monitor</Text>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                    
                    <View style={styles.badgesRow}>
                      <View style={styles.featureBadge}>
                        <LinearGradient
                          colors={['rgba(183, 148, 244, 0.2)', 'rgba(183, 148, 244, 0.05)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.badgeGradient}
                        >
                          <View style={styles.badgeContent}>
                            <Dumbbell size={16} color="#B794F4" />
                            <Text style={styles.badgeText}>Smart Training</Text>
                          </View>
                        </LinearGradient>
                      </View>
                      
                      <View style={styles.featureBadge}>
                        <LinearGradient
                          colors={['rgba(246, 173, 85, 0.2)', 'rgba(246, 173, 85, 0.05)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.badgeGradient}
                        >
                          <View style={styles.badgeContent}>
                            <Flame size={16} color="#F6AD55" />
                            <Text style={styles.badgeText}>Calorie Tracker</Text>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                  </Animated.View>
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// Create the StyleSheet with fixed styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  staticWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 50,
  },
  backgroundGradient: {
    position: 'absolute',
  },
  energyPulse: {
    position: 'absolute',
    zIndex: 0,
  },
  radialGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4FD1C5',
    opacity: 0.05,
  },
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
  neuralConnection: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#63B3ED',
  },
  headerSection: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoBackground: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  logoRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSegment: {
    position: 'absolute',
    width: '70%',
    height: 2,
    backgroundColor: 'rgba(79, 209, 197, 0.6)',
    borderRadius: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  scannerContainer: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  scannerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.4)',
    top: -10,
    left: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringAccent: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    top: 10,
    left: 10,
    borderTopLeftRadius: 8,
    borderColor: 'rgba(79, 209, 197, 0.8)',
  },
  scannerFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(79, 209, 197, 0.8)',
  },
  scannerGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    top: 0,
  },
  scanLineGradient: {
    width: '100%',
    height: '100%',
  },
  binaryPattern: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  binaryRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  binaryDigit: {
    fontSize: 8,
    color: '#4FD1C5',
    marginHorizontal: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  metricItem: {
    marginHorizontal: 4,
  },
  metricGradient: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    marginBottom: 18,
    width: '100%',
    position: 'relative',
  },
  inputContainer: {
    height: 58,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputContainerFocused: {
    borderColor: '#4FD1C5',
  },
  iconContainer: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 58,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  eyeButton: {
    paddingHorizontal: 15,
    height: 58,
    justifyContent: 'center',
  },
  validIconContainer: {
    paddingHorizontal: 15,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  passwordValidation: {
    marginTop: 12,
    width: '100%',
  },
  strengthBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  validationRules: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  validationRule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 6,
    width: '45%',
  },
  validationCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validationValid: {
    backgroundColor: '#48BB78',
    borderColor: '#48BB78',
  },
  validationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 12,
    marginBottom: 24,
    position: 'relative',
  },
  signupButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  loginLink: {
    color: '#4FD1C5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureBadges: {
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureBadge: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4FD1C5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
});