export type MarketType = 'off-plan' | 'secondary';

export interface PropertyListingForm {
  title: string;
  developer: string;
  location: string;
  propertyType: string;
  bedrooms: string;
  priceAED: number;
  marketType: MarketType;
  roiPercent: number;
  paymentPlan: string;
  handoverDate: string;
  rentalStatus: string;
  sizeSqft: number;
  features: string;
  targetAudience: string;
}

export interface GeneratedMarketingPackage {
  whatsappBroadcast: string;
  metaAdCopy: {
    headline: string;
    primaryText: string;
    description: string;
    callToAction: string;
  };
  portalListing: {
    headline: string;
    description: string;
    keyHighlights: string[];
    paymentPlanBreakdown: string;
    permitDisclaimer: string;
  };
  investorBrief: string;
  hotSellingPoints: string[];
}

export interface QualifiedBuyer {
  clientName: string;
  contactPhone: string | null;
  preferredCommunities: string[];
  propertyType: string;
  bedroomCount: string;
  budgetMinAED: number;
  budgetMaxAED: number;
  formattedBudget: string;
  purpose: 'Investor' | 'End-user' | 'Both' | 'Unspecified';
  financeType: 'Cash' | 'Mortgage' | 'Flexible' | 'Cash / Flexible' | string;
  timeline: string;
  goldenVisaCandidate: boolean;
  keyPriorities: string[];
  dealbreakers: string[];
  buyerReadinessScore: number;
  brokerSummary: string;
  suggestedWhatsAppReply: string;
}

export interface ExtractedGroupListing {
  id: string;
  status: 'AVAILABLE' | 'WTB';
  area: string;
  building: string;
  developer?: string;
  propertyType: string;
  beds: string;
  priceAED: number;
  formattedPrice: string;
  sizeSqFt?: number;
  commissionStatus: string;
  contactInfo: string;
  brokerPhone?: string | null;
  isDirect: boolean;
  tags: string[];
  notes: string;
  confidence: 'High' | 'Medium';
}

export interface MilestoneReminderData {
  projectName: string;
  developer: string;
  unitNumber: string;
  investorName: string;
  milestonePercent: number;
  amountAED: number;
  dueDate: string;
  escrowBank: string;
  escrowAccountNumber: string;
  escrowIban: string;
  constructionMilestone: string;
  brokerName: string;
  brokerAgency: string;
  channel: 'both' | 'whatsapp' | 'email';
}

export interface MilestoneReminderOutput {
  emailSubject: string;
  formalEmailBody: string;
  whatsappQuickNotice: string;
  escrowVerificationChecklist: string[];
  dldComplianceAdvice: string;
}

export interface InventoryProperty {
  id: string;
  title: string;
  developer: string;
  location: string;
  type: string;
  beds: string;
  priceAED: number;
  sizeSqft: number;
  marketType: MarketType;
  roiEstimate: number;
  paymentPlan: string;
  handover: string;
  status: 'Available' | 'Reserved' | 'Sold';
  featuredImage?: string;
  tags: string[];
}

export type DealType = 'FOR_SALE' | 'FOR_RENT' | 'BOTH';

export interface BrokerProperty {
  id: string;
  title: string;
  building: string;
  unitNumber: string;
  community: string;
  propertyType: 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse' | 'Commercial' | 'Studio';
  bedrooms: string;
  bathrooms: number;
  sizeSqft: number;
  dealType: DealType;
  // For Sale Fields
  askingPriceAED?: number;
  saleStatus?: 'Available' | 'Under Offer' | 'Sold';
  titleDeedStatus?: 'Title Deed Ready' | 'Oqood' | 'Under Mortgage';
  occupancyStatus?: 'Vacant on Transfer' | 'Rented' | 'Owner Occupied';
  // For Rent & Tenancy Fields
  annualRentAED?: number;
  rentalStatus?: 'Vacant / Available Now' | 'Rented (Active)' | 'Under Maintenance' | 'Available Next Year';
  chequesRequired?: number; // 1, 2, 4, 6
  securityDepositAED?: number;
  currentTenantName?: string;
  currentTenantPhone?: string;
  currentRentAED?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  expectedAvailableDate?: string;
  ejariNumber?: string;
  serviceChargesAED?: number;
  // Landlord & Broker Metadata
  landlordName: string;
  landlordPhone: string;
  exclusive: boolean;
  amenities: string[];
  notes?: string;
  createdAt: string;
}

export type AlertUrgency = 'URGENT' | 'RERA_90_DAY' | 'NEXT_YEAR' | 'VACANT';

export interface TenancyAlert {
  propertyId: string;
  propertyTitle: string;
  community: string;
  unitNumber: string;
  urgency: AlertUrgency;
  daysRemaining: number;
  leaseEndDate?: string;
  expectedAvailableDate?: string;
  currentRentAED?: number;
  annualRentAED?: number;
  tenantName?: string;
  tenantPhone?: string;
  landlordName: string;
  landlordPhone: string;
  headline: string;
  recommendation: string;
}

