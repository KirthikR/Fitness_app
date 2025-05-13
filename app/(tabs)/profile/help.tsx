import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Search, MessageCircle, Book, CircleHelp as HelpCircle, Phone, Mail } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={theme.colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help articles..."
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpIcon}>
              <MessageCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpLabel}>Live Chat</Text>
              <Text style={styles.helpDescription}>Chat with our support team</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpIcon}>
              <Book size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpLabel}>Help Center</Text>
              <Text style={styles.helpDescription}>Browse help articles</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <View style={styles.helpIcon}>
              <HelpCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpLabel}>FAQs</Text>
              <Text style={styles.helpDescription}>Frequently asked questions</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>

          <TouchableOpacity style={styles.topicItem}>
            <Text style={styles.topicTitle}>Account & Billing</Text>
            <Text style={styles.topicDescription}>Subscription, payments, and account settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem}>
            <Text style={styles.topicTitle}>Workout Programs</Text>
            <Text style={styles.topicDescription}>Exercise tutorials and program guidance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem}>
            <Text style={styles.topicTitle}>Technical Issues</Text>
            <Text style={styles.topicDescription}>App functionality and troubleshooting</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem}>
            <Text style={styles.topicTitle}>Privacy & Security</Text>
            <Text style={styles.topicDescription}>Data protection and account security</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>

          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Phone Support</Text>
              <Text style={styles.contactValue}>1-800-123-4567</Text>
              <Text style={styles.contactHours}>Mon-Fri, 9AM-6PM EST</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Mail size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@fitpro.com</Text>
              <Text style={styles.contactHours}>24/7 Support</Text>
            </View>
          </TouchableOpacity>
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
  searchContainer: {
    padding: 24,
    backgroundColor: 'white',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.text,
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  helpDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  topicItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  topicTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  topicDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  contactValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  contactHours: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
  },
});