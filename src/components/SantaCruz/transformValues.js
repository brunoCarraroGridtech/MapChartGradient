const categoryColors = {
  'Broken': '#DA6C6C',
  'Working': '#BBD8A3',
  'Installed': '#819A91',
  'No Data Available': '#bdc3c7'
};

const pieChartData = {
  'Barra Do Jacaré': [
    { value: 65, name: 'Installed' },
    { value: 50, name: 'Working' },
    { value: 15, name: 'Broken' },
  ],
  'Cambará': [
    { value: 95, name: 'Installed' },
    { value: 80, name: 'Working' },
    { value: 15, name: 'Broken' },
  ],
  'Canitar': [
    { value: 58, name: 'Installed' },
    { value: 45, name: 'Working' },
    { value: 13, name: 'Broken' },
  ],
  'Chavantes': [
    { value: 88, name: 'Installed' },
    { value: 70, name: 'Working' },
    { value: 18, name: 'Broken' },
  ],
  'Jacarezinho': [
    { value: 130, name: 'Installed' },
    { value: 110, name: 'Working' },
    { value: 20, name: 'Broken' },
  ],
  'Ourinhos': [
    { value: 210, name: 'Installed' },
    { value: 180, name: 'Working' },
    { value: 30, name: 'Broken' },
  ],
  'Ribeirão Claro': [
    { value: 105, name: 'Installed' },
    { value: 90, name: 'Working' },
    { value: 15, name: 'Broken' },
  ],
  'São Pedro Do Turvo': [
    { value: 75, name: 'Installed' },
    { value: 60, name: 'Working' },
    { value: 15, name: 'Broken' },
  ],
  'Ubirajara': [
    { value: 62, name: 'Installed' },
    { value: 50, name: 'Working' },
    { value: 12, name: 'Broken' },
  ],
};

const defaultData = [
  { value: 1, name: 'No Data Available' }
];

// ========================== MAP STYLE CONFIG ===============================

// Map styling configuration
const mapConfig = {
  // Map appearance
  style: {
    borderColor: '#333',        // Border color for map regions
    borderWidth: 0.5,           // Border width
    hoverBorderColor: '#000',   // Border color on hover
    hoverBorderWidth: 1,        // Border width on hover
    noDataColor: '#ccc',        // Color for regions with no data
    keepOriginalColorOnHover: true, // Prevent color changes on hover/selection
  },
  
  // Label configuration
  labels: {
    show: true,                 // Show/hide city labels
    color: '#000',              // Label text color
    fontSize: 10,               // Label font size
    hoverColor: '#000',         // Label color on hover
    hoverFontSize: 12,          // Label font size on hover
    fontWeight: 'normal',       // Label font weight
    hoverFontWeight: 'bold',    // Label font weight on hover
  },
  
  // Legend configuration
  legend: {
    show: true,                 // Show/hide legend
    orient: 'horizontal',       // 'horizontal' or 'vertical'
    position: {
      left: 'center',           // 'left', 'center', 'right' or pixel value
      top: 'top',               // 'top', 'middle', 'bottom' or pixel value
    },
    padding: [10, 0, 20, 0],    // [top, right, bottom, left]
    itemGap: 20,                // Space between legend items
    itemWidth: 18,              // Width of legend symbol
    itemHeight: 12,             // Height of legend symbol
    textStyle: {
      color: '#666',            // Legend text color
      fontSize: 12,             // Legend text size
      fontWeight: 'normal',     // Legend text weight
    },
    backgroundColor: 'transparent', // Legend background
    borderWidth: 0,             // Legend border width
    selectedMode: 'multiple',   // 'single', 'multiple', or false
  },
  
  // Tooltip configuration
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Tooltip background
    borderColor: '#ccc',        // Tooltip border color
    borderWidth: 1,             // Tooltip border width
    textStyle: {
      color: '#333',            // Tooltip text color
      fontSize: 12,             // Tooltip font size
    },
    padding: [8, 12],           // Tooltip padding [vertical, horizontal]
  },
  
  // Map interaction
  interaction: {
    roam: true,                 // Enable pan/zoom
    scaleLimit: {               // Zoom limits
      min: 1,
      max: 3.5
    }
  },

  legendZoom: {
    activateLegends: 2
  }
};

/**
 * @param {string} locationName - city name.
 * @returns {Array<Object>} data.
 */
export const getPieDataForLocation = (locationName) => {
  const data = pieChartData[locationName] || defaultData;

  return data.map(item => ({
    ...item,
    itemStyle: {
      color: categoryColors[item.name] || '#A9A9A9'
    }
  }));
};

// Export all configurations
export { categoryColors, mapConfig };