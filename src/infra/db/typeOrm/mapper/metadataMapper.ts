import { Metadata } from '../../../../domain/valueObjects/Metadata';
import { MetadataModel } from '../model/docmentMetadataModel';
import { TagMapper } from './tagMapper';

export class MetadataDataMapper {
  public static toDomain(model: MetadataModel): Metadata {
    const metadata = Metadata.create(model.author);

    if (model.tags) {
      model.tags.forEach((tagModel) => {
        const tag = TagMapper.toDomain(tagModel);
        metadata.addTag(tag);
      });
    }

    return metadata;
  }

  public static toModel(domain: Metadata): MetadataModel {
    const metadataModel = new MetadataModel();

    metadataModel.author = domain.getAuthor();
    metadataModel.createdAt = domain.getCreatedAt();
    metadataModel.updatedAt = domain.getUpdatedAt();

    const tags = domain.getTags();
    if (tags.length > 0) {
      metadataModel.tags = tags.map((tag) => TagMapper.toModel(tag));
    }

    return metadataModel;
  }
}
