import {
	type InferContractRouterInputs,
	type InferContractRouterOutputs,
	oc,
} from "@orpc/contract";
import { z } from "zod";
import {
	DeleteDocumentSchema,
	DocumentSchema,
	GetAllDocumentsByCreatorIdSchema,
	GetAllDocumentsByTagSchema,
	UpdateDocumentTagsSchema,
} from "./schema/documentSchema";
import { DocumentRetrievalErrorSchema } from "./schema/errors";

export const documentContract = oc.router({
	getDocuments: oc
		.route({
			path: "/documents",
			method: "GET",
		})
		.output(
			z.object({
				message: z.string(),
				data: z.union([
					z.array(DocumentSchema).describe("List of all documents"),
					DocumentRetrievalErrorSchema,
				]),
			}),
		),

	// uploadDocument: oc
	// 	.route({
	// 		path: "/upload",
	// 		method: "POST",
	// 	})
	// 	.input(
	// 		z.object({
	// 			file: z.any(),
	// 			name: z.string(),
	// 			creatorId: z.string(),
	// 			tags: z.array(z.string()),
	// 		}),
	// 	)
	// 	.output(DocumentSchema),

	// deleteDocument: oc
	// 	.route({
	// 		path: "/deleteById",
	// 		method: "DELETE",
	// 	})
	// 	.input(DeleteDocumentSchema)
	// 	.output(
	// 		z.object({
	// 			message: z.string(),
	// 			data: z.boolean(),
	// 		}),
	// 	),

	// getAllDocumentsByCreatorId: oc
	// 	.route({
	// 		path: "/documents/fetchAllByCreatorId",
	// 		method: "POST",
	// 	})
	// 	.input(GetAllDocumentsByCreatorIdSchema)
	// 	.output(z.array(DocumentSchema)),

	// updateDocumentTags: oc
	// 	.route({
	// 		path: "/documents/updateTags",
	// 		method: "POST",
	// 	})
	// 	.input(UpdateDocumentTagsSchema)
	// 	.output(DocumentSchema),

	// getAllDocumentsByTag: oc
	// 	.route({
	// 		path: "/documents/fetchAllByTag",
	// 		method: "POST",
	// 	})
	// 	.input(GetAllDocumentsByTagSchema)
	// 	.output(z.array(DocumentSchema)),
});

export type documentInputs = InferContractRouterInputs<typeof documentContract>;
export type documentOutputs = InferContractRouterOutputs<
	typeof documentContract
>;
