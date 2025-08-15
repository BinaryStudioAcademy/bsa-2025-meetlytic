type AvatarFileDto = {
	key: string;
	url: string;
};

type AvatarUploadResponseDto = {
	data: AvatarFileDto;
	success: boolean;
};

export { type AvatarFileDto, type AvatarUploadResponseDto };
