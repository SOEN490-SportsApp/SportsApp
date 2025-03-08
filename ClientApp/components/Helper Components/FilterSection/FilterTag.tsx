import themeColors from '@/utils/constants/colors'
import React from 'react'
import { View, Text} from 'react-native'

interface FilterInterface {
    isActive: boolean;
    name:string;
    onPress: () => void;
}

const FilterTag: React.FC<FilterInterface> = ({isActive, onPress, name}) => {
  return (
    <View style={{borderRadius:20, padding:2, borderColor: themeColors.primary, backgroundColor: isActive ? themeColors.primary : "fff"}}>
        <Text style={{color: isActive? "fff" : themeColors.primary}}>{name}</Text>
    </View>
  )
}

export default FilterTag;
