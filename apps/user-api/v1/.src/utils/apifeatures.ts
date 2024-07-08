import { Document, Model, Query } from 'mongoose';

// class ApiFeatures<T extends Document, U extends Model<T>> {
//   private query: Query<T[], T, U>;
//   private queryString: U|any;

//   constructor(query: Query<T[], T, U>, queryStr: U|any) {
//     this.query = query;
//     this.queryString = queryString;
//   }
export class ApiFeatures<T extends Document> {
  private query: Query<T[], T>;
  private queryString: any;

  constructor(query: Query<T[], T>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }
    search() {
      const keyword = this.queryString.keyword
        ? {
            name: {
              $regex: this.queryString.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryString };
      //   Removing some fields for category
      const removeFields = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Filter For Price and Rating
  
      let queryString = JSON.stringify(queryCopy);
      queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
  
      this.query = this.query.find(JSON.parse(queryString));
  
      return this;
    }
  
    pagination(resultPerPage: number) {
      const currentPage = Number(this.queryString.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }
    
    async executeQuery(): Promise<T[]> {
      return await this.query.exec();
    }
  }
  
 export default ApiFeatures;
  