import mongoose from 'mongoose';
import { MockModel, MockModelInstance } from './mockDb.js';

let useMock = false;

export const setUseMock = (val) => {
  useMock = val;
};

export const getUseMock = () => {
  return useMock;
};

// Override mongoose.model to allow transparent fallback
const originalModel = mongoose.model.bind(mongoose);
mongoose.model = function(name, schema) {
  let realModel;
  try {
    realModel = originalModel(name, schema);
  } catch (err) {
    realModel = mongoose.models[name] || originalModel(name, schema);
  }
  
  const mockModel = new MockModel(name);
  
  function DelegatingModel(obj) {
    if (useMock) {
      return new MockModelInstance(name, obj);
    }
    return new realModel(obj);
  }
  
  DelegatingModel.modelName = name;
  DelegatingModel.find = function(query) {
    return useMock ? mockModel.find(query) : realModel.find(query);
  };
  DelegatingModel.findOne = function(query) {
    return useMock ? mockModel.findOne(query) : realModel.findOne(query);
  };
  DelegatingModel.findById = function(id) {
    return useMock ? mockModel.findById(id) : realModel.findById(id);
  };
  DelegatingModel.create = function(obj) {
    return useMock ? mockModel.create(obj) : realModel.create(obj);
  };
  DelegatingModel.countDocuments = function(query) {
    return useMock ? mockModel.countDocuments(query) : realModel.countDocuments(query);
  };
  DelegatingModel.aggregate = function(pipeline) {
    return useMock ? mockModel.aggregate(pipeline) : realModel.aggregate(pipeline);
  };
  DelegatingModel.findByIdAndUpdate = function(id, update, options) {
    return useMock ? mockModel.findByIdAndUpdate(id, update, options) : realModel.findByIdAndUpdate(id, update, options);
  };
  DelegatingModel.findByIdAndDelete = function(id) {
    return useMock ? mockModel.findByIdAndDelete(id) : realModel.findByIdAndDelete(id);
  };
  DelegatingModel.deleteOne = function(query) {
    return useMock ? mockModel.deleteOne(query) : realModel.deleteOne(query);
  };
  DelegatingModel.deleteMany = function(query) {
    if (useMock) {
      const data = mockModel._read();
      const filtered = mockModel._filter(data, query);
      const remaining = data.filter(item => !filtered.includes(item));
      mockModel._write(remaining);
      return { deletedCount: filtered.length };
    }
    return realModel.deleteMany(query);
  };
  DelegatingModel.insertMany = function(arr) {
    if (useMock) {
      const results = [];
      for (const item of arr) {
        results.push(mockModel.create(item));
      }
      return Promise.all(results);
    }
    return realModel.insertMany(arr);
  };
  
  return DelegatingModel;
};
