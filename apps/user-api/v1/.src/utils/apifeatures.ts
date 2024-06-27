import { Document, Model, Query } from 'mongoose';

class ApiFeatures<T extends Document, U extends Model<T>> {
  private query: Query<T[], T, U>;
  private queryStr: any;

  constructor(query: Query<T[], T, U>, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryStr };
      //   Removing some fields for category
      const removeFields = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Filter For Price and Rating
  
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    pagination(resultPerPage: number) {
      const currentPage = Number(this.queryStr.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }
    
    async executeQuery(): Promise<T[]> {
      return await this.query.exec();
    }
  }
  
 export default ApiFeatures;
  