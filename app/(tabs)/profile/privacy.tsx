import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Lock, Eye, Shield, UserPlus, Share2 } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useState } from 'react';

export default function PrivacyScreen() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    activitySharing: true,
    locationSharing: false,
    dataCollection: true,
    marketing: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
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
        <Text style={styles.title}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Eye size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Profile Visibility</Text>
              <Text style={styles.settingDescription}>Make profile visible to others</Text>
            </View>
            <Switch
              value={settings.profileVisibility}
              onValueChange={() => toggleSetting('profileVisibility')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={settings.profileVisibility ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Share2 size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Activity Sharing</Text>
              <Text style={styles.settingDescription}>Share workout activities</Text>
            </View>
            <Switch
              value={settings.activitySharing}
              onValueChange={() => toggleSetting('activitySharing')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={settings.activitySharing ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <UserPlus size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Location Sharing</Text>
              <Text style={styles.settingDescription}>Share location during workouts</Text>
            </View>
            <Switch
              value={settings.locationSharing}
              onValueChange={() => toggleSetting('locationSharing')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={settings.locationSharing ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Personalization</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Data Collection</Text>
              <Text style={styles.settingDescription}>Improve app experience</Text>
            </View>
            <Switch
              value={settings.dataCollection}
              onValueChange={() => toggleSetting('dataCollection')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={settings.dataCollection ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Marketing Communications</Text>
              <Text style={styles.settingDescription}>Receive promotional emails</Text>
            </View>
            <Switch
              value={settings.marketing}
              onValueChange={() => toggleSetting('marketing')}
              trackColor={{ false: '#e0e0e0', true: 'rgba(37, 99, 235, 0.4)' }}
              thumbColor={settings.marketing ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Two-Factor Authentication</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Active Sessions</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download My Data</Text>
        </TouchableOpacity>
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
    paddingVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.primary,
  },
  downloadButton: {
    margin: 24,
    padding: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.primary,
  },
});