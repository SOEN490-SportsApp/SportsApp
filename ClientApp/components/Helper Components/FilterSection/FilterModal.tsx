import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomModal from "../BottomModal";
import supportedSports from "@/utils/constants/supportedSports";
import themeColors from "@/utils/constants/colors";
import ConfirmButton from "../ConfirmButton";
import CustomDateTimePicker from "../CustomDateTimePicker";
import SportFilterButton from "./FilterButtonBadge";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FilterButtonBadge from "./FilterButtonBadge";
import { hs, vs } from "@/utils/helpers/uiScaler";
import { useTranslation } from 'react-i18next';

export interface FilterState {
  filterType: string;
  skillLevel: "All" | "Beginner" | "Intermediate" | "Advanced";
  minDate: Date;
  maxDate: Date;
}

interface FilterModalInterface {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  handleFilterToggle: () => void;
  handleCleanFilter: () => void;
}
const FilterModal: React.FC<FilterModalInterface> = ({
  isVisible,
  setIsVisible,
  setFilterState,
  handleFilterToggle,
  filterState,
  handleCleanFilter,
}) => {
  const adjustedSportMap = [
    ...supportedSports,
  ];

  const skillLevels = ["beginner", "intermediate", "advanced"];
  const { t } = useTranslation();

  return (
    <BottomModal isVisible={isVisible} setIsVisible={setIsVisible} height={650}>
      <View style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%",
            gap: vs(24),
          }}
        >
          <View
            style={{ display: "flex", flexDirection: "column", gap: vs(16) }}
          >
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
                  {t('filter_modal.sport_type')}
                </Text>
              </View>
              <View>
                <TouchableOpacity onPress={handleCleanFilter}>
                  <Text style={{ color: "#0096FF",  fontWeight: "bold" }}>
                    {" "}
                    {t('filter_modal.clear_filters')}
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
                gap: hs(2),
              }}
            >
              {adjustedSportMap &&
                adjustedSportMap.map((item: any) => (
                  <View key={item.name}>
                    <SportFilterButton
                      sport={item.name}
                      icon={
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={16}
                          color={
                            filterState.filterType === item.name
                              ? "#fff"
                              : themeColors.primary
                          }
                        />
                      }
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
          <View
            style={{ display: "flex", flexDirection: "column", gap: vs(4) }}
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
                {t('filter_modal.skill_level')}
              </Text>
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
              {skillLevels.map((level, index) => (
                <View key={index}>
                  <FilterButtonBadge
                    sport={t(`filter_modal.${level}`)}
                    isSelected={filterState.skillLevel.toLowerCase() === level}
                    onPress={() =>
                      setFilterState((prev) => ({
                        ...prev,
                        skillLevel: level.charAt(0).toUpperCase() + level.slice(1) as FilterState['skillLevel']
                      }))
                    }
                    icon={undefined}
                  />
                </View>
              ))}
            </View>
          </View>
          <View
            style={{ display: "flex", flexDirection: "column", gap: vs(18) }}
          >
            <Text
              style={{
                color: themeColors.background.dark,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t('filter_modal.select_date_range')}
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
              <Text>{t('filter_modal.to')} </Text>
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
          text={t('filter_modal.apply_filters')}
          iconPlacement={null}
          onPress={handleFilterToggle}
        />
      </View>
    </BottomModal>
  );
};

export default FilterModal;
