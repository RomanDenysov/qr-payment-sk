import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  date,
  index,
  integer,
  pgSequence,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const createTable = pgTableCreator((name) => `sk_${name}`);

// Variable symbol sequence for generating unique payment identifiers
// Starts at 10000000 (8 digits) and can go up to 9999999999 (10 digits)
export const variableSymbolSequence = pgSequence('variable_symbol_seq', {
  startWith: 10000000, // Start with 8-digit numbers
  maxValue: 9999999999, // Max 10 digits (Slovak banking standard)
  cycle: false, // Don't cycle back to start when maxValue is reached
});

export const usersTable = createTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),

  // Simple user group for feature flag targeting
  userGroup: varchar('user_group', { length: 50 }).default('user'), // 'user', 'beta_tester', 'admin', 'vip'

  // 🆕 QR Limit System Fields
  monthlyQrLimit: integer('monthly_qr_limit').default(50).notNull(),
  qrCodesUsedThisMonth: integer('qr_codes_used_this_month')
    .default(0)
    .notNull(),
  topUpCount: integer('top_up_count').default(0).notNull(),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }), // null = free, 'starter' = paid
  limitResetDate: date('limit_reset_date').defaultNow().notNull(),
  totalSpentOnTopups: integer('total_spent_on_topups').default(0).notNull(), // in cents

  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessionsTable = createTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  activeOrganizationId: text('active_organization_id'),
});

export const accountsTable = createTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verificationsTable = createTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const organizationsTable = createTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
});

export const memberTable = createTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  role: text('role').default('member').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const invitationTable = createTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const apikeyTable = createTable('apikey', {
  id: text('id').primaryKey(),
  name: text('name'),
  start: text('start'),
  prefix: text('prefix'),
  key: text('key').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  refillInterval: integer('refill_interval'),
  refillAmount: integer('refill_amount'),
  lastRefillAt: timestamp('last_refill_at'),
  enabled: boolean('enabled').default(true),
  rateLimitEnabled: boolean('rate_limit_enabled').default(true),
  rateLimitTimeWindow: integer('rate_limit_time_window').default(86400000),
  rateLimitMax: integer('rate_limit_max').default(10),
  requestCount: integer('request_count'),
  remaining: integer('remaining'),
  lastRequest: timestamp('last_request'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  permissions: text('permissions'),
  metadata: text('metadata'),
});

export const rateLimitTable = createTable('rate_limit', {
  id: text('id').primaryKey(),
  key: text('key'),
  count: integer('count'),
  lastRequest: bigint('last_request', { mode: 'number' }),
});

// Optional business profiles - only created when users need business features
// This stores data that can't be stored in Better Auth (preferences, business settings, etc.)
export const businessProfilesTable = createTable(
  'business_profiles',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    businessName: varchar('business_name', { length: 200 }).notNull(),
    businessType: varchar('business_type', { length: 50 }), // 'individual', 'company', 'ngo'
    vatNumber: varchar('vat_number', { length: 20 }), // Slovak IČ DPH
    registrationNumber: varchar('registration_number', { length: 20 }), // Slovak IČO

    // Preferences that can't be stored in Better Auth
    defaultCurrency: varchar('default_currency', { length: 3 }).default('EUR'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('idx_business_profiles_user_id').on(table.userId)]
);

// User IBANs - reference Better Auth user ID
export const userIbansTable = createTable(
  'user_ibans',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    iban: varchar('iban', { length: 34 }).notNull(), // Slovak IBAN format
    bankName: varchar('bank_name', { length: 100 }), // e.g., "VÚB Banka", "Slovenská sporiteľňa"
    accountName: varchar('account_name', { length: 100 }), // e.g., "Business Account", "Personal"
    isDefault: boolean('is_default').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_user_ibans_user_id_active').on(table.userId, table.isActive),
    index('idx_user_ibans_user_id_default').on(table.userId, table.isDefault),
  ]
);

// Payment templates - reference Better Auth user ID
export const paymentTemplatesTable = createTable(
  'payment_templates',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    sortOrder: integer('sort_order').default(0).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    amount: integer('amount').notNull(), // Amount in cents (e.g. 2550 = €25.50)
    description: text('description'),
    userIbanId: uuid('user_iban_id').references(() => userIbansTable.id, {
      onDelete: 'restrict',
    }),
    color: varchar('color', { length: 20 }).default('#3b82f6'),
    icon: varchar('icon', { length: 50 }).default('payment'),
    usageCount: integer('usage_count').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_payment_templates_user_id_active').on(
      table.userId,
      table.isActive
    ),
    index('idx_payment_templates_usage_count').on(table.usageCount),
  ]
);

// QR generations - reference Better Auth user ID
export const qrGenerationsTable = createTable(
  'qr_generations',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id').references(() => usersTable.id, {
      onDelete: 'set null',
    }),
    templateId: uuid('template_id').references(() => paymentTemplatesTable.id, {
      onDelete: 'set null',
    }),
    templateName: varchar('template_name', { length: 100 }), // Preserved if template deleted
    amount: integer('amount').notNull(), // Amount in cents (e.g. 2550 = €25.50)
    variableSymbol: varchar('variable_symbol', { length: 10 })
      .unique()
      .notNull(), // Unique 1-10 digit identifier as string
    qrData: text('qr_data').notNull(), // Generated BySquare QR string
    iban: varchar('iban', { length: 34 }).notNull(),
    userIbanId: uuid('user_iban_id').references(() => userIbansTable.id, {
      onDelete: 'set null',
    }), // Reference to the IBAN used for this QR generation
    note: text('note'),
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_qr_generations_user_id_date').on(
      table.userId,
      table.generatedAt
    ),
    index('idx_qr_generations_variable_symbol').on(table.variableSymbol),
    index('idx_qr_generations_template_id').on(table.templateId),
    index('idx_qr_generations_user_iban').on(table.userIbanId),
  ]
);

// Analytics tables - reference Better Auth user ID
export const dailyUserStatsTable = createTable(
  'daily_user_stats',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    qrCodesGenerated: integer('qr_codes_generated').default(0).notNull(),
    templatesCreated: integer('templates_created').default(0).notNull(),
    templatesUsed: integer('templates_used').default(0).notNull(),
    revenue: integer('revenue').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_daily_user_stats_user_date').on(table.userId, table.date),
  ]
);

export const platformStatsTable = createTable(
  'platform_stats',
  {
    id: uuid().primaryKey().defaultRandom(),
    date: date('date').notNull().unique(),
    qrCodesGenerated: integer('qr_codes_generated').default(0).notNull(),
    templatesCreated: integer('templates_created').default(0).notNull(),
    templatesUsed: integer('templates_used').default(0).notNull(),
    revenue: integer('revenue').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('idx_platform_stats_date').on(table.date)]
);

// 🆕 New table for tracking limit purchases
export const limitPurchasesTable = createTable(
  'limit_purchases',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    purchaseType: varchar('purchase_type', { length: 20 }).notNull(), // 'topup' | 'subscription'
    previousLimit: integer('previous_limit').notNull(),
    newLimit: integer('new_limit').notNull(),
    amountPaid: integer('amount_paid').notNull(), // in cents (e.g., 299 = €2.99)
    stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
    purchasedAt: timestamp('purchased_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_limit_purchases_user_id').on(table.userId),
    index('idx_limit_purchases_user_date').on(table.userId, table.purchasedAt),
    index('idx_limit_purchases_type').on(table.purchaseType),
  ]
);

export const userConsentTable = createTable('user_consent', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  // Consent preferences
  necessary: boolean('necessary').default(true).notNull(),
  functionality: boolean('functionality').default(false).notNull(),
  analytics: boolean('analytics').default(false).notNull(),
  marketing: boolean('marketing').default(false).notNull(),

  // Metadata
  consentDate: timestamp('consent_date').defaultNow().notNull(),
  withdrawnDate: timestamp('withdrawn_date'),
  version: text('version').default('1.0.0').notNull(),

  // Audit trail
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relationships for Drizzle ORM
export const usersRelations = relations(usersTable, ({ many, one }) => ({
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  businessProfiles: many(businessProfilesTable),
  ibans: many(userIbansTable),
  paymentTemplates: many(paymentTemplatesTable),
  qrGenerations: many(qrGenerationsTable),
  dailyStats: many(dailyUserStatsTable),
  limitPurchases: many(limitPurchasesTable),
  userConsent: one(userConsentTable, {
    fields: [usersTable.id],
    references: [userConsentTable.userId],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const businessProfilesRelations = relations(
  businessProfilesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [businessProfilesTable.userId],
      references: [usersTable.id],
    }),
    paymentTemplates: many(paymentTemplatesTable),
    qrGenerations: many(qrGenerationsTable),
    ibans: many(userIbansTable),
  })
);

export const userIbansRelations = relations(
  userIbansTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [userIbansTable.userId],
      references: [usersTable.id],
    }),
    businessProfile: one(businessProfilesTable, {
      fields: [userIbansTable.userId],
      references: [businessProfilesTable.userId],
    }),
    paymentTemplates: many(paymentTemplatesTable),
    qrGenerations: many(qrGenerationsTable),
  })
);

export const paymentTemplatesRelations = relations(
  paymentTemplatesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [paymentTemplatesTable.userId],
      references: [usersTable.id],
    }),
    businessProfile: one(businessProfilesTable, {
      fields: [paymentTemplatesTable.userId],
      references: [businessProfilesTable.userId],
    }),
    userIban: one(userIbansTable, {
      fields: [paymentTemplatesTable.userIbanId],
      references: [userIbansTable.id],
    }),
    qrGenerations: many(qrGenerationsTable),
  })
);

export const qrGenerationsRelations = relations(
  qrGenerationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [qrGenerationsTable.userId],
      references: [usersTable.id],
    }),
    businessProfile: one(businessProfilesTable, {
      fields: [qrGenerationsTable.userId],
      references: [businessProfilesTable.userId],
    }),
    template: one(paymentTemplatesTable, {
      fields: [qrGenerationsTable.templateId],
      references: [paymentTemplatesTable.id],
    }),
    userIban: one(userIbansTable, {
      fields: [qrGenerationsTable.userIbanId],
      references: [userIbansTable.id],
    }),
  })
);

export const dailyUserStatsRelations = relations(
  dailyUserStatsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [dailyUserStatsTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const limitPurchasesRelations = relations(
  limitPurchasesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [limitPurchasesTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const userConsentRelations = relations(userConsentTable, ({ one }) => ({
  profile: one(businessProfilesTable, {
    fields: [userConsentTable.userId],
    references: [businessProfilesTable.userId],
  }),
}));

export const schema = {
  user: usersTable,
  session: sessionsTable,
  account: accountsTable,
  verification: verificationsTable,
  organization: organizationsTable,
  member: memberTable,
  invitation: invitationTable,
  apikey: apikeyTable,
  rateLimit: rateLimitTable,
  businessProfilesTable,
  userIbansTable,
  paymentTemplatesTable,
  qrGenerationsTable,
  dailyUserStatsTable,
  platformStatsTable,
  limitPurchasesTable,
  userConsentTable,
};

// Type exports for use throughout the application
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;

export type Account = typeof accountsTable.$inferSelect;
export type NewAccount = typeof accountsTable.$inferInsert;

export type Verification = typeof verificationsTable.$inferSelect;
export type NewVerification = typeof verificationsTable.$inferInsert;

export type BusinessProfile = typeof businessProfilesTable.$inferSelect;
export type NewBusinessProfile = typeof businessProfilesTable.$inferInsert;

export type UserIban = typeof userIbansTable.$inferSelect;
export type NewUserIban = typeof userIbansTable.$inferInsert;

export type PaymentTemplate = typeof paymentTemplatesTable.$inferSelect;
export type NewPaymentTemplate = typeof paymentTemplatesTable.$inferInsert;

export type QrGeneration = typeof qrGenerationsTable.$inferSelect;
export type NewQrGeneration = typeof qrGenerationsTable.$inferInsert;

export type DailyUserStats = typeof dailyUserStatsTable.$inferSelect;
export type NewDailyUserStats = typeof dailyUserStatsTable.$inferInsert;

export type PlatformStats = typeof platformStatsTable.$inferSelect;
export type NewPlatformStats = typeof platformStatsTable.$inferInsert;

export type LimitPurchase = typeof limitPurchasesTable.$inferSelect;
export type NewLimitPurchase = typeof limitPurchasesTable.$inferInsert;

export type UserConsent = typeof userConsentTable.$inferSelect;
export type NewUserConsent = typeof userConsentTable.$inferInsert;
