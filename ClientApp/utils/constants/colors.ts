const themeColors = {
  primary: '#0C9E04', // Primary brand color (green)
  secondary: '#0278A0', // Complementary blue for secondary elements
  accent: '#FFD700', // Gold accent color for highlights and focus elements

  background: {
    light: '#FFFFFF', // White background for light mode
    lightGrey: '#F2F2F2', // Light grey for subtle backgrounds or section dividers
    dark: '#333333', // Dark background for dark mode
  },

  text: {
    dark: '#333333', // Dark text for readability on light backgrounds
    grey: '#666666', // Grey text for less emphasized text
    light: '#FFFFFF', // Light text for buttons or dark backgrounds
    error: '#ff3333', // Text error in red
    link: 'blue', // Links should be in blue
    lightGrey: '#aaa', // Icon light grey used for text
  },

  button: {
    primaryBackground: '#0C9E04', // Primary button background color
    secondaryBackground: '#0278A0', // Secondary button background color
  },

  inputContainer: {
    backgroundColor: '#F2F2F2', // Light greyish background for inputs
  },

  success: '#28A745', // Success messages or icons (green shade)
  warning: '#FFA500', // Warning messages or icons (orange)
  error: '#DC3545', // Error messages or icons (red)

  border: {
    light: '#E0E0E0', // Light border color for outlines or dividers
    dark: '#CCCCCC', // Darker border for higher emphasis
  },

  sportIcons: {
    beginner: 'green', // Plain green for beginner sport choices
    intermediate: '#ffa700', // Yellow designed for icons when intermediate is selected
    advanced: '#DC3545', // Red colour for advanced
    lightGrey: '#aaa', // Used for shading the background of the icons that arent used and undertext
  },
};

export default themeColors;
