export interface JwtPayload {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any;
	iss?: string | undefined;
	sub?: string | undefined;
	aud?: string | string[] | undefined;
	exp?: number | undefined;
	nbf?: number | undefined;
	iat?: number | undefined;
	jti?: string | undefined;
}

export interface FileObject {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: Buffer;
	size: number;
}

export interface SendEmailParams {
	to: string;
	body: {
		filename: string;
	};
}
