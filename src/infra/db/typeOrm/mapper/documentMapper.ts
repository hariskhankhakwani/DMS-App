import { DocumentItem } from "../../../../domain/entities/Document";
import { DocumentModel } from "../model/documentModel";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class DocumentMapper {
	static toDomain(docModel: DocumentModel): DocumentItem {
		const document = DocumentItem.deserialize({
			id: docModel.id,
			name: docModel.name,
			path: docModel.path,
			creatorId: docModel.creatorId,
			createdAt: docModel.createdAt,
			updatedAt: docModel.updatedAt,
			tags: docModel.tags,
		});

		return document;
	}

	static toModel(doc: DocumentItem): DocumentModel {
		const docModel = new DocumentModel();
		docModel.path = doc.getPath();
		docModel.id = doc.getId();
		docModel.name = doc.getName();
		docModel.creatorId = doc.getCreatorId();
		docModel.createdAt = doc.getCreatedAt();
		docModel.updatedAt = doc.getUpdatedAt();
		docModel.tags = doc.getTags();
		return docModel;
	}
}
