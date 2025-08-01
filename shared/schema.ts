import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table for traditional username/password authentication
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role").default("admin").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personnel profiles table for drivers, security guards, and concierges
export const personnelProfiles = pgTable("personnel_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: varchar("role").notNull(), // 'driver' | 'security' | 'concierge'
  name: varchar("name").notNull(),
  alias: varchar("alias"),
  photoUrl: varchar("photo_url"),
  languages: jsonb("languages").$type<string[]>().default([]).notNull(),
  regions: jsonb("regions").$type<string[]>().default([]).notNull(),
  experienceYears: integer("experience_years").default(0).notNull(),
  verifiedBadges: jsonb("verified_badges").$type<string[]>().default([]).notNull(),
  bio: text("bio"),
  availabilityStatus: varchar("availability_status").default("available").notNull(), // 'available' | 'assigned' | 'offline'
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0).notNull(),
  endorsements: jsonb("endorsements").$type<string[]>().default([]).notNull(),
  adminNotes: jsonb("admin_notes").$type<{
    internalScore: number;
    comments: string[];
    trainingRecords: string[];
  }>().default({ internalScore: 0, comments: [], trainingRecords: [] }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personnel availability schedules
export const personnelSchedules = pgTable("personnel_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personnelId: varchar("personnel_id").notNull().references(() => personnelProfiles.id, { onDelete: "cascade" }),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  startTime: varchar("start_time"), // HH:MM format
  endTime: varchar("end_time"), // HH:MM format
  status: varchar("status").default("available").notNull(), // 'available' | 'booked' | 'unavailable'
  assignmentId: varchar("assignment_id"), // Reference to booking/assignment
  createdAt: timestamp("created_at").defaultNow(),
});

// Personnel reviews and ratings
export const personnelReviews = pgTable("personnel_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personnelId: varchar("personnel_id").notNull().references(() => personnelProfiles.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").notNull().references(() => users.id),
  serviceType: varchar("service_type").notNull(), // 'transportation' | 'security' | 'concierge'
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  serviceDate: timestamp("service_date").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;

export type InsertPersonnelProfile = typeof personnelProfiles.$inferInsert;
export type PersonnelProfile = typeof personnelProfiles.$inferSelect;

export type InsertPersonnelSchedule = typeof personnelSchedules.$inferInsert;
export type PersonnelSchedule = typeof personnelSchedules.$inferSelect;

export type InsertPersonnelReview = typeof personnelReviews.$inferInsert;
export type PersonnelReview = typeof personnelReviews.$inferSelect;

// Vetting Officer Companies - Companies that provide vetting services
export const vettingCompanies = pgTable("vetting_companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: varchar("company_name").notNull(),
  licenseNumber: varchar("license_number").unique().notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  address: text("address"),
  specializations: jsonb("specializations").$type<string[]>().default([]).notNull(), // ['background_check', 'financial_verification', 'credential_validation', 'psychological_assessment']
  certifications: jsonb("certifications").$type<string[]>().default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vetting Officers - Individual officers working for vetting companies
export const vettingOfficers = pgTable("vetting_officers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vettingCompanyId: varchar("vetting_company_id").notNull().references(() => vettingCompanies.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull(), // Company's internal employee ID
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  licenseNumber: varchar("license_number"),
  certifications: jsonb("certifications").$type<string[]>().default([]).notNull(),
  specializations: jsonb("specializations").$type<string[]>().default([]).notNull(), // Areas of expertise
  clearanceLevel: varchar("clearance_level").default("standard").notNull(), // 'standard' | 'enhanced' | 'top_secret'
  accessLevel: varchar("access_level").default("officer").notNull(), // 'officer' | 'supervisor' | 'manager'
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vetting Applications - Main application records for candidates
export const vettingApplications = pgTable("vetting_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantEmail: varchar("applicant_email").notNull(),
  userType: varchar("user_type").notNull(), // 'client' | 'service_provider' | 'regional_partner' | 'personnel'
  subType: varchar("sub_type"), // For service providers: 'individual' | 'company'
  membershipTier: varchar("membership_tier"), // For clients: 'standard' | 'premium' | 'vip'
  serviceCategory: varchar("service_category"), // For service providers: specific category
  applicationData: jsonb("application_data").notNull(), // Complete application form data
  currentStatus: varchar("current_status").default("submitted").notNull(), // 'submitted' | 'in_review' | 'additional_info_required' | 'approved' | 'rejected' | 'suspended'
  priorityLevel: varchar("priority_level").default("standard").notNull(), // 'low' | 'standard' | 'high' | 'urgent'
  vettingTier: varchar("vetting_tier").notNull(), // 'basic' | 'enhanced' | 'comprehensive' | 'executive'
  assignedCompanyId: varchar("assigned_company_id").references(() => vettingCompanies.id),
  primaryOfficerId: varchar("primary_officer_id").references(() => vettingOfficers.id),
  secondaryOfficerId: varchar("secondary_officer_id").references(() => vettingOfficers.id), // For dual verification
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Verification Tasks - Individual verification components
export const verificationTasks = pgTable("verification_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => vettingApplications.id, { onDelete: "cascade" }),
  taskType: varchar("task_type").notNull(), // 'identity_verification' | 'background_check' | 'financial_verification' | 'credential_validation' | 'reference_check' | 'interview' | 'skills_assessment'
  taskDescription: text("task_description").notNull(),
  requiredDocuments: jsonb("required_documents").$type<string[]>().default([]).notNull(),
  assignedOfficerId: varchar("assigned_officer_id").references(() => vettingOfficers.id),
  status: varchar("status").default("pending").notNull(), // 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
  priority: varchar("priority").default("standard").notNull(), // 'low' | 'standard' | 'high' | 'critical'
  result: varchar("result"), // 'pass' | 'fail' | 'conditional' | 'requires_review'
  findings: jsonb("findings").$type<{
    score?: number;
    issues?: string[];
    recommendations?: string[];
    additionalInfo?: any;
  }>(),
  documentsReceived: jsonb("documents_received").$type<string[]>().default([]).notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Verification Documents - Uploaded documents for verification
export const verificationDocuments = pgTable("verification_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => vettingApplications.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").references(() => verificationTasks.id, { onDelete: "cascade" }),
  documentType: varchar("document_type").notNull(), // 'identity' | 'address_proof' | 'license' | 'certification' | 'reference' | 'financial' | 'other'
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size"),
  fileHash: varchar("file_hash"), // For integrity verification
  uploadedBy: varchar("uploaded_by").notNull(), // 'applicant' | 'officer' | 'system'
  verificationStatus: varchar("verification_status").default("pending").notNull(), // 'pending' | 'verified' | 'rejected' | 'expired'
  verifiedBy: varchar("verified_by").references(() => vettingOfficers.id),
  verificationNotes: text("verification_notes"),
  expirationDate: timestamp("expiration_date"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

// Vetting Audit Trail - Complete audit log of all vetting activities
export const vettingAuditTrail = pgTable("vetting_audit_trail", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => vettingApplications.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").references(() => verificationTasks.id, { onDelete: "cascade" }),
  actorId: varchar("actor_id").notNull(), // Officer, system, or admin performing action
  actorType: varchar("actor_type").notNull(), // 'officer' | 'admin' | 'system' | 'applicant'
  action: varchar("action").notNull(), // 'created' | 'updated' | 'approved' | 'rejected' | 'escalated' | 'commented' | 'document_uploaded'
  previousState: jsonb("previous_state"),
  newState: jsonb("new_state"),
  reason: text("reason"),
  metadata: jsonb("metadata"), // Additional context data
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vetting Comments and Notes
export const vettingComments = pgTable("vetting_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => vettingApplications.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").references(() => verificationTasks.id, { onDelete: "cascade" }),
  authorId: varchar("author_id").notNull().references(() => vettingOfficers.id),
  comment: text("comment").notNull(),
  isInternal: boolean("is_internal").default(true).notNull(), // Internal notes vs applicant communication
  visibility: varchar("visibility").default("officer").notNull(), // 'officer' | 'supervisor' | 'manager' | 'admin'
  flagged: boolean("flagged").default(false).notNull(), // For important/concerning comments
  createdAt: timestamp("created_at").defaultNow(),
});

// Vetting Escalations - For cases requiring supervisor/manager review
export const vettingEscalations = pgTable("vetting_escalations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => vettingApplications.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").references(() => verificationTasks.id, { onDelete: "cascade" }),
  escalatedBy: varchar("escalated_by").notNull().references(() => vettingOfficers.id),
  escalatedTo: varchar("escalated_to").notNull().references(() => vettingOfficers.id),
  reason: text("reason").notNull(),
  urgency: varchar("urgency").default("standard").notNull(), // 'low' | 'standard' | 'high' | 'critical'
  status: varchar("status").default("pending").notNull(), // 'pending' | 'in_review' | 'resolved' | 'escalated_further'
  resolution: text("resolution"),
  resolvedBy: varchar("resolved_by").references(() => vettingOfficers.id),
  escalatedAt: timestamp("escalated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Type exports for the new vetting tables
export type InsertVettingCompany = typeof vettingCompanies.$inferInsert;
export type VettingCompany = typeof vettingCompanies.$inferSelect;

export type InsertVettingOfficer = typeof vettingOfficers.$inferInsert;
export type VettingOfficer = typeof vettingOfficers.$inferSelect;

export type InsertVettingApplication = typeof vettingApplications.$inferInsert;
export type VettingApplication = typeof vettingApplications.$inferSelect;

export type InsertVerificationTask = typeof verificationTasks.$inferInsert;
export type VerificationTask = typeof verificationTasks.$inferSelect;

export type InsertVerificationDocument = typeof verificationDocuments.$inferInsert;
export type VerificationDocument = typeof verificationDocuments.$inferSelect;

export type InsertVettingAuditTrail = typeof vettingAuditTrail.$inferInsert;
export type VettingAuditTrail = typeof vettingAuditTrail.$inferSelect;

export type InsertVettingComment = typeof vettingComments.$inferInsert;
export type VettingComment = typeof vettingComments.$inferSelect;

export type InsertVettingEscalation = typeof vettingEscalations.$inferInsert;
export type VettingEscalation = typeof vettingEscalations.$inferSelect;

// Job applications table for careers section
export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  position: varchar("position").notNull(), // The position they're applying for
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  linkedinUrl: varchar("linkedin_url"),
  coverLetter: text("cover_letter"),
  photoUrl: varchar("photo_url"),
  status: varchar("status").default("pending").notNull(), // 'pending' | 'reviewed' | 'interviewing' | 'hired' | 'rejected'
  notes: text("notes"), // HR notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

// Investment interests table for capturing investor information
export const investmentInterests = pgTable("investment_interests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name").notNull(),
  entityName: varchar("entity_name"),
  country: varchar("country").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  investmentRange: varchar("investment_range").notNull(),
  investmentStructure: varchar("investment_structure").notNull(),
  dueDiligenceTimeline: varchar("due_diligence_timeline").notNull(),
  agreesToNDA: boolean("agrees_to_nda").notNull(),
  requestsMeeting: boolean("requests_meeting").default(false).notNull(),
  digitalSignature: varchar("digital_signature").notNull(),
  status: varchar("status").default("submitted").notNull(), // 'submitted' | 'under_review' | 'nda_sent' | 'meeting_scheduled' | 'declined'
  adminNotes: text("admin_notes"),
  reviewedBy: varchar("reviewed_by"), // Admin who reviewed this
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InvestmentInterest = typeof investmentInterests.$inferSelect;
export type InsertInvestmentInterest = typeof investmentInterests.$inferInsert;

// Zod schemas for validation
export const insertVettingApplicationSchema = createInsertSchema(vettingApplications);
export const insertVerificationTaskSchema = createInsertSchema(verificationTasks);
export const insertVettingCommentSchema = createInsertSchema(vettingComments);
export const insertJobApplicationSchema = createInsertSchema(jobApplications);
export const insertInvestmentInterestSchema = createInsertSchema(investmentInterests);
