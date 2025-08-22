type AvatarFileDto = {
	key: string;
	url: string;
};

type AvatarUploadResponseDto = {
	data: AvatarFileDto;
	isSuccess: boolean;
};

type DeleteAvatarResult = {
	isDeleted: boolean;
	message: string;
};

export {
	type AvatarFileDto,
	type AvatarUploadResponseDto,
	type DeleteAvatarResult,
};
