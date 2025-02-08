import React from "react";
import { render } from "@testing-library/react-native";
import FavoriteSportsBadges, { getSkillColor, getSportIcon } from "@/components/FavoriteSportsBadges"; // Assuming the component path


describe('FavoriteSportsBadges Component', () => {
    jest.mock("react-native-vector-icons/Ionicons", () => ({
        Ionicons: () => null, // Mocking Ionicons as a component
      }));
      
      jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => ({
        MaterialCommunityIcons: () => null, // Mocking MaterialCommunityIcons as a component
      }));

  it('should return default icon and type for unknown sport', () => {
    const unknownSport = "unicorn-sport";
    const { name, type } = getSportIcon(unknownSport);
    
    expect(name).toBe("help-circle");
    expect(type).toBe("Ionicons");
  });

  it('should return correct color for beginner ranking', () => {
    const ranking = "beginner";
    const color = getSkillColor(ranking);

    expect(color).toBe("#228B22");
  });

  it('should return correct color for intermediate ranking', () => {
    const ranking = "intermediate";
    const color = getSkillColor(ranking);

    expect(color).toBe("#FFD700");
  });

  it('should return correct color for advanced ranking', () => {
    const ranking = "advanced";
    const color = getSkillColor(ranking);

    expect(color).toBe("#FF0000");
  });

  it('should return default color for unknown ranking', () => {
    const ranking = "expert";  // Invalid ranking
    const color = getSkillColor(ranking);

    expect(color).toBe("#808080");
  });

  it('should display "None" when no sports are passed', () => {
    const { getByText } = render(<FavoriteSportsBadges sports={[]} />);
    
    expect(getByText("None")).toBeTruthy();
  });

  it('should render sports badges with correct icon and color for known sports', () => {
    const sports = [
        { name: "basketball", ranking: "beginner" },
        { name: "baseball", ranking: "intermediate" },
        { name: "cycling", ranking: "advanced" },
        { name: "ping-pong", ranking: "beginner" },
        { name: "table-tennis", ranking: "intermediate" },
        { name: "tennis", ranking: "advanced" },
        { name: "rugby", ranking: "beginner" },
        { name: "golf", ranking: "intermediate" },
        { name: "hockey", ranking: "advanced" },
        { name: "boxing", ranking: "beginner" },
        { name: "hiking", ranking: "intermediate" },
      ];
    
    const { getByText } = render(<FavoriteSportsBadges sports={sports} />);

    sports.forEach(sport => {
        expect(getByText(sport.name)).toBeTruthy();  // Check if the sport name is rendered
      });
  });


});
