import React, { useState} from "react";
import supportedSports from "@/utils/constants/supportedSports";
import { View, Text, TouchableOpacity, FlatList, Modal,Dimensions, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { vs,hs, mvs, mhs  } from "@/utils/helpers/uiScaler";

interface sportSelection {
  onChange: (SelectedSport: { name: string; ranking: string }[]) => void;
}

const RegisterProfileSports: React.FC<sportSelection> = ({ onChange }) => {
  const [selectedIcons, setSelectedIcons] = useState<number[]>([]);
  const [selectedSports, setSelectedSports] = useState<{name: string,ranking:string}[] | null>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSport, setCurrentSport] = useState<{ id: number; name: string } | null>(null);
  const [ranking, setRanking] = useState<string>("");



  const toggleIconSelection = (item: any) => {
    setCurrentSport(item);
    setRanking('Beginner')
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (currentSport) {
      setSelectedIcons((prevState) => {
        const newSelectedIcons = prevState.includes(currentSport.id)
          ? selectedIcons
          : [...prevState, currentSport.id];
  
        const selectedNames = supportedSports.filter((icon) => newSelectedIcons.includes(icon.id)).map((icon) => {
          const existingSport = selectedSports?.find(sport => sport.name === icon.name);
          return {
            name: icon.name,
            ranking: icon.id === currentSport.id ? ranking : existingSport?.ranking || "",
          };
        });
  
        onChange(selectedNames);
        setSelectedSports(selectedNames);
        return newSelectedIcons;
      });
      setRanking(""); // Reset ranking input
    }
    setModalVisible(false);
  };

  const removePick = () => {
    if (currentSport) {
      const newSports = selectedIcons.filter((sportId) => sportId !== currentSport.id);
      setSelectedIcons(newSports);

      const selectedNames = supportedSports.filter((icon) => newSports.includes(icon.id)).map((icon) => {
        const existingSport = selectedSports?.find(sport => sport.name === icon.name);
        return {
          name: icon.name,
          ranking: icon.id === currentSport.id ? ranking : existingSport?.ranking || "",
        };
      });
      onChange(selectedNames);
    }
    setModalVisible(false);
  };

  const selectedIconRankings = (name: string): string => {
    const selectedSport = selectedSports?.find((sport) => sport.name === name);
    if (selectedSport) {
      return selectedSport.ranking || '';
    }
    return '#aaa';
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
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
                  onPress={removePick}
                  style={[
                    styles.baseSelectNRemoveButton,
                    styles.selectSkillsButtons,
                    { backgroundColor: "white", borderColor: "#aaa" },
                  ]}
                >
                  <Text style={{ color: "#aaa" }}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={[
                    styles.baseSelectNRemoveButton,
                    styles.selectSkillsButtons,
                    { backgroundColor: "#0C9E04", borderColor: "#d3d3d3" },
                  ]}
                >
                  <Text style={{ color: "white" }}>Select</Text>
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
        return 'red';
      case 'Intermediate':
        return '#ffa700';
      case 'Beginner':
        return 'green';
      default:
        return '#aaa';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.iconImageContainer, {backgroundColor: `${isSelected ? rankingColour(sportRank): 'white'}`,borderColor: `${isSelected ? rankingColour(sportRank): '#aaa'}`,}]}>
          <MaterialCommunityIcons
            name={icon as unknown as any}
            size={50}
            color={`${isSelected ? "#fff" : "#aaa"}`}
          />
        </View>
      </TouchableOpacity>
      <View>
        <Text style={{ color: `${isSelected ? rankingColour(sportRank): '#aaa'}`}}>
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
    borderColor: "#aaa",
    borderRadius: 8, 
    padding: vs(12), 
  },
  normalOptionText :{
    color: "#aaa", 
    fontSize: vs(20), 
    textAlign: "center"
  },
  beginnerLevelSelected: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: vs(12),
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  beginnerLevelSelectedText: {
    color: "white",
    fontSize: vs(20),
    textAlign: "center",
  },
  intermediateLevelSelected: {
    backgroundColor: "#ffa700",
    borderRadius: 8, 
    padding: vs(12),
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  intermediateLevelSelectedText: {
    color: "white",
    fontSize: vs(20),
    textAlign: "center",
  },
  advancedLevelSelected: {
    backgroundColor: "red",
    borderRadius: 8, 
    padding: vs(12), 
    borderWidth: 1, 
    borderColor: "#d3d3d3",
  },
  advancedLevelSelectedText: {
    color: "white",
    fontSize: vs(20),
    textAlign: "center",
  },
  custompicker: {
    borderRadius: 8,
    padding: vs(12), 
    borderWidth: 1, 
    borderColor: "#d3d3d3",
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
    backgroundColor: "white",
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
    backgroundColor: 'white',
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


});
export default RegisterProfileSports;
