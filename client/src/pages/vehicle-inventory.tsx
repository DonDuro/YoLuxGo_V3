import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Shield, Users, MapPin, Calendar, Clock, Filter } from "lucide-react";
import ylgBrandLogo from "@assets/image_1753678077310.png";

interface Vehicle {
  id: string;
  type: 'sedan' | 'suv' | 'limousine' | 'jet' | 'yacht' | 'helicopter';
  make: string;
  model: string;
  year: number;
  category: 'luxury' | 'armored' | 'executive' | 'ultra-luxury';
  location: string;
  armorLevel?: string;
  capacity: number;
  amenities: string[];
  hourlyRate: number;
  dailyRate: number;
  available: boolean;
  images: string[];
  description: string;
  features: string[];
}

export function VehicleInventory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock vehicle inventory
  const vehicles: Vehicle[] = [
    {
      id: "V001",
      type: "sedan",
      make: "Mercedes-Benz",
      model: "S-Class Maybach",
      year: 2024,
      category: "ultra-luxury",
      location: "New York, NY",
      capacity: 4,
      amenities: ["Champagne Service", "Privacy Glass", "Executive Seating", "WiFi"],
      hourlyRate: 350,
      dailyRate: 2800,
      available: true,
      images: ["/assets/maybach-s-class.jpg"],
      description: "Ultimate luxury sedan with handcrafted interior and whisper-quiet ride",
      features: ["Heated/Cooled Massage Seats", "Executive Rear Cabin", "Burmester Sound", "Ambient Lighting"]
    },
    {
      id: "V002",
      type: "suv",
      make: "Range Rover",
      model: "Sentinel",
      year: 2024,
      category: "armored",
      location: "New York, NY",
      armorLevel: "B6/B7",
      capacity: 5,
      amenities: ["Ballistic Protection", "Run-flat Tires", "Secure Communications", "Emergency Kit"],
      hourlyRate: 450,
      dailyRate: 3600,
      available: true,
      images: ["/assets/range-rover-sentinel.jpg"],
      description: "Armored luxury SUV providing ultimate protection without compromising comfort",
      features: ["B6/B7 Ballistic Protection", "Blast-resistant Floor", "Emergency Escape Systems", "Encrypted Comms"]
    },
    {
      id: "V003",
      type: "jet",
      make: "Gulfstream",
      model: "G650ER",
      year: 2023,
      category: "ultra-luxury",
      location: "Teterboro, NJ",
      capacity: 14,
      amenities: ["Full Galley", "Master Bedroom", "Conference Room", "Global WiFi"],
      hourlyRate: 8500,
      dailyRate: 68000,
      available: true,
      images: ["/assets/gulfstream-g650.jpg"],
      description: "Ultra-long-range business jet with unmatched luxury and global reach",
      features: ["7,500nm Range", "Mach 0.925 Speed", "Master Suite", "14 Passenger Capacity"]
    },
    {
      id: "V004",
      type: "yacht",
      make: "Azimut",
      model: "Grande 32M",
      year: 2024,
      category: "ultra-luxury",
      location: "Miami, FL",
      capacity: 12,
      amenities: ["Master Suite", "Crew Quarters", "Helicopter Pad", "Beach Club"],
      hourlyRate: 3200,
      dailyRate: 25600,
      available: true,
      images: ["/assets/azimut-grande.jpg"],
      description: "105-foot luxury yacht with sophisticated design and ocean-going capabilities",
      features: ["Beach Club", "Sky Lounge", "Master Suite", "Professional Crew"]
    },
    {
      id: "V005",
      type: "limousine",
      make: "Rolls-Royce",
      model: "Phantom Extended",
      year: 2024,
      category: "ultra-luxury",
      location: "Los Angeles, CA",
      capacity: 4,
      amenities: ["Champagne Chiller", "Executive Seating", "Privacy Partition", "Starlight Headliner"],
      hourlyRate: 400,
      dailyRate: 3200,
      available: true,
      images: ["/assets/rolls-royce-phantom.jpg"],
      description: "The pinnacle of automotive luxury with bespoke craftsmanship",
      features: ["Starlight Headliner", "Theatre Configuration", "Bespoke Interior", "Whisper-quiet Ride"]
    },
    {
      id: "V006",
      type: "helicopter",
      make: "Airbus",
      model: "H145",
      year: 2023,
      category: "executive",
      location: "Manhattan, NY",
      capacity: 8,
      amenities: ["Leather Interior", "Noise Reduction", "Panoramic Views", "VIP Configuration"],
      hourlyRate: 2800,
      dailyRate: 22400,
      available: false,
      images: ["/assets/airbus-h145.jpg"],
      description: "Twin-engine helicopter offering safety, comfort, and spectacular city views",
      features: ["Twin Engine Safety", "Low Noise", "VIP Interior", "Weather Radar"]
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || vehicle.location.includes(selectedLocation);
    const matchesSearch = searchTerm === '' || 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLocation && matchesSearch;
  });

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'sedan':
      case 'suv':
      case 'limousine':
        return <Car className="h-5 w-5" />;
      case 'jet':
        return <span className="text-lg">✈️</span>;
      case 'yacht':
        return <span className="text-lg">🛥️</span>;
      case 'helicopter':
        return <span className="text-lg">🚁</span>;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ultra-luxury': return 'bg-[#d4af37] text-[#0a1a2f]';
      case 'armored': return 'bg-red-100 text-red-800';
      case 'luxury': return 'bg-blue-100 text-blue-800';
      case 'executive': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f]">
      {/* Header */}
      <div className="bg-[#fdfdfb] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={ylgBrandLogo} alt="YoLuxGo" className="h-10" />
              <div>
                <h1 className="text-xl font-serif text-[#0a1a2f]">Vehicle Inventory</h1>
                <p className="text-[#666] text-sm">Luxury Transportation Fleet</p>
              </div>
            </div>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a1a2f]"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#fdfdfb] border-t">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#666]" />
              <span className="text-sm font-medium text-[#0a1a2f]">Filters:</span>
            </div>
            
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ultra-luxury">Ultra Luxury</SelectItem>
                <SelectItem value="armored">Armored</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Miami">Miami</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Punta Cana">Punta Cana</SelectItem>
                <SelectItem value="Malaga">Malaga-Marbella</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <Card key={vehicle.id} className="bg-[#fdfdfb] hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                      {getVehicleIcon(vehicle.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#0a1a2f]">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <p className="text-sm text-[#666]">{vehicle.year} • {vehicle.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(vehicle.category)}>
                    {vehicle.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Vehicle Image Placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Professional Photos Available</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#666] line-clamp-2">{vehicle.description}</p>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-[#666]" />
                      <span className="text-[#666]">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-[#666]" />
                      <span className="text-[#666]">{vehicle.capacity} pax</span>
                    </div>
                  </div>

                  {vehicle.armorLevel && (
                    <div className="flex items-center space-x-1 text-sm">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="text-red-600 font-medium">Armor Level: {vehicle.armorLevel}</span>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                <div>
                  <p className="text-xs font-medium text-[#0a1a2f] mb-1">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {vehicle.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vehicle.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-[#666]">Hourly Rate</p>
                      <p className="text-lg font-bold text-[#d4af37]">
                        ${vehicle.hourlyRate.toLocaleString()}/hr
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#666]">Daily Rate</p>
                      <p className="text-lg font-bold text-[#d4af37]">
                        ${vehicle.dailyRate.toLocaleString()}/day
                      </p>
                    </div>
                  </div>

                  {/* Availability & Booking */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${vehicle.available ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`text-xs ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      disabled={!vehicle.available}
                      className="bg-[#d4af37] hover:bg-[#b8941f] text-[#0a1a2f] disabled:opacity-50"
                    >
                      {vehicle.available ? 'Book Now' : 'Waitlist'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-[#666] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#fdfdfb] mb-2">No vehicles found</h3>
            <p className="text-[#999]">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}