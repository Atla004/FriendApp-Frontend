import {  Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ProfileProvider } from '../context/ProfileContext';
import { ToastProvider } from '../context/ToastContext';
import { UserDataProvider } from '../context/UserDataContext';

export default function Layout() {




  return (
    
    <ProfileProvider>
      <ToastProvider>
          <UserDataProvider>

              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
              


          </UserDataProvider>
      </ToastProvider>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
});
