import { Tag } from '../../../../domain/valueObjects/Tag';
import { TagModel } from '../model/metadataTagModel';

export class TagMapper {
  public static toDomain(model: TagModel): Tag {
    return Tag.create(model.name);
  }

  public static toModel(tag: Tag): TagModel {
    const tagModel = new TagModel();
    tagModel.name = tag.getName();
    return tagModel;
  }
}
