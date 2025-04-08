export default function handler(req, res) {
    // Sample Query
    const mockData = [
      { country: 'KEN', count: 150, coordinates: [37.9062, 0.0236] },
      { country: 'USA', count: 450, coordinates: [-95.7129, 37.0902] },
      { country: 'CHN', count: 380, coordinates: [104.1954, 35.8617] },
      { country: 'BRA', count: 220, coordinates: [-51.9253, -14.2350] },
      { country: 'RUS', count: 290, coordinates: [105.3188, 61.5240] },
    ];
  
    res.status(200).json(mockData);
  }