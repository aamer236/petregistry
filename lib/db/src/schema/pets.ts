import { pgTable, text, integer, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const petStatusEnum = pgEnum("pet_status", ["Verified", "Pending", "Incomplete"]);
export const genderEnum = pgEnum("gender", ["Male", "Female", "Unknown"]);

export const ownersTable = pgTable("owners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petsTable = pgTable("pets", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: text("pet_id").notNull().unique(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed").notNull(),
  age: integer("age").notNull(),
  gender: genderEnum("gender").notNull().default("Unknown"),
  rhinariumId: text("rhinarium_id"),
  photoUrl: text("photo_url"),
  status: petStatusEnum("status").notNull().default("Pending"),
  ownerId: uuid("owner_id").notNull().references(() => ownersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vaccinationRecordsTable = pgTable("vaccination_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: uuid("pet_id").notNull().references(() => petsTable.id),
  type: text("type").notNull(),
  date: timestamp("date").notNull(),
  verified: boolean("verified").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medicalRecordsTable = pgTable("medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: uuid("pet_id").notNull().references(() => petsTable.id),
  notes: text("notes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOwnerSchema = createInsertSchema(ownersTable).omit({ id: true, createdAt: true });
export const insertPetSchema = createInsertSchema(petsTable).omit({ id: true, petId: true, createdAt: true });
export const insertVaccinationSchema = createInsertSchema(vaccinationRecordsTable).omit({ id: true, createdAt: true });
export const insertMedicalSchema = createInsertSchema(medicalRecordsTable).omit({ id: true, createdAt: true });

export type Owner = typeof ownersTable.$inferSelect;
export type Pet = typeof petsTable.$inferSelect;
export type VaccinationRecord = typeof vaccinationRecordsTable.$inferSelect;
export type MedicalRecord = typeof medicalRecordsTable.$inferSelect;

export type InsertOwner = z.infer<typeof insertOwnerSchema>;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type InsertMedical = z.infer<typeof insertMedicalSchema>;
