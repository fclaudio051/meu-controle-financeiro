"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUserRepository = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../database");
class FileUserRepository {
    async findById(id) {
        const db = (0, database_1.readDB)();
        return db.users.find(user => user.id === id) || null;
    }
    async findByEmail(email) {
        const db = (0, database_1.readDB)();
        return db.users.find(user => user.email === email) || null;
    }
    async create(userData) {
        const db = (0, database_1.readDB)();
        const newUser = {
            id: (0, uuid_1.v4)(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        db.users.push(newUser);
        (0, database_1.writeDB)(db);
        return newUser;
    }
    async update(id, userData) {
        const db = (0, database_1.readDB)();
        const userIndex = db.users.findIndex(user => user.id === id);
        if (userIndex === -1)
            return null;
        db.users[userIndex] = { ...db.users[userIndex], ...userData };
        (0, database_1.writeDB)(db);
        return db.users[userIndex];
    }
    async delete(id) {
        const db = (0, database_1.readDB)();
        const userIndex = db.users.findIndex(user => user.id === id);
        if (userIndex === -1)
            return false;
        db.users.splice(userIndex, 1);
        (0, database_1.writeDB)(db);
        return true;
    }
}
exports.FileUserRepository = FileUserRepository;
