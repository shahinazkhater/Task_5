import fs from "fs/promises";
import path from "path";

const dbPath = path.join(import.meta.dirname, "data.json");

function getId() {
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

export function createDB() {
  return {
    async getById(resource, id) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      return json[resource].find((x) => String(x.id) === String(id));
    },

    async getAll(resource) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      return json[resource];
    },

    async getOne(resource, query) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      return json[resource].find((x) => {
        return Object.keys(query).every(
          (key) => String(x[key]) === String(query[key])
        );
      });
    },

    async create(resource, obj) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);

      const newObj = { ...obj, id: getId() };
      const newResource = [...json[resource], newObj];
      const newData = { ...json, [resource]: newResource };

      await fs.writeFile(dbPath, JSON.stringify(newData, null, 2));
      return newObj;
    },

    async update(resource, id, obj) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);

      let updated = null;
      const newResource = json[resource].map((x) => {
        if (String(x.id) === String(id)) {
          updated = { ...x, ...obj, id: x.id };
          return updated;
        }
        return x;
      });

      const newData = { ...json, [resource]: newResource };
      await fs.writeFile(dbPath, JSON.stringify(newData, null, 2));
      return updated;
    },

    async delete(resource, id) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);

      const newResource = json[resource].filter(
        (x) => String(x.id) !== String(id)
      );
      const newData = { ...json, [resource]: newResource };

      await fs.writeFile(dbPath, JSON.stringify(newData, null, 2));
      return true;
    },

    async deleteWhere(resource, query) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);

      const newResource = json[resource].filter((x) => {
        return !Object.keys(query).every(
          (key) => String(x[key]) === String(query[key])
        );
      });

      const newData = { ...json, [resource]: newResource };
      await fs.writeFile(dbPath, JSON.stringify(newData, null, 2));
      return true;
    },

    async raw() {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      return JSON.parse(data);
    },
  };
}