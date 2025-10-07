// Shared room data to ensure consistency across the website
export const roomsData = [
  {
    id: 1,
    name: "Standard Twin With Balcony",
    shortName: "Standard Twin",
    value: "standard-twin",
    pricePerNight: 120,
    taxes: 0,
    maxGuests: 2,
    size: 280,
    available: true,
    isPopular: false,
    images: [
      "/assets/images/standard twin room.jpg"
    ],
    description: `Comfortable twin-bedded room featuring a private balcony with stunning lake views. Perfect for friends or colleagues traveling together, this room offers modern amenities and a peaceful retreat after a day of exploration.`,
    keyAmenities: [
      { name: "Private Balcony", icon: "Home" },
      { name: "Lake View", icon: "Eye" },
      { name: "Twin Beds", icon: "Bed" },
      { name: "Free WiFi", icon: "Wifi" }
    ],
    allAmenities: [
      { name: "Private Balcony", icon: "Home" },
      { name: "Lake View", icon: "Eye" },
      { name: "Twin Beds", icon: "Bed" },
      { name: "Free WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Mini Fridge", icon: "Refrigerator" },
      { name: "Coffee Maker", icon: "Coffee" },
      { name: "Safe", icon: "Lock" },
      { name: "Hairdryer", icon: "Zap" },
      { name: "Room Service", icon: "Bell" }
    ],
    specialOffers: ["Early Bird: 15% off for bookings 30 days in advance"]
  },
  {
    id: 2,
    name: "Deluxe Apartment With Balcony And Mountain View",
    shortName: "Deluxe Apartment",
    value: "deluxe-apartment",
    pricePerNight: 280,
    taxes: 0,
    maxGuests: 4,
    size: 650,
    available: true,
    isPopular: true,
    images: [
      "/assets/images/deluxe apartment.jpg"
    ],
    description: `Spacious deluxe apartment featuring separate living area, bedroom, and a large balcony with breathtaking mountain views. Ideal for families or extended stays, offering all the comforts of home with luxury resort amenities.`,
    keyAmenities: [
      { name: "Mountain View", icon: "Mountain" },
      { name: "Separate Living Area", icon: "Sofa" },
      { name: "Large Balcony", icon: "Home" },
      { name: "Kitchenette", icon: "ChefHat" }
    ],
    allAmenities: [
      { name: "Mountain View", icon: "Mountain" },
      { name: "Separate Living Area", icon: "Sofa" },
      { name: "Large Balcony", icon: "Home" },
      { name: "Kitchenette", icon: "ChefHat" },
      { name: "King Size Bed", icon: "Bed" },
      { name: "Free WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Full Refrigerator", icon: "Refrigerator" },
      { name: "Microwave", icon: "Zap" },
      { name: "Dining Table", icon: "Utensils" },
      { name: "Safe", icon: "Lock" },
      { name: "Premium Toiletries", icon: "Sparkles" }
    ],
    specialOffers: [
      "Family Package: Kids stay free",
      "Extended Stay: 20% off for 7+ nights"
    ]
  },
  {
    id: 3,
    name: "Deluxe Double Room With Balcony Non-Smoking",
    shortName: "Deluxe Double",
    value: "deluxe-double",
    pricePerNight: 180,
    taxes: 0,
    maxGuests: 2,
    size: 320,
    available: true,
    isPopular: false,
    images: [
      "/assets/images/deluxe double.jpg"
    ],
    description: `Elegant double room with a comfortable king-size bed and private balcony overlooking the resort gardens. This non-smoking room provides a serene environment perfect for couples seeking a romantic getaway.`,
    keyAmenities: [
      { name: "King Size Bed", icon: "Bed" },
      { name: "Garden View", icon: "Trees" },
      { name: "Non-Smoking", icon: "ShieldCheck" },
      { name: "Private Balcony", icon: "Home" }
    ],
    allAmenities: [
      { name: "King Size Bed", icon: "Bed" },
      { name: "Garden View", icon: "Trees" },
      { name: "Non-Smoking", icon: "ShieldCheck" },
      { name: "Private Balcony", icon: "Home" },
      { name: "Free WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Mini Bar", icon: "Wine" },
      { name: "Coffee Station", icon: "Coffee" },
      { name: "Safe", icon: "Lock" },
      { name: "Luxury Linens", icon: "Sparkles" },
      { name: "Blackout Curtains", icon: "Moon" }
    ],
    specialOffers: ["Romantic Package: Complimentary champagne and chocolates"]
  },
  {
    id: 4,
    name: "Luxury Double/Twin With Balcony",
    shortName: "Luxury Suite",
    value: "luxury-double-twin",
    pricePerNight: 220,
    taxes: 0,
    maxGuests: 3,
    size: 400,
    available: true,
    isPopular: true,
    images: [
      "/assets/images/luxury suite.jpg"
    ],
    description: `Premium luxury room offering flexible bedding configuration with either a king-size bed or twin beds. Features an expansive balcony with panoramic lake and mountain views, perfect for discerning travelers.`,
    keyAmenities: [
      { name: "Flexible Bedding", icon: "Bed" },
      { name: "Panoramic Views", icon: "Eye" },
      { name: "Premium Amenities", icon: "Star" },
      { name: "Large Balcony", icon: "Home" }
    ],
    allAmenities: [
      { name: "Flexible Bedding", icon: "Bed" },
      { name: "Panoramic Views", icon: "Eye" },
      { name: "Premium Amenities", icon: "Star" },
      { name: "Large Balcony", icon: "Home" },
      { name: "Free WiFi", icon: "Wifi" },
      { name: "Climate Control", icon: "Wind" },
      { name: "Premium Mini Bar", icon: "Wine" },
      { name: "Nespresso Machine", icon: "Coffee" },
      { name: "Electronic Safe", icon: "Lock" },
      { name: "Luxury Bathrobes", icon: "Shirt" },
      { name: "Marble Bathroom", icon: "Bath" },
      { name: "24/7 Concierge", icon: "Bell" }
    ],
    specialOffers: []
  },
  {
    id: 5,
    name: "Standard Room With Balcony Mountain View",
    shortName: "Mountain Standard",
    value: "standard-mountain",
    pricePerNight: 150,
    taxes: 0,
    maxGuests: 2,
    size: 300,
    available: true,
    isPopular: false,
    images: [
      "/assets/images/mountain standard.avif"
    ],
    description: `Comfortable standard room featuring a queen-size bed and private balcony with stunning mountain views. Offers excellent value while maintaining high standards of comfort and cleanliness.`,
    keyAmenities: [
      { name: "Mountain View", icon: "Mountain" },
      { name: "Queen Bed", icon: "Bed" },
      { name: "Private Balcony", icon: "Home" },
      { name: "Great Value", icon: "DollarSign" }
    ],
    allAmenities: [
      { name: "Mountain View", icon: "Mountain" },
      { name: "Queen Bed", icon: "Bed" },
      { name: "Private Balcony", icon: "Home" },
      { name: "Free WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Mini Fridge", icon: "Refrigerator" },
      { name: "Coffee Maker", icon: "Coffee" },
      { name: "Safe", icon: "Lock" },
      { name: "Hairdryer", icon: "Zap" },
      { name: "Daily Housekeeping", icon: "Sparkles" }
    ],
    specialOffers: ["Value Deal: 10% off for stays of 3+ nights"]
  }
];

// Helper function to get room options for dropdowns
export const getRoomOptions = () => {
  return [
    { value: '', label: 'Select Room Type' },
    ...roomsData.map(room => ({
      value: room.value,
      label: `${room.shortName} - $${room.pricePerNight}/night`
    }))
  ];
};

// Helper function to get available rooms only
export const getAvailableRooms = () => {
  return roomsData.filter(room => room.available);
};

// Helper function to get room by value
export const getRoomByValue = (value) => {
  return roomsData.find(room => room.value === value);
};
