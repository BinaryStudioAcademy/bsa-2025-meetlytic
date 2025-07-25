import { type FieldValues } from "react-hook-form";

import { SearchInput } from "~/libs/components/components.js";
import { useAppForm } from "~/libs/hooks/hooks.js";

interface HomeFormValues extends FieldValues {
	homeSearch: string;
}

const Home: React.FC = () => {
	const { control, errors } = useAppForm<HomeFormValues>({
		defaultValues: {
			homeSearch: "",
		},
	});
	return <SearchInput control={control} errors={errors} name="homeSearch" />;
};

export { Home };
