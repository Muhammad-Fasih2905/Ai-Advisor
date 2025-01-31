import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AppColors } from '../../utils/color';

const Splash = ({ onTransition }: any) => {
    const fadeAnimation = useRef(new Animated.Value(3)).current; // For fade effect
    const moveAnimation = useRef(new Animated.Value(hp(40))).current; // For vertical movement

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1, // Fade in
                duration: 500, // Faster fade-in
                useNativeDriver: true,
            }),
            Animated.timing(moveAnimation, {
                toValue: hp(-10), // Move to the top
                duration: 500, // Faster move
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Trigger transition to the next screen immediately after animations complete
            if (onTransition) onTransition();
        });
    }, [fadeAnimation, moveAnimation, onTransition]);

    return (
        <ImageBackground
            source={require('../../assets/images/bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <Animated.View
                style={{
                    opacity: fadeAnimation, // Apply fade effect
                    transform: [{ translateY: moveAnimation }], // Apply move effect
                }}
            >
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.body,
    },
    logo: {
        width: wp(40),
        height: hp(40),
    },
});

export default Splash;
