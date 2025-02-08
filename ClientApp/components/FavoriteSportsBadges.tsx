import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
        <View style={styles.container}>
            <View style={styles.badgeContainer}>
                {sports?.length ? (
                    sports.map((sport, index) => {
                        const { name, type } = getSportIcon(sport.name);
                        const IconComponent = type === "Ionicons" ? Ionicons : MaterialCommunityIcons;
                        return (
                            <View key={index} style={styles.badge}>
                                <IconComponent
                                    name={name}
                                    size={16}
                                    color={getSkillColor(sport.ranking)}
                                    style={styles.icon}
                                />
                                <Text style={styles.text}>{sport.name}</Text>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.noSportsText}>None</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        alignItems: "center",
    },
    badgeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
        justifyContent: "center",
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "white",
        minWidth: 100,
        margin: 2,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        color: "black",
        fontSize: 14,
    },
    noSportsText: {
        fontSize: 16,
        color: "#808080",
    },
});

export default FavoriteSportsBadges;
