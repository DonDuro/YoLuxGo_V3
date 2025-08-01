// Fee calculation schema for YoLuxGo™ platform
import { z } from "zod";

// Platform fee structure
export const FeeStructure = {
  CLIENT_BOOKING_FEE: 0.10, // 10% of total booking value
  PROVIDER_COMMISSION: 0.20, // 20% of service value
  RUSH_SERVICE_FEE: 0.05, // Additional 5% for urgent bookings
  DISPUTE_HANDLING_FEE: 250, // $250 flat fee for dispute arbitration
} as const;

// Fee calculation functions
export const calculateClientFees = (baseAmount: number, isRush: boolean = false) => {
  const bookingFee = baseAmount * FeeStructure.CLIENT_BOOKING_FEE;
  const rushFee = isRush ? baseAmount * FeeStructure.RUSH_SERVICE_FEE : 0;
  const totalFees = bookingFee + rushFee;
  const totalAmount = baseAmount + totalFees;
  
  return {
    baseAmount,
    bookingFee,
    rushFee,
    totalFees,
    totalAmount,
  };
};

export const calculateProviderPayout = (serviceValue: number) => {
  const commission = serviceValue * FeeStructure.PROVIDER_COMMISSION;
  const netPayout = serviceValue - commission;
  
  return {
    serviceValue,
    commission,
    netPayout,
  };
};

// Fee breakdown schema for API responses
export const FeeBreakdownSchema = z.object({
  baseAmount: z.number(),
  bookingFee: z.number(),
  rushFee: z.number().optional(),
  totalFees: z.number(),
  totalAmount: z.number(),
});

export const ProviderPayoutSchema = z.object({
  serviceValue: z.number(),
  commission: z.number(),
  netPayout: z.number(),
});

export type FeeBreakdown = z.infer<typeof FeeBreakdownSchema>;
export type ProviderPayout = z.infer<typeof ProviderPayoutSchema>;

// Service pricing tiers (base amounts before fees)
export const ServicePricing = {
  transportation: {
    luxury_sedan: 150,
    luxury_suv: 200,
    executive_van: 300,
    luxury_limousine: 500,
  },
  security: {
    executive_protection: 800,
    residential_security: 600,
    event_security: 1000,
    travel_security: 1200,
  },
  concierge: {
    travel_planning: 500,
    event_management: 800,
    personal_shopping: 300,
    business_services: 600,
  },
  lodging: {
    luxury_hotel: 800,
    private_villa: 1500,
    executive_suite: 1200,
  },
} as const;