import { Injectable, BadRequestException } from '@nestjs/common';
import { FilterConditionDto, FilterGroupDto } from './filter.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class QueryBuilderService {
  buildMongoQuery(group: FilterGroupDto): any {
    if (!group || !group.conditions?.length) {
      return {};
    }

    // Convert each condition into a Mongo fragment
    const mongoFragments = group.conditions.map((cond) =>
      this.convertConditionToMongo(cond),
    );

    // Combine fragments using AND or OR
    if (group.groupType === 'OR') {
      return { $or: mongoFragments };
    } else {
      return { $and: mongoFragments };
    }
  }

  private convertConditionToMongo(cond: FilterConditionDto) {
    const { field, value, condition } = cond;
    if (field.startsWith('$')) {
      throw new BadRequestException('Invalid field name');
    }
    const parsedValue = this.parseValue(field, value)

    switch (condition) {
      case 'equals':
        return { [field]: parsedValue };

      case 'ne':
        return { [field]: { $ne: parsedValue } };

      case 'gt':
        return { [field]: { $gt: parsedValue } };

      case 'gte':
        return { [field]: { $gte: parsedValue } };

      case 'lt':
        return { [field]: { $lt: parsedValue } };

      case 'lte':
        return { [field]: { $lte: parsedValue } };
      case 'exists':
        return { [field]: { $exists: parsedValue} }
      // case 'in':
      //   if (!Array.isArray(value)) {
      //     throw new BadRequestException('Value for "in" must be an array');
      //   }
      //   return { [field]: { $in: value } };

      // case 'nin':
      //   if (!Array.isArray(value)) {
      //     throw new BadRequestException('Value for "nin" must be an array');
      //   }
      //   return { [field]: { $nin: value } };

      case 'contains':
        return {
          [field]: { $regex: parsedValue, $options: 'i' },
        };

      default:
        throw new BadRequestException(`Unsupported condition: ${condition}`);
    }
  }

  parseValue = (field, value) => {
    const OBJECT_ID_FIELDS = new Set(['_id', 'client', 'vessels']);
    const BOOLEAN_FIELDS = new Set(['has_incomplete_vessel_report']);
    if(OBJECT_ID_FIELDS.has(field)){
      if(Array.isArray(value)){
        return value.map((v) => this.toObjectId(v))
      }
      return this.toObjectId(value)
    }
    if(BOOLEAN_FIELDS.has(field)){
      return value === 'true'
    }
    return value
  }

  private toObjectId = (value) => {
    if(!ObjectId.isValid(value)){
      throw new BadRequestException(`${value} is not a valid Object ID`)
    }
    return new ObjectId(value)
  }
}
