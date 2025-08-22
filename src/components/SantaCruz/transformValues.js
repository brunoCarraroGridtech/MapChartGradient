// This file should hold the data for each pie chart.
//  IMPORTANT: The keys must exactly match the geojson files properties, note its case Sensitive
//  OBS: You can change the name on the assets/desiredJson.json to change the name for the way its formated on ODOO

const categoryColors = {
  'Broken': '#86B049',     
  'Working': '#477998',        
  'Installed': '#F5A623',        
  'No Data Available': '#CCCCCC' 
};

const pieChartData = { //MockData
  'Pontal': [
    { value: 50, name: 'Installed' },
    { value: 20, name: 'Working' },
    { value: 30, name: 'Broken' },
  ],
  'Barrinha': [
    { value: 700, name: 'Installed' },
    { value: 10, name: 'Working' },
    { value: 20, name: 'Broken' },
  ],
  'Dumount': [
    { value: 50, name: 'Installed' },
    { value: 24, name: 'Working' },
    { value: 26, name: 'Broken' },
  ],
};

// default
const defaultData = [
  { value: 1, name: 'No Data Available' }
];

/**
 * 
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