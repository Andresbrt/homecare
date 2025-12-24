import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  duration = 800,
  animationType = 'fadeInUp', // fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight
  style = {},
  ...props 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animations = [];

    switch (animationType) {
      case 'fadeInUp':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;
      case 'fadeInDown':
        translateAnim.setValue(-50);
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;
      case 'scaleIn':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        );
        break;
      case 'slideInLeft':
        translateAnim.setValue(-100);
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.spring(translateAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        );
        break;
      case 'slideInRight':
        translateAnim.setValue(100);
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.spring(translateAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        );
        break;
      default:
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
    }

    const animationSequence = Animated.parallel(animations);
    
    const timer = setTimeout(() => {
      animationSequence.start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, animationType]);

  const getAnimatedStyle = () => {
    const baseStyle = {
      opacity: fadeAnim,
    };

    switch (animationType) {
      case 'fadeInUp':
      case 'fadeInDown':
        return {
          ...baseStyle,
          transform: [{ translateY: translateAnim }],
        };
      case 'scaleIn':
        return {
          ...baseStyle,
          transform: [{ scale: scaleAnim }],
        };
      case 'slideInLeft':
      case 'slideInRight':
        return {
          ...baseStyle,
          transform: [{ translateX: translateAnim }],
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]} {...props}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;