"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePersonRepository = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../database");
class FilePersonRepository {
    async findById(id) {
        const db = (0, database_1.readDB)();
        return db.people.find(person => person.id === id) || null;
    }
    async findByUserId(userId) {
        const db = (0, database_1.readDB)();
        return db.people
            .filter(person => person.userId === userId)
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    async findByName(name, userId) {
        const db = (0, database_1.readDB)();
        return db.people.find(person => person.userId === userId &&
            person.name.toLowerCase() === name.trim().toLowerCase()) || null;
    }
    async create(personData) {
        const db = (0, database_1.readDB)();
        const newPerson = {
            id: (0, uuid_1.v4)(),
            ...personData,
            name: personData.name.trim(),
            createdAt: new Date().toISOString()
        };
        db.people.push(newPerson);
        (0, database_1.writeDB)(db);
        return newPerson;
    }
    async delete(id) {
        const db = (0, database_1.readDB)();
        const personIndex = db.people.findIndex(person => person.id === id);
        if (personIndex === -1)
            return false;
        db.people.splice(personIndex, 1);
        (0, database_1.writeDB)(db);
        return true;
    }
}
exports.FilePersonRepository = FilePersonRepository;
