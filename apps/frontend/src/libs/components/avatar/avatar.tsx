import PlaceholderAvatar from "~/assets/img/icons/placeholder-avatar.svg";
import { AvatarSize, AvatarType } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	size?: ValueOf<typeof AvatarSize>;
	src?: string | undefined;
	type?: ValueOf<typeof AvatarType>;
};

const Avatar: React.FC<Properties> = ({
	size = AvatarSize.SMALL,
	src,
	type = AvatarType.MAIN,
}: Properties) => {
	return (
		<img
			alt="avatar"
			className={getValidClassNames(
				styles["avatar"],
				styles[size],
				styles[type],
			)}
			src={src ?? PlaceholderAvatar}
		/>
	);
};

export { Avatar };
