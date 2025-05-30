import countriesData from './countries.json';

export const countries = countriesData.map(c => c.name);

export const getProvinces = (countryName) => {
  const match = countriesData.find(c => c.name === countryName);
  return match?.states?.map(s => s.name) || [];
};
