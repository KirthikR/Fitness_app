import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Platform, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LogOut, Bell, Moon, CreditCard, CircleHelp as HelpCircle, Lock, User as UserIcon, ChevronRight } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={styles.profileSection}
          layout={null}
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Kirthik Ramadoss</Text>
            <Text style={styles.profileEmail}>Kirthikramadoss@gmail.com</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500).duration(800)}
          style={styles.statsContainer}
          layout={null}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>850</Text>
            <Text style={styles.statLabel}>Calories/day</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Days Streak</Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          layout={null}
        >
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/account-settings')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
              <UserIcon size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.menuText}>Account Settings</Text>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          layout={null}
        >
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/notifications')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Bell size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(900).duration(800)}
          layout={null}
        >
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/payment-methods')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <CreditCard size={20} color={theme.colors.warning} />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(1000).duration(800)}
          layout={null}
        >
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/privacy')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
              <Lock size={20} color="#7c3aed" />
            </View>
            <Text style={styles.menuText}>Privacy & Security</Text>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(1100).duration(800)}
          layout={null}
        >
          <View style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(0, 0, 0, 0.05)' }]}>
              <Moon size={20} color={theme.colors.text} />
            </View>
            <Text style={styles.menuText}>Dark Mode</Text>
            <Switch 
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={theme.colors.primary}
              ios_backgroundColor="#e0e0e0"
              value={false}
            />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(1200).duration(800)}
          layout={null}
        >
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/help')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(220, 38, 38, 0.1)' }]}>
              <HelpCircle size={20} color="#dc2626" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(1300).duration(800)}
          layout={null}
        >
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => router.push('/')}
          >
            <LogOut size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  editProfileButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }
    ),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }
    ),
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#dc2626',
    marginLeft: 8,
  },
});