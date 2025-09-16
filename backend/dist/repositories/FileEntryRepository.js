"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntryRepository = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../database");
class FileEntryRepository {
    async findById(id) {
        const db = (0, database_1.readDB)();
        return db.entries.find(entry => entry.id === id) || null;
    }
    async findByUserId(userId) {
        const db = (0, database_1.readDB)();
        return db.entries
            .filter(entry => entry.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findByPersonId(personId) {
        const db = (0, database_1.readDB)();
        return db.entries.filter(entry => entry.person === personId);
    }
    async create(entryData) {
        const db = (0, database_1.readDB)();
        const newEntry = {
            id: (0, uuid_1.v4)(),
            ...entryData,
            date: new Date(entryData.date).toISOString(),
            description: entryData.description.trim(),
            createdAt: new Date().toISOString()
        };
        db.entries.push(newEntry);
        (0, database_1.writeDB)(db);
        return newEntry;
    }
    async update(id, entryData) {
        const db = (0, database_1.readDB)();
        const entryIndex = db.entries.findIndex(entry => entry.id === id);
        if (entryIndex === -1)
            return null;
        const updatedEntry = {
            ...db.entries[entryIndex],
            ...entryData,
            ...(entryData.date && { date: new Date(entryData.date).toISOString() }),
            ...(entryData.description && { description: entryData.description.trim() })
        };
        db.entries[entryIndex] = updatedEntry;
        (0, database_1.writeDB)(db);
        return updatedEntry;
    }
    async delete(id) {
        const db = (0, database_1.readDB)();
        const entryIndex = db.entries.findIndex(entry => entry.id === id);
        if (entryIndex === -1)
            return false;
        db.entries.splice(entryIndex, 1);
        (0, database_1.writeDB)(db);
        return true;
    }
}
exports.FileEntryRepository = FileEntryRepository;
