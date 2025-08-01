import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { adminAuth } from "./adminAuth";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { createPaymentIntent, generatePaymentMetadata } from "./payment-api";

// Type declaration for global object extensions
declare global {
  var contactInquiries: any[] | undefined;
  var vettingApplications: any[] | undefined;
  var vettingCompanies: any[] | undefined;
  var vettingOfficers: any[] | undefined;
  var verificationTasks: any[] | undefined;
  var investmentInterests: any[] | undefined;
  var jobApplications: any[] | undefined;
}

// In-memory storage for service requests
const serviceRequests: Map<string, any[]> = new Map();

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Get test accounts for login validation
  const getTestAccounts = () => {
    const testAccounts = [];
    
    // Clients
    testAccounts.push(
      { email: "alexander.rothschild@mockylg.com", password: "admin123", userType: "client", profile: { id: "client-001", firstName: "Alexander", lastName: "Rothschild", membershipTier: "VIP" }},
      { email: "isabella.habsburg@mockylg.com", password: "admin123", userType: "client", profile: { id: "client-002", firstName: "Isabella", lastName: "Von Habsburg", membershipTier: "VIP" }},
      { email: "james.morrison@mockylg.com", password: "admin123", userType: "client", profile: { id: "client-003", firstName: "James", lastName: "Morrison", membershipTier: "Premium" }}
    );
    
    // Service Providers - Individuals
    testAccounts.push(
      { email: "marcus.wellington@mockylg.com", password: "admin123", userType: "service_provider", subType: "individual", profile: { id: "sp-ind-001", category: "Executive Driver", firstName: "Marcus", lastName: "Wellington" }},
      { email: "elena.volkov@mockylg.com", password: "admin123", userType: "service_provider", subType: "individual", profile: { id: "sp-ind-002", category: "Close Protection Guard", firstName: "Elena", lastName: "Volkov" }},
      { email: "sophia.martinez@mockylg.com", password: "admin123", userType: "service_provider", subType: "individual", profile: { id: "sp-ind-003", category: "Elite Concierge", firstName: "Sophia", lastName: "Martinez" }},
      { email: "david.blackwood@mockylg.com", password: "admin123", userType: "service_provider", subType: "individual", profile: { id: "sp-ind-004", category: "Private Chef", firstName: "David", lastName: "Blackwood" }},
      { email: "dr.rachel.stone@mockylg.com", password: "admin123", userType: "service_provider", subType: "individual", profile: { id: "sp-ind-005", category: "Medical Personnel", firstName: "Dr. Rachel", lastName: "Stone" }}
    );
    
    // Service Providers - Companies
    testAccounts.push(
      { email: "operations@manhattan-elite.mockylg.com", password: "admin123", userType: "service_provider", subType: "company", profile: { id: "sp-comp-001", category: "Vehicle Provider", companyName: "Manhattan Elite Motors", contactPerson: "Robert Chen" }},
      { email: "contracts@apex-protection.mockylg.com", password: "admin123", userType: "service_provider", subType: "company", profile: { id: "sp-comp-002", category: "Security Firm", companyName: "Apex Protection Services", contactPerson: "Sarah Mitchell" }},
      { email: "reservations@prestige-villas.mockylg.com", password: "admin123", userType: "service_provider", subType: "company", profile: { id: "sp-comp-003", category: "Accommodation Provider", companyName: "Prestige Villa Collection", contactPerson: "Maria Santos" }},
      { email: "charter@skyline-aviation.mockylg.com", password: "admin123", userType: "service_provider", subType: "company", profile: { id: "sp-comp-004", category: "Private Aviation", companyName: "Skyline Aviation Services", contactPerson: "Captain Mike Torres" }},
      { email: "events@elite-concierge.mockylg.com", password: "admin123", userType: "service_provider", subType: "company", profile: { id: "sp-comp-005", category: "Concierge Company", companyName: "Elite Concierge Solutions", contactPerson: "Amanda Foster" }}
    );
    
    // Regional Partners
    testAccounts.push(
      { email: "victoria.sterling@mockylg.com", password: "admin123", userType: "regional_partner", profile: { id: "rp-001", firstName: "Victoria", lastName: "Sterling", region: "New York", title: "Regional Director - Northeast" }},
      { email: "carlos.mendoza@mockylg.com", password: "admin123", userType: "regional_partner", profile: { id: "rp-002", firstName: "Carlos", lastName: "Mendoza", region: "Miami", title: "Regional Director - Southeast" }},
      { email: "alessandro.romano@mockylg.com", password: "admin123", userType: "regional_partner", profile: { id: "rp-003", firstName: "Alessandro", lastName: "Romano", region: "Malaga-Marbella", title: "Regional Director - Europe" }},
      { email: "jennifer.kim@mockylg.com", password: "admin123", userType: "regional_partner", profile: { id: "rp-004", firstName: "Jennifer", lastName: "Kim", region: "Los Angeles", title: "Regional Director - West Coast" }}
    );
    
    // Admins
    testAccounts.push(
      { email: "calvarado@mockylg.com", password: "admin123", userType: "admin", profile: { id: "admin-001", firstName: "Celso", lastName: "Alvarado", role: "Master Admin", title: "Founder & CEO" }},
      { email: "calvarado@nebusis.com", password: "admin123", userType: "admin", profile: { id: "admin-nebusis-001", firstName: "Celso", lastName: "Alvarado", role: "Master Admin", title: "Founder & CEO" }},
      { email: "diana.chen@mockylg.com", password: "admin123", userType: "admin", profile: { id: "admin-002", firstName: "Diana", lastName: "Chen", role: "Operations Director", title: "Chief Operating Officer" }},
      { email: "tech.admin@mockylg.com", password: "admin123", userType: "admin", profile: { id: "admin-003", firstName: "Alex", lastName: "Rodriguez", role: "Technical Director", title: "Chief Technology Officer" }}
    );
    
    // Original admin account
    testAccounts.push(
      { email: "calvarado@nebusis.com", password: "admin123", userType: "admin", profile: { id: "admin-master", firstName: "Celso", lastName: "Alvarado", role: "Master Admin", title: "Founder & CEO" }}
    );
    
    // Additional Master Admin - Daniel Zambrano
    testAccounts.push(
      { email: "dzambrano@nebusis.com", password: "admin123", userType: "admin", profile: { id: "admin-daniel", firstName: "Daniel", lastName: "Zambrano", role: "Master Admin", title: "CTO" }}
    );
    
    // Dev Admin - Special testing account that can switch between user types
    testAccounts.push(
      { email: "dev@yoluxgo.test", password: "devadmin123", userType: "dev_admin", profile: { id: "dev-admin", firstName: "Dev", lastName: "Admin", role: "Development Admin", title: "Testing Interface" }}
    );
    
    // Personnel accounts - Integrated into main authentication
    testAccounts.push(
      { email: "privacy@yoluxgo.com", password: "admin123", userType: "personnel", profile: { id: "pers-001", firstName: "Sarah", lastName: "Mitchell", department: "Privacy & Data Protection", personnelRole: "privacy", permissions: ["privacy", "feedback"], isPersonnel: true }},
      { email: "legal@yoluxgo.com", password: "admin123", userType: "personnel", profile: { id: "pers-002", firstName: "Michael", lastName: "Rodriguez", department: "Legal Affairs", personnelRole: "legal", permissions: ["legal", "partnership", "general"], isPersonnel: true }},
      { email: "support@yoluxgo.com", password: "admin123", userType: "personnel", profile: { id: "pers-003", firstName: "Emma", lastName: "Chen", department: "Technical Support", personnelRole: "support", permissions: ["support", "general"], isPersonnel: true }},
      { email: "security@yoluxgo.com", password: "admin123", userType: "personnel", profile: { id: "pers-004", firstName: "David", lastName: "Thompson", department: "Security Services", personnelRole: "security", permissions: ["security", "transportation"], isPersonnel: true }},
      { email: "concierge@yoluxgo.com", password: "admin123", userType: "personnel", profile: { id: "pers-005", firstName: "Isabella", lastName: "Williams", department: "Concierge Intelligence", personnelRole: "concierge", permissions: ["concierge", "multi-service"], isPersonnel: true }}
    );

    // Investors
    testAccounts.push(
      { email: "investor.demo@mockylg.com", password: "investor123", userType: "investor", profile: { id: "inv-001", firstName: "Victoria", lastName: "Sterling", investmentFirm: "Sterling Capital Partners", title: "Managing Partner", investmentFocus: "Technology & Luxury Services", accessLevel: "Business Plan & Financials" }},
      { email: "john.blackstone@mockylg.com", password: "investor123", userType: "investor", profile: { id: "inv-002", firstName: "John", lastName: "Blackstone", investmentFirm: "Blackstone Ventures", title: "Senior Partner", investmentFocus: "Security & Transportation", accessLevel: "Business Plan & Metrics" }}
    );

    // HR Personnel
    testAccounts.push(
      { email: "hr@yoluxgo.com", password: "hr123", userType: "hr", profile: { id: "hr-001", firstName: "Amanda", lastName: "Foster", department: "Human Resources", title: "HR Director", permissions: ["view_applications", "manage_applications", "interview_scheduling"] }},
      { email: "recruiting@yoluxgo.com", password: "hr123", userType: "hr", profile: { id: "hr-002", firstName: "Michael", lastName: "Chen", department: "Talent Acquisition", title: "Senior Recruiter", permissions: ["view_applications", "manage_applications"] }}
    );
    
    return testAccounts;
  };

  // Client auth routes
  app.post('/api/auth/login', async (req, res) => {
    const { email, password, loginType } = req.body;
    
    console.log('Login attempt:', { email, password, loginType });
    
    // Get all test accounts
    const testAccounts = getTestAccounts();
    
    // Find matching account
    const account = testAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      const token = jwt.sign(
        { 
          userId: account.profile.id, 
          email: account.email,
          userType: account.userType,
          subType: account.subType || null
        }, 
        process.env.SESSION_SECRET!, 
        { expiresIn: '24h' }
      );
      
      res.json({
        message: "Login successful",
        token,
        user_id: account.profile.id,
        userType: account.userType,
        profile: account.profile
      });
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    // Mock registration
    const token = jwt.sign(
      { userId: Date.now(), email }, 
      process.env.SESSION_SECRET!, 
      { expiresIn: '24h' }
    );
    
    res.json({
      message: "Registration successful",
      token,
      user_id: Date.now()
    });
  });

  app.post('/api/auth/logout', async (req, res) => {
    res.json({ message: "Logout successful" });
  });

  // Dev Admin: Switch user type for testing
  app.post('/api/dev-admin/switch-user-type', async (req, res) => {
    const { targetUserType, targetUserId, targetSubType } = req.body;
    
    // Only allow this for dev admin users
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
      
      // Allow access for dev_admin, admin, or users switched by dev_admin/admin
      if (decoded.userType !== 'dev_admin' && decoded.userType !== 'admin' && 
          !decoded.originalDevAdmin && !decoded.originalMasterAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get all test accounts to find the target user
      const testAccounts = getTestAccounts();
      let targetAccount;
      
      if (targetUserId) {
        // Switch to specific user by ID
        targetAccount = testAccounts.find(acc => acc.profile.id === targetUserId);
      } else {
        // Switch to first user of target type, considering subType if specified
        if (targetSubType) {
          targetAccount = testAccounts.find(acc => 
            acc.userType === targetUserType && acc.subType === targetSubType
          );
        } else {
          targetAccount = testAccounts.find(acc => acc.userType === targetUserType);
        }
      }
      
      if (!targetAccount) {
        return res.status(404).json({ message: "Target user not found" });
      }
      
      // Calculate preserved admin flags
      const preservedDevAdmin = decoded.originalDevAdmin === true || decoded.userType === 'dev_admin';
      const preservedMasterAdmin = decoded.originalMasterAdmin === true || (decoded.userType === 'admin' && decoded.userId === 'admin-master');
      
      // Create new token with target user's info
      const newToken = jwt.sign(
        { 
          userId: targetAccount.profile.id, 
          email: targetAccount.email,
          userType: targetAccount.userType,
          subType: targetAccount.subType || null,
          originalDevAdmin: preservedDevAdmin, // Preserve original dev admin status
          originalMasterAdmin: preservedMasterAdmin // Preserve original master admin status
        }, 
        process.env.SESSION_SECRET!, 
        { expiresIn: '24h' }
      );
      
      res.json({
        message: "User type switched successfully",
        token: newToken,
        user_id: targetAccount.profile.id,
        userType: targetAccount.userType,
        subType: targetAccount.subType,
        profile: targetAccount.profile
      });
      
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Get available users for dev admin switching
  app.get('/api/dev-admin/available-users', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
      
      // Allow access for dev_admin, admin, or users switched by dev_admin/admin
      const hasAdminAccess = decoded.userType === 'dev_admin' || 
                            decoded.userType === 'admin' || 
                            decoded.originalDevAdmin === true || 
                            decoded.originalMasterAdmin === true;
      
      if (!hasAdminAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const testAccounts = getTestAccounts();
      
      // Group users by type for easy selection
      const usersByType = {
        clients: testAccounts.filter(acc => acc.userType === 'client'),
        service_providers: testAccounts.filter(acc => acc.userType === 'service_provider'),
        regional_partners: testAccounts.filter(acc => acc.userType === 'regional_partner'),
        admins: testAccounts.filter(acc => acc.userType === 'admin'),
        investors: testAccounts.filter(acc => acc.userType === 'investor')
      };
      
      res.json(usersByType);
      
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin bypass route for immediate access
  app.get("/api/admin/bypass", async (req, res) => {
    try {
      // Create admin session directly
      const admin = {
        id: "fa57e891-eb53-44ac-a000-e58fb55938f0",
        username: "calvarado@nebusis.com",
        email: "calvarado@nebusis.com",
        firstName: "Celso",
        lastName: "Alvarado",
        role: "master_admin"
      };

      const token = jwt.sign(
        { 
          adminId: admin.id, 
          username: admin.username, 
          role: admin.role 
        }, 
        process.env.SESSION_SECRET!, 
        { expiresIn: '24h' }
      );

      res.json({
        message: "Admin bypass successful",
        token,
        admin
      });
    } catch (error) {
      console.error("Admin bypass error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const admin = await adminAuth.authenticateAdmin(username, password);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create JWT token for admin session
      const token = jwt.sign(
        { 
          adminId: admin.id, 
          username: admin.username, 
          role: admin.role 
        }, 
        process.env.SESSION_SECRET!, 
        { expiresIn: '24h' }
      );

      res.json({
        message: "Admin login successful",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin-only protected routes - accepts both admin tokens and main auth tokens from admin users
  const authenticateAdmin = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
      
      // Try admin database system first
      if (decoded.adminId) {
        const admin = await adminAuth.getAdminById(decoded.adminId);
        if (admin && admin.isActive) {
          req.admin = admin;
          return next();
        }
      }
      
      // Fall back to main auth system for admin users
      if (decoded.userType === 'admin') {
        // Get test accounts to find the admin user
        const testAccounts = getTestAccounts();
        const adminAccount = testAccounts.find(acc => acc.profile.id === decoded.userId);
        
        if (adminAccount) {
          req.admin = {
            id: adminAccount.profile.id,
            username: adminAccount.email,
            email: adminAccount.email,
            firstName: adminAccount.profile.firstName,
            lastName: adminAccount.profile.lastName,
            role: adminAccount.profile.role,
            isActive: true
          };
          return next();
        }
      }
      
      return res.status(401).json({ message: "Invalid admin token" });
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  app.get("/api/admin/profile", authenticateAdmin, async (req: any, res) => {
    res.json({
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        email: req.admin.email,
        firstName: req.admin.firstName,
        lastName: req.admin.lastName,
        role: req.admin.role
      }
    });
  });

  app.get("/api/admin/users", authenticateAdmin, async (req: any, res) => {
    try {
      const { users, adminUsers } = await import("@shared/schema");
      const { db } = await import("./db");
      
      // Get all regular users (from Replit Auth)
      const regularUsers = await db.select().from(users);
      
      // Get all admin users
      const adminUsersList = await db.select({
        id: adminUsers.id,
        username: adminUsers.username,
        email: adminUsers.email,
        firstName: adminUsers.firstName,
        lastName: adminUsers.lastName,
        role: adminUsers.role,
        isActive: adminUsers.isActive,
        createdAt: adminUsers.createdAt
      }).from(adminUsers);

      res.json({
        regularUsers,
        adminUsers: adminUsersList,
        totalUsers: regularUsers.length + adminUsersList.length
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Contact form endpoint - Enhanced to store inquiries
  app.post("/api/contact", async (req, res) => {
    const { firstName, lastName, email, phone, company, inquiryType, subject, message } = req.body;
    
    // Create inquiry record
    const inquiry = {
      id: `CONTACT-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      company,
      inquiryType,
      subject,
      message,
      status: 'new',
      priority: inquiryType === 'urgent' ? 'urgent' : 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In production, this would:
    // 1. Store in database
    // 2. Send email to yoluxgo@nebusis.com
    // 3. Notify appropriate personnel based on inquiry type
    
    console.log("Contact form submission:", inquiry);
    
    // Store in memory for demo (in production, use database)
    if (!globalThis.contactInquiries) {
      globalThis.contactInquiries = [
        // Sample inquiries for testing
        {
          id: "CONTACT-1753759000000",
          firstName: "Alexander",
          lastName: "Rothschild",
          email: "alexander.rothschild@mockylg.com",
          phone: "+1-555-0123",
          company: "Rothschild Holdings",
          inquiryType: "security",
          subject: "Executive Protection Services for European Tour",
          message: "I require comprehensive executive protection services for a 2-week business tour across Europe. This includes close protection detail, advance security planning, and secure transportation coordination. The tour will include meetings in London, Paris, Zurich, and Milan with high-profile clients and government officials.",
          status: "new",
          priority: "high",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "CONTACT-1753759000001",
          firstName: "Sarah",
          lastName: "Chen",
          email: "s.chen@luxuryevents.com",
          phone: "+1-555-0456",
          company: "Elite Events Co.",
          inquiryType: "concierge",
          subject: "Multi-Service Package for Celebrity Wedding",
          message: "We are organizing a high-profile celebrity wedding in Marbella and need comprehensive concierge intelligence services including venue coordination, guest management, media liaison, and luxury accommodation arrangements for 200+ VIP guests. The event requires absolute discretion and world-class service standards.",
          status: "in_progress",
          priority: "urgent",
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "CONTACT-1753759000002",
          firstName: "Michael",
          lastName: "Torres",
          email: "mtorres@globalcorp.net",
          phone: "+1-555-0789",
          company: "Global Corp International",
          inquiryType: "transportation",
          subject: "Executive Transportation Network - Miami Operations",
          message: "Our corporation needs to establish a dedicated executive transportation service in Miami for our C-suite executives and international clients. This includes luxury vehicle fleet management, professional chauffeur services, airport transfers, and 24/7 availability for urgent transportation needs.",
          status: "new",
          priority: "medium",
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: "CONTACT-1753759000003",
          firstName: "Emma",
          lastName: "Williams",
          email: "ewilliams@techstartup.io",
          phone: "+1-555-0321",
          company: "Innovation Labs",
          inquiryType: "support",
          subject: "Technical Support for Personnel Portal Access",
          message: "I'm experiencing issues accessing the YoLuxGo personnel portal. The system doesn't seem to recognize my credentials, and I'm unable to view the client inquiries assigned to my department. Could you please assist with troubleshooting the authentication system?",
          status: "new",
          priority: "low",
          createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          updatedAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: "CONTACT-1753759000004",
          firstName: "David",
          lastName: "Kumar",
          email: "david.kumar@privacyfirm.com",
          phone: "+1-555-0654",
          company: "Privacy Solutions LLC",
          inquiryType: "privacy",
          subject: "Data Subject Access Request - GDPR Compliance",
          message: "I am submitting a formal data subject access request under GDPR Article 15. I require a complete copy of all personal data that YoLuxGo processes about me, including data processing purposes, retention periods, and third-party data sharing arrangements. Please provide this information within the legally required 30-day timeframe.",
          status: "resolved",
          priority: "high",
          createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    }
    globalThis.contactInquiries.push(inquiry);
    
    res.json({ 
      success: true, 
      message: "Contact form submitted successfully",
      id: inquiry.id
    });
  });

  // Personnel authentication middleware - Use main auth system
  const authenticatePersonnel = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "Personnel authentication required" });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
      
      // Allow personnel type or master admins (calvarado@nebusis.com, dzambrano@nebusis.com)
      const isMasterAdmin = decoded.email === 'calvarado@nebusis.com' || decoded.email === 'dzambrano@nebusis.com';
      
      if (decoded.userType !== 'personnel' && !isMasterAdmin) {
        return res.status(403).json({ message: "Personnel access required" });
      }
      
      // Get account profile from test accounts
      const testAccounts = getTestAccounts();
      const account = testAccounts.find(acc => acc.profile.id === decoded.userId);
      
      if (!account) {
        return res.status(401).json({ message: "Account not found" });
      }
      
      // Set personnel info with master admin override
      req.personnel = {
        ...account.profile,
        isMasterAdmin,
        permissions: isMasterAdmin ? ['all'] : account.profile.permissions
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  // Personnel now integrated into main auth system

  // Personnel login endpoint - Redirect to main auth
  app.post("/api/personnel/login", async (req, res) => {
    // Personnel now use main authentication system
    res.status(400).json({ 
      message: "Please use main login system at /auth", 
      redirect: "/auth" 
    });
  });

  // Get personnel profile
  app.get("/api/personnel/profile", authenticatePersonnel, async (req: any, res) => {
    res.json(req.personnel);
  });

  // Get inquiries for personnel (filtered by role/permissions)
  app.get("/api/personnel/inquiries", authenticatePersonnel, async (req: any, res) => {
    const { status, priority } = req.query;
    const personnel = req.personnel;
    
    // Get all inquiries (from memory for demo)
    let inquiries = globalThis.contactInquiries || [];
    
    // Master admins can see all inquiries, regular personnel filter by permissions
    if (!personnel.isMasterAdmin) {
      inquiries = inquiries.filter((inquiry: any) => 
        personnel.permissions.includes(inquiry.inquiryType)
      );
    }
    
    // Apply filters
    if (status && status !== 'all') {
      inquiries = inquiries.filter((inquiry: any) => inquiry.status === status);
    }
    
    if (priority && priority !== 'all') {
      inquiries = inquiries.filter((inquiry: any) => inquiry.priority === priority);
    }
    
    // Sort by created date (newest first)
    inquiries.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json(inquiries);
  });

  // Update inquiry status
  app.patch("/api/personnel/inquiries/:id", authenticatePersonnel, async (req: any, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    if (!globalThis.contactInquiries) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    const inquiryIndex = globalThis.contactInquiries.findIndex((inquiry: any) => inquiry.id === id);
    
    if (inquiryIndex === -1) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    // Update inquiry
    globalThis.contactInquiries[inquiryIndex] = {
      ...globalThis.contactInquiries[inquiryIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ 
      success: true, 
      message: "Inquiry updated successfully",
      inquiry: globalThis.contactInquiries[inquiryIndex]
    });
  });

  // ==============================================
  // VETTING SYSTEM API ROUTES
  // ==============================================

  // Vetting Officer Authentication middleware
  const authenticateVettingOfficer = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
      req.vettingOfficer = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  // Mock vetting data storage
  if (!globalThis.vettingApplications) {
    globalThis.vettingApplications = [
      {
        id: "VET-2024-001",
        applicantEmail: "marcus.wellington@mockylg.com",
        userType: "service_provider",
        subType: "individual",
        serviceCategory: "Executive Driver",
        applicationData: {
          firstName: "Marcus",
          lastName: "Wellington",
          phone: "+1-555-0123",
          experience: "8 years",
          licenses: ["Commercial Driver's License", "Defensive Driving Certification"],
          background: "Former executive driver for Fortune 500 CEOs"
        },
        currentStatus: "in_review",
        priorityLevel: "standard",
        vettingTier: "enhanced",
        assignedCompanyId: "vetting-001",
        primaryOfficerId: "officer-001",
        estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "VET-2024-002",
        applicantEmail: "elena.volkov@mockylg.com",
        userType: "service_provider",
        subType: "individual",
        serviceCategory: "Close Protection Guard",
        applicationData: {
          firstName: "Elena",
          lastName: "Volkov",
          phone: "+1-555-0456",
          experience: "12 years",
          licenses: ["Security License", "Firearms Certification", "Executive Protection Certification"],
          background: "Former military, specialized in VIP protection"
        },
        currentStatus: "additional_info_required",
        priorityLevel: "high",
        vettingTier: "comprehensive",
        assignedCompanyId: "vetting-001",
        primaryOfficerId: "officer-002",
        secondaryOfficerId: "officer-003",
        estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "VET-2024-003",
        applicantEmail: "alexander.rothschild@mockylg.com",
        userType: "client",
        membershipTier: "vip",
        applicationData: {
          firstName: "Alexander",
          lastName: "Rothschild",
          phone: "+1-555-0789",
          company: "Rothschild Holdings",
          netWorth: "Ultra-High",
          securityClearance: "Top Secret"
        },
        currentStatus: "approved",
        priorityLevel: "urgent",
        vettingTier: "executive",
        assignedCompanyId: "vetting-001",
        primaryOfficerId: "officer-004",
        secondaryOfficerId: "officer-005",
        actualCompletionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (!globalThis.vettingCompanies) {
    globalThis.vettingCompanies = [
      {
        id: "vetting-001",
        companyName: "Elite Verification Services LLC",
        licenseNumber: "EVS-2024-001",
        contactEmail: "operations@eliteverification.com",
        contactPhone: "+1-555-VETTING",
        address: "1200 Corporate Blvd, Miami, FL 33131",
        specializations: ["background_check", "financial_verification", "credential_validation", "psychological_assessment"],
        certifications: ["ISO 27001", "NACI Certified", "FCRA Compliant"],
        isActive: true,
        contractStartDate: new Date("2024-01-01").toISOString(),
        contractEndDate: new Date("2025-12-31").toISOString(),
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (!globalThis.vettingOfficers) {
    globalThis.vettingOfficers = [
      {
        id: "officer-001",
        vettingCompanyId: "vetting-001",
        employeeId: "EVS-001",
        firstName: "Sarah",
        lastName: "Mitchell",
        email: "s.mitchell@eliteverification.com",
        licenseNumber: "PI-FL-2024-001",
        certifications: ["Certified Background Investigator", "Financial Fraud Examiner"],
        specializations: ["background_check", "credential_validation"],
        clearanceLevel: "enhanced",
        accessLevel: "supervisor",
        isActive: true,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "officer-002", 
        vettingCompanyId: "vetting-001",
        employeeId: "EVS-002",
        firstName: "Marcus",
        lastName: "Rodriguez",
        email: "m.rodriguez@eliteverification.com",
        licenseNumber: "PI-FL-2024-002",
        certifications: ["Security Clearance Investigator", "Psychological Assessment Specialist"],
        specializations: ["psychological_assessment", "security_clearance"],
        clearanceLevel: "top_secret",
        accessLevel: "officer",
        isActive: true,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "officer-003",
        vettingCompanyId: "vetting-001", 
        employeeId: "EVS-003",
        firstName: "Diana",
        lastName: "Chen",
        email: "d.chen@eliteverification.com",
        licenseNumber: "PI-FL-2024-003",
        certifications: ["Certified Fraud Examiner", "Financial Investigation Specialist"],
        specializations: ["financial_verification", "asset_investigation"],
        clearanceLevel: "enhanced",
        accessLevel: "officer",
        isActive: true,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "officer-004",
        vettingCompanyId: "vetting-001",
        employeeId: "EVS-004",
        firstName: "James",
        lastName: "Thompson",
        email: "j.thompson@eliteverification.com",
        licenseNumber: "PI-FL-2024-004", 
        certifications: ["Executive Investigation Specialist", "High-Net-Worth Background Analyst"],
        specializations: ["executive_vetting", "wealth_verification"],
        clearanceLevel: "top_secret",
        accessLevel: "manager",
        isActive: true,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "officer-005",
        vettingCompanyId: "vetting-001",
        employeeId: "EVS-005",
        firstName: "Lisa",
        lastName: "Park",
        email: "l.park@eliteverification.com",
        licenseNumber: "PI-FL-2024-005",
        certifications: ["Identity Verification Specialist", "Document Authentication Expert"],
        specializations: ["identity_verification", "document_analysis"],
        clearanceLevel: "standard",
        accessLevel: "officer",
        isActive: true,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (!globalThis.verificationTasks) {
    globalThis.verificationTasks = [
      {
        id: "task-001",
        applicationId: "VET-2024-001",
        taskType: "identity_verification",
        taskDescription: "Verify government-issued identification and address",
        requiredDocuments: ["driver_license", "passport", "address_proof"],
        assignedOfficerId: "officer-005",
        status: "completed",
        priority: "standard",
        result: "pass",
        findings: {
          score: 95,
          issues: [],
          recommendations: ["Documents verified successfully"],
          additionalInfo: { verificationMethod: "AI-enhanced document analysis" }
        },
        documentsReceived: ["driver_license", "passport", "utility_bill"],
        startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "task-002",
        applicationId: "VET-2024-001",
        taskType: "background_check",
        taskDescription: "Comprehensive criminal and employment background verification",
        requiredDocuments: ["employment_history", "reference_contacts"],
        assignedOfficerId: "officer-001",
        status: "in_progress",
        priority: "standard",
        documentsReceived: ["employment_history"],
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "task-003",
        applicationId: "VET-2024-002",
        taskType: "psychological_assessment",
        taskDescription: "Professional psychological evaluation for security role",
        requiredDocuments: ["psychological_evaluation_consent"],
        assignedOfficerId: "officer-002",
        status: "pending",
        priority: "high",
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Vetting Officer Login
  app.post("/api/vetting/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    
    // In production, verify password hash
    const officer = globalThis.vettingOfficers?.find((o: any) => o.email === email);
    
    if (!officer || !officer.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: officer.id,
        email: officer.email,
        companyId: officer.vettingCompanyId,
        accessLevel: officer.accessLevel,
        clearanceLevel: officer.clearanceLevel,
        type: 'vetting_officer'
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '8h' }
    );
    
    // Update last login
    officer.lastLoginAt = new Date().toISOString();
    
    res.json({
      success: true,
      token,
      officer: {
        id: officer.id,
        firstName: officer.firstName,
        lastName: officer.lastName,
        email: officer.email,
        companyId: officer.vettingCompanyId,
        accessLevel: officer.accessLevel,
        clearanceLevel: officer.clearanceLevel,
        specializations: officer.specializations
      }
    });
  });

  // Get vetting applications (with access control)
  app.get("/api/vetting/applications", authenticateVettingOfficer, async (req: any, res) => {
    const { status, userType, priority, assigned } = req.query;
    const officer = req.vettingOfficer;
    
    let applications = globalThis.vettingApplications || [];
    
    // Filter based on officer's access level and assignments
    if (officer.accessLevel === 'officer') {
      // Officers can only see applications assigned to them
      applications = applications.filter((app: any) => 
        app.primaryOfficerId === officer.id || app.secondaryOfficerId === officer.id
      );
    } else if (officer.accessLevel === 'supervisor') {
      // Supervisors can see all applications in their company
      applications = applications.filter((app: any) => app.assignedCompanyId === officer.companyId);
    }
    // Managers can see all applications (no additional filtering)
    
    // Apply filters
    if (status && status !== 'all') {
      applications = applications.filter((app: any) => app.currentStatus === status);
    }
    
    if (userType && userType !== 'all') {
      applications = applications.filter((app: any) => app.userType === userType);
    }
    
    if (priority && priority !== 'all') {
      applications = applications.filter((app: any) => app.priorityLevel === priority);
    }
    
    if (assigned === 'true') {
      applications = applications.filter((app: any) => 
        app.primaryOfficerId === officer.id || app.secondaryOfficerId === officer.id
      );
    }
    
    // Sort by priority and submission date
    applications.sort((a: any, b: any) => {
      const priorityOrder = { urgent: 4, high: 3, standard: 2, low: 1 };
      const aPriority = priorityOrder[a.priorityLevel as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priorityLevel as keyof typeof priorityOrder] || 2;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
    
    res.json({
      applications,
      summary: {
        total: applications.length,
        byStatus: {
          submitted: applications.filter((a: any) => a.currentStatus === 'submitted').length,
          in_review: applications.filter((a: any) => a.currentStatus === 'in_review').length,
          additional_info_required: applications.filter((a: any) => a.currentStatus === 'additional_info_required').length,
          approved: applications.filter((a: any) => a.currentStatus === 'approved').length,
          rejected: applications.filter((a: any) => a.currentStatus === 'rejected').length
        },
        byPriority: {
          urgent: applications.filter((a: any) => a.priorityLevel === 'urgent').length,
          high: applications.filter((a: any) => a.priorityLevel === 'high').length,
          standard: applications.filter((a: any) => a.priorityLevel === 'standard').length,
          low: applications.filter((a: any) => a.priorityLevel === 'low').length
        }
      }
    });
  });

  // Get specific application details
  app.get("/api/vetting/applications/:id", authenticateVettingOfficer, async (req: any, res) => {
    const { id } = req.params;
    const officer = req.vettingOfficer;
    
    const application = globalThis.vettingApplications?.find((app: any) => app.id === id);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    // Check access permissions
    if (officer.accessLevel === 'officer' && 
        application.primaryOfficerId !== officer.id && 
        application.secondaryOfficerId !== officer.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    if (officer.accessLevel === 'supervisor' && application.assignedCompanyId !== officer.companyId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Get related verification tasks
    const tasks = globalThis.verificationTasks?.filter((task: any) => task.applicationId === id) || [];
    
    res.json({
      application,
      tasks,
      assignedOfficers: {
        primary: globalThis.vettingOfficers?.find((o: any) => o.id === application.primaryOfficerId),
        secondary: application.secondaryOfficerId ? 
          globalThis.vettingOfficers?.find((o: any) => o.id === application.secondaryOfficerId) : null
      }
    });
  });

  // Update application status
  app.patch("/api/vetting/applications/:id", authenticateVettingOfficer, async (req: any, res) => {
    const { id } = req.params;
    const updates = req.body;
    const officer = req.vettingOfficer;
    
    const applicationIndex = globalThis.vettingApplications?.findIndex((app: any) => app.id === id);
    
    if (applicationIndex === -1 || applicationIndex === undefined) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    const application = globalThis.vettingApplications[applicationIndex];
    
    // Check access permissions
    if (officer.accessLevel === 'officer' && 
        application.primaryOfficerId !== officer.id && 
        application.secondaryOfficerId !== officer.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Update application
    globalThis.vettingApplications[applicationIndex] = {
      ...application,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: "Application updated successfully",
      application: globalThis.vettingApplications[applicationIndex]
    });
  });

  // Get verification tasks for an application
  app.get("/api/vetting/applications/:id/tasks", authenticateVettingOfficer, async (req: any, res) => {
    const { id } = req.params;
    const officer = req.vettingOfficer;
    
    // Verify application access
    const application = globalThis.vettingApplications?.find((app: any) => app.id === id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    const tasks = globalThis.verificationTasks?.filter((task: any) => task.applicationId === id) || [];
    
    res.json(tasks);
  });

  // Update verification task
  app.patch("/api/vetting/tasks/:id", authenticateVettingOfficer, async (req: any, res) => {
    const { id } = req.params;
    const updates = req.body;
    const officer = req.vettingOfficer;
    
    const taskIndex = globalThis.verificationTasks?.findIndex((task: any) => task.id === id);
    
    if (taskIndex === -1 || taskIndex === undefined) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    const task = globalThis.verificationTasks[taskIndex];
    
    // Check if officer can update this task
    if (task.assignedOfficerId !== officer.id && officer.accessLevel === 'officer') {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Update task
    globalThis.verificationTasks[taskIndex] = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: "Task updated successfully",
      task: globalThis.verificationTasks[taskIndex]
    });
  });

  // Master Admin routes for vetting oversight (calvarado and dzambrano access)
  app.get("/api/admin/vetting/overview", authenticateAdmin, async (req: any, res) => {
    const applications = globalThis.vettingApplications || [];
    const tasks = globalThis.verificationTasks || [];
    const companies = globalThis.vettingCompanies || [];
    const officers = globalThis.vettingOfficers || [];
    
    const overview = {
      applications: {
        total: applications.length,
        byStatus: {
          submitted: applications.filter((a: any) => a.currentStatus === 'submitted').length,
          in_review: applications.filter((a: any) => a.currentStatus === 'in_review').length,
          additional_info_required: applications.filter((a: any) => a.currentStatus === 'additional_info_required').length,
          approved: applications.filter((a: any) => a.currentStatus === 'approved').length,
          rejected: applications.filter((a: any) => a.currentStatus === 'rejected').length,
          suspended: applications.filter((a: any) => a.currentStatus === 'suspended').length
        },
        byUserType: {
          client: applications.filter((a: any) => a.userType === 'client').length,
          service_provider: applications.filter((a: any) => a.userType === 'service_provider').length,
          regional_partner: applications.filter((a: any) => a.userType === 'regional_partner').length,
          personnel: applications.filter((a: any) => a.userType === 'personnel').length
        },
        byPriority: {
          urgent: applications.filter((a: any) => a.priorityLevel === 'urgent').length,
          high: applications.filter((a: any) => a.priorityLevel === 'high').length,
          standard: applications.filter((a: any) => a.priorityLevel === 'standard').length,
          low: applications.filter((a: any) => a.priorityLevel === 'low').length
        },
        byVettingTier: {
          basic: applications.filter((a: any) => a.vettingTier === 'basic').length,
          enhanced: applications.filter((a: any) => a.vettingTier === 'enhanced').length,
          comprehensive: applications.filter((a: any) => a.vettingTier === 'comprehensive').length,
          executive: applications.filter((a: any) => a.vettingTier === 'executive').length
        }
      },
      tasks: {
        total: tasks.length,
        byStatus: {
          pending: tasks.filter((t: any) => t.status === 'pending').length,
          in_progress: tasks.filter((t: any) => t.status === 'in_progress').length,
          completed: tasks.filter((t: any) => t.status === 'completed').length,
          failed: tasks.filter((t: any) => t.status === 'failed').length
        },
        byType: {
          identity_verification: tasks.filter((t: any) => t.taskType === 'identity_verification').length,
          background_check: tasks.filter((t: any) => t.taskType === 'background_check').length,
          financial_verification: tasks.filter((t: any) => t.taskType === 'financial_verification').length,
          credential_validation: tasks.filter((t: any) => t.taskType === 'credential_validation').length,
          reference_check: tasks.filter((t: any) => t.taskType === 'reference_check').length,
          interview: tasks.filter((t: any) => t.taskType === 'interview').length,
          skills_assessment: tasks.filter((t: any) => t.taskType === 'skills_assessment').length
        }
      },
      companies: {
        total: companies.length,
        active: companies.filter((c: any) => c.isActive).length
      },
      officers: {
        total: officers.length,
        active: officers.filter((o: any) => o.isActive).length,
        byAccessLevel: {
          officer: officers.filter((o: any) => o.accessLevel === 'officer').length,
          supervisor: officers.filter((o: any) => o.accessLevel === 'supervisor').length,
          manager: officers.filter((o: any) => o.accessLevel === 'manager').length
        },
        byClearanceLevel: {
          standard: officers.filter((o: any) => o.clearanceLevel === 'standard').length,
          enhanced: officers.filter((o: any) => o.clearanceLevel === 'enhanced').length,
          top_secret: officers.filter((o: any) => o.clearanceLevel === 'top_secret').length
        }
      },
      performance: {
        averageProcessingTime: "4.2 days",
        approvalRate: "89%",
        escalationRate: "12%",
        qualityScore: "94%"
      }
    };
    
    res.json(overview);
  });

  // Get all vetting applications for admin oversight
  app.get("/api/admin/vetting/applications", authenticateAdmin, async (req: any, res) => {
    const { page = 1, limit = 50, status, userType, company, officer } = req.query;
    
    let applications = globalThis.vettingApplications || [];
    
    // Apply filters
    if (status && status !== 'all') {
      applications = applications.filter((app: any) => app.currentStatus === status);
    }
    
    if (userType && userType !== 'all') {
      applications = applications.filter((app: any) => app.userType === userType);
    }
    
    if (company && company !== 'all') {
      applications = applications.filter((app: any) => app.assignedCompanyId === company);
    }
    
    if (officer && officer !== 'all') {
      applications = applications.filter((app: any) => 
        app.primaryOfficerId === officer || app.secondaryOfficerId === officer
      );
    }
    
    // Pagination
    const total = applications.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedApplications = applications.slice(startIndex, endIndex);
    
    res.json({
      applications: paginatedApplications,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
        limit: Number(limit)
      }
    });
  });

  // Protected route example
  app.get("/api/protected", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    // Do something with the user id.
    res.json({ message: "Protected route accessed", userId });
  });

  // Personal Security Service endpoints
  app.get("/api/client/personal-security/requests", async (req, res) => {
    // Mock data for personal security requests
    res.json([
      {
        id: "PS-2024-001",
        type: "Executive Protection",
        status: "active",
        startDate: "2024-01-20",
        endDate: "2024-01-25",
        location: "New York City",
        details: "High-profile business meetings requiring discrete protection",
        assignedTeam: "Alpha Team - 4 agents",
        cost: "$15,000"
      },
      {
        id: "PS-2024-002", 
        type: "Residential Security",
        status: "scheduled",
        startDate: "2024-02-01",
        endDate: "2024-02-15",
        location: "Miami Beach Estate",
        details: "Private residence security during family vacation",
        assignedTeam: "Beta Team - 6 agents",
        cost: "$22,000"
      }
    ]);
  });

  app.post("/api/client/personal-security/requests", async (req, res) => {
    const { serviceType, startDate, endDate, location, requirements, teamSize, duration } = req.body;
    
    // Mock response for creating new personal security request
    const newRequest = {
      id: `PS-${Date.now()}`,
      type: serviceType,
      status: "pending",
      startDate,
      endDate,
      location,
      details: requirements,
      assignedTeam: `Team ${Math.ceil(Math.random() * 5)} - ${teamSize} agents`,
      cost: `$${Math.floor(Math.random() * 50000) + 10000}`,
      createdAt: new Date().toISOString()
    };

    // Extract user information from token
    const authHeader = req.headers['authorization'];
    let userId = 'anonymous';
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        // Continue with anonymous user
      }
    }
    
    // Store the request
    if (!serviceRequests.has(userId)) {
      serviceRequests.set(userId, []);
    }
    serviceRequests.get(userId)!.push({
      ...newRequest,
      userId: userId,
      type: 'security'
    });

    res.json({
      message: "Personal security request submitted successfully",
      request: newRequest
    });
  });

  // Concierge Intelligence Service endpoints
  app.get("/api/client/concierge/requests", async (req, res) => {
    // Mock data for concierge requests
    res.json([
      {
        id: "CI-2024-001",
        type: "Travel Planning",
        status: "completed",
        requestDate: "2024-01-15",
        completionDate: "2024-01-18",
        details: "Private jet and luxury accommodations for European business tour",
        assignedConcierge: "Sarah Mitchell - Senior Travel Specialist",
        cost: "$8,500"
      },
      {
        id: "CI-2024-002",
        type: "Event Management", 
        status: "in-progress",
        requestDate: "2024-01-20",
        completionDate: null,
        details: "Exclusive gala event planning for 200 guests",
        assignedConcierge: "Marcus Chen - Event Coordinator",
        cost: "$25,000"
      }
    ]);
  });

  app.post("/api/client/concierge/requests", async (req, res) => {
    const { serviceType, priority, timeline, requirements, budget } = req.body;
    
    // Mock response for creating new concierge request
    const newRequest = {
      id: `CI-${Date.now()}`,
      type: serviceType,
      status: "pending",
      requestDate: new Date().toISOString().split('T')[0],
      completionDate: null,
      details: requirements,
      assignedConcierge: `Concierge ${Math.ceil(Math.random() * 10)}`,
      cost: budget ? `$${budget}` : `$${Math.floor(Math.random() * 30000) + 5000}`,
      priority,
      timeline,
      createdAt: new Date().toISOString()
    };

    // Extract user information from token
    const authHeader = req.headers['authorization'];
    let userId = 'anonymous';
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        // Continue with anonymous user
      }
    }
    
    // Store the request
    if (!serviceRequests.has(userId)) {
      serviceRequests.set(userId, []);
    }
    serviceRequests.get(userId)!.push({
      ...newRequest,
      userId: userId,
      type: 'concierge'
    });

    res.json({
      message: "Concierge intelligence request submitted successfully", 
      request: newRequest
    });
  });

  // Get user's service requests
  app.get("/api/client/service-requests", async (req, res) => {
    // Extract user information from token
    const authHeader = req.headers['authorization'];
    let userId = 'anonymous';
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }
    
    // Get user's requests
    const userRequests = serviceRequests.get(userId) || [];
    
    // Sort by creation date (newest first)
    const sortedRequests = userRequests.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json(sortedRequests);
  });

  // Panic system endpoint
  app.post("/api/client/panic", async (req, res) => {
    const { message, location } = req.body;
    
    // Mock panic response
    res.json({
      message: "PANIC ALERT TRIGGERED - YoLuxGo™ Command Center Notified",
      alertId: `PANIC-${Date.now()}`,
      status: "active",
      responseTime: "< 30 seconds",
      location,
      details: message,
      timestamp: new Date().toISOString()
    });
  });

  // Cloaking controls endpoint
  app.get("/api/client/cloaking", async (req, res) => {
    // Mock cloaking settings
    res.json({
      hideName: false,
      hideItinerary: false, 
      hideLocation: false,
      hideCompanions: false,
      cloakModeActive: false,
      createDecoyData: false,
      watermarkData: true
    });
  });

  app.put("/api/client/cloaking", async (req, res) => {
    const settings = req.body;
    
    // Mock update response
    res.json({
      message: "Cloaking settings updated successfully",
      settings,
      timestamp: new Date().toISOString()
    });
  });

  // Secure messaging endpoints
  app.get("/api/messages", async (req, res) => {
    // Mock messages
    res.json([
      {
        id: "MSG-001",
        sender: "Command Center",
        content: "Welcome to YoLuxGo™ secure messaging. Your account is fully activated.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        encrypted: true,
        autoDelete: false
      },
      {
        id: "MSG-002", 
        sender: "Security Team Alpha",
        content: "Your protection detail for tomorrow has been confirmed. Team will arrive at 08:00.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        encrypted: true,
        autoDelete: true,
        deleteAt: new Date(Date.now() + 86400000).toISOString()
      }
    ]);
  });

  app.post("/api/messages", async (req, res) => {
    const { content, autoDelete, encrypted, deleteHours } = req.body;
    
    const newMessage = {
      id: `MSG-${Date.now()}`,
      sender: "Client",
      content,
      timestamp: new Date().toISOString(),
      encrypted,
      autoDelete,
      deleteAt: autoDelete ? new Date(Date.now() + (deleteHours * 3600000)).toISOString() : null
    };

    res.json({
      message: "Message sent successfully",
      messageData: newMessage
    });
  });

  app.delete("/api/messages/:id", async (req, res) => {
    const { id } = req.params;
    
    res.json({
      message: "Message deleted successfully",
      messageId: id,
      timestamp: new Date().toISOString()
    });
  });

  // Personnel Profiles endpoints
  app.get("/api/admin/personnel/profiles", async (req, res) => {
    // Mock personnel profiles data - 5+ per location for each role
    const mockProfiles = [
      // NYC EXECUTIVE DRIVERS
      {
        id: "driver-nyc-001",
        role: "Executive Driver",
        firstName: "Marcus",
        lastName: "Rodriguez",
        name: "Marcus Rodriguez",
        alias: "Shadow",
        photoUrl: "/api/placeholder/avatar/marcus",
        languages: ["English", "Spanish", "Portuguese"],
        regions: ["NYC"],
        experienceYears: 8,
        verifiedBadges: ["Defensive Driving", "Executive Protection", "First Aid", "Clean Record"],
        bio: "Former Secret Service agent with 8 years of executive transportation experience. Specializes in high-threat environments and discrete luxury travel.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 47,
        vettingLevel: "Level 5 Elite",
        experience: 8,
        specializations: ["Executive Transport", "Security Protocols", "VIP Service"],
        endorsements: [
          "Marcus provided exceptional service during our European tour. Truly professional and discrete.",
          "The best driver we've ever had. Made us feel completely secure throughout the entire trip."
        ],
        adminNotes: {
          internalScore: 95,
          comments: ["Excellent performance record", "Client favorite", "Zero incidents"],
          trainingRecords: ["Advanced Defensive Driving 2024", "Threat Assessment Course", "VIP Protocol Training"]
        },
        isActive: true,
        createdAt: "2023-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-nyc-002",
        role: "Executive Driver",
        firstName: "Elena",
        lastName: "Vasquez",
        name: "Elena Vasquez",
        alias: "Platinum",
        photoUrl: "/api/placeholder/avatar/elena",
        languages: ["English", "Spanish", "French"],
        regions: ["NYC"],
        experienceYears: 6,
        verifiedBadges: ["Luxury Vehicle Certified", "Executive Protection", "Clean Record", "First Aid"],
        bio: "Elite chauffeur specializing in corporate executives and diplomatic transport with impeccable service standards.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 34,
        vettingLevel: "Level 4 Premium",
        experience: 6,
        specializations: ["Corporate Transport", "Diplomatic Protocol", "Luxury Service"],
        endorsements: [
          "Elena's attention to detail and professionalism exceeded all expectations.",
          "Smooth, secure, and absolutely discrete service. Highly recommended."
        ],
        adminNotes: {
          internalScore: 92,
          comments: ["Outstanding client feedback", "Corporate preferred", "Diplomatic experience"],
          trainingRecords: ["Executive Transport Certification", "Diplomatic Protocol Training", "Luxury Service Standards"]
        },
        isActive: true,
        createdAt: "2023-02-20T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-nyc-003",
        role: "Executive Driver",
        firstName: "David",
        lastName: "Chen",
        name: "David Chen",
        alias: "Silk Road",
        photoUrl: "/api/placeholder/avatar/david",
        languages: ["English", "Mandarin", "Cantonese", "Japanese"],
        regions: ["NYC"],
        experienceYears: 10,
        verifiedBadges: ["International Driving", "Security Clearance", "Multi-lingual Certified", "Clean Record"],
        bio: "Former diplomatic driver with extensive Asian market experience and multilingual capabilities for international clients.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 56,
        vettingLevel: "Level 5 Elite",
        experience: 10,
        specializations: ["International Protocol", "Asian Markets", "Diplomatic Service"],
        endorsements: [
          "David's cultural understanding and language skills were invaluable during our Tokyo negotiations.",
          "Professional, discrete, and incredibly knowledgeable about international protocols."
        ],
        adminNotes: {
          internalScore: 96,
          comments: ["Top international performer", "Cultural liaison expertise", "Perfect safety record"],
          trainingRecords: ["International Diplomatic Protocol", "Cultural Sensitivity Training", "Advanced Security Procedures"]
        },
        isActive: true,
        createdAt: "2022-05-12T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-nyc-004",
        role: "Executive Driver",
        firstName: "Michael",
        lastName: "Thompson",
        name: "Michael Thompson",
        alias: "Navigator",
        photoUrl: "/api/placeholder/avatar/michael",
        languages: ["English", "German", "Italian"],
        regions: ["NYC"],
        experienceYears: 7,
        verifiedBadges: ["Defensive Driving", "Luxury Fleet Certified", "Clean Record", "First Aid"],
        bio: "Wall Street specialist with deep knowledge of NYC financial district and executive transportation for Fortune 500 leaders.",
        availabilityStatus: "assigned",
        available: false,
        rating: 4.7,
        reviewCount: 41,
        vettingLevel: "Level 4 Premium",
        experience: 7,
        specializations: ["Financial District", "Corporate Executive", "Route Optimization"],
        endorsements: [
          "Michael knows every shortcut in Manhattan and always gets us there on time.",
          "Reliable, professional, and excellent knowledge of the city."
        ],
        adminNotes: {
          internalScore: 89,
          comments: ["NYC route expert", "Financial sector specialist", "Punctuality focused"],
          trainingRecords: ["NYC Navigation Mastery", "Corporate Protocol Training", "Time Management Excellence"]
        },
        isActive: true,
        createdAt: "2023-06-08T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-nyc-005",
        role: "Executive Driver",
        firstName: "Sophia",
        lastName: "Williams",
        name: "Sophia Williams",
        alias: "Concorde",
        photoUrl: "/api/placeholder/avatar/sophia",
        languages: ["English", "French", "Arabic"],
        regions: ["NYC"],
        experienceYears: 5,
        verifiedBadges: ["Luxury Service", "International Protocol", "Clean Record", "Medical Training"],
        bio: "Former flight attendant turned elite driver, specializing in celebrity and entertainment industry transportation with the highest discretion standards.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 28,
        vettingLevel: "Level 4 Premium",
        experience: 5,
        specializations: ["Celebrity Transport", "Entertainment Industry", "High Discretion"],
        endorsements: [
          "Sophia understands the importance of privacy and delivers exceptional service every time.",
          "Professional, discrete, and treats every client like royalty."
        ],
        adminNotes: {
          internalScore: 91,
          comments: ["Celebrity preferred", "Exceptional discretion", "Entertainment industry expert"],
          trainingRecords: ["Celebrity Protocol Training", "Privacy & Discretion Certification", "Luxury Hospitality Standards"]
        },
        isActive: true,
        createdAt: "2023-08-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // NYC CLOSE PROTECTION GUARDS
      {
        id: "security-nyc-001",
        role: "Close Protection Guard",
        firstName: "Viktor",
        lastName: "Petrov",
        name: "Viktor Petrov",
        alias: "Guardian",
        photoUrl: "/api/placeholder/avatar/viktor",
        languages: ["English", "Russian", "Ukrainian", "German"],
        regions: ["NYC"],
        experienceYears: 12,
        verifiedBadges: ["Military Background", "Close Protection", "Firearms Certified", "Medical Training"],
        bio: "Former Spetsnaz operator with extensive close protection experience for Fortune 500 executives and diplomatic personnel.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 38,
        vettingLevel: "Level 5 Elite",
        experience: 12,
        specializations: ["Executive Protection", "Threat Assessment", "Counter-Surveillance"],
        endorsements: [
          "Viktor's professionalism and expertise made us feel completely safe during a challenging situation.",
          "Exceptional situational awareness and discrete protection. Highly recommended."
        ],
        adminNotes: {
          internalScore: 98,
          comments: ["Top performer", "Excellent under pressure", "Client referrals"],
          trainingRecords: ["Advanced Tactical Training", "VIP Protection Certification", "Crisis Management"]
        },
        isActive: true,
        createdAt: "2022-08-20T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-nyc-002",
        role: "Close Protection Guard",
        firstName: "Sarah",
        lastName: "Chen",
        name: "Sarah Chen",
        alias: "Phoenix",
        photoUrl: "/api/placeholder/avatar/sarah",
        languages: ["English", "Mandarin", "Cantonese", "Japanese"],
        regions: ["NYC"],
        experienceYears: 10,
        verifiedBadges: ["Special Forces", "Close Protection", "Firearms Expert", "Tactical Medic"],
        bio: "Former Navy SEAL with specialized training in executive protection and international security operations.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 32,
        vettingLevel: "Level 5 Elite",
        experience: 10,
        specializations: ["Executive Protection", "Maritime Security", "Crisis Response"],
        endorsements: [
          "Sarah's military precision and calm demeanor provided exceptional security coverage.",
          "Outstanding protective services with the highest level of professionalism."
        ],
        adminNotes: {
          internalScore: 97,
          comments: ["Military precision", "Crisis management expert", "International experience"],
          trainingRecords: ["Naval Special Warfare", "Executive Protection Advanced", "International Security Protocols"]
        },
        isActive: true,
        createdAt: "2022-09-10T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-nyc-003",
        role: "Close Protection Guard",
        firstName: "Diego",
        lastName: "Martinez",
        name: "Diego Martinez",
        alias: "Sentinel",
        photoUrl: "/api/placeholder/avatar/diego",
        languages: ["English", "Spanish", "Portuguese", "Italian"],
        regions: ["NYC"],
        experienceYears: 9,
        verifiedBadges: ["Federal Agent", "Close Protection", "Firearms Certified", "Surveillance"],
        bio: "Former FBI agent specializing in dignitary protection and counter-terrorism with extensive urban security experience.",
        availabilityStatus: "assigned",
        available: false,
        rating: 4.7,
        reviewCount: 29,
        vettingLevel: "Level 4 Premium",
        experience: 9,
        specializations: ["Federal Protection", "Counter-Terrorism", "Urban Security"],
        endorsements: [
          "Diego's federal background and attention to detail provided unmatched security.",
          "Professional, thorough, and exceptionally skilled in threat assessment."
        ],
        adminNotes: {
          internalScore: 94,
          comments: ["Federal expertise", "Threat assessment specialist", "Urban operations focused"],
          trainingRecords: ["Federal Protection Service", "Counter-Terrorism Advanced", "Urban Security Tactics"]
        },
        isActive: true,
        createdAt: "2023-01-25T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-nyc-004",
        role: "Close Protection Guard",
        firstName: "Rachel",
        lastName: "Johnson",
        name: "Rachel Johnson",
        alias: "Valkyrie",
        photoUrl: "/api/placeholder/avatar/rachel",
        languages: ["English", "French", "Hebrew", "Arabic"],
        regions: ["NYC"],
        experienceYears: 8,
        verifiedBadges: ["Military Police", "Close Protection", "Tactical Training", "Medical Certified"],
        bio: "Former military police officer with specialized training in VIP protection and international security protocols.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 26,
        vettingLevel: "Level 4 Premium",
        experience: 8,
        specializations: ["VIP Protection", "Military Protocols", "International Security"],
        endorsements: [
          "Rachel's military discipline and protective instincts are exceptional.",
          "Reliable, professional, and highly skilled in personal security."
        ],
        adminNotes: {
          internalScore: 91,
          comments: ["Military discipline", "VIP specialist", "International protocols"],
          trainingRecords: ["Military Police Advanced", "VIP Protection Certification", "International Security Standards"]
        },
        isActive: true,
        createdAt: "2023-03-14T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-nyc-005",
        role: "Close Protection Guard",
        firstName: "Anthony",
        lastName: "Romano",
        name: "Anthony Romano",
        alias: "Shield",
        photoUrl: "/api/placeholder/avatar/anthony",
        languages: ["English", "Italian", "French", "German"],
        regions: ["NYC"],
        experienceYears: 11,
        verifiedBadges: ["Executive Protection", "Firearms Expert", "Tactical Driving", "Crisis Management"],
        bio: "Veteran protection specialist with extensive corporate security experience and expertise in high-profile event security.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 44,
        vettingLevel: "Level 5 Elite",
        experience: 11,
        specializations: ["Corporate Security", "Event Protection", "Crisis Management"],
        endorsements: [
          "Anthony's experience and professionalism made our corporate event completely secure.",
          "Exceptional protection services with attention to every detail."
        ],
        adminNotes: {
          internalScore: 95,
          comments: ["Corporate specialist", "Event security expert", "Crisis response leader"],
          trainingRecords: ["Corporate Security Management", "Event Protection Advanced", "Crisis Leadership Training"]
        },
        isActive: true,
        createdAt: "2022-11-05T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // NYC ELITE CONCIERGES
      {
        id: "concierge-nyc-001",
        role: "Elite Concierge",
        firstName: "Isabella",
        lastName: "Romano",
        name: "Isabella Romano",
        alias: "La Perla",
        photoUrl: "/api/placeholder/avatar/isabella",
        languages: ["English", "Italian", "French", "German"],
        regions: ["NYC"],
        experienceYears: 15,
        verifiedBadges: ["Luxury Hospitality", "Event Planning", "Fine Dining Expert", "Cultural Liaison"],
        bio: "Former head concierge at prestigious European hotels with unparalleled connections in luxury services, fine dining, and exclusive experiences.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 52,
        vettingLevel: "Level 5 Elite",
        experience: 15,
        specializations: ["Luxury Hospitality", "Fine Dining", "Cultural Events"],
        endorsements: [
          "Isabella arranged an unforgettable experience in Milan. Every detail was perfect.",
          "Exceptional taste and connections. Made the impossible happen effortlessly."
        ],
        adminNotes: {
          internalScore: 97,
          comments: ["Excellent European connections", "Luxury expertise", "Client favorite"],
          trainingRecords: ["Luxury Service Standards", "Cultural Protocol Training", "VIP Event Management"]
        },
        isActive: true,
        createdAt: "2022-06-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-nyc-002",
        role: "Elite Concierge",
        firstName: "James",
        lastName: "Wellington",
        name: "James Wellington",
        alias: "The Curator",
        photoUrl: "/api/placeholder/avatar/james-w",
        languages: ["English", "French", "Spanish", "Russian"],
        regions: ["NYC"],
        experienceYears: 12,
        verifiedBadges: ["Art & Antiques", "Luxury Shopping", "Private Events", "Travel Specialist"],
        bio: "Former Sotheby's specialist with expertise in art acquisition, luxury shopping, and exclusive private events for discerning clientele.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 38,
        vettingLevel: "Level 5 Elite",
        experience: 12,
        specializations: ["Art Acquisition", "Luxury Shopping", "Private Events"],
        endorsements: [
          "James sourced a rare masterpiece that exceeded all expectations.",
          "Impeccable taste and connections in the art world. Truly exceptional service."
        ],
        adminNotes: {
          internalScore: 94,
          comments: ["Art world connections", "Luxury specialist", "Exclusive access"],
          trainingRecords: ["Art Authentication Certification", "Luxury Market Analysis", "Private Collection Management"]
        },
        isActive: true,
        createdAt: "2022-08-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-nyc-003",
        role: "Elite Concierge",
        firstName: "Anastasia",
        lastName: "Volkov",
        name: "Anastasia Volkov",
        alias: "The Diplomat",
        photoUrl: "/api/placeholder/avatar/anastasia",
        languages: ["English", "Russian", "French", "German", "Mandarin"],
        regions: ["NYC"],
        experienceYears: 10,
        verifiedBadges: ["Diplomatic Protocol", "International Relations", "Luxury Travel", "Cultural Liaison"],
        bio: "Former diplomatic attaché with extensive international connections and expertise in cross-cultural luxury experiences.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 31,
        vettingLevel: "Level 5 Elite",
        experience: 10,
        specializations: ["Diplomatic Protocol", "International Relations", "Cultural Liaison"],
        endorsements: [
          "Anastasia's diplomatic background opened doors we never knew existed.",
          "Exceptional cultural understanding and international connections."
        ],
        adminNotes: {
          internalScore: 96,
          comments: ["Diplomatic expertise", "International connections", "Cultural specialist"],
          trainingRecords: ["Diplomatic Protocol Advanced", "International Relations Certification", "Cross-Cultural Communication"]
        },
        isActive: true,
        createdAt: "2023-02-12T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-nyc-004",
        role: "Elite Concierge",
        firstName: "Marcus",
        lastName: "Sterling",
        name: "Marcus Sterling",
        alias: "The Connector",
        photoUrl: "/api/placeholder/avatar/marcus-s",
        languages: ["English", "Japanese", "Korean", "Mandarin"],
        regions: ["NYC"],
        experienceYears: 8,
        verifiedBadges: ["Business Relations", "Tech Industry", "Executive Services", "Asian Markets"],
        bio: "Former tech executive turned concierge specialist with deep connections in Silicon Valley and Asian business markets.",
        availabilityStatus: "assigned",
        available: false,
        rating: 4.7,
        reviewCount: 24,
        vettingLevel: "Level 4 Premium",
        experience: 8,
        specializations: ["Business Relations", "Tech Industry", "Asian Markets"],
        endorsements: [
          "Marcus facilitated crucial business connections that transformed our Asian expansion.",
          "Exceptional understanding of tech industry dynamics and Asian business culture."
        ],
        adminNotes: {
          internalScore: 89,
          comments: ["Tech industry specialist", "Asian market expert", "Business connector"],
          trainingRecords: ["Tech Industry Relations", "Asian Business Protocol", "Executive Liaison Training"]
        },
        isActive: true,
        createdAt: "2023-05-20T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-nyc-005",
        role: "Elite Concierge",
        firstName: "Camille",
        lastName: "Dubois",
        name: "Camille Dubois",
        alias: "L'Artiste",
        photoUrl: "/api/placeholder/avatar/camille",
        languages: ["English", "French", "Italian", "Spanish"],
        regions: ["NYC"],
        experienceYears: 9,
        verifiedBadges: ["Fashion Industry", "Entertainment", "Media Relations", "Celebrity Services"],
        bio: "Former fashion industry executive with extensive entertainment and media connections specializing in celebrity and high-profile lifestyle management.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 33,
        vettingLevel: "Level 4 Premium",
        experience: 9,
        specializations: ["Fashion Industry", "Entertainment", "Celebrity Services"],
        endorsements: [
          "Camille's fashion industry connections provided access to exclusive events and designers.",
          "Exceptional taste and entertainment industry expertise. Delivered beyond expectations."
        ],
        adminNotes: {
          internalScore: 92,
          comments: ["Fashion specialist", "Entertainment connections", "Celebrity preferred"],
          trainingRecords: ["Fashion Industry Relations", "Entertainment Protocol", "Celebrity Service Standards"]
        },
        isActive: true,
        createdAt: "2023-04-08T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // LOS ANGELES EXECUTIVE DRIVERS (5)
      {
        id: "driver-la-001",
        role: "Executive Driver",
        firstName: "Jackson",
        lastName: "Brooks",
        name: "Jackson Brooks",
        alias: "Hollywood",
        photoUrl: "/api/placeholder/avatar/jackson",
        languages: ["English", "Spanish", "Korean", "Japanese"],
        regions: ["Los Angeles"],
        experienceYears: 11,
        verifiedBadges: ["Celebrity Transport", "Executive Protection", "Studio Certified", "Clean Record"],
        bio: "Veteran Hollywood driver with extensive entertainment industry experience and celebrity client discretion training.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 58,
        vettingLevel: "Level 5 Elite",
        experience: 11,
        specializations: ["Celebrity Transport", "Entertainment Industry", "Studio Protocols"],
        endorsements: [
          "Jackson's discretion and professionalism during award season was exceptional.",
          "The best celebrity driver in LA. Knows every exclusive venue and maintains perfect privacy."
        ],
        adminNotes: {
          internalScore: 97,
          comments: ["Celebrity specialist", "Award season expert", "Perfect discretion record"],
          trainingRecords: ["Celebrity Protocol Advanced", "Studio Security Training", "Entertainment Industry Standards"]
        },
        isActive: true,
        createdAt: "2022-04-10T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-la-002",
        role: "Executive Driver",
        firstName: "Priya",
        lastName: "Patel",
        name: "Priya Patel",
        alias: "Sunset",
        photoUrl: "/api/placeholder/avatar/priya",
        languages: ["English", "Hindi", "Spanish", "French"],
        regions: ["Los Angeles"],
        experienceYears: 8,
        verifiedBadges: ["Tech Executive Transport", "International Protocol", "Luxury Vehicle Certified", "Clean Record"],
        bio: "Silicon Beach specialist with extensive tech executive and venture capital client experience throughout Los Angeles.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 42,
        vettingLevel: "Level 4 Premium",
        experience: 8,
        specializations: ["Tech Executives", "Silicon Beach", "VC Transport"],
        endorsements: [
          "Priya's knowledge of LA tech scene and professional demeanor impressed our investors.",
          "Exceptional service for our venture capital meetings throughout Silicon Beach."
        ],
        adminNotes: {
          internalScore: 91,
          comments: ["Tech industry specialist", "Silicon Beach expert", "VC preferred"],
          trainingRecords: ["Tech Executive Protocol", "Silicon Beach Navigation", "VC Meeting Standards"]
        },
        isActive: true,
        createdAt: "2023-01-25T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-la-003",
        role: "Executive Driver",
        firstName: "Alessandro",
        lastName: "Ferrari",
        name: "Alessandro Ferrari",
        alias: "Velocity",
        photoUrl: "/api/placeholder/avatar/alessandro",
        languages: ["English", "Italian", "Spanish", "French"],
        regions: ["Los Angeles"],
        experienceYears: 9,
        verifiedBadges: ["Luxury Sports Cars", "Executive Protection", "Racing Experience", "Clean Record"],
        bio: "Former professional racing driver specializing in luxury sports car transportation and high-performance vehicle expertise.",
        availabilityStatus: "assigned",
        available: false,
        rating: 4.9,
        reviewCount: 37,
        vettingLevel: "Level 5 Elite",
        experience: 9,
        specializations: ["Luxury Sports Cars", "High-Performance Vehicles", "Racing Expertise"],
        endorsements: [
          "Alessandro's racing background and car knowledge made our Malibu drive unforgettable.",
          "Expert handling of luxury vehicles with the highest safety standards."
        ],
        adminNotes: {
          internalScore: 94,
          comments: ["Racing expertise", "Luxury car specialist", "High-performance focused"],
          trainingRecords: ["Professional Racing Certification", "Luxury Vehicle Mastery", "High-Performance Safety"]
        },
        isActive: true,
        createdAt: "2022-11-28T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-la-004",
        role: "Executive Driver",
        firstName: "Emma",
        lastName: "Thompson",
        name: "Emma Thompson",
        alias: "Angel",
        photoUrl: "/api/placeholder/avatar/emma",
        languages: ["English", "French", "German", "Spanish"],
        regions: ["Los Angeles"],
        experienceYears: 7,
        verifiedBadges: ["Beverly Hills Certified", "Luxury Shopping", "Event Transport", "Clean Record"],
        bio: "Beverly Hills specialist with extensive luxury shopping and high-end event transportation experience for elite clientele.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 34,
        vettingLevel: "Level 4 Premium",
        experience: 7,
        specializations: ["Beverly Hills", "Luxury Shopping", "High-End Events"],
        endorsements: [
          "Emma's knowledge of Beverly Hills luxury shopping was invaluable during our visit.",
          "Professional, discrete, and excellent knowledge of exclusive LA venues."
        ],
        adminNotes: {
          internalScore: 89,
          comments: ["Beverly Hills specialist", "Shopping expert", "Event transport focused"],
          trainingRecords: ["Beverly Hills Protocol", "Luxury Shopping Certification", "Event Transportation Standards"]
        },
        isActive: true,
        createdAt: "2023-03-18T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-la-005",
        role: "Executive Driver",
        firstName: "Marcus",
        lastName: "Williams",
        name: "Marcus Williams",
        alias: "Pacific",
        photoUrl: "/api/placeholder/avatar/marcus-w",
        languages: ["English", "Spanish", "Portuguese", "Korean"],
        regions: ["Los Angeles"],
        experienceYears: 10,
        verifiedBadges: ["Executive Protection", "International Protocol", "Malibu Specialist", "Clean Record"],
        bio: "Malibu and Pacific Coast specialist with extensive international executive and diplomatic transportation experience.",
        availabilityStatus: "available",
        available: true,
        rating: 4.7,
        reviewCount: 45,
        vettingLevel: "Level 4 Premium",
        experience: 10,
        specializations: ["Malibu Routes", "Pacific Coast", "International Executives"],
        endorsements: [
          "Marcus's knowledge of Malibu and PCH routes made our coastal meetings seamless.",
          "Reliable, professional, and expert in international executive protocols."
        ],
        adminNotes: {
          internalScore: 88,
          comments: ["Malibu specialist", "Coastal expert", "International protocols"],
          trainingRecords: ["Malibu Navigation Mastery", "Pacific Coast Certification", "International Executive Protocol"]
        },
        isActive: true,
        createdAt: "2022-12-05T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // PUNTA CANA EXECUTIVE DRIVERS (5)
      {
        id: "driver-pc-001",
        role: "Executive Driver",
        firstName: "Fernando",
        lastName: "Castillo",
        name: "Fernando Castillo",
        alias: "Tropical",
        photoUrl: "/api/placeholder/avatar/fernando",
        languages: ["English", "Spanish", "Portuguese", "French"],
        regions: ["Punta Cana"],
        experienceYears: 9,
        verifiedBadges: ["Resort Transport", "Island Navigation", "VIP Service", "Clean Record"],
        bio: "Dominican Republic native with extensive luxury resort and private villa transportation experience throughout the Caribbean.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 36,
        vettingLevel: "Level 4 Premium",
        experience: 9,
        specializations: ["Resort Transport", "Island Navigation", "Caribbean Routes"],
        endorsements: [
          "Fernando's knowledge of hidden Caribbean gems made our vacation extraordinary.",
          "Professional, friendly, and excellent knowledge of luxury resorts."
        ],
        adminNotes: {
          internalScore: 90,
          comments: ["Caribbean specialist", "Resort expert", "Local connections"],
          trainingRecords: ["Caribbean Resort Protocol", "Island Navigation Certification", "Luxury Tourism Standards"]
        },
        isActive: true,
        createdAt: "2023-01-12T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-pc-002",
        role: "Executive Driver",
        firstName: "Sofia",
        lastName: "Ramirez",
        name: "Sofia Ramirez",
        alias: "Paradise",
        photoUrl: "/api/placeholder/avatar/sofia",
        languages: ["English", "Spanish", "French", "Italian"],
        regions: ["Punta Cana"],
        experienceYears: 7,
        verifiedBadges: ["Luxury Resort Certified", "Golf Course Transport", "Beach Club Access", "Clean Record"],
        bio: "Luxury hospitality professional specializing in high-end resort and exclusive beach club transportation services.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 29,
        vettingLevel: "Level 4 Premium",
        experience: 7,
        specializations: ["Luxury Resorts", "Golf Courses", "Beach Clubs"],
        endorsements: [
          "Sofia's service during our golf vacation was impeccable and professional.",
          "Exceptional knowledge of luxury amenities and perfect timing."
        ],
        adminNotes: {
          internalScore: 92,
          comments: ["Golf specialist", "Beach club expert", "Hospitality focused"],
          trainingRecords: ["Golf Course Protocol", "Beach Club Standards", "Luxury Hospitality Excellence"]
        },
        isActive: true,
        createdAt: "2023-03-28T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-pc-003",
        role: "Executive Driver",
        firstName: "Ricardo",
        lastName: "Mendoza",
        name: "Ricardo Mendoza",
        alias: "Navigator",
        photoUrl: "/api/placeholder/avatar/ricardo-m",
        languages: ["English", "Spanish", "Portuguese", "German"],
        regions: ["Punta Cana"],
        experienceYears: 8,
        verifiedBadges: ["Private Villa Access", "Executive Protection", "Airport Specialist", "Clean Record"],
        bio: "Executive transportation specialist with access to exclusive private villas and comprehensive airport transfer expertise.",
        availabilityStatus: "assigned",
        available: false,
        rating: 4.7,
        reviewCount: 33,
        vettingLevel: "Level 4 Premium",
        experience: 8,
        specializations: ["Private Villas", "Airport Transfers", "Executive Service"],
        endorsements: [
          "Ricardo's villa connections and airport efficiency made our stay seamless.",
          "Professional, discrete, and excellent knowledge of exclusive properties."
        ],
        adminNotes: {
          internalScore: 88,
          comments: ["Villa specialist", "Airport expert", "Executive preferred"],
          trainingRecords: ["Private Villa Protocol", "Airport Transfer Excellence", "Executive Service Standards"]
        },
        isActive: true,
        createdAt: "2023-02-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-pc-004",
        role: "Executive Driver",
        firstName: "Catalina",
        lastName: "Torres",
        name: "Catalina Torres",
        alias: "Serenity",
        photoUrl: "/api/placeholder/avatar/catalina",
        languages: ["English", "Spanish", "French", "Portuguese"],
        regions: ["Punta Cana"],
        experienceYears: 6,
        verifiedBadges: ["Spa Transport", "Wellness Centers", "Luxury Shopping", "Clean Record"],
        bio: "Wellness and luxury lifestyle specialist with extensive connections to exclusive spas, wellness centers, and boutique shopping.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 27,
        vettingLevel: "Level 4 Premium",
        experience: 6,
        specializations: ["Spa Services", "Wellness Centers", "Luxury Shopping"],
        endorsements: [
          "Catalina's spa and wellness connections provided the perfect relaxation experience.",
          "Exceptional knowledge of luxury lifestyle services and perfect attention to detail."
        ],
        adminNotes: {
          internalScore: 89,
          comments: ["Wellness specialist", "Spa expert", "Lifestyle focused"],
          trainingRecords: ["Spa Protocol Training", "Wellness Service Standards", "Luxury Lifestyle Certification"]
        },
        isActive: true,
        createdAt: "2023-04-22T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-pc-005",
        role: "Executive Driver",
        firstName: "Miguel",
        lastName: "Santos",
        name: "Miguel Santos",
        alias: "Ocean",
        photoUrl: "/api/placeholder/avatar/miguel-s",
        languages: ["English", "Spanish", "Portuguese", "Italian"],
        regions: ["Punta Cana"],
        experienceYears: 10,
        verifiedBadges: ["Yacht Club Access", "Marine Transport", "Executive Protection", "Clean Record"],
        bio: "Marine and yacht transportation specialist with extensive experience in luxury water transport and exclusive yacht club services.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 41,
        vettingLevel: "Level 5 Elite",
        experience: 10,
        specializations: ["Yacht Services", "Marine Transport", "Water Activities"],
        endorsements: [
          "Miguel's yacht expertise and marine knowledge made our Caribbean adventure perfect.",
          "Professional, knowledgeable, and exceptional in marine transportation services."
        ],
        adminNotes: {
          internalScore: 94,
          comments: ["Marine specialist", "Yacht expert", "Water transport focused"],
          trainingRecords: ["Marine Safety Certification", "Yacht Club Protocol", "Water Transport Excellence"]
        },
        isActive: true,
        createdAt: "2022-09-18T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // MALAGA-MARBELLA EXECUTIVE DRIVERS (5)
      {
        id: "driver-mm-001",
        role: "Executive Driver",
        firstName: "Carlos",
        lastName: "Delgado",
        name: "Carlos Delgado",
        alias: "Andalusian",
        photoUrl: "/api/placeholder/avatar/carlos-d",
        languages: ["English", "Spanish", "French", "Arabic"],
        regions: ["Malaga-Marbella"],
        experienceYears: 11,
        verifiedBadges: ["Costa del Sol Certified", "Luxury Resort Transport", "Golf Course Access", "Clean Record"],
        bio: "Costa del Sol native with extensive luxury resort and golf course transportation experience throughout southern Spain.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 48,
        vettingLevel: "Level 5 Elite",
        experience: 11,
        specializations: ["Costa del Sol", "Golf Courses", "Luxury Resorts"],
        endorsements: [
          "Carlos's knowledge of Costa del Sol and golf courses is unmatched.",
          "Professional, cultured, and exceptional knowledge of Spanish luxury destinations."
        ],
        adminNotes: {
          internalScore: 95,
          comments: ["Costa del Sol expert", "Golf specialist", "Cultural knowledge"],
          trainingRecords: ["Costa del Sol Mastery", "Golf Course Protocol", "Spanish Luxury Standards"]
        },
        isActive: true,
        createdAt: "2022-06-20T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // LA ROMANA - CASA DE CAMPO EXECUTIVE DRIVERS (5)
      {
        id: "driver-lr-001",
        role: "Executive Driver",
        firstName: "Rafael",
        lastName: "Santana",
        name: "Rafael Santana",
        alias: "Casa Grande",
        photoUrl: "/api/placeholder/avatar/rafael",
        languages: ["Spanish", "English", "French", "Italian"],
        regions: ["La Romana"],
        experienceYears: 12,
        verifiedBadges: ["Casa de Campo Certified", "Golf Course Transport", "Marina Navigation", "Clean Record"],
        bio: "Casa de Campo resort specialist with 12 years experience providing luxury transportation for international guests and resort activities.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 62,
        vettingLevel: "Level 5 Elite",
        experience: 12,
        specializations: ["Casa de Campo Resort", "Golf Courses", "Marina Transport"],
        endorsements: [
          "Rafael's knowledge of Casa de Campo and Dominican culture made our stay unforgettable.",
          "Exceptional service and expertise with the resort facilities and local attractions."
        ],
        adminNotes: {
          internalScore: 96,
          comments: ["Casa de Campo expert", "Resort specialist", "Cultural ambassador"],
          trainingRecords: ["Casa de Campo Mastery", "Dominican Culture Training", "Resort Protocol Excellence"]
        },
        isActive: true,
        createdAt: "2022-03-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-lr-002",
        role: "Executive Driver",
        firstName: "Isabella",
        lastName: "Vasquez",
        name: "Isabella Vasquez",
        alias: "Caribbean Rose",
        photoUrl: "/api/placeholder/avatar/isabella-v",
        languages: ["Spanish", "English", "Portuguese"],
        regions: ["La Romana"],
        experienceYears: 8,
        verifiedBadges: ["Luxury Villa Transport", "Beach Club Access", "Cultural Guide", "Clean Record"],
        bio: "Luxury villa and beach club specialist with extensive knowledge of Casa de Campo's exclusive amenities and Dominican Republic attractions.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 45,
        vettingLevel: "Level 4 Premium",
        experience: 8,
        specializations: ["Luxury Villas", "Beach Clubs", "Cultural Tours"],
        endorsements: [
          "Isabella provided exceptional villa service and introduced us to authentic Dominican experiences.",
          "Professional, knowledgeable, and made our Caribbean vacation truly special."
        ],
        adminNotes: {
          internalScore: 92,
          comments: ["Villa specialist", "Cultural expert", "Beach club preferred"],
          trainingRecords: ["Villa Service Excellence", "Dominican Cultural Training", "Beach Club Protocol"]
        },
        isActive: true,
        createdAt: "2023-01-22T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-lr-003",
        role: "Executive Driver",
        firstName: "Miguel",
        lastName: "Perez",
        name: "Miguel Perez",
        alias: "Marina King",
        photoUrl: "/api/placeholder/avatar/miguel-p",
        languages: ["Spanish", "English", "French"],
        regions: ["La Romana"],
        experienceYears: 10,
        verifiedBadges: ["Marina Certified", "Yacht Transport", "Water Activities", "Clean Record"],
        bio: "Marina and yacht specialist with decade of experience coordinating water activities and luxury vessel transportation at Casa de Campo.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 38,
        vettingLevel: "Level 5 Elite",
        experience: 10,
        specializations: ["Marina Services", "Yacht Coordination", "Water Sports"],
        endorsements: [
          "Miguel's marina expertise and yacht coordination made our sailing experience perfect.",
          "Outstanding knowledge of water activities and professional yacht services."
        ],
        adminNotes: {
          internalScore: 94,
          comments: ["Marina expert", "Yacht specialist", "Water activities focused"],
          trainingRecords: ["Marina Operations Mastery", "Yacht Service Protocol", "Water Sports Coordination"]
        },
        isActive: true,
        createdAt: "2022-11-08T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-lr-004",
        role: "Executive Driver",
        firstName: "Carlos",
        lastName: "Jimenez",
        name: "Carlos Jimenez",
        alias: "Tropical",
        photoUrl: "/api/placeholder/avatar/carlos-j",
        languages: ["Spanish", "English", "German"],
        regions: ["La Romana"],
        experienceYears: 9,
        verifiedBadges: ["Airport Transfers", "VIP Escorts", "Resort Navigation", "Clean Record"],
        bio: "VIP airport transfer and resort navigation specialist serving international clientele with premium transportation services.",
        availabilityStatus: "available",
        available: true,
        rating: 4.7,
        reviewCount: 52,
        vettingLevel: "Level 4 Premium",
        experience: 9,
        specializations: ["Airport Transfers", "VIP Service", "Resort Tours"],
        endorsements: [
          "Carlos provided seamless airport transfers and excellent resort tour services.",
          "Reliable, punctual, and knowledgeable about the entire La Romana region."
        ],
        adminNotes: {
          internalScore: 89,
          comments: ["Transfer specialist", "VIP preferred", "Resort expert"],
          trainingRecords: ["Airport Transfer Excellence", "VIP Service Protocol", "Regional Navigation Mastery"]
        },
        isActive: true,
        createdAt: "2023-04-12T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "driver-lr-005",
        role: "Executive Driver",
        firstName: "Lucia",
        lastName: "Martinez",
        name: "Lucia Martinez",
        alias: "Dominican Pearl",
        photoUrl: "/api/placeholder/avatar/lucia",
        languages: ["Spanish", "English", "Italian", "French"],
        regions: ["La Romana"],
        experienceYears: 7,
        verifiedBadges: ["Luxury Shopping", "Cultural Sites", "Restaurant Guide", "Clean Record"],
        bio: "Cultural and shopping specialist with expertise in Dominican luxury experiences, fine dining, and exclusive local attractions.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 34,
        vettingLevel: "Level 4 Premium",
        experience: 7,
        specializations: ["Cultural Tours", "Luxury Shopping", "Fine Dining"],
        endorsements: [
          "Lucia's cultural knowledge and shopping expertise created unforgettable Dominican experiences.",
          "Exceptional guide for authentic Dominican culture and luxury lifestyle experiences."
        ],
        adminNotes: {
          internalScore: 91,
          comments: ["Cultural specialist", "Shopping expert", "Dining guide"],
          trainingRecords: ["Dominican Cultural Mastery", "Luxury Shopping Protocol", "Fine Dining Excellence"]
        },
        isActive: true,
        createdAt: "2023-07-18T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // LA ROMANA - CASA DE CAMPO CLOSE PROTECTION GUARDS (5)
      {
        id: "security-lr-001",
        role: "Close Protection Guard",
        firstName: "Eduardo",
        lastName: "Morales",
        name: "Eduardo Morales",
        alias: "Guardian",
        photoUrl: "/api/placeholder/avatar/eduardo",
        languages: ["Spanish", "English", "French"],
        regions: ["La Romana"],
        experienceYears: 15,
        verifiedBadges: ["Executive Protection", "Resort Security", "VIP Services", "Firearms Certified"],
        bio: "Former Dominican military officer with 15 years in executive protection specializing in resort security and VIP guest protection.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 41,
        vettingLevel: "Level 5 Elite",
        experience: 15,
        specializations: ["Executive Protection", "Resort Security", "VIP Services"],
        endorsements: [
          "Eduardo's professional security services provided complete peace of mind during our stay.",
          "Highly trained, discrete, and exceptional security awareness throughout our visit."
        ],
        adminNotes: {
          internalScore: 96,
          comments: ["Military background", "Resort specialist", "VIP focused"],
          trainingRecords: ["Executive Protection Advanced", "Resort Security Mastery", "VIP Protocol Excellence"]
        },
        isActive: true,
        createdAt: "2022-02-10T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-lr-002",
        role: "Close Protection Guard",
        firstName: "Ana",
        lastName: "Rodriguez",
        name: "Ana Rodriguez",
        alias: "Shield",
        photoUrl: "/api/placeholder/avatar/ana-r",
        languages: ["Spanish", "English", "Portuguese"],
        regions: ["La Romana"],
        experienceYears: 11,
        verifiedBadges: ["Personal Security", "Female Protection Specialist", "Medical Training", "Firearms Certified"],
        bio: "Female protection specialist with 11 years experience providing discrete security services for high-profile families and individuals.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 36,
        vettingLevel: "Level 5 Elite",
        experience: 11,
        specializations: ["Female Protection", "Family Security", "Discrete Services"],
        endorsements: [
          "Ana provided exceptional security services with perfect discretion for our family vacation.",
          "Professional, caring, and highly skilled in personal protection services."
        ],
        adminNotes: {
          internalScore: 93,
          comments: ["Female specialist", "Family preferred", "Discrete expert"],
          trainingRecords: ["Female Protection Specialization", "Family Security Protocol", "Discretion Excellence"]
        },
        isActive: true,
        createdAt: "2022-08-22T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-lr-003",
        role: "Close Protection Guard",
        firstName: "Roberto",
        lastName: "Castillo",
        name: "Roberto Castillo",
        alias: "Fortress",
        photoUrl: "/api/placeholder/avatar/roberto-c",
        languages: ["Spanish", "English", "Italian"],
        regions: ["La Romana"],
        experienceYears: 13,
        verifiedBadges: ["Maritime Security", "Yacht Protection", "Water Activities Security", "Firearms Certified"],
        bio: "Maritime security specialist with 13 years experience protecting clients during yacht excursions and water-based activities.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 29,
        vettingLevel: "Level 5 Elite",
        experience: 13,
        specializations: ["Maritime Security", "Yacht Protection", "Water Security"],
        endorsements: [
          "Roberto's maritime security expertise made our yacht adventures completely safe and enjoyable.",
          "Exceptional water security knowledge and professional yacht protection services."
        ],
        adminNotes: {
          internalScore: 95,
          comments: ["Maritime expert", "Yacht specialist", "Water security focused"],
          trainingRecords: ["Maritime Security Mastery", "Yacht Protection Protocol", "Water Activities Security"]
        },
        isActive: true,
        createdAt: "2022-05-14T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-lr-004",
        role: "Close Protection Guard",
        firstName: "Diana",
        lastName: "Hernandez",
        name: "Diana Hernandez",
        alias: "Sentinel",
        photoUrl: "/api/placeholder/avatar/diana",
        languages: ["Spanish", "English", "French"],
        regions: ["La Romana"],
        experienceYears: 9,
        verifiedBadges: ["Event Security", "Golf Course Security", "VIP Events", "Medical Training"],
        bio: "Event and venue security specialist with 9 years experience protecting clients during golf tournaments, social events, and exclusive gatherings.",
        availabilityStatus: "assigned",
        available: false,
        rating: 4.7,
        reviewCount: 33,
        vettingLevel: "Level 4 Premium",
        experience: 9,
        specializations: ["Event Security", "Golf Course Protection", "Social Events"],
        endorsements: [
          "Diana's event security services ensured our golf tournament proceeded flawlessly.",
          "Professional event protection with excellent attention to detail and guest safety."
        ],
        adminNotes: {
          internalScore: 90,
          comments: ["Event specialist", "Golf expert", "Social gatherings focused"],
          trainingRecords: ["Event Security Excellence", "Golf Course Protocol", "Social Event Management"]
        },
        isActive: true,
        createdAt: "2023-02-28T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "security-lr-005",
        role: "Close Protection Guard",
        firstName: "Manuel",
        lastName: "Vargas",
        name: "Manuel Vargas",
        alias: "Watchman",
        photoUrl: "/api/placeholder/avatar/manuel",
        languages: ["Spanish", "English", "German"],
        regions: ["La Romana"],
        experienceYears: 12,
        verifiedBadges: ["Residential Security", "Villa Protection", "Perimeter Security", "Firearms Certified"],
        bio: "Residential security specialist with 12 years experience providing 24/7 villa protection and perimeter security for luxury properties.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 38,
        vettingLevel: "Level 5 Elite",
        experience: 12,
        specializations: ["Residential Security", "Villa Protection", "Perimeter Defense"],
        endorsements: [
          "Manuel's residential security services provided complete peace of mind during our extended stay.",
          "Highly professional villa protection with excellent security awareness and response."
        ],
        adminNotes: {
          internalScore: 92,
          comments: ["Residential expert", "Villa specialist", "Perimeter focused"],
          trainingRecords: ["Residential Security Mastery", "Villa Protection Excellence", "Perimeter Defense Training"]
        },
        isActive: true,
        createdAt: "2022-09-05T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },

      // LA ROMANA - CASA DE CAMPO ELITE CONCIERGES (5)
      {
        id: "concierge-lr-001",
        role: "Elite Concierge",
        firstName: "Sofia",
        lastName: "Mendez",
        name: "Sofia Mendez",
        alias: "Caribbean Pearl",
        photoUrl: "/api/placeholder/avatar/sofia-m",
        languages: ["Spanish", "English", "French", "Italian"],
        regions: ["La Romana"],
        experienceYears: 10,
        verifiedBadges: ["Resort Services", "Cultural Events", "Luxury Experiences", "VIP Relations"],
        bio: "Casa de Campo resort concierge specialist with 10 years experience creating bespoke Caribbean luxury experiences and cultural immersion.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 47,
        vettingLevel: "Level 5 Elite",
        experience: 10,
        specializations: ["Resort Experiences", "Cultural Events", "Caribbean Luxury"],
        endorsements: [
          "Sofia created the most amazing Dominican cultural experiences and luxury resort activities.",
          "Exceptional concierge services with deep knowledge of Caribbean luxury and local culture."
        ],
        adminNotes: {
          internalScore: 95,
          comments: ["Resort expert", "Cultural specialist", "Luxury focused"],
          trainingRecords: ["Casa de Campo Mastery", "Caribbean Culture Training", "Luxury Experience Design"]
        },
        isActive: true,
        createdAt: "2022-06-12T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-lr-002",
        role: "Elite Concierge",
        firstName: "Antonio",
        lastName: "Rivera",
        name: "Antonio Rivera",
        alias: "Casa Curator",
        photoUrl: "/api/placeholder/avatar/antonio-r",
        languages: ["Spanish", "English", "Portuguese", "Italian"],
        regions: ["La Romana"],
        experienceYears: 12,
        verifiedBadges: ["Villa Services", "Private Events", "Fine Dining", "Luxury Shopping"],
        bio: "Luxury villa and private event specialist with 12 years experience curating exclusive experiences for high-net-worth individuals.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 54,
        vettingLevel: "Level 5 Elite",
        experience: 12,
        specializations: ["Villa Services", "Private Events", "Luxury Curation"],
        endorsements: [
          "Antonio's villa services and private event planning exceeded all expectations.",
          "Masterful luxury curation with attention to every detail and personal preference."
        ],
        adminNotes: {
          internalScore: 97,
          comments: ["Villa expert", "Event specialist", "Luxury curator"],
          trainingRecords: ["Villa Service Excellence", "Private Event Mastery", "Luxury Curation Advanced"]
        },
        isActive: true,
        createdAt: "2022-03-18T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-lr-003",
        role: "Elite Concierge",
        firstName: "Carmen",
        lastName: "Flores",
        name: "Carmen Flores",
        alias: "Marina Muse",
        photoUrl: "/api/placeholder/avatar/carmen-f",
        languages: ["Spanish", "English", "French"],
        regions: ["La Romana"],
        experienceYears: 8,
        verifiedBadges: ["Yacht Services", "Water Activities", "Marine Excursions", "Event Planning"],
        bio: "Marine and yacht concierge specialist with 8 years experience coordinating luxury water activities and exclusive marine experiences.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 31,
        vettingLevel: "Level 4 Premium",
        experience: 8,
        specializations: ["Yacht Services", "Marine Activities", "Water Excursions"],
        endorsements: [
          "Carmen's yacht services and marine activity coordination made our Caribbean sailing perfect.",
          "Outstanding knowledge of water activities with exceptional yacht concierge services."
        ],
        adminNotes: {
          internalScore: 93,
          comments: ["Marine specialist", "Yacht expert", "Water activities focused"],
          trainingRecords: ["Yacht Service Protocol", "Marine Activity Coordination", "Water Excursion Planning"]
        },
        isActive: true,
        createdAt: "2023-05-20T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-lr-004",
        role: "Elite Concierge",
        firstName: "Felipe",
        lastName: "Gutierrez",
        name: "Felipe Gutierrez",
        alias: "Golf Master",
        photoUrl: "/api/placeholder/avatar/felipe",
        languages: ["Spanish", "English", "German", "Italian"],
        regions: ["La Romana"],
        experienceYears: 11,
        verifiedBadges: ["Golf Services", "Sports Coordination", "Tournament Planning", "VIP Sports"],
        bio: "Golf and sports concierge specialist with 11 years experience coordinating golf tournaments, sports activities, and athletic experiences.",
        availabilityStatus: "available",
        available: true,
        rating: 4.9,
        reviewCount: 42,
        vettingLevel: "Level 5 Elite",
        experience: 11,
        specializations: ["Golf Services", "Sports Coordination", "Athletic Experiences"],
        endorsements: [
          "Felipe's golf services and tournament coordination created an incredible sporting experience.",
          "Exceptional golf knowledge and sports activity planning with professional tournament standards."
        ],
        adminNotes: {
          internalScore: 94,
          comments: ["Golf expert", "Sports specialist", "Tournament focused"],
          trainingRecords: ["Golf Service Mastery", "Sports Coordination Excellence", "Tournament Planning Advanced"]
        },
        isActive: true,
        createdAt: "2022-10-25T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "concierge-lr-005",
        role: "Elite Concierge",
        firstName: "Valentina",
        lastName: "Cruz",
        name: "Valentina Cruz",
        alias: "Tropical Muse",
        photoUrl: "/api/placeholder/avatar/valentina-c",
        languages: ["Spanish", "English", "French", "Portuguese"],
        regions: ["La Romana"],
        experienceYears: 9,
        verifiedBadges: ["Spa Services", "Wellness Coordination", "Health & Beauty", "Relaxation Specialist"],
        bio: "Wellness and spa concierge specialist with 9 years experience coordinating luxury wellness experiences, spa treatments, and health retreats.",
        availabilityStatus: "available",
        available: true,
        rating: 4.8,
        reviewCount: 39,
        vettingLevel: "Level 4 Premium",
        experience: 9,
        specializations: ["Spa Services", "Wellness Coordination", "Health Retreats"],
        endorsements: [
          "Valentina's spa and wellness coordination created the most relaxing Caribbean retreat experience.",
          "Exceptional wellness knowledge with outstanding spa service coordination and health expertise."
        ],
        adminNotes: {
          internalScore: 91,
          comments: ["Wellness expert", "Spa specialist", "Health focused"],
          trainingRecords: ["Spa Service Excellence", "Wellness Coordination Mastery", "Health Retreat Planning"]
        },
        isActive: true,
        createdAt: "2023-01-08T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      }
      // Total dataset now includes 45+ comprehensive personnel profiles 
      // across all 6 pilot locations (NYC, Miami, Los Angeles, Punta Cana, Malaga-Marbella, La Romana - Casa de Campo)
      // Each location has multiple Executive Drivers, Close Protection Guards, and Elite Concierges
      // La Romana - Casa de Campo now features complete luxury resort services including villa, marina, golf, and wellness specialists
    ];

    res.json(mockProfiles);
  });

  app.get("/api/admin/personnel/profiles/:id", async (req, res) => {
    const { id } = req.params;
    
    // Mock individual profile lookup
    res.json({
      message: "Personnel profile retrieved",
      profileId: id,
      // Would return full profile details
    });
  });

  app.post("/api/admin/personnel/profiles", async (req, res) => {
    const profileData = req.body;
    
    // Mock create new personnel profile
    const newProfile = {
      id: `profile-${Date.now()}`,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: "Personnel profile created successfully",
      profile: newProfile
    });
  });

  app.put("/api/admin/personnel/profiles/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Mock update personnel profile
    res.json({
      message: "Personnel profile updated successfully",
      profileId: id,
      updatedFields: Object.keys(updateData),
      timestamp: new Date().toISOString()
    });
  });

  app.delete("/api/admin/personnel/profiles/:id", async (req, res) => {
    const { id } = req.params;
    
    // Mock delete personnel profile
    res.json({
      message: "Personnel profile deactivated successfully",
      profileId: id,
      timestamp: new Date().toISOString()
    });
  });

  // Business Intelligence & Analytics APIs
  app.get("/api/admin/analytics/dashboard", async (req, res) => {
    // Comprehensive business metrics
    res.json({
      // Financial Metrics
      revenue: {
        monthly: 2847600, // $2.8M monthly
        quarterly: 8542800, // $8.5M quarterly
        yearly: 34171200, // $34.2M yearly
        growth: {
          monthOverMonth: 12.4,
          quarterOverQuarter: 18.7,
          yearOverYear: 34.2
        }
      },
      
      // Client Metrics
      clients: {
        total: 847,
        active: 623,
        premium: 156,
        vip: 42,
        newThisMonth: 23,
        churnRate: 2.1,
        avgLifetimeValue: 485600,
        regionBreakdown: {
          "New York": 234,
          "Miami": 187,
          "Los Angeles": 198,
          "Punta Cana": 89,
          "Malaga-Marbella": 139,
          "La Romana": 67
        }
      },

      // Service Metrics
      services: {
        transportation: {
          bookings: 1247,
          revenue: 987400,
          avgPrice: 1840,
          satisfaction: 4.9
        },
        security: {
          assignments: 234,
          revenue: 1456700,
          avgPrice: 6225,
          satisfaction: 4.8
        },
        concierge: {
          requests: 567,
          revenue: 403500,
          avgPrice: 712,
          satisfaction: 4.9
        }
      },

      // Operational Metrics
      operations: {
        personnelUtilization: 89.4,
        vehicleUtilization: 76.8,
        responseTime: 1.2, // minutes
        incidentRate: 0.003,
        uptime: 99.97
      },

      // Regional Performance
      regions: [
        {
          name: "New York",
          revenue: 8940000,
          clients: 234,
          growth: 15.6,
          margin: 34.2
        },
        {
          name: "Miami", 
          revenue: 6750000,
          clients: 187,
          growth: 22.3,
          margin: 38.1
        },
        {
          name: "Los Angeles",
          revenue: 7850000,
          clients: 198,
          growth: 18.9,
          margin: 36.7
        },
        {
          name: "La Romana",
          revenue: 4280000,
          clients: 67,
          growth: 31.5,
          margin: 42.3
        },
        {
          name: "Punta Cana",
          revenue: 4240000,
          clients: 89,
          growth: 28.4,
          margin: 41.2
        },
        {
          name: "Malaga-Marbella",
          revenue: 6380000,
          clients: 139,
          growth: 31.7,
          margin: 39.8
        }
      ]
    });
  });

  app.get("/api/admin/suppliers", async (req, res) => {
    // Supplier management data
    res.json([
      {
        id: "SUP-001",
        name: "Elite Vehicle Rentals LLC",
        type: "Transportation",
        region: "NYC",
        contracts: 23,
        monthlySpend: 247800,
        rating: 4.8,
        vehicles: ["Rolls-Royce", "Bentley", "Mercedes S-Class"],
        status: "active",
        lastPayment: "2024-01-15",
        nextReview: "2024-03-01"
      },
      {
        id: "SUP-002", 
        name: "Sovereign Security Group",
        type: "Security Personnel",
        region: "Global",
        contracts: 45,
        monthlySpend: 890400,
        rating: 4.9,
        specialties: ["Executive Protection", "Event Security", "Residential"],
        status: "active",
        lastPayment: "2024-01-12",
        nextReview: "2024-02-15"
      },
      {
        id: "SUP-003",
        name: "Platinum Properties International",
        type: "Real Estate",
        region: "Miami",
        contracts: 12,
        monthlySpend: 156700,
        rating: 4.7,
        properties: ["Penthouses", "Villas", "Yachts"],
        status: "active",
        lastPayment: "2024-01-10",
        nextReview: "2024-04-01"
      }
    ]);
  });

  app.get("/api/admin/financial/overview", async (req, res) => {
    // Financial overview with P&L
    res.json({
      profitLoss: {
        revenue: 34171200,
        costs: {
          personnel: 8240000,
          suppliers: 12840000,
          operations: 3250000,
          technology: 890000,
          marketing: 1240000,
          overhead: 2180000
        },
        grossProfit: 5531200,
        netProfit: 4891200,
        margins: {
          gross: 16.2,
          net: 14.3
        }
      },
      cashFlow: {
        operating: 6240000,
        investing: -1890000,
        financing: -890000,
        net: 3460000
      },
      receivables: {
        current: 2840000,
        overdue: 156000,
        avgCollectionDays: 18
      },
      payables: {
        current: 1890000,
        overdue: 23000,
        avgPaymentDays: 22
      }
    });
  });

  // Personnel availability endpoints
  app.get("/api/admin/personnel/availability", async (req, res) => {
    const { date, role, region } = req.query;
    
    // Mock availability data
    res.json([
      {
        personnelId: "driver-001",
        name: "Marcus Rodriguez",
        role: "driver",
        date: date || "2024-01-20",
        availability: "available",
        timeSlots: ["09:00-12:00", "14:00-18:00", "20:00-23:00"]
      },
      {
        personnelId: "security-001",
        name: "Sarah Chen", 
        role: "security",
        date: date || "2024-01-20",
        availability: "partially_available",
        timeSlots: ["06:00-14:00"]
      }
    ]);
  });

  // Personnel assignments endpoint
  app.post("/api/admin/personnel/assign", async (req, res) => {
    const { personnelId, serviceId, startDate, endDate, clientId } = req.body;
    
    // Mock assignment creation
    res.json({
      message: "Personnel assigned successfully",
      assignmentId: `assign-${Date.now()}`,
      personnelId,
      serviceId,
      startDate,
      endDate,
      clientId,
      status: "confirmed",
      timestamp: new Date().toISOString()
    });
  });

  // Multi-Service booking
  app.post('/api/client/multi-service/book', (req, res) => {
    console.log('Multi-Service booking request:', req.body);
    const enabledServices = req.body.services?.filter((s: any) => s.enabled) || [];
    
    // Extract user information from token
    const authHeader = req.headers['authorization'];
    let userId = 'anonymous';
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        // Continue with anonymous user
      }
    }
    
    // Create service request record
    const bookingId = `MS-${Date.now()}`;
    const serviceRequest = {
      id: bookingId,
      type: 'multi-service',
      title: req.body.tripName || 'Multi-Service Package',
      status: 'pending',
      location: req.body.primaryLocation,
      datetime: req.body.startDateTime,
      details: `${enabledServices.length} services: ${enabledServices.map((s: any) => s.type).join(', ')}`,
      cost: req.body.estimatedBudget,
      services: enabledServices,
      userId: userId,
      createdAt: new Date().toISOString(),
      tripData: req.body
    };
    
    // Store the request
    if (!serviceRequests.has(userId)) {
      serviceRequests.set(userId, []);
    }
    serviceRequests.get(userId)!.push(serviceRequest);
    
    res.json({ 
      success: true, 
      bookingId,
      message: `Multi-service package with ${enabledServices.length} services submitted successfully`,
      services: enabledServices.map((s: any) => s.type),
      tripName: req.body.tripName,
      estimatedCoordination: '2-4 hours'
    });
  });

  // ========================================
  // INVESTMENT INTEREST ENDPOINTS
  // ========================================

  // Submit investment interest form
  app.post('/api/investment-interest', async (req, res) => {
    try {
      const investmentData = req.body;
      
      const investment = {
        id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...investmentData,
        status: 'submitted',
        adminNotes: null,
        reviewedBy: null,
        reviewedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Initialize global storage if needed
      if (!globalThis.investmentInterests) {
        globalThis.investmentInterests = [];
      }

      globalThis.investmentInterests.push(investment);
      
      console.log("Investment interest submitted:", investment);
      
      res.json({ 
        success: true, 
        message: 'Investment interest submitted successfully',
        investmentId: investment.id
      });
    } catch (error) {
      console.error('Error submitting investment interest:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit investment interest' 
      });
    }
  });

  // Admin authentication middleware - specifically for calvarado@nebusis.com
  const celsoAdminAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'default_secret') as any;
      
      // Check if user is Celso (Master Admin) - only require email match OR admin userType
      if (decoded.email !== 'calvarado@nebusis.com' && decoded.userType !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      // Allow access if user is either Celso specifically OR has admin userType
      if (decoded.email === 'calvarado@nebusis.com' || decoded.userType === 'admin') {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({ message: 'Admin access required' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Get all investment interests (Celso only)
  app.get('/api/admin/investment-interests', celsoAdminAuth, async (req, res) => {
    try {
      if (!globalThis.investmentInterests) {
        globalThis.investmentInterests = [
          {
            id: "inv-1753776400001",
            fullName: "Victoria Sterling",
            email: "v.sterling@sterlingcapital.com",
            phone: "+1-555-0147",
            entityName: "Sterling Capital Partners",
            entityType: "investment_fund",
            investmentRange: "$5,000,000–$15,000,000",
            investmentStructure: "equity",
            dueDiligenceTimeline: "30_45_days",
            primaryInterest: "Global expansion potential and luxury market positioning",
            experience: "15+ years in luxury services and security technology investments",
            referralSource: "Industry networking event",
            additionalComments: "Particularly interested in the cloaking technology and international expansion opportunities. Have portfolio companies that could provide strategic partnerships.",
            ndaAgreed: true,
            digitalSignature: "Victoria Sterling",
            status: "under_review",
            adminNotes: "High-potential investor with relevant portfolio. Schedule follow-up meeting.",
            reviewedBy: "Celso Alvarado",
            reviewedAt: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "inv-1753776400002",
            fullName: "Marcus Blackstone",
            email: "marcus@blackstonellc.com",
            phone: "+1-555-0284",
            entityName: "Blackstone Security Ventures",
            entityType: "private_equity",
            investmentRange: "$10,000,000–$25,000,000",
            investmentStructure: "convertible_debt",
            dueDiligenceTimeline: "45_60_days",
            primaryInterest: "Security technology and executive protection market expansion",
            experience: "Former CIA executive with 20+ years in security investments",
            referralSource: "Direct outreach",
            additionalComments: "Impressed by the discrete luxury positioning and global security framework. Would like to discuss strategic advisory role alongside investment.",
            ndaAgreed: true,
            digitalSignature: "Marcus J. Blackstone",
            status: "meeting_scheduled",
            adminNotes: "Meeting scheduled for next week. Very interested in advisory position.",
            reviewedBy: "Celso Alvarado",
            reviewedAt: new Date(Date.now() - 43200000).toISOString(),
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 43200000).toISOString()
          },
          {
            id: "inv-1753776400003",
            fullName: "Sophia Chen",
            email: "s.chen@asiapacificfund.com",
            phone: "+65-9876-5432",
            entityName: "Asia Pacific Luxury Fund",
            entityType: "investment_fund",
            investmentRange: "$2,000,000–$8,000,000",
            investmentStructure: "equity",
            dueDiligenceTimeline: "60_90_days",
            primaryInterest: "Asian market expansion and luxury transportation services",
            experience: "Managing Director with expertise in luxury services across Asia Pacific",
            referralSource: "LinkedIn professional network",
            additionalComments: "See significant opportunity for YoLuxGo expansion into Hong Kong, Singapore, and Tokyo markets. Our fund has strong connections with UHNW individuals in the region.",
            ndaAgreed: true,
            digitalSignature: "Sophia M. Chen",
            status: "nda_sent",
            adminNotes: "Promising for Asian expansion. NDA sent for detailed business plan review.",
            reviewedBy: "Celso Alvarado",
            reviewedAt: new Date(Date.now() - 21600000).toISOString(),
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 21600000).toISOString()
          },
          {
            id: "inv-1753776400004",
            fullName: "Alexander Petrov",
            email: "a.petrov@europeancapital.eu",
            phone: "+33-1-4567-8900",
            entityName: "European Luxury Capital",
            entityType: "family_office",
            investmentRange: "$1,000,000–$5,000,000",
            investmentStructure: "equity",
            dueDiligenceTimeline: "30_45_days",
            primaryInterest: "European market penetration and luxury concierge services",
            experience: "Family office representing UHNW European families, 12+ years in luxury investments",
            referralSource: "Referred by existing client",
            additionalComments: "Our principals are current users of similar services and see the value proposition. Interested in European expansion, particularly London, Paris, and Monaco.",
            ndaAgreed: true,
            digitalSignature: "Alexander V. Petrov",
            status: "submitted",
            adminNotes: null,
            reviewedBy: null,
            reviewedAt: null,
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            updatedAt: new Date(Date.now() - 432000000).toISOString()
          },
          {
            id: "inv-1753776400005",
            fullName: "Diana Rodriguez",
            email: "d.rodriguez@techventures.com",
            phone: "+1-555-0392",
            entityName: "TechVentures International",
            entityType: "venture_capital",
            investmentRange: "$3,000,000–$12,000,000",
            investmentStructure: "series_a",
            dueDiligenceTimeline: "45_60_days",
            primaryInterest: "Technology platform scalability and mobile application development",
            experience: "Partner at leading tech VC firm, 18+ years funding security and luxury tech startups",
            referralSource: "Industry conference",
            additionalComments: "Very interested in the technology infrastructure and mobile platform potential. Would like to understand the roadmap for AI integration and predictive security features.",
            ndaAgreed: true,
            digitalSignature: "Diana M. Rodriguez",
            status: "declined",
            adminNotes: "Investment focus shifted to earlier-stage companies. Potential future opportunity.",
            reviewedBy: "Celso Alvarado",
            reviewedAt: new Date(Date.now() - 604800000).toISOString(),
            createdAt: new Date(Date.now() - 691200000).toISOString(),
            updatedAt: new Date(Date.now() - 604800000).toISOString()
          }
        ];
      }

      const interests = globalThis.investmentInterests.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      res.json(interests);
    } catch (error) {
      console.error('Error fetching investment interests:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch investment interests' 
      });
    }
  });

  // Update investment interest status (Celso only)
  app.patch('/api/admin/investment-interests/:id', celsoAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes, reviewedBy } = req.body;
      
      if (!globalThis.investmentInterests) {
        return res.status(404).json({ success: false, message: 'Investment interest not found' });
      }

      const interestIndex = globalThis.investmentInterests.findIndex((interest: any) => interest.id === id);
      
      if (interestIndex === -1) {
        return res.status(404).json({ success: false, message: 'Investment interest not found' });
      }
      
      globalThis.investmentInterests[interestIndex] = {
        ...globalThis.investmentInterests[interestIndex],
        status,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      res.json({ 
        success: true, 
        message: 'Investment interest updated successfully',
        interest: globalThis.investmentInterests[interestIndex]
      });
    } catch (error) {
      console.error('Error updating investment interest:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update investment interest' 
      });
    }
  });

  // Get all job applications for admin (Celso only)
  app.get('/api/admin/job-applications', celsoAdminAuth, async (req, res) => {
    try {
      if (!globalThis.jobApplications) {
        globalThis.jobApplications = [
          {
            id: "app-1753759000001",
            position: "Chief Technology Officer (CTO)",
            firstName: "Michael",
            lastName: "Chen",
            email: "michael.chen@techleader.com",
            phone: "+1-555-0123",
            linkedinUrl: "https://linkedin.com/in/michaelchen-cto",
            coverLetter: "As a seasoned technology executive with 15+ years of experience scaling global platforms, I am excited about the opportunity to lead YoLuxGo's technical vision. My background includes founding two successful fintech startups, leading engineering teams of 100+ developers, and implementing enterprise-grade security systems for luxury service platforms.",
            photoUrl: null,
            status: "interviewed",
            notes: "Strong technical background, excellent cultural fit. Proceeding to final interview stage.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 43200000).toISOString()
          },
          {
            id: "app-1753759000002",
            position: "Chief Financial Officer (CFO)",
            firstName: "Sarah",
            lastName: "Rodriguez",
            email: "sarah.rodriguez@financepro.com",
            phone: "+1-555-0456",
            linkedinUrl: "https://linkedin.com/in/sarahrodriguez-cfo",
            coverLetter: "With extensive experience in luxury service sector finance and startup scaling, I bring deep expertise in fundraising, financial planning, and regulatory compliance. I've successfully raised over $250M across multiple funding rounds and have a proven track record of building financial systems that support rapid international expansion.",
            photoUrl: null,
            status: "pending",
            notes: null,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: "app-1753759000003",
            position: "VP of Operations",
            firstName: "David",
            lastName: "Kim",
            email: "david.kim@operations.com",
            phone: "+1-555-0789",
            linkedinUrl: "https://linkedin.com/in/davidkim-operations",
            coverLetter: "My 12-year career in luxury hospitality operations, including 8 years with Ritz-Carlton and Four Seasons, has prepared me to excel in YoLuxGo's operational leadership role. I specialize in building scalable service delivery systems, managing global vendor networks, and ensuring consistent quality across multiple markets.",
            photoUrl: null,
            status: "reviewed",
            notes: "Excellent operational background in luxury services. Strong candidate for VP Operations role.",
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 129600000).toISOString()
          },
          {
            id: "app-1753759000004",
            position: "Head of Security",
            firstName: "James",
            lastName: "Wellington",
            email: "j.wellington@securityexpert.com",
            phone: "+1-555-0234",
            linkedinUrl: "https://linkedin.com/in/jameswellington-security",
            coverLetter: "Former Secret Service agent with 18 years of executive protection experience, including 8 years protecting Fortune 500 CEOs and foreign dignitaries. I bring deep expertise in threat assessment, security protocol development, and global security network management. My experience includes coordinating protection details across 40+ countries.",
            photoUrl: null,
            status: "hired",
            notes: "Exceptional candidate. Offer extended and accepted. Start date confirmed for next month.",
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "app-1753759000005",
            position: "VP of Marketing",
            firstName: "Elena",
            lastName: "Volkov",
            email: "elena.volkov@luxurymarketing.com",
            phone: "+1-555-0567",
            linkedinUrl: "https://linkedin.com/in/elenavolkov-marketing",
            coverLetter: "With 14 years in luxury brand marketing, including senior roles at Louis Vuitton and Rolls-Royce, I understand the delicate balance of marketing exclusive services while maintaining discretion. My expertise in high-net-worth customer acquisition and retention aligns perfectly with YoLuxGo's positioning in the luxury security market.",
            photoUrl: null,
            status: "interviewing",
            notes: "Impressive luxury brand background. Second interview scheduled for next week.",
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: "app-1753759000006",
            position: "Regional Director - Europe",
            firstName: "Alessandro",
            lastName: "Romano",
            email: "a.romano@europeanluxury.com",
            phone: "+39-06-1234-5678",
            linkedinUrl: "https://linkedin.com/in/alessandroromano-luxury",
            coverLetter: "As a former Managing Director at Concierge Auctions Europe, I bring 16+ years of experience in luxury service operations across European markets. I have extensive networks with UHNW individuals, luxury service providers, and regulatory bodies in key European cities including London, Paris, Monaco, and Zurich.",
            photoUrl: null,
            status: "reviewed",
            notes: "Strong European market knowledge and network. Good fit for expansion plans.",
            createdAt: new Date(Date.now() - 518400000).toISOString(),
            updatedAt: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: "app-1753759000007",
            position: "Head of Concierge Intelligence",
            firstName: "Sophia",
            lastName: "Martinez",
            email: "sophia.martinez@eliteconcierge.com",
            phone: "+1-555-0890",
            linkedinUrl: "https://linkedin.com/in/sophiamartinez-concierge",
            coverLetter: "My 11-year career with American Express Centurion and private family offices has given me unparalleled expertise in ultra-luxury concierge services. I've managed complex requests for billionaire families, including private island acquisitions, diplomatic passport arrangements, and exclusive event access that most consider impossible.",
            photoUrl: null,
            status: "rejected",
            notes: "Overqualified for current role structure. May reconsider for future senior position.",
            createdAt: new Date(Date.now() - 604800000).toISOString(),
            updatedAt: new Date(Date.now() - 345600000).toISOString()
          },
          {
            id: "app-1753759000008",
            position: "Head of Business Development",
            firstName: "Victoria",
            lastName: "Sterling",
            email: "v.sterling@businessdev.com",
            phone: "+1-555-0345",
            linkedinUrl: "https://linkedin.com/in/victoriasterling-bd",
            coverLetter: "Having led business development for three unicorn startups in the luxury tech space, I bring proven expertise in scaling premium service platforms globally. My network includes C-suite executives at Fortune 100 companies, celebrity managers, and government officials who represent YoLuxGo's target demographic.",
            photoUrl: null,
            status: "pending",
            notes: null,
            createdAt: new Date(Date.now() - 691200000).toISOString(),
            updatedAt: new Date(Date.now() - 691200000).toISOString()
          }
        ];
      }

      const applications = globalThis.jobApplications.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      res.json(applications);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch job applications' 
      });
    }
  });

  // ========================================
  // CAREERS & HR MANAGEMENT ENDPOINTS
  // ========================================

  // Initialize global storage for job applications
  if (!global.jobApplications) {
    global.jobApplications = [
      {
        id: "app-demo-001",
        position: "operations-manager",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        linkedinUrl: "https://linkedin.com/in/sarahjohnson",
        coverLetter: "I am excited to apply for the Operations & Provider Onboarding Manager position. With 8 years of experience in hospitality operations and a proven track record of building scalable processes, I am well-positioned to help YoLuxGo establish world-class service standards. My bilingual abilities (English/Spanish) and experience with luxury service providers make me an ideal candidate for this role.",
        photoUrl: null,
        status: "pending",
        notes: null,
        createdAt: "2025-01-29T10:00:00.000Z",
        updatedAt: "2025-01-29T10:00:00.000Z"
      },
      {
        id: "app-demo-002",
        position: "technical-lead",
        firstName: "Marcus",
        lastName: "Chen",
        email: "marcus.chen@email.com",
        phone: "+1 (555) 987-6543",
        linkedinUrl: "https://linkedin.com/in/marcuschen",
        coverLetter: "As a senior full-stack developer with 12 years of experience building secure, scalable platforms, I am thrilled about the opportunity to serve as YoLuxGo's Technical Lead. I have extensive experience with Go, mobile-first architectures, and payment integrations including Stripe. I've previously led technical teams at two successful startups and understand the unique challenges of building luxury service platforms.",
        photoUrl: null,
        status: "reviewed",
        notes: "Strong technical background, excellent experience with Go and mobile platforms. Schedule for technical interview.",
        createdAt: "2025-01-28T15:30:00.000Z",
        updatedAt: "2025-01-29T09:15:00.000Z"
      },
      {
        id: "app-demo-003",
        position: "marketing-partnerships",
        firstName: "Isabella",
        lastName: "Rodriguez",
        email: "isabella.rodriguez@email.com",
        phone: "+1 (555) 456-7890",
        linkedinUrl: "https://linkedin.com/in/isabellarodriguez",
        coverLetter: "I am passionate about luxury brands and have spent the last 5 years building social media presence for high-end hospitality and lifestyle brands. My experience managing partnerships with influencers in Miami and New York makes me uniquely qualified to help YoLuxGo establish its presence in key launch markets. I'm fluent in English, Spanish, and Portuguese.",
        photoUrl: null,
        status: "interviewing",
        notes: "Great portfolio of luxury brand work. Scheduled for final interview with marketing team on Friday.",
        createdAt: "2025-01-27T11:45:00.000Z",
        updatedAt: "2025-01-29T08:30:00.000Z"
      },
      {
        id: "app-demo-004",
        position: "client-success",
        firstName: "David",
        lastName: "Thompson",
        email: "david.thompson@email.com",
        phone: null,
        linkedinUrl: null,
        coverLetter: "With 6 years of experience in premium customer service at luxury hotels and private clubs, I understand the importance of discretion and excellence in client interactions. I have experience with support platforms like Zendesk and have consistently maintained high customer satisfaction scores. I'm excited about the opportunity to help shape the early client experience at YoLuxGo.",
        photoUrl: null,
        status: "pending",
        notes: null,
        createdAt: "2025-01-26T14:20:00.000Z",
        updatedAt: "2025-01-26T14:20:00.000Z"
      }
    ];
  }

  // Submit job application
  app.post('/api/careers/apply', async (req, res) => {
    try {
      const { position, firstName, lastName, email, phone, linkedinUrl, coverLetter } = req.body;
      
      const application = {
        id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position,
        firstName,
        lastName,
        email,
        phone: phone || null,
        linkedinUrl: linkedinUrl || null,
        coverLetter: coverLetter || null,
        photoUrl: null, // Will be implemented later for file uploads
        status: 'pending',
        notes: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      global.jobApplications.push(application);
      
      res.json({ 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: application.id
      });
    } catch (error) {
      console.error('Error submitting job application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit application' 
      });
    }
  });

  // HR authentication middleware
  const hrAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
      
      // Check if user is HR personnel
      if (decoded.userType !== 'hr' && decoded.userType !== 'admin') {
        return res.status(403).json({ message: 'HR access required' });
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Get all job applications (HR only)
  app.get('/api/hr/applications', hrAuth, async (req, res) => {
    try {
      // Return applications sorted by creation date (newest first)
      const applications = global.jobApplications.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch applications' 
      });
    }
  });

  // Update job application status and notes (HR only)
  app.patch('/api/hr/applications/:id', hrAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const applicationIndex = global.jobApplications.findIndex((app: any) => app.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Application not found' 
        });
      }
      
      // Update the application
      global.jobApplications[applicationIndex] = {
        ...global.jobApplications[applicationIndex],
        status: status || global.jobApplications[applicationIndex].status,
        notes: notes !== undefined ? notes : global.jobApplications[applicationIndex].notes,
        updatedAt: new Date().toISOString(),
      };
      
      res.json({ 
        success: true, 
        message: 'Application updated successfully',
        application: global.jobApplications[applicationIndex]
      });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update application' 
      });
    }
  });

  // Get application details (HR only)
  app.get('/api/hr/applications/:id', hrAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      const application = global.jobApplications.find((app: any) => app.id === id);
      
      if (!application) {
        return res.status(404).json({ 
          success: false, 
          message: 'Application not found' 
        });
      }
      
      res.json(application);
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch application' 
      });
    }
  });

  // All User Types Mock Data
  app.get("/api/admin/users/all-types", async (req, res) => {
    const mockUsers = {
      clients: [
        {
          id: "client-001",
          firstName: "Alexander",
          lastName: "Rothschild",
          email: "a.rothschild@private.com",
          membershipTier: "VIP",
          location: "New York",
          joinDate: "2023-03-15",
          totalBookings: 47,
          lifetimeValue: 285000,
          preferredServices: ["Transportation", "Security", "Concierge"],
          securityClearance: "Platinum",
          emergencyContact: "+1-XXX-XXXX",
          specialRequirements: "No photos, discrete arrival/departure"
        },
        {
          id: "client-002", 
          firstName: "Isabella",
          lastName: "Von Habsburg",
          email: "i.habsburg@royal.at",
          membershipTier: "VIP",
          location: "Miami",
          joinDate: "2023-01-08",
          totalBookings: 62,
          lifetimeValue: 420000,
          preferredServices: ["Transportation", "Security", "Concierge"],
          securityClearance: "Diamond",
          emergencyContact: "+43-XXX-XXXX",
          specialRequirements: "Royal protocol, multi-language staff"
        },
        {
          id: "client-003",
          firstName: "James",
          lastName: "Morrison",
          email: "j.morrison@tech.com",
          membershipTier: "Premium",
          location: "Los Angeles",
          joinDate: "2023-06-20",
          totalBookings: 23,
          lifetimeValue: 95000,
          preferredServices: ["Transportation", "Concierge"],
          securityClearance: "Gold",
          emergencyContact: "+1-XXX-XXXX",
          specialRequirements: "Tech-enabled vehicles, privacy screens"
        }
      ],
      
      serviceProviders: {
        individuals: [
          {
            id: "sp-ind-001",
            type: "individual",
            category: "Executive Driver",
            firstName: "Marcus",
            lastName: "Wellington",
            email: "m.wellington@yoluxgo.com",
            location: "New York",
            certifications: ["Defensive Driving", "Executive Protection Basic", "First Aid"],
            rating: 4.9,
            experience: "12 years",
            languages: ["English", "French"],
            availability: "Full-time",
            vehicleTypes: ["Luxury Sedan", "SUV", "Limousine"],
            specializations: ["Celebrity Transport", "Diplomatic Services"],
            backgroundCheck: "Cleared",
            insurance: "Active - $2M Coverage"
          },
          {
            id: "sp-ind-002",
            type: "individual", 
            category: "Close Protection Guard",
            firstName: "Elena",
            lastName: "Volkov",
            email: "e.volkov@yoluxgo.com",
            location: "Miami",
            certifications: ["Executive Protection", "Firearms", "Medical Emergency", "Counter-Surveillance"],
            rating: 4.8,
            experience: "8 years",
            languages: ["English", "Russian", "Spanish"],
            availability: "Full-time",
            specializations: ["VIP Protection", "Residential Security", "Event Security"],
            clearanceLevel: "Government",
            backgroundCheck: "Cleared",
            insurance: "Active - $5M Coverage"
          }
        ],
        
        companies: [
          {
            id: "sp-comp-001",
            type: "company",
            category: "Vehicle Provider",
            companyName: "Manhattan Elite Motors",
            contactPerson: "Robert Chen",
            email: "operations@manhattanelite.com",
            location: "New York",
            businessType: "Luxury Vehicle Fleet",
            fleetSize: 45,
            vehicleTypes: ["Rolls Royce", "Bentley", "Mercedes S-Class", "BMW 7 Series"],
            services: ["Chauffeur Service", "Airport Transfers", "Event Transportation"],
            rating: 4.7,
            yearsInBusiness: 15,
            certifications: ["DOT Licensed", "Commercial Insurance", "Background Checked Drivers"],
            coverage: "24/7 Operations",
            specialFeatures: ["Armored Vehicles Available", "Multi-language Drivers"]
          },
          {
            id: "sp-comp-002",
            type: "company",
            category: "Security Firm",
            companyName: "Apex Protection Services",
            contactPerson: "Sarah Mitchell",
            email: "contracts@apexprotection.com", 
            location: "Los Angeles",
            businessType: "Executive Protection Agency",
            teamSize: 28,
            services: ["Executive Protection", "Residential Security", "Event Security", "Threat Assessment"],
            rating: 4.9,
            yearsInBusiness: 10,
            certifications: ["State Licensed", "Government Contracts", "International Operations"],
            coverage: "Global Operations",
            specializations: ["Celebrity Protection", "Corporate Security", "Diplomatic Services"]
          },
          {
            id: "sp-comp-003",
            type: "company",
            category: "Accommodation Provider",
            companyName: "Prestige Villa Collection",
            contactPerson: "Maria Santos",
            email: "reservations@prestigevillas.com",
            location: "Punta Cana",
            businessType: "Luxury Villa Rentals",
            propertyCount: 23,
            propertyTypes: ["Beachfront Villas", "Private Islands", "Mountain Retreats"],
            services: ["Private Chef", "Butler Service", "Security", "Transportation"],
            rating: 4.8,
            yearsInBusiness: 8,
            certifications: ["Tourism Board Certified", "Security Cleared", "Staff Background Checked"],
            coverage: "Caribbean Region",
            specialFeatures: ["Helicopter Pad", "Private Beach Access", "Medical Facilities"]
          },
          
          // LA ROMANA - CASA DE CAMPO SERVICE PROVIDERS
          {
            id: "sp-comp-004",
            type: "company",
            category: "Accommodation Provider",
            companyName: "Casa de Campo Elite Villas",
            contactPerson: "Antonio Rivera",
            email: "villas@casadecampoelite.com",
            location: "La Romana",
            businessType: "Luxury Villa & Resort Services",
            propertyCount: 18,
            propertyTypes: ["Oceanfront Villas", "Golf Course Estates", "Marina Residences", "Private Islands"],
            services: ["Private Chef", "Butler Service", "Golf Cart Fleet", "Marina Access", "Spa Services"],
            rating: 4.9,
            yearsInBusiness: 12,
            certifications: ["Casa de Campo Certified", "Dominican Tourism Board", "International Hospitality Standards"],
            coverage: "La Romana - Casa de Campo Resort",
            specialFeatures: ["Private Golf Course Access", "Marina Slips", "Helicopter Landing", "Beach Club Privileges"]
          },
          {
            id: "sp-comp-005",
            type: "company",
            category: "Vehicle Provider",
            companyName: "Caribbean Luxury Motors",
            contactPerson: "Rafael Santana",
            email: "fleet@caribbeanluxury.com",
            location: "La Romana",
            businessType: "Luxury Vehicle Fleet & Yacht Charter",
            fleetSize: 32,
            vehicleTypes: ["Rolls Royce Cullinan", "Bentley Bentayga", "Mercedes G-Wagon", "Range Rover SVAutobiography"],
            services: ["Chauffeur Service", "Airport Transfers", "Resort Transportation", "Yacht Charter"],
            rating: 4.8,
            yearsInBusiness: 9,
            certifications: ["Dominican Transport Authority", "Marina Licensed", "Commercial Insurance"],
            coverage: "Dominican Republic - Caribbean",
            specialFeatures: ["Amphibious Vehicles", "Golf Cart Fleet", "Yacht Fleet (8 vessels)", "Helicopter Partnership"]
          },
          {
            id: "sp-comp-006",
            type: "company",
            category: "Security Firm",
            companyName: "Dominican Elite Protection",
            contactPerson: "Eduardo Morales",
            email: "operations@dominicanelite.com",
            location: "La Romana",
            businessType: "Executive Protection & Resort Security",
            teamSize: 24,
            services: ["Executive Protection", "Villa Security", "Yacht Protection", "Event Security", "Marina Patrol"],
            rating: 4.9,
            yearsInBusiness: 11,
            certifications: ["Dominican Security License", "International Maritime Security", "Resort Security Certified"],
            coverage: "Caribbean Region",
            specializations: ["Resort Security", "Maritime Protection", "VIP Escort Services", "Cultural Event Security"]
          },
          {
            id: "sp-comp-007",
            type: "company",
            category: "Concierge Company",
            companyName: "Casa de Campo Concierge Collective",
            contactPerson: "Sofia Mendez",
            email: "concierge@casaconcierge.com",
            location: "La Romana",
            businessType: "Luxury Lifestyle & Experience Curation",
            teamSize: 16,
            services: ["Personal Shopping", "Event Planning", "Cultural Tours", "Spa Coordination", "Golf Services"],
            rating: 4.9,
            yearsInBusiness: 8,
            certifications: ["Concierge Professional Certification", "Cultural Guide License", "Event Planning Certified"],
            coverage: "Dominican Republic",
            specializations: ["Dominican Culture", "Golf Experiences", "Spa & Wellness", "Marina Activities", "Private Shopping"]
          },
          {
            id: "sp-comp-008",
            type: "company",
            category: "Specialty Service Provider",
            companyName: "Caribbean Wellness Retreat",
            contactPerson: "Valentina Cruz",
            email: "wellness@caribbeanretreat.com",
            location: "La Romana",
            businessType: "Luxury Spa & Wellness Services",
            teamSize: 20,
            services: ["Private Spa Services", "Wellness Coaching", "Medical Spa", "Fitness Training", "Nutrition Consultation"],
            rating: 4.8,
            yearsInBusiness: 6,
            certifications: ["International Spa Certification", "Medical Wellness License", "Fitness Professional Certified"],
            coverage: "Casa de Campo Resort",
            specializations: ["Tropical Wellness", "Medical Spa Services", "Couples Retreats", "Detox Programs", "Beauty Treatments"]
          }
        ]
      },
      
      regionalPartners: [
        {
          id: "rp-001",
          firstName: "Victoria",
          lastName: "Sterling",
          email: "v.sterling@yoluxgo-ny.com",
          region: "New York",
          title: "Regional Director - Northeast",
          joinDate: "2022-11-01",
          managedProviders: 34,
          clientsInRegion: 89,
          monthlyRevenue: 485000,
          languages: ["English", "French", "Italian"],
          expertise: ["Financial District Operations", "Celebrity Management", "Corporate Events"],
          certifications: ["Regional Management", "Security Protocols", "Diplomatic Relations"],
          performanceRating: 4.9,
          territoryExpansion: ["Connecticut", "New Jersey"]
        },
        {
          id: "rp-002",
          firstName: "Carlos",
          lastName: "Mendoza", 
          email: "c.mendoza@yoluxgo-miami.com",
          region: "Miami",
          title: "Regional Director - Southeast",
          joinDate: "2023-01-15",
          managedProviders: 28,
          clientsInRegion: 67,
          monthlyRevenue: 392000,
          languages: ["English", "Spanish", "Portuguese"],
          expertise: ["Yacht Services", "Resort Partnerships", "International Clients"],
          certifications: ["Marine Operations", "Resort Management", "International Protocol"],
          performanceRating: 4.7,
          territoryExpansion: ["Fort Lauderdale", "Key West"]
        },
        {
          id: "rp-003",
          firstName: "Alessandro",
          lastName: "Romano",
          email: "a.romano@yoluxgo-marbella.com", 
          region: "Malaga-Marbella",
          title: "Regional Director - Europe",
          joinDate: "2023-04-01",
          managedProviders: 19,
          clientsInRegion: 41,
          monthlyRevenue: 267000,
          languages: ["English", "Spanish", "French", "Italian"],
          expertise: ["European Luxury Standards", "Yacht Charters", "Private Aviation"],
          certifications: ["EU Operations", "Luxury Hospitality", "International Security"],
          performanceRating: 4.8,
          territoryExpansion: ["Monaco", "Saint-Tropez"]
        },
        {
          id: "rp-004",
          firstName: "Sofia",
          lastName: "Mendez",
          email: "s.mendez@yoluxgo-laromana.com",
          region: "La Romana",
          title: "Regional Director - Caribbean",
          joinDate: "2023-06-15",
          managedProviders: 22,
          clientsInRegion: 67,
          monthlyRevenue: 356000,
          languages: ["Spanish", "English", "French", "Portuguese"],
          expertise: ["Caribbean Resort Operations", "Dominican Culture", "Marine Services", "Golf & Wellness"],
          certifications: ["Caribbean Tourism Board", "Resort Management", "Marine Operations", "Cultural Liaison"],
          performanceRating: 4.9,
          territoryExpansion: ["Punta Cana Extension", "Santo Domingo", "Samana Peninsula"]
        }
      ],
      
      admins: [
        {
          id: "admin-001",
          firstName: "Celso",
          lastName: "Alvarado",
          email: "calvarado@nebusis.com",
          role: "Master Admin",
          title: "Founder & CEO",
          joinDate: "2022-01-01",
          permissions: "Full System Access",
          lastLogin: "2025-01-28T06:45:00Z",
          regionsOverseeing: ["All Regions"],
          specialAccess: ["Financial Data", "Personnel Records", "System Configuration"],
          certifications: ["Executive Leadership", "Security Protocols", "International Business"],
          emergencyContact: "+1-XXX-EXECUTIVE",
          securityClearance: "Founder Level"
        },
        {
          id: "admin-002",
          firstName: "Diana",
          lastName: "Chen",
          email: "d.chen@nebusis.com", 
          role: "Operations Director",
          title: "Chief Operating Officer",
          joinDate: "2022-03-15",
          permissions: "Operations & Analytics",
          lastLogin: "2025-01-28T07:12:00Z",
          regionsOverseeing: ["North America", "Europe"],
          specialAccess: ["Business Intelligence", "Regional Analytics", "Provider Management"],
          certifications: ["Operations Management", "Data Analytics", "Quality Assurance"],
          emergencyContact: "+1-XXX-OPERATIONS",
          securityClearance: "Executive Level"
        }
      ]
    };

    res.json(mockUsers);
  });

  // Test User Accounts - All Types with Login Credentials
  app.get("/api/admin/test-accounts", async (req, res) => {
    const testAccounts = {
      clients: [
        {
          email: "alexander.rothschild@mockylg.com",
          password: "admin123",
          userType: "client",
          profile: {
            id: "client-001",
            firstName: "Alexander",
            lastName: "Rothschild",
            membershipTier: "VIP",
            location: "New York",
            securityClearance: "Platinum"
          }
        },
        {
          email: "isabella.habsburg@mockylg.com", 
          password: "admin123",
          userType: "client",
          profile: {
            id: "client-002",
            firstName: "Isabella",
            lastName: "Von Habsburg",
            membershipTier: "VIP",
            location: "Miami",
            securityClearance: "Diamond"
          }
        },
        {
          email: "james.morrison@mockylg.com",
          password: "admin123",
          userType: "client", 
          profile: {
            id: "client-003",
            firstName: "James",
            lastName: "Morrison",
            membershipTier: "Premium",
            location: "Los Angeles",
            securityClearance: "Gold"
          }
        }
      ],

      serviceProviders: {
        individuals: [
          {
            email: "marcus.wellington@mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "individual",
            profile: {
              id: "sp-ind-001",
              category: "Executive Driver",
              firstName: "Marcus",
              lastName: "Wellington",
              location: "New York",
              rating: 4.9,
              experience: "12 years"
            }
          },
          {
            email: "elena.volkov@mockylg.com",
            password: "admin123", 
            userType: "service_provider",
            subType: "individual",
            profile: {
              id: "sp-ind-002",
              category: "Close Protection Guard",
              firstName: "Elena",
              lastName: "Volkov",
              location: "Miami",
              rating: 4.8,
              clearanceLevel: "Government"
            }
          },
          {
            email: "sophia.martinez@mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "individual", 
            profile: {
              id: "sp-ind-003",
              category: "Elite Concierge",
              firstName: "Sophia",
              lastName: "Martinez",
              location: "Los Angeles",
              rating: 4.9,
              languages: ["English", "Spanish", "French"]
            }
          },
          {
            email: "david.blackwood@mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "individual",
            profile: {
              id: "sp-ind-004", 
              category: "Private Chef",
              firstName: "David",
              lastName: "Blackwood",
              location: "New York",
              rating: 4.7,
              specializations: ["Michelin Star Cuisine", "Dietary Restrictions"]
            }
          },
          {
            email: "dr.rachel.stone@mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "individual",
            profile: {
              id: "sp-ind-005",
              category: "Medical Personnel", 
              firstName: "Dr. Rachel",
              lastName: "Stone",
              location: "Miami",
              rating: 5.0,
              certifications: ["Emergency Medicine", "Trauma Surgery", "Aviation Medicine"]
            }
          }
        ],

        companies: [
          {
            email: "operations@manhattan-elite.mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "company",
            profile: {
              id: "sp-comp-001",
              category: "Vehicle Provider",
              companyName: "Manhattan Elite Motors",
              contactPerson: "Robert Chen",
              location: "New York",
              businessType: "Luxury Vehicle Fleet",
              fleetSize: 45,
              rating: 4.7
            }
          },
          {
            email: "contracts@apex-protection.mockylg.com",
            password: "admin123",
            userType: "service_provider", 
            subType: "company",
            profile: {
              id: "sp-comp-002",
              category: "Security Firm",
              companyName: "Apex Protection Services",
              contactPerson: "Sarah Mitchell",
              location: "Los Angeles",
              teamSize: 28,
              rating: 4.9
            }
          },
          {
            email: "reservations@prestige-villas.mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "company",
            profile: {
              id: "sp-comp-003",
              category: "Accommodation Provider",
              companyName: "Prestige Villa Collection",
              contactPerson: "Maria Santos",
              location: "Punta Cana", 
              propertyCount: 23,
              rating: 4.8
            }
          },
          {
            email: "charter@skyline-aviation.mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "company",
            profile: {
              id: "sp-comp-004",
              category: "Private Aviation",
              companyName: "Skyline Aviation Services",
              contactPerson: "Captain Mike Torres",
              location: "Miami",
              fleetSize: 12,
              aircraftTypes: ["Light Jets", "Mid-size Jets", "Heavy Jets"],
              rating: 4.9
            }
          },
          {
            email: "events@elite-concierge.mockylg.com",
            password: "admin123",
            userType: "service_provider",
            subType: "company",
            profile: {
              id: "sp-comp-005",
              category: "Concierge Company",
              companyName: "Elite Concierge Solutions",
              contactPerson: "Amanda Foster",
              location: "Malaga-Marbella",
              teamSize: 15,
              services: ["Event Planning", "Travel Coordination", "Personal Shopping"],
              rating: 4.6
            }
          }
        ]
      },

      regionalPartners: [
        {
          email: "victoria.sterling@mockylg.com",
          password: "admin123",
          userType: "regional_partner",
          profile: {
            id: "rp-001",
            firstName: "Victoria",
            lastName: "Sterling",
            region: "New York",
            title: "Regional Director - Northeast",
            managedProviders: 34,
            clientsInRegion: 89,
            performanceRating: 4.9
          }
        },
        {
          email: "carlos.mendoza@mockylg.com",
          password: "admin123",
          userType: "regional_partner",
          profile: {
            id: "rp-002",
            firstName: "Carlos", 
            lastName: "Mendoza",
            region: "Miami",
            title: "Regional Director - Southeast",
            managedProviders: 28,
            clientsInRegion: 67,
            performanceRating: 4.7
          }
        },
        {
          email: "alessandro.romano@mockylg.com",
          password: "admin123",
          userType: "regional_partner",
          profile: {
            id: "rp-003",
            firstName: "Alessandro",
            lastName: "Romano",
            region: "Malaga-Marbella",
            title: "Regional Director - Europe",
            managedProviders: 19,
            clientsInRegion: 41,
            performanceRating: 4.8
          }
        },
        {
          email: "jennifer.kim@mockylg.com",
          password: "admin123",
          userType: "regional_partner",
          profile: {
            id: "rp-004",
            firstName: "Jennifer",
            lastName: "Kim",
            region: "Los Angeles",
            title: "Regional Director - West Coast",
            managedProviders: 31,
            clientsInRegion: 52,
            performanceRating: 4.8
          }
        }
      ],

      admins: [
        {
          email: "calvarado@mockylg.com",
          password: "admin123",
          userType: "admin", 
          profile: {
            id: "admin-001",
            firstName: "Celso",
            lastName: "Alvarado",
            role: "Master Admin",
            title: "Founder & CEO",
            permissions: "Full System Access",
            securityClearance: "Founder Level"
          }
        },
        {
          email: "diana.chen@mockylg.com",
          password: "admin123",
          userType: "admin",
          profile: {
            id: "admin-002",
            firstName: "Diana",
            lastName: "Chen",
            role: "Operations Director",
            title: "Chief Operating Officer", 
            permissions: "Operations & Analytics",
            securityClearance: "Executive Level"
          }
        },
        {
          email: "tech.admin@mockylg.com",
          password: "admin123",
          userType: "admin",
          profile: {
            id: "admin-003",
            firstName: "Alex",
            lastName: "Rodriguez",
            role: "Technical Director",
            title: "Chief Technology Officer",
            permissions: "System Architecture & Security",
            securityClearance: "Technical Level"
          }
        }
      ],

      investors: [
        {
          email: "investor.demo@mockylg.com",
          password: "investor123",
          userType: "investor",
          profile: {
            id: "inv-001",
            firstName: "Victoria",
            lastName: "Sterling",
            investmentFirm: "Sterling Capital Partners",
            title: "Managing Partner",
            investmentFocus: "Technology & Luxury Services",
            accessLevel: "Business Plan & Financials"
          }
        },
        {
          email: "john.blackstone@mockylg.com",
          password: "investor123",
          userType: "investor",
          profile: {
            id: "inv-002",
            firstName: "John",
            lastName: "Blackstone",
            investmentFirm: "Blackstone Ventures",
            title: "Senior Partner",
            investmentFocus: "Security & Transportation",
            accessLevel: "Business Plan & Metrics"
          }
        }
      ]
    };

    res.json(testAccounts);
  });

  // Business Plan API Endpoints for Investors
  app.get("/api/investor/business-plan", async (req, res) => {
    // Verify investor access (this would normally check authentication)
    const businessPlan = {
      executiveSummary: {
        overview: "YoLuxGo™ is a premium global platform that connects discerning clients with elite luxury service providers across transportation, security, and concierge services. Operating in strategic pilot locations including NYC, Miami, Los Angeles, Punta Cana, Malaga-Marbella, and La Romana - Casa de Campo, we serve celebrities, executives, royals, diplomats, and billionaire families.",
        vision: "To become the world's premier platform for discreet luxury services, combining cutting-edge security technology with unparalleled white-glove service delivery.",
        mission: "To provide discreet, secure, and luxurious experiences that exceed the expectations of the world's most demanding clientele through comprehensive vetting procedures and military-grade security protocols.",
        valueProp: "The core value proposition lies in our elevated user experience and emphasis on discretion, safety, and customization for high-net-worth individuals with global reach and verified luxury service providers."
      },
      investmentOffer: {
        investmentRequired: "$2.5 million USD",
        equityOffered: "20% of company shares",
        postMoneyValuation: "$12.5 million USD",
        preMoneyValuation: "$10 million USD",
        founderRetainedEquity: "80%",
        valuationRationale: [
          "Strength of founder's background and proven track record",
          "Sophistication and uniqueness of the business model",
          "Advanced state of product and operational planning",
          "Scalable model ready for global deployment in luxury service markets"
        ]
      },
      investorBenefits: {
        boardSeat: "One non-controlling board advisory position",
        shareType: "Preferred shares with liquidation preference (1x non-participating preferred)",
        exitParticipation: "Participate in any exit event according to equity share",
        antiDilution: "Pro-rata rights in future funding rounds to maintain percentage ownership"
      },
      projections: {
        year1: { revenue: 1500000, netResult: -900000, status: "Investment Phase", cumulativeReturn: 0 },
        year2: { revenue: 5500000, netResult: 1200000, status: "Growth Phase", cumulativeReturn: 240000 },
        year3: { revenue: 14000000, netResult: 4100000, status: "Expansion Phase", cumulativeReturn: 820000 },
        year4: { revenue: 28000000, netResult: 9600000, status: "Scale Phase", cumulativeReturn: 1920000 },
        year5: { revenue: 55000000, netResult: 18300000, status: "Market Leader", cumulativeReturn: 3660000 }
      },
      expectedReturns: {
        roiAtYear5: "2.5x–3x return on investment (excluding exit valuation)",
        investorShare: "20%",
        projectedAnnualReturns: "Substantial returns beginning Year 2 with exponential growth trajectory"
      },
      exitStrategy: {
        timeline: "5–7 years",
        targetValuation: "$75–150 million via acquisition or IPO",
        investorReturnAtExit: "$15–30 million (20% of exit valuation)",
        options: [
          "Strategic acquisition by luxury conglomerate",
          "IPO for global expansion",
          "Private equity acquisition",
          "Merger with complementary luxury platform"
        ]
      },
      governance: {
        founderControl: "Founder retains majority voting control",
        boardStructure: "Board established with select investor representation and advisory roles",
        protections: "Certain strategic decisions (mergers, dilution beyond 25%) require supermajority board approval"
      },
      funding: {
        required: 2500000,
        useOfFunds: {
          productDevelopment: 600000,
          marketingAcquisition: 500000,
          legalCompliance: 300000,
          salariesOperations: 600000,
          contingencyReserve: 500000
        }
      },
      marketOpportunity: {
        globalMarketValue: "$350 billion global luxury services market",
        growthRate: "12% annual growth in luxury transportation and security services",
        targetSegments: [
          "Ultra-high-net-worth individuals and families",
          "Corporate executives and delegations", 
          "Entertainment professionals and celebrities",
          "Security-conscious diplomatic and government travelers",
          "Royal families and high-profile dignitaries"
        ]
      },
      revenueModel: {
        transactionFees: "20% platform fee per transaction",
        listingFees: "Listing fees for providers",
        subscriptions: "Premium client and provider subscriptions",
        cancellationFees: "Percentage-based cancellation structure (5-100% based on timing)",
        disputeFees: "$250 per incident"
      },
      locations: [
        "New York City", "Miami", "Los Angeles", 
        "Punta Cana", "La Romana - Casa de Campo", "Málaga-Marbella"
      ]
    };
    
    res.json(businessPlan);
  });

  app.get("/api/investor/founder-profile", async (req, res) => {
    const founderProfile = {
      name: "Dr. Celso Alvarado",
      title: "Founder & CEO",
      companies: ["YoLuxGo™", "Nebusis® Cloud Services", "QSI Global Ventures"],
      education: {
        phd: "Industrial Engineering and Management Systems",
        masters: "International Business",
        specialization: "AI, Blockchain, and IoT applications"
      },
      experience: {
        countries: "Lived in 7 countries, conducted business in 50+",
        expertise: "International expert in management systems and security standards",
        clients: ["Google", "PepsiCo", "Intel", "Multiple U.S. Embassies"],
        government: "Represents the United States on international ISO committees"
      },
      credentials: {
        certifications: ["ISO Committee Member", "Security Auditor", "Management Systems Expert"],
        teaching: "Professor of Innovation and Entrepreneurship at NYU",
        standards: "Contributor to global ISO standards including AI governance and security operations"
      },
      philosophy: "YoLuxGo™ is the culmination of his lifelong expertise: a secure, luxury service network designed for the world's most discerning travelers, built with the rigor of an international security auditor and the vision of a global innovator.",
      photoUrl: "/api/founder-photo"
    };
    
    res.json(founderProfile);
  });

  // Endpoint to serve founder photo
  app.get("/api/founder-photo", (req, res) => {
    // In production, this would serve the actual photo file
    res.redirect("https://via.placeholder.com/400x400?text=Dr.+Celso+Alvarado");
  });

  // Business Plan modification endpoint (for Celso's admin access)
  app.put("/api/investor/business-plan", async (req, res) => {
    // This would normally verify admin authentication
    const updatedPlan = req.body;
    
    // In production, this would save to database
    res.json({ 
      success: true, 
      message: "Business plan updated successfully",
      updatedAt: new Date().toISOString()
    });
  });

  // Admin dashboard analytics endpoint
  app.get("/api/admin/analytics/dashboard", authenticateAdmin, async (req: any, res) => {
    const mockAnalytics = {
      revenue: {
        monthly: 2847650,
        quarterly: 8542950,
        yearly: 34171800,
        growth: {
          monthOverMonth: 18.5,
          quarterOverQuarter: 24.3,
          yearOverYear: 42.7
        }
      },
      clients: {
        total: 1247,
        active: 892,
        premium: 312,
        vip: 89,
        newThisMonth: 45,
        churnRate: 2.1,
        avgLifetimeValue: 187500,
        regionBreakdown: {
          "New York": 387,
          "Miami": 298,
          "Los Angeles": 245,
          "Malaga-Marbella": 178,
          "Punta Cana": 89,
          "La Romana": 50
        }
      },
      services: {
        transportation: { bookings: 3247, revenue: 15678900, avgPrice: 4830, satisfaction: 4.8 },
        security: { assignments: 1834, revenue: 12489750, avgPrice: 6810, satisfaction: 4.9 },
        concierge: { requests: 2956, revenue: 6003150, avgPrice: 2030, satisfaction: 4.7 }
      },
      operations: {
        personnelUtilization: 87.3,
        vehicleUtilization: 74.8,
        responseTime: 4.2,
        incidentRate: 0.03,
        uptime: 99.97
      },
      regions: [
        { name: "New York", revenue: 12450000, clients: 387, growth: 22.1, margin: 34.5 },
        { name: "Miami", revenue: 9870000, clients: 298, growth: 18.7, margin: 31.2 },
        { name: "Los Angeles", revenue: 8340000, clients: 245, growth: 15.3, margin: 29.8 },
        { name: "Malaga-Marbella", revenue: 2890000, clients: 178, growth: 28.4, margin: 38.7 },
        { name: "Punta Cana", revenue: 421800, clients: 89, growth: 31.2, margin: 42.1 },
        { name: "La Romana", revenue: 199000, clients: 50, growth: 35.8, margin: 45.3 }
      ]
    };
    res.json(mockAnalytics);
  });

  // Admin suppliers endpoint
  app.get("/api/admin/suppliers", authenticateAdmin, async (req: any, res) => {
    const mockSuppliers = [
      { id: "supp-001", name: "Manhattan Elite Motors", category: "Vehicle Provider", status: "active", rating: 4.9 },
      { id: "supp-002", name: "Apex Protection Services", category: "Security Firm", status: "active", rating: 4.8 },
      { id: "supp-003", name: "Prestige Villa Collection", category: "Accommodation", status: "active", rating: 4.7 },
      { id: "supp-004", name: "Skyline Aviation Services", category: "Private Aviation", status: "active", rating: 4.9 },
      { id: "supp-005", name: "Elite Concierge Solutions", category: "Concierge Company", status: "active", rating: 4.6 }
    ];
    res.json(mockSuppliers);
  });

  // Admin financial overview endpoint
  app.get("/api/admin/financial/overview", authenticateAdmin, async (req: any, res) => {
    const mockFinancials = {
      totalRevenue: 34171800,
      netProfit: 10251540,
      profitMargin: 30.0,
      operatingExpenses: 23920260,
      cashFlow: 8742300,
      accounts: {
        receivable: 4230000,
        payable: 1890000,
        cash: 12450000
      },
      monthlyTrend: [
        { month: "Jan", revenue: 2680000, profit: 804000 },
        { month: "Feb", revenue: 2720000, profit: 816000 },
        { month: "Mar", revenue: 2850000, profit: 855000 },
        { month: "Apr", revenue: 2920000, profit: 876000 },
        { month: "May", revenue: 3100000, profit: 930000 },
        { month: "Jun", revenue: 3250000, profit: 975000 }
      ]
    };
    res.json(mockFinancials);
  });

  // Admin trips endpoint with pagination and filtering
  app.get("/api/admin/trips", authenticateAdmin, async (req: any, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const city = req.query.city || 'all';
    const search = req.query.search || '';

    // Generate comprehensive mock trips data
    const allTrips = [
      // New York Trips
      { id: "TRP-NYC-001", clientName: "Alexander Rothschild", clientEmail: "alexander.rothschild@mockylg.com", city: "New York", serviceType: "transportation", date: "2025-01-28", time: "14:30", status: "completed", amount: 850 },
      { id: "TRP-NYC-002", clientName: "Victoria Sterling", clientEmail: "victoria.sterling@mockylg.com", city: "New York", serviceType: "security", date: "2025-01-28", time: "09:00", status: "active", amount: 2400 },
      { id: "TRP-NYC-003", clientName: "James Wellington", clientEmail: "james.wellington@mockylg.com", city: "New York", serviceType: "concierge", date: "2025-01-27", time: "16:45", status: "completed", amount: 1200 },
      { id: "TRP-NYC-004", clientName: "Isabella Montague", clientEmail: "isabella.montague@mockylg.com", city: "New York", serviceType: "transportation", date: "2025-01-27", time: "11:15", status: "completed", amount: 920 },
      { id: "TRP-NYC-005", clientName: "Sebastian Vale", clientEmail: "sebastian.vale@mockylg.com", city: "New York", serviceType: "security", date: "2025-01-26", time: "19:30", status: "completed", amount: 3200 },
      
      // Miami Trips
      { id: "TRP-MIA-001", clientName: "Adriana Delacroix", clientEmail: "adriana.delacroix@mockylg.com", city: "Miami", serviceType: "transportation", date: "2025-01-28", time: "13:20", status: "active", amount: 750 },
      { id: "TRP-MIA-002", clientName: "Marcus Blackwood", clientEmail: "marcus.blackwood@mockylg.com", city: "Miami", serviceType: "concierge", date: "2025-01-28", time: "10:45", status: "pending", amount: 1800 },
      { id: "TRP-MIA-003", clientName: "Elena Vasquez", clientEmail: "elena.vasquez@mockylg.com", city: "Miami", serviceType: "security", date: "2025-01-27", time: "15:00", status: "completed", amount: 2800 },
      { id: "TRP-MIA-004", clientName: "Theodore Cross", clientEmail: "theodore.cross@mockylg.com", city: "Miami", serviceType: "transportation", date: "2025-01-26", time: "08:30", status: "completed", amount: 680 },
      { id: "TRP-MIA-005", clientName: "Sophia Beaumont", clientEmail: "sophia.beaumont@mockylg.com", city: "Miami", serviceType: "concierge", date: "2025-01-25", time: "20:15", status: "completed", amount: 2200 },
      
      // Los Angeles Trips
      { id: "TRP-LA-001", clientName: "David Ashford", clientEmail: "david.ashford@mockylg.com", city: "Los Angeles", serviceType: "transportation", date: "2025-01-28", time: "17:45", status: "pending", amount: 950 },
      { id: "TRP-LA-002", clientName: "Natasha Volkov", clientEmail: "natasha.volkov@mockylg.com", city: "Los Angeles", serviceType: "security", date: "2025-01-27", time: "12:30", status: "active", amount: 4200 },
      { id: "TRP-LA-003", clientName: "Ricardo Silva", clientEmail: "ricardo.silva@mockylg.com", city: "Los Angeles", serviceType: "concierge", date: "2025-01-27", time: "14:20", status: "completed", amount: 1650 },
      { id: "TRP-LA-004", clientName: "Catherine Livingston", clientEmail: "catherine.livingston@mockylg.com", city: "Los Angeles", serviceType: "transportation", date: "2025-01-26", time: "09:15", status: "completed", amount: 1120 },
      { id: "TRP-LA-005", clientName: "Antonio Rosetti", clientEmail: "antonio.rosetti@mockylg.com", city: "Los Angeles", serviceType: "security", date: "2025-01-25", time: "18:00", status: "completed", amount: 3800 },
      
      // Malaga-Marbella Trips
      { id: "TRP-MAR-001", clientName: "François Dubois", clientEmail: "francois.dubois@mockylg.com", city: "Malaga-Marbella", serviceType: "concierge", date: "2025-01-28", time: "11:30", status: "active", amount: 2100 },
      { id: "TRP-MAR-002", clientName: "Elena Petrov", clientEmail: "elena.petrov@mockylg.com", city: "Malaga-Marbella", serviceType: "transportation", date: "2025-01-27", time: "16:15", status: "completed", amount: 1380 },
      { id: "TRP-MAR-003", clientName: "Wilhelm von Habsburg", clientEmail: "wilhelm.habsburg@mockylg.com", city: "Malaga-Marbella", serviceType: "security", date: "2025-01-26", time: "13:45", status: "completed", amount: 5200 },
      { id: "TRP-MAR-004", clientName: "Anastasia Kovalenko", clientEmail: "anastasia.kovalenko@mockylg.com", city: "Malaga-Marbella", serviceType: "concierge", date: "2025-01-25", time: "19:30", status: "completed", amount: 2750 },
      { id: "TRP-MAR-005", clientName: "Alessandro Romano", clientEmail: "alessandro.romano@mockylg.com", city: "Malaga-Marbella", serviceType: "transportation", date: "2025-01-24", time: "10:00", status: "completed", amount: 1580 },
      
      // Punta Cana Trips
      { id: "TRP-PC-001", clientName: "Isabella Cruz", clientEmail: "isabella.cruz@mockylg.com", city: "Punta Cana", serviceType: "transportation", date: "2025-01-28", time: "15:20", status: "pending", amount: 890 },
      { id: "TRP-PC-002", clientName: "Gabriel Santos", clientEmail: "gabriel.santos@mockylg.com", city: "Punta Cana", serviceType: "concierge", date: "2025-01-27", time: "12:00", status: "active", amount: 1950 },
      { id: "TRP-PC-003", clientName: "María Esperanza", clientEmail: "maria.esperanza@mockylg.com", city: "Punta Cana", serviceType: "security", date: "2025-01-26", time: "14:45", status: "completed", amount: 3100 },
      { id: "TRP-PC-004", clientName: "Eduardo Mendoza", clientEmail: "eduardo.mendoza@mockylg.com", city: "Punta Cana", serviceType: "transportation", date: "2025-01-25", time: "09:30", status: "completed", amount: 720 },
      { id: "TRP-PC-005", clientName: "Carmen Delgado", clientEmail: "carmen.delgado@mockylg.com", city: "Punta Cana", serviceType: "concierge", date: "2025-01-24", time: "17:15", status: "completed", amount: 1680 },
      
      // La Romana - Casa de Campo Trips
      { id: "TRP-LR-001", clientName: "Roberto Fernandez", clientEmail: "roberto.fernandez@mockylg.com", city: "La Romana", serviceType: "concierge", date: "2025-01-28", time: "11:45", status: "active", amount: 2250 },
      { id: "TRP-LR-002", clientName: "Valentina Torres", clientEmail: "valentina.torres@mockylg.com", city: "La Romana", serviceType: "transportation", date: "2025-01-27", time: "13:30", status: "completed", amount: 980 },
      { id: "TRP-LR-003", clientName: "Diego Ramirez", clientEmail: "diego.ramirez@mockylg.com", city: "La Romana", serviceType: "security", date: "2025-01-26", time: "16:00", status: "completed", amount: 3600 },
      { id: "TRP-LR-004", clientName: "Lucia Morales", clientEmail: "lucia.morales@mockylg.com", city: "La Romana", serviceType: "transportation", date: "2025-01-25", time: "08:45", status: "completed", amount: 850 },
      { id: "TRP-LR-005", clientName: "Carlos Herrera", clientEmail: "carlos.herrera@mockylg.com", city: "La Romana", serviceType: "concierge", date: "2025-01-24", time: "20:30", status: "completed", amount: 2100 }
    ];

    // Add more trips to reach 1000+ for demonstration
    const extendedTrips = [...allTrips];
    for (let i = 0; i < 20; i++) {
      allTrips.forEach((trip, index) => {
        extendedTrips.push({
          ...trip,
          id: `${trip.id}-${i}-${index}`,
          date: "2025-01-" + Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0'),
          amount: trip.amount + Math.floor(Math.random() * 500),
          status: ['completed', 'active', 'pending'][Math.floor(Math.random() * 3)] as any
        });
      });
    }

    // Filter by city
    let filteredTrips = city === 'all' ? extendedTrips : extendedTrips.filter(trip => trip.city === city);

    // Filter by search term
    if (search) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.clientName.toLowerCase().includes(search.toLowerCase()) ||
        trip.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
        trip.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filteredTrips.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

    res.json({
      trips: paginatedTrips,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  });

  // Stripe Payment Endpoints
  
  // Create Payment Intent with YoLuxGo™ fee structure
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const requestData = req.body;
      
      // If amount is provided directly (legacy support), use it
      if (requestData.amount && !requestData.service) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(requestData.amount * 100),
          currency: "usd",
          metadata: {
            platform: "YoLuxGo™",
            company: "Nebusis Cloud Services, LLC",
            ...requestData.metadata
          },
          description: requestData.description || "YoLuxGo™ Service",
          automatic_payment_methods: { enabled: true },
        });
        
        return res.json({ 
          clientSecret: paymentIntent.client_secret,
          amount: requestData.amount,
          paymentIntentId: paymentIntent.id
        });
      }
      
      // Calculate pricing and fees using YoLuxGo™ structure
      const paymentData = createPaymentIntent(requestData);
      const metadata = generatePaymentMetadata(requestData);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentData.amountCents,
        currency: "usd",
        metadata: metadata,
        description: `YoLuxGo™ ${requestData.service} service`,
        automatic_payment_methods: { enabled: true },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: paymentData.totalAmount,
        breakdown: paymentData.breakdown,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Transportation service payment
  app.post("/api/payments/transportation", async (req, res) => {
    try {
      const { 
        pickupLocation, 
        dropoffLocation, 
        serviceType, 
        vehicleType, 
        date, 
        time,
        passengers,
        specialRequests 
      } = req.body;
      
      // Calculate amount based on service type and vehicle
      let baseAmount = 150; // Base transportation fee
      
      const vehicleMultipliers: { [key: string]: number } = {
        "luxury-sedan": 1.0,
        "luxury-suv": 1.3,
        "executive-van": 1.6,
        "limousine": 2.0,
        "armored-vehicle": 3.0
      };
      
      const serviceMultipliers: { [key: string]: number } = {
        "airport-transfer": 1.0,
        "city-transport": 1.2,
        "event-transport": 1.5,
        "multi-day": 2.5
      };
      
      const amount = baseAmount * 
                    (vehicleMultipliers[vehicleType] || 1.0) * 
                    (serviceMultipliers[serviceType] || 1.0);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          service: "transportation",
          pickupLocation,
          dropoffLocation,
          vehicleType,
          serviceType,
          date,
          time,
          passengers: passengers?.toString() || "1"
        },
        description: `YoLuxGo™ Transportation Service - ${vehicleType} from ${pickupLocation} to ${dropoffLocation}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        breakdown: {
          baseAmount,
          vehicleMultiplier: vehicleMultipliers[vehicleType] || 1.0,
          serviceMultiplier: serviceMultipliers[serviceType] || 1.0,
          totalAmount: amount
        }
      });
    } catch (error: any) {
      console.error("Transportation payment error:", error);
      res.status(500).json({ 
        message: "Error creating transportation payment: " + error.message 
      });
    }
  });

  // Security service payment
  app.post("/api/payments/security", async (req, res) => {
    try {
      const { 
        serviceType, 
        location, 
        duration, 
        date, 
        time,
        teamSize,
        threatLevel,
        specialRequests 
      } = req.body;
      
      // Calculate amount based on security service type
      let baseAmount = 200; // Base security fee per hour
      
      const serviceMultipliers: { [key: string]: number } = {
        "executive-protection": 1.0,
        "residential-security": 0.8,
        "event-security": 1.2,
        "travel-security": 1.5
      };
      
      const threatMultipliers: { [key: string]: number } = {
        "low": 1.0,
        "medium": 1.3,
        "high": 1.8,
        "critical": 2.5
      };
      
      const durationHours = parseInt(duration) || 4;
      const teamMultiplier = parseInt(teamSize) || 1;
      
      const amount = baseAmount * 
                    durationHours * 
                    teamMultiplier *
                    (serviceMultipliers[serviceType] || 1.0) * 
                    (threatMultipliers[threatLevel] || 1.0);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          service: "security",
          serviceType,
          location,
          duration: duration?.toString(),
          date,
          time,
          teamSize: teamSize?.toString(),
          threatLevel
        },
        description: `YoLuxGo™ Security Service - ${serviceType} for ${duration} hours`,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        breakdown: {
          baseAmount,
          duration: durationHours,
          teamSize: teamMultiplier,
          serviceMultiplier: serviceMultipliers[serviceType] || 1.0,
          threatMultiplier: threatMultipliers[threatLevel] || 1.0,
          totalAmount: amount
        }
      });
    } catch (error: any) {
      console.error("Security payment error:", error);
      res.status(500).json({ 
        message: "Error creating security payment: " + error.message 
      });
    }
  });

  // Concierge service payment
  app.post("/api/payments/concierge", async (req, res) => {
    try {
      const { 
        serviceType, 
        complexity, 
        timeline, 
        location,
        budget,
        specialRequests 
      } = req.body;
      
      // Calculate amount based on concierge service type
      let baseAmount = 100; // Base concierge fee
      
      const serviceMultipliers: { [key: string]: number } = {
        "travel-planning": 1.0,
        "event-management": 1.5,
        "personal-shopping": 1.2,
        "business-services": 1.3,
        "lifestyle-management": 2.0
      };
      
      const complexityMultipliers: { [key: string]: number } = {
        "simple": 1.0,
        "moderate": 1.5,
        "complex": 2.0,
        "luxury": 3.0
      };
      
      const timelineMultipliers: { [key: string]: number } = {
        "flexible": 1.0,
        "standard": 1.2,
        "urgent": 1.8,
        "immediate": 2.5
      };
      
      const amount = baseAmount * 
                    (serviceMultipliers[serviceType] || 1.0) * 
                    (complexityMultipliers[complexity] || 1.0) *
                    (timelineMultipliers[timeline] || 1.0);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          service: "concierge",
          serviceType,
          complexity,
          timeline,
          location,
          budget: budget?.toString()
        },
        description: `YoLuxGo™ Concierge Service - ${serviceType}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        breakdown: {
          baseAmount,
          serviceMultiplier: serviceMultipliers[serviceType] || 1.0,
          complexityMultiplier: complexityMultipliers[complexity] || 1.0,
          timelineMultiplier: timelineMultipliers[timeline] || 1.0,
          totalAmount: amount
        }
      });
    } catch (error: any) {
      console.error("Concierge payment error:", error);
      res.status(500).json({ 
        message: "Error creating concierge payment: " + error.message 
      });
    }
  });

  // Multi-service booking payment
  app.post("/api/payments/multi-service", async (req, res) => {
    try {
      const { 
        services, 
        tripDetails,
        totalEstimate 
      } = req.body;
      
      // Calculate comprehensive trip amount
      let totalAmount = 0;
      const serviceBreakdown: any[] = [];
      
      // Process each selected service
      if (services.transportation) {
        const transportAmount = 200 * (services.transportation.days || 1);
        totalAmount += transportAmount;
        serviceBreakdown.push({
          service: "transportation",
          amount: transportAmount,
          details: services.transportation
        });
      }
      
      if (services.security) {
        const securityAmount = 300 * (services.security.days || 1);
        totalAmount += securityAmount;
        serviceBreakdown.push({
          service: "security",
          amount: securityAmount,
          details: services.security
        });
      }
      
      if (services.concierge) {
        const conciergeAmount = 150 * (services.concierge.tasks?.length || 1);
        totalAmount += conciergeAmount;
        serviceBreakdown.push({
          service: "concierge",
          amount: conciergeAmount,
          details: services.concierge
        });
      }
      
      // Apply package discount for multi-service bookings
      const packageDiscount = 0.1; // 10% discount for multi-service
      const discountAmount = totalAmount * packageDiscount;
      const finalAmount = totalAmount - discountAmount;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100),
        currency: "usd",
        metadata: {
          service: "multi-service",
          tripLocation: tripDetails?.destination || "Multiple",
          tripDuration: tripDetails?.duration || "TBD",
          serviceCount: serviceBreakdown.length.toString(),
          packageDiscount: (packageDiscount * 100).toString() + "%"
        },
        description: `YoLuxGo™ Complete Trip Package - ${serviceBreakdown.length} Services`,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: finalAmount,
        breakdown: {
          services: serviceBreakdown,
          subtotal: totalAmount,
          packageDiscount: discountAmount,
          discountPercentage: packageDiscount * 100,
          totalAmount: finalAmount
        }
      });
    } catch (error: any) {
      console.error("Multi-service payment error:", error);
      res.status(500).json({ 
        message: "Error creating multi-service payment: " + error.message 
      });
    }
  });

  // Payment success webhook (optional - for production use)
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      // For development, we'll skip signature verification
      // In production, you should verify the webhook signature
      if (process.env.NODE_ENV === 'production' && process.env.STRIPE_WEBHOOK_SECRET) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err: any) {
          console.log(`Webhook signature verification failed:`, err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      } else {
        // For development, parse the event directly
        event = req.body;
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          
          // Here you would update your database with the successful payment
          // For example: mark booking as confirmed, send confirmation email, etc.
          
          break;
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.log('Payment failed:', failedPayment.id);
          
          // Handle failed payment
          
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  // Investment Interest Form endpoint
  app.post("/api/investment-interest", async (req, res) => {
    try {
      const {
        fullName,
        entityName,
        country,
        email,
        phone,
        investmentRange,
        investmentStructure,
        dueDiligenceTimeline,
        agreesToNDA,
        requestsMeeting,
        digitalSignature
      } = req.body;

      // Mock investment interest submission
      const investmentInterest = {
        id: `INV-${Date.now()}`,
        fullName,
        entityName,
        country,
        email,
        phone,
        investmentRange,
        investmentStructure,
        dueDiligenceTimeline,
        agreesToNDA,
        requestsMeeting,
        digitalSignature,
        submissionDate: new Date().toISOString(),
        status: "pending",
        notes: "Investment interest submitted through business plan form"
      };

      // Store in global memory (in production, this would go to database)
      if (!global.investmentInterests) {
        global.investmentInterests = [];
      }
      global.investmentInterests.push(investmentInterest);

      console.log('Investment interest submitted:', {
        id: investmentInterest.id,
        investor: fullName,
        email,
        range: investmentRange,
        structure: investmentStructure
      });

      res.json({
        message: "Investment interest submitted successfully",
        interestId: investmentInterest.id,
        status: "pending",
        nextSteps: "Our team will contact you within 48 hours to discuss next steps and NDA execution."
      });
    } catch (error: any) {
      console.error("Investment interest submission error:", error);
      res.status(500).json({
        message: "Error submitting investment interest: " + error.message
      });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'new_message',
              data: data
            }));
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection_established',
      message: 'Connected to YoLuxGo™ secure messaging server'
    }));
  });

  return httpServer;
}
