import fs from "fs/promises";

const DB_FILE = "./database.json";

export const createDB = () => {
  const getDB = async () => {
    try {
      const data = await fs.readFile(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return {
        authors: [],
        errors: []
      };
    }
  };

  const saveDB = async (data) => {
    await fs.writeFile(
      DB_FILE,
      JSON.stringify(data, null, 2)
    );
  };

  return {
    getAll: async (collection) => {
      const db = await getDB();
      return db[collection] || [];
    },

    insert: async (collection, item) => {
      const db = await getDB();

      if (!db[collection]) {
        db[collection] = [];
      }

      db[collection].push(item);

      await saveDB(db);

      return item;
    },

    update: async (collection, id, updatedItem) => {
      const db = await getDB();

      const index = db[collection].findIndex(
        (item) => item.id === id
      );

      if (index === -1) {
        return null;
      }

      db[collection][index] = updatedItem;

      await saveDB(db);

      return updatedItem;
    },

    delete: async (collection, id) => {
      const db = await getDB();

      const index = db[collection].findIndex(
        (item) => item.id === id
      );

      if (index === -1) {
        return null;
      }

      const deleted = db[collection].splice(index, 1)[0];

      await saveDB(db);

      return deleted;
    }
  };
};