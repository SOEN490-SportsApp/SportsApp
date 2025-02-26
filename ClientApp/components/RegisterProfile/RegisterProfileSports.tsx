import React, { useState, useEffect } from "react";
import supportedSports from "@/utils/constants/supportedSports";
import { View, Text, TouchableOpacity, FlatList, Modal, Dimensions, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { vs, hs } from "@/utils/helpers/uiScaler";
import themeColors from "@/utils/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "@/state/user/userSlice";

interface SportPreference {
  name: string;
  ranking: string;
}

interface sportSelection {
  selectedSports: SportPreference[];
  onChange: (selectedSports: SportPreference[]) => void;
}

const RegisterProfileSports: React.FC<sportSelection> = ({ selectedSports = [], onChange }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [selectedIcons, setSelectedIcons] = useState<number[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSport, setCurrentSport] = useState<{ id: number; name: string } | null>(null);
  const [ranking, setRanking] = useState<string>("");
  useEffect(() => {
    if (user?.profile?.sportsOfPreference) {
      setSelectedIcons(user.profile.sportsOfPreference.map(sport => {
        const matchingSport = supportedSports.find(s => s.name === sport.name);
        return matchingSport ? matchingSport.id : -1;
      }));
    }
  }, [user.profile.sportsOfPreference]); 

  const toggleIconSelection = (item: any) => {
    setCurrentSport(item);
    setRanking("Beginner");
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (currentSport) {
        setSelectedIcons((prevState) => {
            const newSelectedIcons = prevState.includes(currentSport.id)
                ? prevState
                : [...prevState, currentSport.id];

            const selectedNames = user.profile.sportsOfPreference ? [...user.profile.sportsOfPreference] : [];

            const existingSportIndex = selectedNames.findIndex(sport => sport.name === currentSport.name);

            if (existingSportIndex !== -1) {
                selectedNames[existingSportIndex].ranking = ranking;
            } else {
                selectedNames.push({ name: currentSport.name, ranking });
            }
            dispatch(setUser({
                ...user,
                profile: {
                    ...user.profile,
                    sportsOfPreference: selectedNames 
                }
            }));
            onChange(selectedNames);

            return newSelectedIcons;
        });
    }
    setModalVisible(false);
};

const selectedIconRankings = (name: string): string => {
  const selectedSport = user.profile.sportsOfPreference?.find((sport) => sport.name === name);
  return selectedSport ? selectedSport.ranking : "";
};


  const renderItem = ({item}: { item: { id: number; name: string; icon: string }; }) => (
    <IconButton
      id={item.id}
      icon={item.icon}
      name={item.name}
      isSelected={selectedIcons.includes(item.id)}
      sportRank = {selectedIconRankings(item.name)}
      onPress={() => toggleIconSelection(item)}
    />
  );
  return (
    <>
      <View style={styles.mainSelectionView}>
        <FlatList
          data={supportedSports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          ItemSeparatorComponent={() => <View style={{ height: vs(12) }} />}
        />
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <View style={styles.modalSection}>
              <Text style={styles.modalMessage}>
                Select your skill level in {currentSport?.name}
              </Text>
              <View style={styles.skillSelectionSection}>
                <TouchableOpacity
                  onPress={() => setRanking("Beginner")}
                  testID="beginner-button"
                  style={
                    ranking === "Beginner"
                      ? styles.beginnerLevelSelected
                      : styles.normalOption
                  }
                >
                  <Text
                    style={
                      ranking === "Beginner"
                        ? styles.beginnerLevelSelectedText
                        : styles.normalOptionText
                    }
                  >
                    Beginner
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRanking("Intermediate")}
                  testID="intermediate-button"
                  style={
                    ranking === "Intermediate"
                      ? styles.intermediateLevelSelected
                      : styles.normalOption
                  }
                >
                  <Text
                    style={
                      ranking === "Intermediate"
                        ? styles.intermediateLevelSelectedText
                        : styles.normalOptionText
                    }
                  >
                    Intermediate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                testID="advanced-button"
                  onPress={() => setRanking("Advanced")}
                  style={
                    ranking === "Advanced"
                      ? styles.advancedLevelSelected
                      : styles.normalOption
                  }
                >
                  <Text
                    style={
                      ranking === "Advanced"
                        ? styles.advancedLevelSelectedText
                        : styles.normalOptionText
                    }
                  >
                    Advanced
                  </Text>
                </TouchableOpacity>
                </View>
              <View style={styles.selectSkillButtonContainer}>
                <TouchableOpacity
                  testID="remove-sport"
                  onPress={() => setModalVisible(false)}
                  style={[
                    styles.baseSelectNRemoveButton,
                    styles.selectSkillsButtons,
                    { backgroundColor: themeColors.background.light, borderColor: themeColors.text.grey },
                  ]}
                >
                  <Text style={{ color: themeColors.text.grey }}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                testID="confirm-sport"
                  onPress={handleConfirm}
                  style={[
                    styles.baseSelectNRemoveButton,
                    styles.selectSkillsButtons,
                    styles.selectSkillsSectionButton
                  ]}
                >
                  <Text style={{ color: themeColors.text.light }}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const IconButton = ({
  id,
  icon,
  isSelected,
  onPress,
  name,
  sportRank
}: {
  id: number;
  icon: string;
  name: string;
  isSelected: boolean;
 sportRank: string
  onPress: () => void;
}) => {

  const rankingColour = (rank: string) => {
    switch (rank) {
        case 'Advanced':
            return themeColors.error;  
        case 'Intermediate':
            return themeColors.sportIcons.intermediate;  
        case 'Beginner':
            return themeColors.sportIcons.beginner;  
        default:
            return themeColors.text.grey;  
    }
};
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onPress} testID={name+"-selection-button"}>
      <View style={[styles.iconImageContainer, {
    backgroundColor: isSelected ? rankingColour(sportRank) : themeColors.text.light,
    borderColor: isSelected ? rankingColour(sportRank) : themeColors.text.light,
          }]}>
      <MaterialCommunityIcons
            name={icon as unknown as any}
            size={50}
            color={`${isSelected ? "#fff" : themeColors.sportIcons.lightGrey}`}
          />
        </View>
      </TouchableOpacity>
      <View>
        <Text style={{ color: `${isSelected ? rankingColour(sportRank): themeColors.sportIcons.lightGrey}`}}>
          {name}
        </Text>
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  modalMessage: {
    fontSize: vs(20),
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: vs(16),
  },
  normalOption: {
    borderWidth: 1,
    borderColor: themeColors.sportIcons.lightGrey,
    borderRadius: 8, 
    padding: vs(12), 
  },
  normalOptionText :{
    color: themeColors.sportIcons.lightGrey, 
    fontSize: vs(20), 
    textAlign: "center"
  },
  beginnerLevelSelected: {
    backgroundColor: themeColors.sportIcons.beginner,
    borderRadius: 8,
    padding: vs(12),
    borderWidth: 1,
    borderColor: themeColors.border.dark,
  },
  beginnerLevelSelectedText: {
    color: themeColors.text.light,
    fontSize: vs(20),
    textAlign: "center",
  },
  intermediateLevelSelected: {
    backgroundColor: themeColors.sportIcons.intermediate,
    borderRadius: 8, 
    padding: vs(12),
    borderWidth: 1,
    borderColor: themeColors.border.dark,
  },
  intermediateLevelSelectedText: {
    color: themeColors.text.light,
    fontSize: vs(20),
    textAlign: "center",
  },
  advancedLevelSelected: {
    backgroundColor: themeColors.sportIcons.advanced,
    borderRadius: 8, 
    padding: vs(12), 
    borderWidth: 1, 
    borderColor: themeColors.border.dark,
  },
  advancedLevelSelectedText: {
    color: themeColors.text.light,
    fontSize: vs(20),
    textAlign: "center",
  },
  custompicker: {
    borderRadius: 8,
    padding: vs(12), 
    borderWidth: 1, 
    borderColor: themeColors.border.dark,
  },
  baseSelectNRemoveButton : {
    paddingHorizontal: hs(28), 
    paddingVertical: vs(12)
  },
  selectSkillsButtons : { 
      display: 'flex',   
      justifyContent: 'center',    
      paddingHorizontal: hs(36), 
      borderWidth: 1,   
      borderRadius: 24, 
  },
  skillSelectionSection : {
    display: 'flex',
    flexDirection: 'column',    
    justifyContent: 'center',    
    gap: vs(16), 
    marginBottom: vs(32),
  },
  modalView : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSection :{
    backgroundColor: themeColors.text.light,
    padding: vs(30),
    borderRadius: 10,
    width: "80%",
  },
  mainSelectionView : {
    flex: 1,
    maxHeight: screenHeight * 0.95,
    marginTop: vs(2),
    justifyContent: "center",
  },
  iconContainer : {
    flex: 1,    
    alignItems: 'center',    
    backgroundColor: themeColors.background.light,
  },
  iconImageContainer : {
    borderWidth: 1,
    padding: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: vs(5),
    borderRadius: 24, 
  },
  selectSkillButtonContainer: {   
     flexDirection: 'row',   
      justifyContent: 'center',    
      gap: vs(16),
    },
  selectSkillsSectionButton: {
    backgroundColor : themeColors.button.primaryBackground,
    borderColor: themeColors.border.dark
  }

});
export default RegisterProfileSports;
