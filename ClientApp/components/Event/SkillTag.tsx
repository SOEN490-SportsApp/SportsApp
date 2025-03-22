import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface SkillTagProps {
  level: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ level }) => {

  const { t } = useTranslation();

  // Define colors based on skill levels
  const getColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'BEGINNER':
        return { backgroundColor: '#e0f7fa', textColor: '#00796b' }; // Light blue for beginners
      case 'INTERMEDIATE':
        return { backgroundColor: '#fff3e0', textColor: '#e65100' }; // Orange for intermediate
      case 'ADVANCED':
        return { backgroundColor: '#ffebee', textColor: '#b71c1c' }; // Red for advanced
      default:
        return { backgroundColor: '#e0e0e0', textColor: '#757575' }; // Grey for unknown
    }
  };

  const { backgroundColor, textColor } = getColor(level);

  return (
    <View style={[styles.tagContainer, { backgroundColor }]}>
      <Text style={[styles.tagText, { color: textColor }]}>{t(`skill_tag.${level.toLowerCase()}`)}</Text>
    </View>
  );
};

export default SkillTag;

const styles = StyleSheet.create({
  tagContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
