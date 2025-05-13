import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Bell, Calendar, Heart, Star, MessageCircle, Mail } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useState } from 'react';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    progressUpdates: true,
    achievements: true,
    messages: false,
    newsletter: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationLabel}>All Notifications</Text>
              <Text style={styles.notificationDescription}>Enable or disable all notifications</Text>
            </View>
            <Switch
              value={Object.values(notifications).some(v => v)}
              onValueChange={() => {
                const allEnabled = Object.values(notifications).every(v => v);
                const newValue = !allEnabled;
                setNotifications({
                  workoutReminders: newValue,
                  progressUpdates: newValue,
                  achievements: newValue,
                  messages: newValue,
                  newsletter: newValue,
                });
              }}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={Object.values(notifications).some(v => v) ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Calendar size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationLabel}>Workout Reminders</Text>
              <Text style={styles.notificationDescription}>Daily workout notifications</Text>
            </View>
            <Switch
              value={notifications.workoutReminders}
              onValueChange={() => toggleNotification('workoutReminders')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={notifications.workoutReminders ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Heart size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationLabel}>Progress Updates</Text>
              <Text style={styles.notificationDescription}>Weekly progress summaries</Text>
            </View>
            <Switch
              value={notifications.progressUpdates}
              onValueChange={() => toggleNotification('progressUpdates')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={notifications.progressUpdates ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Star size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationLabel}>Achievements</Text>
              <Text style={styles.notificationDescription}>Goal completion and milestones</Text>
            </View>
            <Switch
              value={notifications.achievements}
              onValueChange={() => toggleNotification('achievements')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={notifications.achievements ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <MessageCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationLabel}>Direct Messages</Text>
              <Text style={styles.notificationDescription}>Chat and support messages</Text>
            </View>
            <Switch
              value={notifications.messages}
              onValueChange={() => toggleNotification('messages')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={notifications.messages ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Mail size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationLabel}>Newsletter</Text>
              <Text style={styles.notificationDescription}>Weekly fitness tips and updates</Text>
            </View>
            <Switch
              value={notifications.newsletter}
              onValueChange={() => toggleNotification('newsletter')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={notifications.newsletter ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
});