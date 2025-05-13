import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, User, Mail, Phone, Globe, Key } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function AccountSettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Account Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <User size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Full Name</Text>
              <Text style={styles.settingValue}>Alex Johnson</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Mail size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Email Address</Text>
              <Text style={styles.settingValue}>alex.j@example.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Phone size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Phone Number</Text>
              <Text style={styles.settingValue}>+1 (555) 123-4567</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Preferences</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Globe size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>English (US)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Key size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingValue}>Last changed 2 months ago</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
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
    paddingVertical: 8,
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
  settingValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  deleteButton: {
    marginTop: 40,
    marginBottom: 40,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.error,
  },
});