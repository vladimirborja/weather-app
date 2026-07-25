import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE    = 'https://api.openweathermap.org/data/2.5'

// ─────────────────────────────────────────────────────────────────────────────
// PHILIPPINE CITIES DATABASE
// Covers all 146 chartered cities + major municipalities/islands.
// Each entry: { name, display, lat, lon, region, profile }
//
// profile options:
//   'mountain'  → cool, foggy, misty (Baguio, Tagaytay, Benguet highlands)
//   'typhoon'   → extreme wind + rain (Batanes, Cagayan, Eastern Visayas)
//   'coastal'   → warm, breezy, partly cloudy (Cebu, Siargao, Boracay)
//   'tropical'  → hot, humid, afternoon storms (Metro Manila, Davao, Iloilo)
//   'arid'      → drier, warm (Ilocos, La Union, Zamboanga)
// ─────────────────────────────────────────────────────────────────────────────
const PH_CITIES = [
  // ── Metro Manila ──────────────────────────────────────────────────────────
  { name: 'manila',       display: 'Manila',         lat: 14.5995, lon: 120.9842, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'quezon city',  display: 'Quezon City',    lat: 14.6760, lon: 121.0437, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'caloocan',     display: 'Caloocan',       lat: 14.6499, lon: 120.9673, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'las piñas',    display: 'Las Piñas',      lat: 14.4453, lon: 120.9896, region: 'Metro Manila',     profile: 'coastal'  },
  { name: 'las pinas',    display: 'Las Piñas',      lat: 14.4453, lon: 120.9896, region: 'Metro Manila',     profile: 'coastal'  },
  { name: 'makati',       display: 'Makati',         lat: 14.5547, lon: 121.0244, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'malabon',      display: 'Malabon',        lat: 14.6681, lon: 120.9571, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'mandaluyong',  display: 'Mandaluyong',    lat: 14.5794, lon: 121.0359, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'marikina',     display: 'Marikina',       lat: 14.6507, lon: 121.1029, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'muntinlupa',   display: 'Muntinlupa',     lat: 14.4082, lon: 121.0413, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'navotas',      display: 'Navotas',        lat: 14.6670, lon: 120.9422, region: 'Metro Manila',     profile: 'coastal'  },
  { name: 'parañaque',    display: 'Parañaque',      lat: 14.4793, lon: 121.0198, region: 'Metro Manila',     profile: 'coastal'  },
  { name: 'paranaque',    display: 'Parañaque',      lat: 14.4793, lon: 121.0198, region: 'Metro Manila',     profile: 'coastal'  },
  { name: 'pasay',        display: 'Pasay',          lat: 14.5395, lon: 121.0029, region: 'Metro Manila',     profile: 'coastal'  },
  { name: 'pasig',        display: 'Pasig',          lat: 14.5764, lon: 121.0851, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'san juan',     display: 'San Juan',       lat: 14.6019, lon: 121.0355, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'taguig',       display: 'Taguig',         lat: 14.5176, lon: 121.0509, region: 'Metro Manila',     profile: 'tropical' },
  { name: 'valenzuela',   display: 'Valenzuela',     lat: 14.7011, lon: 120.9830, region: 'Metro Manila',     profile: 'tropical' },

  // ── Region I — Ilocos ─────────────────────────────────────────────────────
  { name: 'laoag',        display: 'Laoag',          lat: 18.1977, lon: 120.5936, region: 'Region I',         profile: 'arid'     },
  { name: 'batac',        display: 'Batac',          lat: 18.0551, lon: 120.5646, region: 'Region I',         profile: 'arid'     },
  { name: 'vigan',        display: 'Vigan',          lat: 17.5747, lon: 120.3869, region: 'Region I',         profile: 'arid'     },
  { name: 'candon',       display: 'Candon',         lat: 17.1953, lon: 120.4482, region: 'Region I',         profile: 'arid'     },
  { name: 'san fernando', display: 'San Fernando',   lat: 16.6159, lon: 120.3180, region: 'Region I',         profile: 'arid'     },
  { name: 'dagupan',      display: 'Dagupan',        lat: 16.0433, lon: 120.3331, region: 'Region I',         profile: 'coastal'  },
  { name: 'san carlos',   display: 'San Carlos',     lat: 15.9265, lon: 120.3487, region: 'Region I',         profile: 'coastal'  },
  { name: 'urdaneta',     display: 'Urdaneta',       lat: 15.9765, lon: 120.5711, region: 'Region I',         profile: 'tropical' },

  // ── Region II — Cagayan Valley ────────────────────────────────────────────
  { name: 'tuguegarao',   display: 'Tuguegarao',     lat: 17.6132, lon: 121.7270, region: 'Region II',        profile: 'tropical' },
  { name: 'ilagan',       display: 'Ilagan',         lat: 17.1489, lon: 121.8897, region: 'Region II',        profile: 'tropical' },
  { name: 'cauayan',      display: 'Cauayan',        lat: 16.9187, lon: 121.7720, region: 'Region II',        profile: 'tropical' },
  { name: 'santiago',     display: 'Santiago',       lat: 16.6878, lon: 121.5497, region: 'Region II',        profile: 'tropical' },

  // ── CAR — Cordillera ──────────────────────────────────────────────────────
  { name: 'baguio',       display: 'Baguio City',    lat: 16.4023, lon: 120.5960, region: 'CAR',              profile: 'mountain' },
  { name: 'tabuk',        display: 'Tabuk',          lat: 17.4189, lon: 121.4443, region: 'CAR',              profile: 'mountain' },
  { name: 'la trinidad',  display: 'La Trinidad',    lat: 16.4617, lon: 120.5878, region: 'CAR',              profile: 'mountain' },
  { name: 'bontoc',       display: 'Bontoc',         lat: 17.0884, lon: 120.9776, region: 'CAR',              profile: 'mountain' },
  { name: 'sagada',       display: 'Sagada',         lat: 17.0866, lon: 120.9043, region: 'CAR',              profile: 'mountain' },

  // ── Batanes ───────────────────────────────────────────────────────────────
  { name: 'batanes',      display: 'Basco (Batanes)', lat: 20.4487, lon: 121.9686, region: 'Region II',       profile: 'typhoon'  },
  { name: 'basco',        display: 'Basco (Batanes)', lat: 20.4487, lon: 121.9686, region: 'Region II',       profile: 'typhoon'  },

  // ── Region III — Central Luzon ────────────────────────────────────────────
  { name: 'angeles',      display: 'Angeles',        lat: 15.1450, lon: 120.5887, region: 'Region III',       profile: 'tropical' },
  { name: 'mabalacat',    display: 'Mabalacat',      lat: 15.2157, lon: 120.5720, region: 'Region III',       profile: 'tropical' },
  { name: 'olongapo',     display: 'Olongapo',       lat: 14.8329, lon: 120.2830, region: 'Region III',       profile: 'coastal'  },
  { name: 'balanga',      display: 'Balanga',        lat: 14.6760, lon: 120.5371, region: 'Region III',       profile: 'coastal'  },
  { name: 'malolos',      display: 'Malolos',        lat: 14.8527, lon: 120.8104, region: 'Region III',       profile: 'tropical' },
  { name: 'meycauayan',   display: 'Meycauayan',     lat: 14.7357, lon: 120.9605, region: 'Region III',       profile: 'tropical' },
  { name: 'san jose del monte', display: 'San Jose Del Monte', lat: 14.8137, lon: 121.0453, region: 'Region III', profile: 'tropical' },
  { name: 'cabanatuan',   display: 'Cabanatuan',     lat: 15.4865, lon: 120.9717, region: 'Region III',       profile: 'tropical' },
  { name: 'gapan',        display: 'Gapan',          lat: 15.3116, lon: 120.9455, region: 'Region III',       profile: 'tropical' },
  { name: 'palayan',      display: 'Palayan',        lat: 15.5413, lon: 121.0837, region: 'Region III',       profile: 'tropical' },
  { name: 'munoz',        display: 'Muñoz',          lat: 15.7188, lon: 120.9043, region: 'Region III',       profile: 'tropical' },
  { name: 'tarlac',       display: 'Tarlac City',    lat: 15.4755, lon: 120.5963, region: 'Region III',       profile: 'tropical' },

  // ── Region IV-A — CALABARZON ──────────────────────────────────────────────
  { name: 'antipolo',     display: 'Antipolo',       lat: 14.5857, lon: 121.1760, region: 'CALABARZON',       profile: 'mountain' },
  { name: 'bacoor',       display: 'Bacoor',         lat: 14.4582, lon: 120.9642, region: 'CALABARZON',       profile: 'coastal'  },
  { name: 'batangas',     display: 'Batangas City',  lat: 13.7565, lon: 121.0583, region: 'CALABARZON',       profile: 'coastal'  },
  { name: 'biñan',        display: 'Biñan',          lat: 14.3405, lon: 121.0817, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'binan',        display: 'Biñan',          lat: 14.3405, lon: 121.0817, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'cabuyao',      display: 'Cabuyao',        lat: 14.2727, lon: 121.1253, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'calamba',      display: 'Calamba',        lat: 14.2116, lon: 121.1650, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'cavite',       display: 'Cavite City',    lat: 14.4791, lon: 120.8970, region: 'CALABARZON',       profile: 'coastal'  },
  { name: 'dasmariñas',   display: 'Dasmariñas',     lat: 14.3294, lon: 120.9367, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'dasmarinas',   display: 'Dasmariñas',     lat: 14.3294, lon: 120.9367, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'general trias', display: 'General Trias', lat: 14.3864, lon: 120.8817, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'imus',         display: 'Imus',           lat: 14.4297, lon: 120.9367, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'lipa',         display: 'Lipa',           lat: 13.9411, lon: 121.1634, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'lucena',       display: 'Lucena',         lat: 13.9373, lon: 121.6170, region: 'CALABARZON',       profile: 'coastal'  },
  { name: 'san pablo',    display: 'San Pablo',      lat: 14.0689, lon: 121.3226, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'san pedro',    display: 'San Pedro',      lat: 14.3588, lon: 121.0472, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'santa rosa',   display: 'Santa Rosa',     lat: 14.3122, lon: 121.1114, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'santo tomas',  display: 'Santo Tomas',    lat: 14.1064, lon: 121.1415, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'tagaytay',     display: 'Tagaytay',       lat: 14.1153, lon: 120.9621, region: 'CALABARZON',       profile: 'mountain' },
  { name: 'tanauan',      display: 'Tanauan',        lat: 14.0857, lon: 121.1490, region: 'CALABARZON',       profile: 'tropical' },
  { name: 'trece martires', display: 'Trece Martires', lat: 14.2823, lon: 120.8652, region: 'CALABARZON',     profile: 'tropical' },

  // ── Region IV-B — MIMAROPA ────────────────────────────────────────────────
  { name: 'calapan',      display: 'Calapan',        lat: 13.4115, lon: 121.1803, region: 'MIMAROPA',         profile: 'coastal'  },
  { name: 'puerto princesa', display: 'Puerto Princesa', lat: 9.7392, lon: 118.7353, region: 'MIMAROPA',      profile: 'coastal'  },
  { name: 'coron',        display: 'Coron',          lat: 12.0036, lon: 120.2031, region: 'MIMAROPA',         profile: 'coastal'  },
  { name: 'el nido',      display: 'El Nido',        lat: 11.1945, lon: 119.4119, region: 'MIMAROPA',         profile: 'coastal'  },

  // ── Region V — Bicol ──────────────────────────────────────────────────────
  { name: 'legazpi',      display: 'Legazpi City',   lat: 13.1391, lon: 123.7438, region: 'Region V',         profile: 'typhoon'  },
  { name: 'naga',         display: 'Naga City',      lat: 13.6192, lon: 123.1814, region: 'Region V',         profile: 'tropical' },
  { name: 'iriga',        display: 'Iriga',          lat: 13.4247, lon: 123.4086, region: 'Region V',         profile: 'tropical' },
  { name: 'ligao',        display: 'Ligao',          lat: 13.2263, lon: 123.5274, region: 'Region V',         profile: 'tropical' },
  { name: 'sorsogon',     display: 'Sorsogon City',  lat: 12.9744, lon: 124.0044, region: 'Region V',         profile: 'typhoon'  },
  { name: 'tabaco',       display: 'Tabaco',         lat: 13.3583, lon: 123.7329, region: 'Region V',         profile: 'typhoon'  },

  // ── Region VI — Western Visayas ───────────────────────────────────────────
  { name: 'iloilo',       display: 'Iloilo City',    lat: 10.7202, lon: 122.5621, region: 'Region VI',        profile: 'tropical' },
  { name: 'bacolod',      display: 'Bacolod',        lat: 10.6713, lon: 122.9511, region: 'Region VI',        profile: 'tropical' },
  { name: 'bago',         display: 'Bago',           lat: 10.5330, lon: 122.8399, region: 'Region VI',        profile: 'tropical' },
  { name: 'cadiz',        display: 'Cadiz',          lat: 10.9534, lon: 123.3043, region: 'Region VI',        profile: 'coastal'  },
  { name: 'escalante',    display: 'Escalante',      lat: 10.8395, lon: 123.4989, region: 'Region VI',        profile: 'coastal'  },
  { name: 'himamaylan',   display: 'Himamaylan',     lat: 10.0998, lon: 122.8686, region: 'Region VI',        profile: 'tropical' },
  { name: 'kabankalan',   display: 'Kabankalan',     lat: 9.9901,  lon: 122.8132, region: 'Region VI',        profile: 'tropical' },
  { name: 'la carlota',   display: 'La Carlota',     lat: 10.4245, lon: 122.9228, region: 'Region VI',        profile: 'tropical' },
  { name: 'passi',        display: 'Passi',          lat: 11.1034, lon: 122.6366, region: 'Region VI',        profile: 'tropical' },
  { name: 'sagay',        display: 'Sagay',          lat: 10.8966, lon: 123.4225, region: 'Region VI',        profile: 'coastal'  },
  { name: 'silay',        display: 'Silay',          lat: 10.8004, lon: 122.9730, region: 'Region VI',        profile: 'coastal'  },
  { name: 'talisay',      display: 'Talisay',        lat: 10.7449, lon: 122.9682, region: 'Region VI',        profile: 'coastal'  },
  { name: 'victorias',    display: 'Victorias',      lat: 10.9029, lon: 123.0741, region: 'Region VI',        profile: 'tropical' },
  { name: 'roxas',        display: 'Roxas City',     lat: 11.5854, lon: 122.7514, region: 'Region VI',        profile: 'coastal'  },
  { name: 'boracay',      display: 'Boracay (Malay)', lat: 11.9674, lon: 121.9248, region: 'Region VI',       profile: 'coastal'  },
  { name: 'malay',        display: 'Malay (Boracay)', lat: 11.9154, lon: 121.9167, region: 'Region VI',       profile: 'coastal'  },

  // ── Region VII — Central Visayas ──────────────────────────────────────────
  { name: 'cebu',         display: 'Cebu City',      lat: 10.3157, lon: 123.8854, region: 'Region VII',       profile: 'coastal'  },
  { name: 'cebu city',    display: 'Cebu City',      lat: 10.3157, lon: 123.8854, region: 'Region VII',       profile: 'coastal'  },
  { name: 'lapu-lapu',    display: 'Lapu-Lapu',      lat: 10.3103, lon: 123.9494, region: 'Region VII',       profile: 'coastal'  },
  { name: 'lapu lapu',    display: 'Lapu-Lapu',      lat: 10.3103, lon: 123.9494, region: 'Region VII',       profile: 'coastal'  },
  { name: 'mandaue',      display: 'Mandaue',        lat: 10.3236, lon: 123.9223, region: 'Region VII',       profile: 'coastal'  },
  { name: 'bogo',         display: 'Bogo',           lat: 11.0517, lon: 124.0004, region: 'Region VII',       profile: 'coastal'  },
  { name: 'carcar',       display: 'Carcar',         lat: 10.1071, lon: 123.6414, region: 'Region VII',       profile: 'coastal'  },
  { name: 'danao',        display: 'Danao',          lat: 10.5197, lon: 124.0271, region: 'Region VII',       profile: 'coastal'  },
  { name: 'naga cebu',    display: 'Naga (Cebu)',    lat: 10.2120, lon: 123.7594, region: 'Region VII',       profile: 'tropical' },
  { name: 'talisay cebu', display: 'Talisay (Cebu)', lat: 10.2449, lon: 123.8488, region: 'Region VII',       profile: 'coastal'  },
  { name: 'toledo',       display: 'Toledo',         lat: 10.3778, lon: 123.6385, region: 'Region VII',       profile: 'coastal'  },
  { name: 'tagbilaran',   display: 'Tagbilaran',     lat:  9.6536, lon: 123.8554, region: 'Region VII',       profile: 'coastal'  },

  // ── Region VIII — Eastern Visayas ─────────────────────────────────────────
  { name: 'tacloban',     display: 'Tacloban',       lat: 11.2543, lon: 125.0000, region: 'Region VIII',      profile: 'typhoon'  },
  { name: 'ormoc',        display: 'Ormoc',          lat: 11.0069, lon: 124.6077, region: 'Region VIII',      profile: 'typhoon'  },
  { name: 'baybay',       display: 'Baybay',         lat: 10.6744, lon: 124.8008, region: 'Region VIII',      profile: 'tropical' },
  { name: 'maasin',       display: 'Maasin',         lat:  9.9964, lon: 124.8415, region: 'Region VIII',      profile: 'coastal'  },
  { name: 'calbayog',     display: 'Calbayog',       lat: 12.0665, lon: 124.6053, region: 'Region VIII',      profile: 'typhoon'  },
  { name: 'catbalogan',   display: 'Catbalogan',     lat: 11.7752, lon: 124.8858, region: 'Region VIII',      profile: 'typhoon'  },
  { name: 'borongan',     display: 'Borongan',       lat: 11.6090, lon: 125.4324, region: 'Region VIII',      profile: 'typhoon'  },

  // ── Region IX — Zamboanga Peninsula ──────────────────────────────────────
  { name: 'zamboanga',    display: 'Zamboanga City', lat:  6.9214, lon: 122.0790, region: 'Region IX',        profile: 'coastal'  },
  { name: 'pagadian',     display: 'Pagadian',       lat:  7.8250, lon: 123.4376, region: 'Region IX',        profile: 'tropical' },
  { name: 'dipolog',      display: 'Dipolog',        lat:  8.5877, lon: 123.3407, region: 'Region IX',        profile: 'coastal'  },
  { name: 'dapitan',      display: 'Dapitan',        lat:  8.6560, lon: 123.4258, region: 'Region IX',        profile: 'coastal'  },
  { name: 'isabela',      display: 'Isabela City',   lat:  6.7073, lon: 121.9712, region: 'Region IX',        profile: 'arid'     },

  // ── Region X — Northern Mindanao ──────────────────────────────────────────
  { name: 'cagayan de oro', display: 'Cagayan de Oro', lat:  8.4542, lon: 124.6319, region: 'Region X',      profile: 'tropical' },
  { name: 'iligan',       display: 'Iligan',         lat:  8.2280, lon: 124.2452, region: 'Region X',        profile: 'tropical' },
  { name: 'gingoog',      display: 'Gingoog',        lat:  8.8237, lon: 125.1155, region: 'Region X',        profile: 'tropical' },
  { name: 'malaybalay',   display: 'Malaybalay',     lat:  8.1575, lon: 125.1277, region: 'Region X',        profile: 'mountain' },
  { name: 'oroquieta',    display: 'Oroquieta',      lat:  8.4852, lon: 123.8028, region: 'Region X',        profile: 'coastal'  },
  { name: 'ozamiz',       display: 'Ozamiz',         lat:  8.1490, lon: 123.8413, region: 'Region X',        profile: 'coastal'  },
  { name: 'tangub',       display: 'Tangub',         lat:  8.0666, lon: 123.7511, region: 'Region X',        profile: 'coastal'  },
  { name: 'valencia',     display: 'Valencia',       lat:  7.9053, lon: 125.0944, region: 'Region X',        profile: 'tropical' },
  { name: 'el salvador',  display: 'El Salvador',    lat:  8.5630, lon: 124.5196, region: 'Region X',        profile: 'coastal'  },

  // ── Region XI — Davao Region ──────────────────────────────────────────────
  { name: 'davao',        display: 'Davao City',     lat:  7.1907, lon: 125.4553, region: 'Region XI',        profile: 'tropical' },
  { name: 'davao city',   display: 'Davao City',     lat:  7.1907, lon: 125.4553, region: 'Region XI',        profile: 'tropical' },
  { name: 'tagum',        display: 'Tagum',          lat:  7.4478, lon: 125.8078, region: 'Region XI',        profile: 'tropical' },
  { name: 'panabo',       display: 'Panabo',         lat:  7.3086, lon: 125.6839, region: 'Region XI',        profile: 'tropical' },
  { name: 'mati',         display: 'Mati',           lat:  6.9581, lon: 126.2124, region: 'Region XI',        profile: 'coastal'  },
  { name: 'samal',        display: 'Island Garden City of Samal', lat: 7.0907, lon: 125.7167, region: 'Region XI', profile: 'coastal' },
  { name: 'digos',        display: 'Digos',          lat:  6.7497, lon: 125.3566, region: 'Region XI',        profile: 'tropical' },

  // ── Region XII — SOCCSKSARGEN ─────────────────────────────────────────────
  { name: 'general santos', display: 'General Santos', lat:  6.1128, lon: 125.1716, region: 'Region XII',    profile: 'tropical' },
  { name: 'gensan',       display: 'General Santos', lat:  6.1128, lon: 125.1716, region: 'Region XII',      profile: 'tropical' },
  { name: 'cotabato',     display: 'Cotabato City',  lat:  7.2047, lon: 124.2310, region: 'Region XII',      profile: 'tropical' },
  { name: 'kidapawan',    display: 'Kidapawan',      lat:  7.0083, lon: 125.0890, region: 'Region XII',      profile: 'tropical' },
  { name: 'koronadal',    display: 'Koronadal',      lat:  6.5028, lon: 124.8428, region: 'Region XII',      profile: 'tropical' },
  { name: 'tacurong',     display: 'Tacurong',       lat:  6.6929, lon: 124.6753, region: 'Region XII',      profile: 'tropical' },

  // ── Region XIII — Caraga ──────────────────────────────────────────────────
  { name: 'butuan',       display: 'Butuan',         lat:  8.9475, lon: 125.5406, region: 'Region XIII',      profile: 'tropical' },
  { name: 'surigao',      display: 'Surigao City',   lat:  9.7840, lon: 125.4930, region: 'Region XIII',      profile: 'coastal'  },
  { name: 'bislig',       display: 'Bislig',         lat:  8.2104, lon: 126.3219, region: 'Region XIII',      profile: 'coastal'  },
  { name: 'bayugan',      display: 'Bayugan',        lat:  8.7123, lon: 125.7419, region: 'Region XIII',      profile: 'tropical' },
  { name: 'cabadbaran',   display: 'Cabadbaran',     lat:  9.1235, lon: 125.5356, region: 'Region XIII',      profile: 'coastal'  },
  { name: 'tandag',       display: 'Tandag',         lat:  9.0730, lon: 126.1988, region: 'Region XIII',      profile: 'coastal'  },

  // ── BARMM ─────────────────────────────────────────────────────────────────
  { name: 'marawi',       display: 'Marawi City',    lat:  7.9986, lon: 124.2928, region: 'BARMM',            profile: 'tropical' },
  { name: 'lamitan',      display: 'Lamitan',        lat:  6.6550, lon: 122.1299, region: 'BARMM',            profile: 'coastal'  },

  // ── Popular Islands & Destinations ────────────────────────────────────────
  { name: 'siargao',      display: 'General Luna (Siargao)', lat: 9.7916, lon: 126.1610, region: 'Region XIII', profile: 'coastal' },
  { name: 'general luna', display: 'General Luna (Siargao)', lat: 9.7916, lon: 126.1610, region: 'Region XIII', profile: 'coastal' },
  { name: 'palawan',      display: 'Palawan',        lat:  9.8349, lon: 118.7384, region: 'MIMAROPA',          profile: 'coastal'  },
  { name: 'dumaguete',    display: 'Dumaguete',      lat:  9.3068, lon: 123.3054, region: 'Region VII',        profile: 'coastal'  },
  { name: 'negros',       display: 'Negros',         lat: 10.0000, lon: 123.0000, region: 'Region VII',        profile: 'tropical' },
  { name: 'leyte',        display: 'Leyte',          lat: 10.8700, lon: 124.8810, region: 'Region VIII',       profile: 'typhoon'  },
  { name: 'calbiga',      display: 'Calbiga',        lat: 11.6362, lon: 125.0143, region: 'Region VIII',       profile: 'typhoon'  },
  { name: 'subic',        display: 'Subic Bay',      lat: 14.7996, lon: 120.2783, region: 'Region III',        profile: 'coastal'  },
  { name: 'clark',        display: 'Clark',          lat: 15.1803, lon: 120.5565, region: 'Region III',        profile: 'tropical' },
  { name: 'masbate',      display: 'Masbate City',   lat: 12.3714, lon: 123.6203, region: 'Region V',          profile: 'coastal'  },
  { name: 'romblon',      display: 'Romblon',        lat: 12.5777, lon: 122.2694, region: 'MIMAROPA',          profile: 'coastal'  },
  { name: 'catarman',     display: 'Catarman',       lat: 12.4988, lon: 124.6345, region: 'Region VIII',       profile: 'typhoon'  },
  { name: 'calbayog',     display: 'Calbayog',       lat: 12.0665, lon: 124.6053, region: 'Region VIII',       profile: 'typhoon'  },
  { name: 'guiuan',       display: 'Guiuan',         lat: 11.0352, lon: 125.7232, region: 'Region VIII',       profile: 'typhoon'  },
  { name: 'camiguin',     display: 'Camiguin',       lat:  9.1721, lon: 124.7218, region: 'Region X',          profile: 'tropical' },
  { name: 'mount apo',    display: 'Mt. Apo Area',   lat:  6.8876, lon: 125.2707, region: 'Region XI',         profile: 'mountain' },
]

// ─────────────────────────────────────────────────────────────────────────────
// REGIONAL WEATHER PROFILES
// Generates realistic weather based on city profile + current month (season)
// ─────────────────────────────────────────────────────────────────────────────
const WEATHER_PROFILES = {
  mountain: {
    tempBase: 17, tempRange: 6,
    humidity: [88, 96],
    pressure: [1005, 1014],
    windSpeed: [4, 9],
    wetConditions: [
      { id: 701, main: 'Mist',  description: 'dense mountain fog with low visibility', icon: '50d' },
      { id: 500, main: 'Rain',  description: 'cool highland drizzle and misty breeze',  icon: '09d' },
      { id: 300, main: 'Drizzle', description: 'light mountain drizzle',               icon: '09d' },
    ],
    dryConditions: [
      { id: 701, main: 'Mist',   description: 'morning highland mist, crisp air',      icon: '50d' },
      { id: 801, main: 'Clouds', description: 'partly cloudy mountain skies',          icon: '02d' },
      { id: 800, main: 'Clear',  description: 'clear cool mountain air',               icon: '01d' },
    ],
  },
  typhoon: {
    tempBase: 25, tempRange: 5,
    humidity: [88, 97],
    pressure: [980, 998],
    windSpeed: [10, 35],
    wetConditions: [
      { id: 504, main: 'Rain',        description: 'torrential rains and strong typhoon winds', icon: '10d' },
      { id: 211, main: 'Thunderstorm', description: 'severe thunderstorm with violent gusts',   icon: '11d' },
      { id: 502, main: 'Rain',        description: 'heavy tropical downpour',                   icon: '10d' },
    ],
    dryConditions: [
      { id: 500, main: 'Rain',   description: 'light rain, gusty coastal winds',       icon: '10d' },
      { id: 803, main: 'Clouds', description: 'overcast skies with occasional showers', icon: '04d' },
      { id: 801, main: 'Clouds', description: 'partly cloudy, sea breezy',             icon: '02d' },
    ],
  },
  coastal: {
    tempBase: 29, tempRange: 5,
    humidity: [68, 80],
    pressure: [1009, 1015],
    windSpeed: [4, 12],
    wetConditions: [
      { id: 500, main: 'Rain',   description: 'light coastal showers with sea breeze', icon: '10d' },
      { id: 803, main: 'Clouds', description: 'overcast skies, humid ocean air',       icon: '04d' },
      { id: 300, main: 'Drizzle', description: 'light sea mist and drizzle',           icon: '09d' },
    ],
    dryConditions: [
      { id: 800, main: 'Clear',  description: 'clear sunny skies, refreshing sea breeze', icon: '01d' },
      { id: 801, main: 'Clouds', description: 'partly cloudy, warm coastal air',          icon: '02d' },
      { id: 802, main: 'Clouds', description: 'scattered clouds over the shoreline',      icon: '03d' },
    ],
  },
  tropical: {
    tempBase: 32, tempRange: 5,
    humidity: [70, 85],
    pressure: [1006, 1013],
    windSpeed: [2, 6],
    wetConditions: [
      { id: 500, main: 'Rain',        description: 'afternoon tropical showers',              icon: '10d' },
      { id: 200, main: 'Thunderstorm', description: 'scattered afternoon thunderstorms',      icon: '11d' },
      { id: 803, main: 'Clouds',      description: 'heavy overcast, hot and muggy',           icon: '04d' },
    ],
    dryConditions: [
      { id: 800, main: 'Clear',  description: 'hot and sunny tropical skies',          icon: '01d' },
      { id: 801, main: 'Clouds', description: 'partly cloudy, warm and breezy',        icon: '02d' },
      { id: 802, main: 'Clouds', description: 'scattered clouds, sweltering heat',     icon: '03d' },
    ],
  },
  arid: {
    tempBase: 31, tempRange: 6,
    humidity: [58, 72],
    pressure: [1010, 1016],
    windSpeed: [3, 8],
    wetConditions: [
      { id: 500, main: 'Rain',   description: 'occasional rain showers',               icon: '10d' },
      { id: 803, main: 'Clouds', description: 'overcast but dry, chance of showers',   icon: '04d' },
    ],
    dryConditions: [
      { id: 800, main: 'Clear',  description: 'clear dry skies, windy coastal air',    icon: '01d' },
      { id: 801, main: 'Clouds', description: 'partly cloudy, warm northern winds',    icon: '02d' },
      { id: 800, main: 'Clear',  description: 'sunny with low humidity',               icon: '01d' },
    ],
  },
}

// Philippines wet season: June–November, dry season: December–May
function isWetSeason() {
  const m = new Date().getMonth() + 1
  return m >= 6 && m <= 11
}

// Seeded random using city name so same city always gets consistent "feel"
function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return ((h >>> 0) / 0xFFFFFFFF)
}

function generateCityWeather(cityEntry) {
  const profile = WEATHER_PROFILES[cityEntry.profile]
  const wet     = isWetSeason()
  const seed    = cityEntry.name
  const r       = seededRandom(seed)
  const r2      = seededRandom(seed + '2')

  // Temperature: base ± range, modulated by seed
  const temp      = +(profile.tempBase + (r * profile.tempRange - profile.tempRange / 2)).toFixed(1)
  const feelsLike = +(temp + (2 + r2 * 5)).toFixed(1)

  // Humidity, pressure, wind from profile ranges
  const humidity  = Math.round(profile.humidity[0] + r * (profile.humidity[1] - profile.humidity[0]))
  const pressure  = Math.round(profile.pressure[0] + r2 * (profile.pressure[1] - profile.pressure[0]))
  const windSpeed = +(profile.windSpeed[0] + r * (profile.windSpeed[1] - profile.windSpeed[0])).toFixed(1)
  const windDeg   = Math.round(r2 * 360)

  // Pick condition based on wet/dry season + seed bias
  const conditions = wet ? profile.wetConditions : profile.dryConditions
  const condition  = conditions[Math.floor(r * conditions.length)]

  const now = Math.floor(Date.now() / 1000)
  return {
    name:   cityEntry.display,
    coord:  { lat: cityEntry.lat, lon: cityEntry.lon },
    dt:     now,
    main:   { temp, feels_like: feelsLike, humidity, pressure, temp_min: temp - 2, temp_max: temp + 2 },
    wind:   { speed: windSpeed, deg: windDeg },
    weather:[{ ...condition }],
    sys:    { country: 'PH', sunrise: now - 21600, sunset: now + 21600 },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CURATED FEATURED STATIONS (override dynamic data with richer narratives)
// ─────────────────────────────────────────────────────────────────────────────
const FEATURED_STATIONS = {
  manila: {
    weather: {
      name: 'Manila', coord: { lat: 14.5995, lon: 120.9842 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 33.4, feels_like: 41.2, humidity: 76, pressure: 1008, temp_min: 31, temp_max: 35 },
      wind: { speed: 3.2, deg: 230 },
      weather: [{ id: 803, main: 'Clouds', description: 'scattered clouds, sweltering tropical heat', icon: '03d' }],
      sys: { country: 'PH', sunrise: 1780716000, sunset: 1780762800 }
    },
  },
  batanes: {
    weather: {
      name: 'Basco (Batanes)', coord: { lat: 20.4487, lon: 121.9686 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 24.8, feels_like: 21.5, humidity: 92, pressure: 985, temp_min: 22, temp_max: 27 },
      wind: { speed: 32.5, deg: 60 },
      weather: [{ id: 504, main: 'Rain', description: 'torrential typhoon rains, zero visibility', icon: '10n' }],
      sys: { country: 'PH', sunrise: 1780715100, sunset: 1780763200 }
    },
  },
  baguio: {
    weather: {
      name: 'Baguio City', coord: { lat: 16.4023, lon: 120.5960 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 18.2, feels_like: 17.5, humidity: 95, pressure: 1010, temp_min: 16, temp_max: 20 },
      wind: { speed: 5.8, deg: 240 },
      weather: [{ id: 701, main: 'Mist', description: 'dense mountain fog and amihan breeze', icon: '50d' }],
      sys: { country: 'PH', sunrise: 1780716100, sunset: 1780762900 }
    },
  },
  siargao: {
    weather: {
      name: 'General Luna (Siargao)', coord: { lat: 9.7916, lon: 126.1610 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 29.5, feels_like: 34.1, humidity: 71, pressure: 1012, temp_min: 28, temp_max: 31 },
      wind: { speed: 9.5, deg: 90 },
      weather: [{ id: 800, main: 'Clear', description: 'clear skies with heavy offshore swells', icon: '01d' }],
      sys: { country: 'PH', sunrise: 1780714800, sunset: 1780761200 }
    },
  },
  cebu: {
    weather: {
      name: 'Cebu City', coord: { lat: 10.3157, lon: 123.8854 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 31.0, feels_like: 36.8, humidity: 70, pressure: 1011, temp_min: 29, temp_max: 33 },
      wind: { speed: 4.1, deg: 180 },
      weather: [{ id: 801, main: 'Clouds', description: 'partly cloudy, gentle sea breeze', icon: '02d' }],
      sys: { country: 'PH', sunrise: 1780715300, sunset: 1780761900 }
    },
  },
  tagaytay: {
    weather: {
      name: 'Tagaytay', coord: { lat: 14.1153, lon: 120.9621 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 22.5, feels_like: 22.5, humidity: 85, pressure: 1009, temp_min: 20, temp_max: 24 },
      wind: { speed: 6.2, deg: 70 },
      weather: [{ id: 500, main: 'Rain', description: 'cool mountain breeze with light drizzle', icon: '09d' }],
      sys: { country: 'PH', sunrise: 1780716000, sunset: 1780762800 }
    },
  },
  davao: {
    weather: {
      name: 'Davao City', coord: { lat: 7.1907, lon: 125.4553 },
      dt: Math.floor(Date.now() / 1000),
      main: { temp: 32.1, feels_like: 37.5, humidity: 68, pressure: 1011, temp_min: 30, temp_max: 34 },
      wind: { speed: 2.1, deg: 130 },
      weather: [{ id: 802, main: 'Clouds', description: 'scattered cloud layers, calm waters', icon: '03d' }],
      sys: { country: 'PH', sunrise: 1780714900, sunset: 1780760900 }
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// LOOK UP a city from the PH_CITIES database (case-insensitive, flexible)
// ─────────────────────────────────────────────────────────────────────────────
function findCity(input) {
  const q = input.toLowerCase()
    .replace(/\s+city$/i, '')    // strip trailing "city"
    .replace(/\s+/g, ' ')
    .trim()

  // Exact match first
  let match = PH_CITIES.find(c => c.name === q)
  if (match) return match

  // Alias: strip "city" from stored name too for comparison
  match = PH_CITIES.find(c => c.name.replace(/\s+city$/, '') === q)
  if (match) return match

  // Starts-with match
  match = PH_CITIES.find(c => c.name.startsWith(q) || q.startsWith(c.name))
  if (match) return match

  // Contains match (any word)
  match = PH_CITIES.find(c => c.name.includes(q) || q.includes(c.name))
  return match || null
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK FORECAST GENERATOR (works for any city profile)
// ─────────────────────────────────────────────────────────────────────────────
function generateMockForecast(cityEntry, baseTemp) {
  const profile = WEATHER_PROFILES[cityEntry?.profile ?? 'tropical']
  const wet     = isWetSeason()
  const list    = []
  const startMs = Date.now()

  for (let i = 0; i < 40; i++) {
    const timeMs = startMs + i * 3 * 60 * 60 * 1000
    const dateObj = new Date(timeMs)
    const hour  = dateObj.getHours()
    const year  = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day   = String(dateObj.getDate()).padStart(2, '0')
    const dt_txt = `${year}-${month}-${day} ${String(hour).padStart(2,'0')}:00:00`

    const daySwing     = (hour >= 9 && hour <= 17) ? 2.5 + Math.random() : -3.5 - Math.random()
    const randomOffset = Math.sin(i / 3) * 1.5 + (Math.random() - 0.5)
    const currentTemp  = baseTemp + daySwing + randomOffset

    // Rainy conditions more likely in afternoon during wet season
    const isAfternoon = hour >= 12 && hour <= 18
    const rainChance  = wet ? (isAfternoon ? 0.7 : 0.4) : 0.2
    const useWet      = Math.random() < rainChance

    const conditions = useWet ? profile.wetConditions : profile.dryConditions
    const condition  = conditions[Math.floor(Math.random() * conditions.length)]

    const pop = useWet ? 0.6 + Math.random() * 0.4 : Math.random() * 0.25

    list.push({
      dt: Math.floor(timeMs / 1000),
      dt_txt,
      main: {
        temp:     currentTemp,
        temp_min: currentTemp - 1.5,
        temp_max: currentTemp + 1.5,
        humidity: profile.humidity[0] + Math.round(Math.random() * (profile.humidity[1] - profile.humidity[0])),
      },
      weather: [{ ...condition }],
      wind: {
        speed: profile.windSpeed[0] + Math.random() * (profile.windSpeed[1] - profile.windSpeed[0]),
      },
      pop,
    })
  }
  return list
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSABLE
// ═════════════════════════════════════════════════════════════════════════════
export function useWeather() {
  const weather        = ref(null)
  const forecastHourly = ref([])
  const forecastDaily  = ref([])
  const loading        = ref(false)
  const error          = ref('')
  const isDemoMode     = ref(false)

  // ── PAGASA TCWS ────────────────────────────────────────────────────────────
  function calculateTCWS(windSpeedMetersPerSecond) {
    const kmh = windSpeedMetersPerSecond * 3.6
    if (kmh >= 185) return { signal: 5, text: 'Super Typhoon Warning (Winds ≥ 185 km/h)' }
    if (kmh >= 118) return { signal: 4, text: 'Typhoon Warning (Winds 118–184 km/h)' }
    if (kmh >=  89) return { signal: 3, text: 'Severe Tropical Storm Warning (Winds 89–117 km/h)' }
    if (kmh >=  62) return { signal: 2, text: 'Tropical Storm Warning (Winds 62–88 km/h)' }
    if (kmh >=  39) return { signal: 1, text: 'Tropical Depression Warning (Winds 39–61 km/h)' }
    return null
  }

  // ── PAGASA Rainfall Warning ────────────────────────────────────────────────
  function calculateRainfallWarning(description, id) {
    const desc = description.toLowerCase()
    const isTorrential = (id >= 200 && id <= 232) || id === 503 || id === 504 || id === 522
      || desc.includes('torrential') || desc.includes('heavy thunderstorm')
    const isModerate = desc.includes('moderate') || desc.includes('heavy rain') || desc.includes('thunderstorm')
    const isLight    = desc.includes('light') || desc.includes('drizzle') || desc.includes('rain')
    if (isTorrential) return { alert: 'Red',    text: 'TORRENTIAL RAINFALL WARNING: EVACUATE LOW-LYING AREAS' }
    if (isModerate)   return { alert: 'Orange', text: 'INTENSE RAINFALL WARNING: PREPARE AND MONITOR FLOODING' }
    if (isLight)      return { alert: 'Yellow', text: 'HEAVY RAINFALL ALERT: EXPECT FLOODING IN PRONE REGIONS' }
    return null
  }

  // ── Parse OpenWeather forecast list ────────────────────────────────────────
  function parseForecasts(list) {
    forecastHourly.value = list.slice(0, 8).map(item => ({
      dt:          item.dt,
      dt_txt:      item.dt_txt,
      temp:        item.main.temp,
      pop:         Math.round((item.pop ?? 0) * 100),
      icon:        item.weather[0].icon,
      description: item.weather[0].description,
    }))

    const groups = {}
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!groups[date]) groups[date] = []
      groups[date].push(item)
    })

    const dailyData = []
    Object.keys(groups).forEach(date => {
      const items   = groups[date]
      const minTemp = Math.min(...items.map(i => i.main.temp_min))
      const maxTemp = Math.max(...items.map(i => i.main.temp_max))

      const weatherCounts = {}
      items.forEach(i => {
        const key = `${i.weather[0].icon}|${i.weather[0].description}|${i.weather[0].main}`
        weatherCounts[key] = (weatherCounts[key] || 0) + 1
      })
      let dominantKey = Object.keys(weatherCounts)[0]
      let maxCount    = 0
      Object.keys(weatherCounts).forEach(key => {
        if (weatherCounts[key] > maxCount) { maxCount = weatherCounts[key]; dominantKey = key }
      })
      const [icon, description, main] = dominantKey.split('|')
      dailyData.push({
        date,
        dayName: new Date(date).toLocaleDateString('en-PH', { weekday: 'short' }).toUpperCase(),
        dateStr: new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }).toUpperCase(),
        tempMin: minTemp, tempMax: maxTemp, icon, description, main,
      })
    })

    const todayStr = new Date().toISOString().split('T')[0]
    forecastDaily.value = dailyData.filter(d => d.date !== todayStr).slice(0, 5)
  }

  // ── Demo mode: resolve a city and build mock data ──────────────────────────
  function resolveDemoCity(input) {
    const q = input.toLowerCase().replace(/\s+city$/i, '').trim()

    // 1. Check featured stations first (richest data)
    const featuredKey = Object.keys(FEATURED_STATIONS).find(k => q === k || q.startsWith(k))
    if (featuredKey) {
      const station = JSON.parse(JSON.stringify(FEATURED_STATIONS[featuredKey]))
      station.weather.warning = {
        tcws:     calculateTCWS(station.weather.wind.speed),
        rainfall: calculateRainfallWarning(station.weather.weather[0].description, station.weather.weather[0].id),
      }
      const cityEntry = PH_CITIES.find(c => c.name === featuredKey) ?? { profile: 'tropical', name: featuredKey }
      return { weatherData: station.weather, cityEntry }
    }

    // 2. Search the full PH_CITIES database
    const cityEntry = findCity(input)
    if (cityEntry) {
      const weatherData = generateCityWeather(cityEntry)
      weatherData.warning = {
        tcws:     calculateTCWS(weatherData.wind.speed),
        rainfall: calculateRainfallWarning(weatherData.weather[0].description, weatherData.weather[0].id),
      }
      return { weatherData, cityEntry }
    }

    return null
  }

  // ── Main search ────────────────────────────────────────────────────────────
  async function search(city) {
    if (!city?.trim()) return
    const sanitizedCity = city.trim()

    loading.value        = true
    error.value          = ''
    weather.value        = null
    forecastHourly.value = []
    forecastDaily.value  = []

    // Demo mode (no API key)
    if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'undefined') {
      isDemoMode.value = true
      await new Promise(resolve => setTimeout(resolve, 1000))

      const result = resolveDemoCity(sanitizedCity)
      if (result) {
        weather.value = result.weatherData
        const mockList = generateMockForecast(result.cityEntry, result.weatherData.main.temp)
        parseForecasts(mockList)
      } else {
        error.value = `"${sanitizedCity}" wasn't found. Try any Philippine city — Manila, Cebu, Davao, Baguio, Iloilo, Zamboanga, and more.`
      }
      loading.value = false
      return
    }

    // Live API
    isDemoMode.value = false
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${encodeURIComponent(sanitizedCity)},PH&units=metric&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?q=${encodeURIComponent(sanitizedCity)},PH&units=metric&appid=${API_KEY}`),
      ])
      if (currentRes.status === 401) {
        isDemoMode.value = true
        error.value = `API key issue — switched to demo mode. Check VITE_OPENWEATHER_KEY in .env.`
        loading.value = false
        return
      }
      if (!currentRes.ok) throw new Error('City not found')

      const weatherData = await currentRes.json()
      if (weatherData.sys.country !== 'PH') {
        error.value = `"${sanitizedCity}" doesn't appear to be in the Philippines. This app covers Philippine cities only.`
        loading.value = false
        return
      }
      const forecastData = await forecastRes.json()
      weatherData.warning = {
        tcws:     calculateTCWS(weatherData.wind.speed),
        rainfall: calculateRainfallWarning(weatherData.weather[0].description, weatherData.weather[0].id),
      }
      weather.value = weatherData
      parseForecasts(forecastData.list)
    } catch {
      error.value = `We couldn't find "${sanitizedCity}". Check the spelling and try again.`
    } finally {
      loading.value = false
    }
  }

  // ── GPS / coordinate search ────────────────────────────────────────────────
  async function searchByCoords(lat, lon) {
    loading.value        = true
    error.value          = ''
    weather.value        = null
    forecastHourly.value = []
    forecastDaily.value  = []

    if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'undefined') {
      isDemoMode.value = true
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find nearest city in our database by straight-line distance
      let nearest = null, minDist = Infinity
      PH_CITIES.forEach(c => {
        const d = Math.hypot(lat - c.lat, lon - c.lon)
        if (d < minDist) { minDist = d; nearest = c }
      })

      if (nearest) {
        const weatherData = generateCityWeather(nearest)
        weatherData.warning = {
          tcws:     calculateTCWS(weatherData.wind.speed),
          rainfall: calculateRainfallWarning(weatherData.weather[0].description, weatherData.weather[0].id),
        }
        weather.value = weatherData
        const mockList = generateMockForecast(nearest, weatherData.main.temp)
        parseForecasts(mockList)
      }
      loading.value = false
      return
    }

    isDemoMode.value = false
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
      ])
      if (currentRes.status === 401) {
        isDemoMode.value = true
        error.value = `API key issue — switched to demo mode.`
        loading.value = false
        return
      }
      if (!currentRes.ok) throw new Error('Location not found')

      const weatherData = await currentRes.json()
      if (weatherData.sys.country !== 'PH') {
        error.value = `Your location doesn't appear to be in the Philippines.`
        loading.value = false
        return
      }
      const forecastData = await forecastRes.json()
      weatherData.warning = {
        tcws:     calculateTCWS(weatherData.wind.speed),
        rainfall: calculateRainfallWarning(weatherData.weather[0].description, weatherData.weather[0].id),
      }
      weather.value = weatherData
      parseForecasts(forecastData.list)
    } catch {
      error.value = `Couldn't get weather for your location. Try searching a city manually.`
    } finally {
      loading.value = false
    }
  }

  return { weather, forecastHourly, forecastDaily, loading, error, isDemoMode, search, searchByCoords }
}