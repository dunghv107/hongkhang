export type NearbyPlace = {
  id: number;
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: "hospital" | "market" | "school" | "mall" | "football" | "badminton";
  rating?: number;
};

export const nearbyPlaces: readonly NearbyPlace[] = [
  { id: 1388697739, lat: 10.2318213, lng: 105.9596563, name: "Trường Đại học Xây dựng Miền Tây - Khu B", address: "", category: "school" },
  { id: 1067451888, lat: 10.2355781, lng: 105.9621789, name: "Trường Đại học Xây dựng Miền Tây", address: "20B, Phó Cơ Điều", category: "school" },
  { id: 1421512669, lat: 10.2352361, lng: 105.9658508, name: "Trường Mầm non 3", address: "71, Mậu Thân", category: "school" },
  { id: 1193070244, lat: 10.2314772, lng: 105.9562238, name: "Trường Chính trị Phạm Hùng", address: "241, Đường Đinh Tiên Hoàng", category: "school" },
  { id: 1388697738, lat: 10.234569, lng: 105.9577063, name: "Trường Tiểu học Chu Văn An (Cơ Sở 1)", address: "", category: "school" },
  { id: 1085777660, lat: 10.2298199, lng: 105.9543985, name: "Trường Trung học Phổ thông Nguyễn Thông", address: "Đường Đinh Tiên Hoàng", category: "school" },
  { id: 1418763774, lat: 10.235526, lng: 105.9552439, name: "Trường Trung học Cơ Sở Lương Thế Vinh", address: "", category: "school" },
  { id: 1085777651, lat: 10.2277318, lng: 105.9532684, name: "Trường Cao đẳng Vĩnh Long", address: "112 -112A, Đường Đinh Tiên Hoàng", category: "school" },
  { id: 1418731175, lat: 10.2390479, lng: 105.9685815, name: "Trường Tiểu học Lê Lợi", address: "", category: "school" },
  { id: 1169321008, lat: 10.2408528, lng: 105.9606548, name: "Phân hiệu Đại học Kinh tế Thành phố Hồ Chí Minh tại tỉnh Vĩnh Long", address: "1B, Nguyễn Trung Trực", category: "school" },
  { id: 1388697729, lat: 10.2334813, lng: 105.9483555, name: "Trường Tiểu học Chu Văn An (Cơ sở 2)", address: "", category: "school" },
  { id: 1421485861, lat: 10.2484197, lng: 105.9625164, name: "Trường Năng khiếu Nghệ thuật & Thể dục Thể thao", address: "", category: "school" },
  { id: 1085777666, lat: 10.2501676, lng: 105.9624942, name: "Trường Đại học Sư phạm Kỹ thuật Vĩnh Long", address: "73, Đường Nguyễn Huệ", category: "school" },
  { id: 702169227, lat: 10.2413614, lng: 105.9812616, name: "Trường THPT chuyên Nguyễn Bỉnh Khiêm", address: "157, Phạm Thái Bường", category: "school" },
  { id: 702169228, lat: 10.2420324, lng: 105.9809473, name: "Trường Tiểu học Trần Đại Nghĩa", address: "Phạm Thái Bường", category: "school" },
  { id: 1418849936, lat: 10.2324047, lng: 105.9577332, name: "Bệnh xá Quân Y", address: "", category: "hospital" },
  { id: 209302274, lat: 10.2318033, lng: 105.9889527, name: "Bệnh viện Đa khoa Vĩnh Long", address: "301, Đường Trần Phú", category: "hospital" },
  { id: 968350204, lat: 10.2512465, lng: 105.9786407, name: "Bệnh viện Y dược cổ truyền Vĩnh Long", address: "", category: "hospital" },
  { id: 1119345120, lat: 10.2303468, lng: 105.9984181, name: "Bệnh viện Tâm thần Vĩnh Long", address: "", category: "hospital" },
  { id: 1119345121, lat: 10.2306371, lng: 105.9990337, name: "Bệnh viện Phổi Vĩnh Long", address: "", category: "hospital" },
  { id: 7105923285, lat: 10.2604931, lng: 105.9406182, name: "Bệnh viện Đa khoa Xuyên Á", address: "", category: "hospital" },
  { id: 1380667675, lat: 10.2612939, lng: 105.941658, name: "Bệnh viện Đa khoa Thành phố Vĩnh Long", address: "", category: "hospital" },
  { id: 1380667674, lat: 10.2612388, lng: 105.9404921, name: "Bệnh viện Đa khoa Xuyên Á", address: "", category: "hospital" },
  { id: 1388981201, lat: 10.2372748, lng: 105.9588847, name: "Chợ Phước Thọ", address: "", category: "market" },
  { id: 1423785773, lat: 10.254177, lng: 105.9627693, name: "Chợ Long Châu", address: "", category: "market" },
  { id: 962628993, lat: 10.2370903, lng: 105.9893239, name: "Chợ Cua", address: "", category: "market" },
  { id: 1480593159, lat: 10.255758, lng: 105.9730958, name: "Chợ Vĩnh Long", address: "", category: "market" },
  { id: 532651535, lat: 10.25623, lng: 105.9726665, name: "Chợ Bách hóa Tổng hợp Vĩnh Long", address: "", category: "market" },
  { id: 1480593156, lat: 10.2568457, lng: 105.9731404, name: "Chợ Vĩnh Long", address: "", category: "market" },
  { id: 532896630, lat: 10.2592943, lng: 105.9427322, name: "Chợ Phường 9", address: "", category: "market" },
  { id: 3284635842, lat: 10.2717802, lng: 105.9643042, name: "Cho An Binh", address: "", category: "market" },
  { id: 702177377, lat: 10.2461103, lng: 105.9774698, name: "Vincom Plaza Vĩnh Long", address: "55, Phạm Thái Bường", category: "mall" },
  { id: -1, lat: 10.2287875, lng: 105.9515469, name: "Sân bóng mini Ngoại Thành", address: "6XH2+GJ7, Phường 8, Vĩnh Long", category: "football" },
  { id: -2, lat: 10.2295103, lng: 105.9676257, name: "Sân cầu lông Thanh Bảo", address: "14/1 Ấp Phước Hạnh A, Phường Phước Hậu, Vĩnh Long", category: "badminton" },
];
