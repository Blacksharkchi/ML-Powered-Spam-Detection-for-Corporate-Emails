// import { useState, useEffect } from 'react';
// import { useTheme } from '../contexts/ThemeContext';
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
//   Annotation,
//   ZoomableGroup
// } from 'react-simple-maps';
// import { scaleSequential } from 'd3-scale';
// import { interpolateYlOrRd } from 'd3-scale-chromatic';
// import { Loader } from '../components/ui/Loader';
// import { useRouter } from 'next/router';

// const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// const ThreatOriginMap = () => {
//   const { darkMode } = useTheme();
//   const router = useRouter();
//   const [threatData, setThreatData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
//   const [error, setError] = useState(null);

//   // Map interaction state
//   const [hoveredGeo, setHoveredGeo] = useState(null);

//   // Color scale for threat intensity
//   const colorScale = scaleSequential(interpolateYlOrRd)
//     .domain([0, Math.max(...threatData.map(d => d.count))]);

//     useEffect(() => {
//         const fetchThreatData = async () => {
//           try {
//             const response = await fetch('/api/threat-origins');
//             const data = await response.json();
//             setThreatData(data);
//           } catch (error) {
//             setError('Failed to load threat data');
//           } finally {
//             setIsLoading(false);
//           }
//         };
    
//         fetchThreatData();
//     }, []);

//   const handleZoomIn = () => {
//     setPosition(pos => ({
//       ...pos,
//       zoom: pos.zoom * 2
//     }));
//   };

//   const handleZoomOut = () => {
//     setPosition(pos => ({
//       ...pos,
//       zoom: pos.zoom / 2
//     }));
//   };

//   const handleGeographyClick = (geo) => {
//     router.push(`/analytics/${geo.properties.isoA3}`);
//   };

//   if (error) {
//     return (
//       <ChartCard title="Threat Origins">
//         <div className="h-80 flex items-center justify-center text-red-500">
//           {error}
//         </div>
//       </ChartCard>
//     );
//   }

//   return (
//     <ChartCard title="Threat Origin Heatmap">
//       <div className="h-80 relative">
//         {isLoading ? (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Loader size="lg" />
//           </div>
//         ) : (
//           <>
//             <ComposableMap
//               projection="geoMercator"
//               projectionConfig={{
//                 scale: 120 * position.zoom,
//                 center: [position.coordinates[0], position.coordinates[1]]
//               }}
//             >
//               <ZoomableGroup center={position.coordinates} zoom={position.zoom}>
//                 <Geographies geography={geoUrl}>
//                   {({ geographies }) =>
//                     geographies.map(geo => {
//                       const threat = threatData.find(d => d.country === geo.properties.isoA3);
//                       return (
//                         <Geography
//                           key={geo.rsmKey}
//                           geography={geo}
//                           fill={threat ? colorScale(threat.count) : darkMode ? '#374151' : '#f3f4f6'}
//                           stroke={darkMode ? '#4b5563' : '#d1d5db'}
//                           strokeWidth={0.5}
//                           style={{
//                             default: { outline: 'none' },
//                             hover: {
//                               fill: threat ? interpolateYlOrRd(0.8) : darkMode ? '#4b5563' : '#e5e7eb',
//                               outline: 'none'
//                             },
//                             pressed: { outline: 'none' }
//                           }}
//                           onMouseEnter={(e) => {
//                             setHoveredGeo({
//                               ...geo,
//                               threat: threat?.count,
//                               clientX: e.clientX,
//                               clientY: e.clientY
//                             });
//                           }}
//                           onMouseLeave={() => {
//                             setHoveredGeo(null);
//                           }}
//                           onClick={() => handleGeographyClick(geo)}
//                         />
//                       );
//                     })
//                   }
//                 </Geographies>

//                 {threatData
//                   .sort((a, b) => b.count - a.count)
//                   .slice(0, 5)
//                   .map(({ country, count, coordinates }) => (
//                     <Marker key={country} coordinates={coordinates}>
//                       <circle
//                         r={Math.sqrt(count) * 0.6}
//                         fill={colorScale(count)}
//                         fillOpacity={0.4}
//                         stroke={colorScale(count)}
//                         strokeWidth={0.5}
//                       />
//                       <Annotation
//                         subject={coordinates}
//                         dx={15}
//                         dy={-15}
//                         connectorProps={{
//                           stroke: colorScale(count),
//                           strokeWidth: 1,
//                           strokeLinecap: 'round'
//                         }}
//                       >
//                         <text
//                           x="4"
//                           textAnchor="start"
//                           fontSize={12}
//                           fill={darkMode ? '#fff' : '#1f2937'}
//                         >
//                           {count.toLocaleString()}
//                         </text>
//                       </Annotation>
//                     </Marker>
//                   ))}
//               </ZoomableGroup>
//             </ComposableMap>

//             {/* Zoom Controls */}
//             <div className="absolute top-4 right-4 flex flex-col gap-2">
//               <button
//                 onClick={handleZoomIn}
//                 className={`p-2 rounded-lg ${
//                   darkMode 
//                     ? 'bg-gray-800 hover:bg-gray-700 text-white' 
//                     : 'bg-white hover:bg-gray-100 text-gray-900'
//                 } shadow-lg`}
//               >
//                 +
//               </button>
//               <button
//                 onClick={handleZoomOut}
//                 className={`p-2 rounded-lg ${
//                   darkMode 
//                     ? 'bg-gray-800 hover:bg-gray-700 text-white' 
//                     : 'bg-white hover:bg-gray-100 text-gray-900'
//                 } shadow-lg`}
//               >
//                 -
//               </button>
//             </div>

//             {/* Tooltip */}
//             {hoveredGeo && (
//               <div 
//                 className={`absolute p-3 rounded-lg text-sm pointer-events-none transition-opacity ${
//                   darkMode ? 'bg-gray-800 text-white' : 'bg-white shadow-lg text-gray-900'
//                 }`}
//                 style={{
//                   left: hoveredGeo.clientX + 15,
//                   top: hoveredGeo.clientY - 30
//                 }}
//               >
//                 <div className="font-medium">
//                   {hoveredGeo.properties.name}
//                 </div>
//                 {hoveredGeo.threat && (
//                   <div className="text-xs mt-1">
//                     {hoveredGeo.threat.toLocaleString()} threats detected
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </ChartCard>
//   );
// };

// export default ThreatOriginMap;