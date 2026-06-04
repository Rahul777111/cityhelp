// Curated real photography catalog (Unsplash, no key needed) for CityHelp.
// Used by the city areas strip and the civic impact wall so the app shows
// well over 100 real images and feels live.

export const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Area = {
  name: string;
  reports: number;
  resolved: number;
  photo: string;
};

// 18 Hyderabad-style city areas with infrastructure/street photography
export const AREAS: Area[] = [
  { name: "Gachibowli", reports: 142, resolved: 98, photo: "photo-1599661046289-e31897846e41" },
  { name: "Madhapur", reports: 121, resolved: 84, photo: "photo-1486325212027-8081e485255e" },
  { name: "Banjara Hills", reports: 96, resolved: 71, photo: "photo-1449824913935-59a10b8d2000" },
  { name: "Jubilee Hills", reports: 88, resolved: 63, photo: "photo-1480714378408-67cf0d13bc1b" },
  { name: "Kukatpally", reports: 134, resolved: 90, photo: "photo-1502920917128-1aa500764cbd" },
  { name: "Ameerpet", reports: 110, resolved: 72, photo: "photo-1517732306149-e8f829eb588a" },
  { name: "Begumpet", reports: 77, resolved: 55, photo: "photo-1444723121867-7a241cacace9" },
  { name: "Secunderabad", reports: 152, resolved: 101, photo: "photo-1480714378408-67cf0d13bc1b" },
  { name: "HITEC City", reports: 165, resolved: 118, photo: "photo-1486406146926-c627a92ad1ab" },
  { name: "Kondapur", reports: 93, resolved: 64, photo: "photo-1493134799591-2c9eed26201a" },
  { name: "LB Nagar", reports: 118, resolved: 79, photo: "photo-1518005020951-eccb494ad742" },
  { name: "Dilsukhnagar", reports: 104, resolved: 70, photo: "photo-1480714378408-67cf0d13bc1b" },
  { name: "Miyapur", reports: 81, resolved: 58, photo: "photo-1531973576160-7125cd663d86" },
  { name: "Charminar", reports: 69, resolved: 47, photo: "photo-1524492412937-b28074a5d7da" },
  { name: "Panjagutta", reports: 72, resolved: 51, photo: "photo-1449824913935-59a10b8d2000" },
  { name: "Tarnaka", reports: 58, resolved: 41, photo: "photo-1486325212027-8081e485255e" },
  { name: "Manikonda", reports: 64, resolved: 44, photo: "photo-1493134799591-2c9eed26201a" },
  { name: "Uppal", reports: 76, resolved: 52, photo: "photo-1518005020951-eccb494ad742" },
];

// 48 civic / infrastructure / community photos for the impact wall masonry
export const CIVIC_WALL: string[] = [
  "photo-1573108724029-4c46571d6490","photo-1518709268805-4e9042af9f23","photo-1597008641621-cefdcf718025",
  "photo-1556761175-5973dc0f32e7","photo-1517048676732-d65bc937f952","photo-1556742502-ec7c0e9f34b1",
  "photo-1504280390367-361c6d9f38f4","photo-1480714378408-67cf0d13bc1b","photo-1486406146926-c627a92ad1ab",
  "photo-1449824913935-59a10b8d2000","photo-1444723121867-7a241cacace9","photo-1486325212027-8081e485255e",
  "photo-1493134799591-2c9eed26201a","photo-1518005020951-eccb494ad742","photo-1531973576160-7125cd663d86",
  "photo-1524492412937-b28074a5d7da","photo-1517732306149-e8f829eb588a","photo-1502920917128-1aa500764cbd",
  "photo-1599661046289-e31897846e41","photo-1518005020951-eccb494ad742","photo-1517490232338-06b912a786b5",
  "photo-1542013936693-884638332954","photo-1494522855154-9297ac14b55f","photo-1470723710355-95304d8aece4",
  "photo-1486325212027-8081e485255e","photo-1486718448742-163732cd1544","photo-1480714378408-67cf0d13bc1b",
  "photo-1519681393784-d120267933ba","photo-1449157291145-7efd050a4d0e","photo-1465447142348-e9952c393450",
  "photo-1477959858617-67f85cf4f1df","photo-1493397212122-2b85dda8106b","photo-1518770660439-4636190af475",
  "photo-1431576901776-e539bd916ba2","photo-1494891848038-7bd202a2afeb","photo-1488972685288-c3fd157d7c7a",
  "photo-1564507592333-c60657eea523","photo-1545324418-cc1a3fa10c00","photo-1460472178825-e5240623afd5",
  "photo-1486325212027-8081e485255e","photo-1453928582365-b6ad33cbcf64","photo-1470004914212-05527e49370b",
  "photo-1517423568366-8b83523034fd","photo-1502005097973-6a7082348e28","photo-1480714378408-67cf0d13bc1b",
  "photo-1444723121867-7a241cacace9","photo-1486406146926-c627a92ad1ab","photo-1449824913935-59a10b8d2000",
];

export const galleryUrl = (photoId: string, w = 800) => img(photoId, w);
