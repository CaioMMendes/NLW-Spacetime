import { ImageBackground } from "react-native";
import blurBg from "../src/assets/blurBg.png";
import Stripes from "../src/assets/stripes.svg";
import { styled } from "nativewind";
import {
    useFonts,
    Roboto_400Regular,
    Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store'

export default function Layout() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<null | boolean>(null)
    const [hasLoadedFonts] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        BaiJamjuree_700Bold,
    });
    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            setIsUserAuthenticated(!!token)
        })
    }, [])

    if (!hasLoadedFonts) {
        return <SplashScreen />;
    }
    const StyledStrypes = styled(Stripes);
    return (
        <ImageBackground
            source={blurBg}
            className="relative flex-1 bg-gray-900 "
            imageStyle={{ position: "absolute", left: "-100%" }}
        >
            <StyledStrypes className="absolute left-2" />
            <StatusBar style="light" translucent />
            <Stack

                screenOptions={{ animation: 'fade', headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} >
                <Stack.Screen name="index" redirect={isUserAuthenticated} />
                <Stack.Screen name="memories" />
                <Stack.Screen name="new" />

            </Stack>
        </ImageBackground>
    )
}