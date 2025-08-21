type AvatarFileDto = {
	key: string;
	url: string;
};

type AvatarUploadResponseDto = {
	data: AvatarFileDto;
	isSuccess: boolean;
};

export { type AvatarFileDto, type AvatarUploadResponseDto };
