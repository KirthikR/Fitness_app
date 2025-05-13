import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, CreditCard, Ban as Bank, Wallet } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function PaymentMethodsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardItem}>
            <View style={styles.cardIcon}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' }}
                style={styles.cardLogo}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Mastercard ending in 4589</Text>
              <Text style={styles.cardExpiry}>Expires 12/25</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardItem}>
            <View style={styles.cardIcon}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png' }}
                style={styles.cardLogo}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Visa ending in 1234</Text>
              <Text style={styles.cardExpiry}>Expires 09/24</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Payment Methods</Text>

          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentIcon}>
              <Bank size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentLabel}>Bank Account</Text>
              <Text style={styles.paymentDescription}>Connect your bank account</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentIcon}>
              <Wallet size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentLabel}>Digital Wallet</Text>
              <Text style={styles.paymentDescription}>Apple Pay, Google Pay, etc.</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Address</Text>
          <TouchableOpacity style={styles.addressContainer}>
            <Text style={styles.addressName}>Alex Johnson</Text>
            <Text style={styles.addressText}>123 Main Street</Text>
            <Text style={styles.addressText}>Apt 4B</Text>
            <Text style={styles.addressText}>New York, NY 10001</Text>
            <Text style={styles.addressText}>United States</Text>
            <TouchableOpacity style={styles.editAddressButton}>
              <Text style={styles.editAddressText}>Edit Address</Text>
            </TouchableOpacity>
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
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardLogo: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardExpiry: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentContent: {
    flex: 1,
  },
  paymentLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  addressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  addressName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  editAddressButton: {
    marginTop: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editAddressText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
});