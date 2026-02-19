export const CATEGORIES = [
  {
    id: 'power_cut',
    label: 'Power Cut / Electrical Issues',
    icon: 'flash',
    color: '#FFC107',
  },
  {
    id: 'drainage',
    label: 'Drainage / Sewage Problems',
    icon: 'water',
    color: '#795548',
  },
  {
    id: 'road_damage',
    label: 'Road Damage / Potholes',
    icon: 'car',
    color: '#607D8B',
  },
  {
    id: 'water_supply',
    label: 'Water Supply Issues',
    icon: 'water-outline',
    color: '#03A9F4',
  },
  {
    id: 'garbage',
    label: 'Garbage / Waste Management',
    icon: 'trash',
    color: '#4CAF50',
  },
  {
    id: 'street_light',
    label: 'Street Light Issues',
    icon: 'bulb',
    color: '#FF9800',
  },
  {
    id: 'public_property',
    label: 'Public Property Damage',
    icon: 'business',
    color: '#9C27B0',
  },
  {
    id: 'noise_pollution',
    label: 'Noise Pollution',
    icon: 'volume-high',
    color: '#F44336',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'ellipsis-horizontal',
    color: '#9E9E9E',
  },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
