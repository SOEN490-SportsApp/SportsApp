/**
 * CustomTabMenu Component
 * 
 * How to use: 
 * 
 * This component uses `react-native-tab-view` to create a customizable tab menu. It requires `routes` and `scenes` as props:
 *
 * 1. Define Routes:
 *    - Create an array of route objects, each with a unique `key` and `title`.
 *    - `key` identifies the tab, while `title` displays on the tab.
 * 
 *    - Example:
 *      const routes = [
 *          { key: 'first', title: 'Tab One' },
 *          { key: 'second', title: 'Tab Two' }
 *      ];
 * 
 * 2. Define Scenes for Each Tab:
 *    - Create React components for each tab’s CONTENT.
 *    - Store them in an object where keys match the route keys.
 * 
 *    - Example:
 *      const scenes = {
 *          first: <FirstTabComponent />,
 *          second: <SecondTabComponent />
 *      };
 *
 * 3. Using the Component:
 *    - Pass `routes` and `scenes` as props to `CustomTabMenu`.
 * 
 *    - Example:
 *      <CustomTabMenu routes={routes} scenes={scenes} />;
 *
 *
 * Ensure `react-native-tab-view` is installed to use this component.
 * 
 * for more check: 
 * - https://reactnavigation.org/docs/tab-view/
 * - https://snack.expo.dev/@satya164/react-native-tab-view-custom-tabbar
 */

import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, TabBar, Route, SceneRendererProps, NavigationState } from 'react-native-tab-view';

interface CustomTabMenuProps {
    routes: Route[]; // Array of routes with keys and titles
    scenes: { [key: string]: React.ReactNode };
    backgroundColor: string | null // Scenes without swipe control logic;
    setActiveIndex?: (index: number) => void  
}

const CustomTabMenu: React.FC<CustomTabMenuProps> = ({ routes, scenes, backgroundColor, setActiveIndex = () => {} }) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const handleIndexChange = (index: number) => {
        setIndex(index)
        setActiveIndex(index)
        
    }
    // Function to render the tab bar with custom styling
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={{ backgroundColor }}
            activeColor="black"
            inactiveColor="grey"
            indicatorStyle={{ backgroundColor: 'black', height: 2 }}
            labelStyle={{ fontWeight: 'bold' }}
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={({ route }) => scenes[route.key]}
            onIndexChange={(index:number) => handleIndexChange(index)}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
            swipeEnabled={true} // Disable swipe between tabs
            style={{ flex: 1 }}
        />
    );
};

export default CustomTabMenu;
