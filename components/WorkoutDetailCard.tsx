import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Flame, Heart } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface WorkoutDetailCardProps {
  title: string;
  duration: string;
  calories: string;
  level: string;
  imageUrl: string;
  favorite: boolean;
}

export default function WorkoutDetailCard({
  title,
  duration,
  calories,
  level,
  imageUrl,
  favorite,
}: WorkoutDetailCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity>
            <Heart 
              size={20} 
              color={favorite ? theme.colors.error : theme.colors.textLight} 
              fill={favorite ? theme.colors.error : 'transparent'} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={16} color={theme.colors.textLight} style={styles.detailIcon} />
            <Text style={styles.detailText}>{duration}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Flame size={16} color={theme.colors.textLight} style={styles.detailIcon} />
            <Text style={styles.detailText}>{calories} cal</Text>
          </View>
          
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textLight,
  },
  levelContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 12,
  },
  levelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.primary,
  },
});