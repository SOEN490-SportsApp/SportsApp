import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, ViewStyle } from 'react-native';

type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton = ({
  width,
  height,
  bgColor = '#0C9E04',
  borderRadius = 8,
  style,
}: SkeletonProps) => {
  const animation = useRef(new Animated.Value(0.5)).current;

  const startAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const animatedStyle = {
    opacity: animation,
    width,
    height,
    backgroundColor: bgColor,
    borderRadius,
  };

  return <Animated.View style={[style, animatedStyle]} />;
};
