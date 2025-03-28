// Parking Areas Data
export const parkingAreas = [
  {
    id: "area1",
    name: "City Center Mall",
    location: "Central Business District",
    rate: 60,
    totalSlots: 50,
    prefix: "A",
    icon: "building",
  },
  {
    id: "area2",
    name: "Medical Complex",
    location: "Hospital Zone",
    rate: 40,
    totalSlots: 30,
    prefix: "B",
    icon: "hospital",
  },
  {
    id: "area3",
    name: "Food Street",
    location: "Restaurant District",
    rate: 50,
    totalSlots: 25,
    prefix: "C",
    icon: "food",
  },
  {
    id: "area4",
    name: "University Campus",
    location: "Education Zone",
    rate: 30,
    totalSlots: 40,
    prefix: "D",
    icon: "education",
  },
  {
    id: "area5",
    name: "Market Complex",
    location: "Shopping District",
    rate: 45,
    totalSlots: 35,
    prefix: "E",
    icon: "shopping",
  },
]

// Generate slots for each area with random availability
export function generateSlots(prefix, count) {
  const slots = []
  for (let i = 1; i <= count; i++) {
    // Randomly determine if slot is available (70% chance of being available)
    const isAvailable = Math.random() < 0.7
    slots.push({
      id: `${prefix}${i}`,
      number: `${prefix}${i}`,
      isAvailable: isAvailable,
    })
  }
  return slots
}

