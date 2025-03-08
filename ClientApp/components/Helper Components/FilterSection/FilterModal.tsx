import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomModal from "../BottomModal";
import supportedSports from "@/utils/constants/supportedSports";
import themeColors from "@/utils/constants/colors";
import ConfirmButton from "../ConfirmButton";
import CustomDateTimePicker from "../CustomDateTimePicker";
import SportFilterButton from "./SportFilterButton";

interface FilterState {
    filterType: string;
    minDate: Date;
    maxDate: Date;
  }

interface FilterModalInterface {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    filterState: FilterState;
    setFilterState: React.Dispatch<React.SetStateAction<FilterState>>
    handleFilterToggle: () => void;
}
const FilterModal: React.FC<FilterModalInterface> = ({isVisible, setIsVisible, setFilterState, handleFilterToggle, filterState}) => {
    
    const adjustedSportMap = [
        { name: "All", icon: "check-circle-outline" },
        ...supportedSports,
      ];
  return (
    <BottomModal isVisible={isVisible} setIsVisible={setIsVisible} height={500}>
      <View style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%",
            gap: 24,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <View>
                <Text
                  style={{
                    color: themeColors.background.dark,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Sport type
                </Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Text style={{ color: themeColors.border.dark }}>
                    {" "}
                    clear filters
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {adjustedSportMap &&
                adjustedSportMap.map((item: any) => (
                  <View key={item.name}>
                    <SportFilterButton
                      sport={item.name}
                      icon={item.icon}
                      isSelected={filterState.filterType === item.name}
                      onPress={() =>
                        setFilterState((prev) => ({
                          ...prev,
                          filterType: item.name,
                        }))
                      }
                    />
                  </View>
                ))}
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Text
              style={{
                color: themeColors.background.dark,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Select Date Range
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <CustomDateTimePicker
                value={filterState.minDate}
                mode="date"
                label=""
                onChange={(selectedDate: Date) =>
                  setFilterState((prev) => ({
                    ...prev,
                    minDate: selectedDate,
                  }))
                }
              />
              <Text>To: </Text>
              <CustomDateTimePicker
                value={filterState.maxDate}
                mode="date"
                label=""
                onChange={(selectedDate: Date) =>
                  setFilterState((prev) => ({
                    ...prev,
                    maxDate: selectedDate,
                  }))
                }
              />
            </View>
          </View>
        </View>
        <ConfirmButton
          icon={null}
          text="Apply Filters"
          iconPlacement={null}
          onPress={handleFilterToggle}
        />
      </View>
    </BottomModal>
  );
};

export default FilterModal;