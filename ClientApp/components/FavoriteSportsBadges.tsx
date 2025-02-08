import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const getSportIcon = (sportName: string) => {
    switch (sportName.toLowerCase()) {
        case "football":
            return { name: "american-football", type: "Ionicons" };
        case "soccer":
            return { name: "soccer", type: "MaterialCommunityIcons" };
        case "basketball":
            return { name: "basketball", type: "Ionicons" };
        case "baseball":
            return { name: "baseball", type: "MaterialCommunityIcons" };
        case "cycling":
            return { name: "bike", type: "MaterialCommunityIcons" };
        case "ping-pong":
        case "table-tennis":
            return { name: "table-tennis", type: "MaterialCommunityIcons" };
        case "tennis":
            return { name: "tennis", type: "MaterialCommunityIcons" };
        case "rugby":
            return { name: "rugby", type: "MaterialCommunityIcons" };
        case "golf":
            return { name: "golf-tee", type: "MaterialCommunityIcons" };
        case "hockey":
            return { name: "hockey-sticks", type: "MaterialCommunityIcons" };
        case "boxing":
            return { name: "boxing-glove", type: "MaterialCommunityIcons" };
        case "hiking":
            return { name: "hiking", type: "MaterialCommunityIcons" };
        default:
            return { name: "help-circle", type: "Ionicons" };
    }
};

const getSkillColor = (ranking: string) => {
    switch (ranking.toLowerCase()) {
        case "beginner":
            return "#228B22";
        case "intermediate":
            return "#FFD700";
        case "advanced":
            return "#FF0000";
        default:
            return "#808080";
    }
};

interface Sport {
    name: string;
    ranking: string;
}

interface FavoriteSportsBadgesProps {
    sports: Sport[];
}

const FavoriteSportsBadges: React.FC<FavoriteSportsBadgesProps> = ({ sports }) => {
    return (
        <View className="mt-0 items-center">
            <View className="flex-row flex-wrap gap-2 mt-2 justify-center">
                {sports?.length ? (
                    sports.map((sport, index) => (
                        <View
                            key={index}
                            className="px-3 py-1 rounded-full border border-gray-300 flex-row items-center"
                            style={{ backgroundColor: "white", minWidth: 100, margin: 4 }}
                        >
                            {["soccer", "baseball", "bike", "table-tennis", "tennis", "rugby", "golf-tee", "hockey-sticks", "boxing-glove", "hiking"].includes(getSportIcon(sport.name).name) ? (
                                <MaterialCommunityIcons name={getSportIcon(sport.name).name} size={16} color={getSkillColor(sport.ranking)} style={{ marginRight: 4 }} />
                            ) : (
                                <Ionicons name={getSportIcon(sport.name).name} size={16} color={getSkillColor(sport.ranking)} style={{ marginRight: 4 }} />
                            )}
                            <Text className="text-black text-sm">{sport.name}</Text>
                        </View>
                    ))
                ) : (
                    <Text className="text-md text-gray-600">None</Text>
                )}
            </View>
        </View>
    );
};

export default FavoriteSportsBadges;
