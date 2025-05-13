import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface WorkoutCardProps {
  title: string;
  duration: string;
  level: string;
  imageUrl: string;
}

export default function WorkoutCard({
  title,
  duration,
  level,
  imageUrl,
}: WorkoutCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.durationContainer}>
            <Clock size={14} color={theme.colors.textLight} />
            <Text style={styles.duration}>{duration}</Text>
          </View>
          <View style={styles.levelContainer}>
            <Text style={styles.level}>{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  levelContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 10,
  },
  level: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: theme.colors.primary,
  },
});