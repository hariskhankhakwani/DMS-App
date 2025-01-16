import { DocumentModel } from '../model/documentModel';
import { DocumentItem } from '../../../../domain/entities/Document';
import { MetadataDataMapper } from './metadataMapper';

export class DocumentMapper {
  static toDomain(docModel: DocumentModel): DocumentItem {
    const document = DocumentItem.deserialize({ id: docModel.id, name: docModel.name, content: docModel.content });

    return document;
  }

  static toModel(doc: DocumentItem): DocumentModel {
    const docModel = new DocumentModel();
    docModel.content = doc.getContent();
    docModel.id = doc.getId();
    docModel.name = doc.getName();
    const metadata = doc.getMetadata();
    if (metadata) {
      docModel.metaData = MetadataDataMapper.toModel(metadata);
    }

    return docModel;
  }
}
