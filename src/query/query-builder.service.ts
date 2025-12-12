import { Injectable, BadRequestException } from '@nestjs/common';
import { FilterConditionDto, FilterGroupDto } from './filter.dto';

@Injectable()
export class QueryBuilderService {
  buildMongoQuery(group: FilterGroupDto): any {
    console.log(group)
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

    // Prevent dangerous field names like "$where"
    if (field.startsWith('$')) {
      throw new BadRequestException('Invalid field name');
    }

    switch (condition) {
      case 'equals':
        return { [field]: value };

      case 'ne':
        return { [field]: { $ne: value } };

      case 'gt':
        return { [field]: { $gt: value } };

      case 'gte':
        return { [field]: { $gte: value } };

      case 'lt':
        return { [field]: { $lt: value } };

      case 'lte':
        return { [field]: { $lte: value } };

      case 'in':
        if (!Array.isArray(value)) {
          throw new BadRequestException('Value for "in" must be an array');
        }
        return { [field]: { $in: value } };

      case 'nin':
        if (!Array.isArray(value)) {
          throw new BadRequestException('Value for "nin" must be an array');
        }
        return { [field]: { $nin: value } };

      case 'contains':
        return {
          [field]: { $regex: value, $options: 'i' },
        };

      default:
        throw new BadRequestException(`Unsupported condition: ${condition}`);
    }
  }
}
