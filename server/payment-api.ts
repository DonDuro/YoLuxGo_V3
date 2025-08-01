// Payment API endpoints with YoLuxGo™ fee structure
import { calculateClientFees, ServicePricing } from '@shared/fee-schema';

interface PaymentRequestData {
  service: string;
  serviceType: string;
  location: string;
  isRush?: boolean;
  [key: string]: any;
}

// Calculate pricing based on service type and complexity
export function calculateServicePricing(data: PaymentRequestData): number {
  let basePrice = 500; // Default base price

  // Transportation pricing
  if (data.service === 'transportation') {
    const transportPricing = ServicePricing.transportation;
    basePrice = transportPricing[data.serviceType as keyof typeof transportPricing] || 200;
    
    // Adjust for passenger count
    if (data.passengers && data.passengers > 4) {
      basePrice *= 1.5;
    }
  }
  
  // Security pricing
  else if (data.service === 'security') {
    const securityPricing = ServicePricing.security;
    basePrice = securityPricing[data.serviceType as keyof typeof securityPricing] || 800;
    
    // Adjust for team size and duration
    if (data.teamSize && data.teamSize > 1) {
      basePrice *= data.teamSize;
    }
    if (data.duration && data.duration > 8) {
      basePrice *= 1.3;
    }
  }
  
  // Concierge pricing
  else if (data.service === 'concierge') {
    const conciergePricing = ServicePricing.concierge;
    basePrice = conciergePricing[data.serviceType as keyof typeof conciergePricing] || 500;
    
    // Adjust for complexity
    if (data.complexity === 'complex') {
      basePrice *= 1.5;
    } else if (data.complexity === 'luxury') {
      basePrice *= 2.0;
    }
  }
  
  // Multi-service pricing
  else if (data.service === 'multi-service') {
    basePrice = data.totalEstimate || 2500;
  }

  return basePrice;
}

// Create payment intent with YoLuxGo™ fee structure
export function createPaymentIntent(data: PaymentRequestData) {
  const baseAmount = calculateServicePricing(data);
  const isRush = data.isRush || data.priority === 'urgent' || data.priority === 'critical';
  
  // Calculate fees using YoLuxGo™ fee structure
  const feeBreakdown = calculateClientFees(baseAmount, isRush);
  
  return {
    baseAmount: feeBreakdown.baseAmount,
    bookingFee: feeBreakdown.bookingFee,
    rushFee: feeBreakdown.rushFee,
    totalFees: feeBreakdown.totalFees,
    totalAmount: feeBreakdown.totalAmount,
    isRush,
    breakdown: feeBreakdown,
    // Amount in cents for Stripe
    amountCents: Math.round(feeBreakdown.totalAmount * 100),
  };
}

// Generate payment metadata for Stripe
export function generatePaymentMetadata(data: PaymentRequestData) {
  return {
    service: data.service,
    serviceType: data.serviceType,
    location: data.location,
    clientBookingFee: '10%',
    rushService: data.isRush ? 'true' : 'false',
    platform: 'YoLuxGo™',
    company: 'Nebusis Cloud Services, LLC',
  };
}