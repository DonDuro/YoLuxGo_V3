import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, MapPin, Users, Star, Wifi, Car, Shield, Filter, Eye } from "lucide-react";
import ylgBrandLogo from "@assets/image_1753678077310.png";

interface Property {
  id: string;
  type: 'villa' | 'penthouse' | 'estate' | 'yacht' | 'private-island' | 'chalet';
  name: string;
  location: string;
  country: string;
  category: 'ultra-luxury' | 'exclusive' | 'premium' | 'secure';
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number;
  amenities: string[];
  dailyRate: number;
  weeklyRate: number;
  available: boolean;
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  accessLevel: 'public' | 'member' | 'vip' | 'invitation-only';
  images: string[];
  description: string;
  features: string[];
  nearbyServices: string[];
}

export function PropertyInventory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock property inventory
  const properties: Property[] = [
    {
      id: "P001",
      type: "villa",
      name: "Villa Serenity",
      location: "Marbella, Spain",
      country: "Spain",
      category: "ultra-luxury",
      bedrooms: 8,
      bathrooms: 10,
      maxGuests: 16,
      sqft: 12000,
      amenities: ["Private Beach", "Helipad", "Wine Cellar", "Home Theater", "Spa", "Security Team"],
      dailyRate: 8500,
      weeklyRate: 52000,
      available: true,
      securityLevel: "maximum",
      accessLevel: "vip",
      images: ["/assets/villa-marbella.jpg"],
      description: "Spectacular oceanfront villa with panoramic Mediterranean views and complete privacy",
      features: ["360° Ocean Views", "Private Beach Access", "24/7 Security", "Professional Staff", "Helicopter Landing"],
      nearbyServices: ["Private Jet Terminal", "Michelin Star Restaurants", "Exclusive Golf Courses", "Marina Access"]
    },
    {
      id: "P002",
      type: "penthouse",
      name: "Manhattan Sky Residence",
      location: "Manhattan, NY",
      country: "USA",
      category: "ultra-luxury",
      bedrooms: 6,
      bathrooms: 8,
      maxGuests: 12,
      sqft: 8500,
      amenities: ["Private Elevator", "Rooftop Terrace", "Wine Room", "Home Office", "Gym", "Concierge"],
      dailyRate: 12000,
      weeklyRate: 75000,
      available: true,
      securityLevel: "enhanced",
      accessLevel: "vip",
      images: ["/assets/penthouse-manhattan.jpg"],
      description: "Exclusive penthouse with Central Park views and world-class amenities",
      features: ["Central Park Views", "Private Rooftop", "Smart Home Technology", "Professional Kitchen", "Library"],
      nearbyServices: ["Private Banking", "Exclusive Shopping", "Helicopter Tours", "Fine Dining"]
    },
    {
      id: "P003",
      type: "estate",
      name: "Château Lumière",
      location: "Provence, France",
      country: "France",
      category: "exclusive",
      bedrooms: 12,
      bathrooms: 14,
      maxGuests: 24,
      sqft: 18000,
      amenities: ["Vineyard", "Private Chapel", "Stables", "Tennis Court", "Pool Complex", "Staff Quarters"],
      dailyRate: 6800,
      weeklyRate: 42000,
      available: true,
      securityLevel: "enhanced",
      accessLevel: "member",
      images: ["/assets/chateau-provence.jpg"],
      description: "Historic château with working vineyard and breathtaking countryside views",
      features: ["Historic Architecture", "Private Vineyard", "Wine Cellar", "Event Spaces", "Formal Gardens"],
      nearbyServices: ["Wine Tours", "Private Chef Services", "Cultural Excursions", "Wellness Retreats"]
    },
    {
      id: "P004",
      type: "private-island",
      name: "Isla Privada",
      location: "Punta Cana, Dominican Republic",
      country: "Dominican Republic",
      category: "ultra-luxury",
      bedrooms: 10,
      bathrooms: 12,
      maxGuests: 20,
      sqft: 15000,
      amenities: ["Private Beach", "Marina", "Spa Resort", "Multiple Villas", "Staff Village", "Helipad"],
      dailyRate: 15000,
      weeklyRate: 95000,
      available: false,
      securityLevel: "maximum",
      accessLevel: "invitation-only",
      images: ["/assets/private-island.jpg"],
      description: "Exclusive private island offering complete isolation and luxury in the Caribbean",
      features: ["Complete Privacy", "Multiple Beaches", "Water Sports Center", "Spa Treatments", "Gourmet Dining"],
      nearbyServices: ["Private Yacht Charter", "Helicopter Transfers", "Medical Services", "Water Activities"]
    },
    {
      id: "P005",
      type: "chalet",
      name: "Alpine Sanctuary",
      location: "St. Moritz, Switzerland",
      country: "Switzerland",
      category: "premium",
      bedrooms: 7,
      bathrooms: 9,
      maxGuests: 14,
      sqft: 9500,
      amenities: ["Ski-in/Ski-out", "Wine Cellar", "Home Cinema", "Wellness Area", "Garage", "Staff Apartment"],
      dailyRate: 4500,
      weeklyRate: 28000,
      available: true,
      securityLevel: "standard",
      accessLevel: "member",
      images: ["/assets/chalet-stmoritz.jpg"],
      description: "Luxury alpine chalet with direct ski slope access and mountain panoramas",
      features: ["Ski-in/Ski-out Access", "Mountain Views", "Fireplace Lounge", "Wellness Suite", "Wine Collection"],
      nearbyServices: ["Private Ski Lessons", "Helicopter Skiing", "Fine Dining", "Spa Services"]
    },
    {
      id: "P006",
      type: "yacht",
      name: "Ocean Majesty",
      location: "Monaco Harbor",
      country: "Monaco",
      category: "ultra-luxury",
      bedrooms: 6,
      bathrooms: 8,
      maxGuests: 12,
      sqft: 4500,
      amenities: ["Master Suite", "Helipad", "Beach Club", "Gym", "Spa", "Professional Crew"],
      dailyRate: 18000,
      weeklyRate: 110000,
      available: true,
      securityLevel: "enhanced",
      accessLevel: "vip",
      images: ["/assets/superyacht-monaco.jpg"],
      description: "180-foot superyacht offering luxury cruising in the Mediterranean",
      features: ["Ocean Cruising", "Beach Club", "Master Suite", "Professional Crew", "Water Toys"],
      nearbyServices: ["Marina Services", "Provisioning", "Helicopter Transfers", "Concierge"]
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesCategory = selectedCategory === 'all' || property.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || property.country === selectedLocation;
    const matchesAccess = selectedAccessLevel === 'all' || property.accessLevel === selectedAccessLevel;
    const matchesSearch = searchTerm === '' || 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLocation && matchesAccess && matchesSearch;
  });

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'villa':
      case 'estate':
      case 'chalet':
        return <Home className="h-5 w-5" />;
      case 'penthouse':
        return <span className="text-lg">🏙️</span>;
      case 'yacht':
        return <span className="text-lg">🛥️</span>;
      case 'private-island':
        return <span className="text-lg">🏝️</span>;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ultra-luxury': return 'bg-[#d4af37] text-[#0a1a2f]';
      case 'exclusive': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'secure': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityBadge = (level: string) => {
    switch (level) {
      case 'maximum': return <Badge className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" />Maximum Security</Badge>;
      case 'enhanced': return <Badge className="bg-orange-100 text-orange-800"><Shield className="h-3 w-3 mr-1" />Enhanced Security</Badge>;
      case 'standard': return <Badge className="bg-green-100 text-green-800"><Shield className="h-3 w-3 mr-1" />Standard Security</Badge>;
      default: return null;
    }
  };

  const getAccessBadge = (level: string) => {
    switch (level) {
      case 'invitation-only': return <Badge className="bg-[#d4af37] text-[#0a1a2f]"><Eye className="h-3 w-3 mr-1" />Invitation Only</Badge>;
      case 'vip': return <Badge className="bg-purple-100 text-purple-800"><Star className="h-3 w-3 mr-1" />VIP Access</Badge>;
      case 'member': return <Badge className="bg-blue-100 text-blue-800">Member Access</Badge>;
      case 'public': return <Badge className="bg-gray-100 text-gray-800">Public</Badge>;
      default: return null;
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
                <h1 className="text-xl font-serif text-[#0a1a2f]">Luxury Lodging</h1>
                <p className="text-[#666] text-sm">Exclusive Villas, Penthouses & Private Estates</p>
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
              placeholder="Search properties..."
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
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="secure">Secure</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="USA">United States</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Switzerland">Switzerland</SelectItem>
                <SelectItem value="Monaco">Monaco</SelectItem>
                <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Access Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access Levels</SelectItem>
                <SelectItem value="invitation-only">Invitation Only</SelectItem>
                <SelectItem value="vip">VIP Access</SelectItem>
                <SelectItem value="member">Member Access</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <Card key={property.id} className="bg-[#fdfdfb] hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                      {getPropertyIcon(property.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#0a1a2f]">{property.name}</CardTitle>
                      <p className="text-sm text-[#666]">{property.type.replace('-', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(property.category)}>
                    {property.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getAccessBadge(property.accessLevel)}
                  {getSecurityBadge(property.securityLevel)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Property Image Placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Home className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Professional Photos Available</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-[#666]" />
                  <span className="text-sm text-[#666]">{property.location}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#666] line-clamp-2">{property.description}</p>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-[#d4af37]">{property.bedrooms}</p>
                    <p className="text-[#666] text-xs">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-[#d4af37]">{property.bathrooms}</p>
                    <p className="text-[#666] text-xs">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-[#d4af37]">{property.maxGuests}</p>
                    <p className="text-[#666] text-xs">Max Guests</p>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <p className="text-xs font-medium text-[#0a1a2f] mb-1">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-[#666]">Daily Rate</p>
                      <p className="text-lg font-bold text-[#d4af37]">
                        ${property.dailyRate.toLocaleString()}/night
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#666]">Weekly Rate</p>
                      <p className="text-lg font-bold text-[#d4af37]">
                        ${property.weeklyRate.toLocaleString()}/week
                      </p>
                    </div>
                  </div>

                  {/* Availability & Booking */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${property.available ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`text-xs ${property.available ? 'text-green-600' : 'text-red-600'}`}>
                        {property.available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      disabled={!property.available}
                      className="bg-[#d4af37] hover:bg-[#b8941f] text-[#0a1a2f] disabled:opacity-50"
                    >
                      {property.available ? 'Book Now' : 'Waitlist'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-[#666] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#fdfdfb] mb-2">No properties found</h3>
            <p className="text-[#999]">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}