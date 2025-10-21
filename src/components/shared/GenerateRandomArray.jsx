const GenerateRandomArray = (size = 10) => {
  return Array.from({ length: size }, (_, i) => ({
    id: `item-${i}-${Math.random().toString(36).substr(2, 9)}`, 
    value: Math.floor(Math.random() * 95) + 5,
  }));
};

export default GenerateRandomArray ;