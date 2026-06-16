import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const getFilePath = (modelName) => path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);

export const readData = (modelName) => {
  const filePath = getFilePath(modelName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};

export const writeData = (modelName, data) => {
  const filePath = getFilePath(modelName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

class MockQuery {
  constructor(data, modelName, populateFunc, isSingle = false) {
    this.data = data;
    this.modelName = modelName;
    this.populateFunc = populateFunc;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._populates = [];
    this._isSingle = isSingle;
  }

  sort(options) {
    this._sort = options;
    return this;
  }

  skip(num) {
    this._skip = num;
    return this;
  }

  limit(num) {
    this._limit = num;
    return this;
  }

  populate(pathOrObj, selectFields) {
    const path = typeof pathOrObj === 'string' ? pathOrObj : pathOrObj.path;
    this._populates.push({ path, selectFields });
    return this;
  }

  select(fields) {
    return this;
  }

  async exec() {
    let result = [...this.data];

    // Apply sort
    if (this._sort) {
      const sortKey = Object.keys(this._sort)[0];
      const sortOrder = this._sort[sortKey];
      result.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (sortKey === 'likesCount') {
          valA = a.likes ? a.likes.length : 0;
          valB = b.likes ? b.likes.length : 0;
        }
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        
        // Handle dates or string comparisons
        if (typeof valA === 'string' && !isNaN(Date.parse(valA)) && typeof valB === 'string' && !isNaN(Date.parse(valB))) {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA < valB) return sortOrder === 1 ? -1 : 1;
        if (valA > valB) return sortOrder === 1 ? 1 : -1;
        return 0;
      });
    }

    // Apply skip
    if (this._skip) {
      result = result.slice(this._skip);
    }

    // Apply limit
    if (this._limit) {
      result = result.slice(0, this._limit);
    }

    // Apply populate
    for (const pop of this._populates) {
      for (const item of result) {
        if (this.populateFunc) {
          await this.populateFunc(item, pop.path);
        }
      }
    }

    if (this._isSingle) {
      return result.length > 0 ? result[0] : null;
    }

    return result;
  }

  then(onResolve, onReject) {
    return this.exec().then(onResolve, onReject);
  }
}

class MockModel {
  constructor(name) {
    this.modelName = name;
  }

  _read() {
    return readData(this.modelName);
  }

  _write(data) {
    writeData(this.modelName, data);
  }

  async countDocuments(query = {}) {
    const data = this._read();
    const filtered = this._filter(data, query);
    return filtered.length;
  }

  _filter(data, query) {
    return data.filter(item => {
      for (const key in query) {
        if (key === '$or') {
          const orConditions = query[key];
          const matched = orConditions.some(cond => {
            const condKey = Object.keys(cond)[0];
            const condVal = cond[condKey];
            if (condVal && condVal.$regex) {
              const regex = new RegExp(condVal.$regex, condVal.$options || 'i');
              const itemVal = item[condKey];
              if (Array.isArray(itemVal)) {
                return itemVal.some(v => regex.test(v));
              }
              return regex.test(itemVal || '');
            }
            return item[condKey] === condVal;
          });
          if (!matched) return false;
          continue;
        }

        const queryVal = query[key];
        if (queryVal && typeof queryVal === 'object') {
          if (queryVal.$regex) {
            const regex = new RegExp(queryVal.$regex, queryVal.$options || 'i');
            const itemVal = item[key];
            if (Array.isArray(itemVal)) {
              return itemVal.some(v => regex.test(v));
            }
            return regex.test(itemVal || '');
          }
        } else {
          const itemVal = item[key];
          if (itemVal && typeof itemVal === 'object' && itemVal._id) {
            if (itemVal._id.toString() !== queryVal.toString()) return false;
          } else if (itemVal !== undefined && queryVal !== undefined) {
            if (itemVal.toString() !== queryVal.toString()) return false;
          } else if (itemVal !== queryVal) {
            return false;
          }
        }
      }
      return true;
    });
  }

  find(query = {}) {
    const data = this._read();
    const filtered = this._filter(data, query);
    const docs = filtered.map(item => this._wrapDoc(item));
    return new MockQuery(docs, this.modelName, this._populate.bind(this));
  }

  findOne(query = {}) {
    const data = this._read();
    const filtered = this._filter(data, query);
    const docs = filtered.map(item => this._wrapDoc(item));
    return new MockQuery(docs, this.modelName, this._populate.bind(this), true);
  }

  findById(id) {
    if (!id) {
      return new MockQuery([], this.modelName, this._populate.bind(this), true);
    }
    const data = this._read();
    const filtered = data.filter(item => item._id.toString() === id.toString());
    const docs = filtered.map(item => this._wrapDoc(item));
    return new MockQuery(docs, this.modelName, this._populate.bind(this), true);
  }

  async create(obj) {
    const data = this._read();
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...obj,
    };

    if (this.modelName === 'User' && newDoc.password) {
      const salt = await bcrypt.genSalt(10);
      newDoc.password = await bcrypt.hash(newDoc.password, salt);
    }

    data.push(newDoc);
    this._write(data);
    return this._wrapDoc(newDoc);
  }

  async aggregate(pipeline) {
    let data = this._read();
    let result = [...data];
    
    for (const stage of pipeline) {
      if (stage.$match) {
        result = this._filter(result, stage.$match);
      } else if (stage.$group) {
        const groupKey = stage.$group._id;
        
        if (groupKey === null) {
          let totalViews = 0;
          let totalLikes = 0;
          for (const item of result) {
            totalViews += (item.views || 0);
            totalLikes += (item.likes ? item.likes.length : 0);
          }
          return [{ _id: null, totalViews, totalLikesCount: totalLikes }];
        } else if (groupKey === '$category') {
          const categoriesMap = {};
          for (const item of result) {
            const cat = item.category || 'Uncategorized';
            if (!categoriesMap[cat]) {
              categoriesMap[cat] = { _id: cat, count: 0, views: 0 };
            }
            categoriesMap[cat].count += 1;
            categoriesMap[cat].views += (item.views || 0);
          }
          return Object.values(categoriesMap);
        }
      }
    }
    
    return result;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const data = this._read();
    const idx = data.findIndex(item => item._id.toString() === id.toString());
    if (idx === -1) return null;
    
    const updatedItem = {
      ...data[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    
    data[idx] = updatedItem;
    this._write(data);
    return this._wrapDoc(updatedItem);
  }

  async findByIdAndDelete(id) {
    const data = this._read();
    const idx = data.findIndex(item => item._id.toString() === id.toString());
    if (idx === -1) return null;
    const removed = data.splice(idx, 1)[0];
    this._write(data);
    return removed;
  }

  async deleteOne(query) {
    const data = this._read();
    const filtered = this._filter(data, query);
    if (filtered.length > 0) {
      const idx = data.findIndex(item => item._id === filtered[0]._id);
      if (idx !== -1) {
        data.splice(idx, 1);
        this._write(data);
      }
    }
    return { deletedCount: filtered.length > 0 ? 1 : 0 };
  }

  _wrapDoc(rawObj) {
    if (!rawObj) return null;
    const modelName = this.modelName;
    const self = this;

    // Ensure fields are initialized to standard defaults if missing
    if (!rawObj.likes) rawObj.likes = [];
    if (!rawObj.tags) rawObj.tags = [];
    if (rawObj.views === undefined) rawObj.views = 0;
    
    const doc = {
      ...rawObj,
      
      async save() {
        const data = self._read();
        const idx = data.findIndex(item => item._id.toString() === this._id.toString());
        
        this.updatedAt = new Date().toISOString();
        
        const cleanObj = { ...this };
        delete cleanObj.save;
        delete cleanObj.deleteOne;
        delete cleanObj.matchPassword;
        
        if (idx !== -1) {
          data[idx] = cleanObj;
        } else {
          data.push(cleanObj);
        }
        self._write(data);
        return this;
      },
      
      async deleteOne() {
        const data = self._read();
        const idx = data.findIndex(item => item._id.toString() === this._id.toString());
        if (idx !== -1) {
          data.splice(idx, 1);
          self._write(data);
        }
        return this;
      }
    };

    if (modelName === 'User') {
      doc.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
    }

    return doc;
  }

  async _populate(item, path) {
    if (path === 'author') {
      const users = readData('User');
      const authorId = item.author;
      if (authorId) {
        const user = users.find(u => u._id.toString() === authorId.toString());
        if (user) {
          item.author = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            role: user.role,
          };
        }
      }
    } else if (path === 'user') {
      const users = readData('User');
      const userId = item.user;
      if (userId) {
        const user = users.find(u => u._id.toString() === userId.toString());
        if (user) {
          item.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            role: user.role,
          };
        }
      }
    } else if (path === 'blog') {
      const blogs = readData('Blog');
      const blogId = item.blog;
      if (blogId) {
        const blog = blogs.find(b => b._id.toString() === blogId.toString());
        if (blog) {
          item.blog = {
            _id: blog._id,
            title: blog.title,
            slug: blog.slug,
          };
        }
      }
    }
  }
}

export class MockModelInstance {
  constructor(modelName, obj) {
    this._id = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    Object.assign(this, obj);
    
    // Ensure lists and values are initialized
    if (!this.likes) this.likes = [];
    if (!this.tags) this.tags = [];
    if (this.views === undefined) this.views = 0;
    
    this.save = async function() {
      const mockModel = new MockModel(modelName);
      const data = mockModel._read();
      const idx = data.findIndex(item => item._id.toString() === this._id.toString());
      
      this.updatedAt = new Date().toISOString();
      
      const cleanObj = { ...this };
      delete cleanObj.save;
      delete cleanObj.deleteOne;
      delete cleanObj.matchPassword;
      
      if (idx !== -1) {
        data[idx] = cleanObj;
      } else {
        data.push(cleanObj);
      }
      mockModel._write(data);
      return this;
    };
    
    this.deleteOne = async function() {
      const mockModel = new MockModel(modelName);
      const data = mockModel._read();
      const idx = data.findIndex(item => item._id.toString() === this._id.toString());
      if (idx !== -1) {
        data.splice(idx, 1);
        mockModel._write(data);
      }
      return this;
    };
    
    if (modelName === 'User') {
      this.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
    }
  }
}

export { MockModel };
